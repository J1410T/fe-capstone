import {
  Button,
  Loading,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OverviewTab, ProjectHeader, TeamTab } from "./components";
import BudgetTab from "./components/BudgetTab";
import { useAuth } from "@/contexts/AuthContext";
import ProgressTab from "./components/ProgressTab";
import MilestoneTab from "./components/MilestoneTab";
import { ProjectEnrollModal } from "./components/ProjectEnrollModal";
import { ArrowLeft } from "lucide-react";
import { useProject } from "@/hooks/queries/project";
import { useProjectMajors } from "@/hooks/queries/major";
import { useAccountInfo, useRoleInfo } from "@/hooks/queries";

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const { data: majorProject } = useProjectMajors(projectId || "");

  // Use React Query hooks
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useProject(projectId || "");

  const project = projectResponse?.data["project-detail"];
  const members = project?.members || [];

  // Extract unique account and role IDs
  const uniqueAccountIds = useMemo(
    () => [
      ...new Set(members.map((member) => member.accountId).filter(Boolean)),
    ],
    [members]
  );

  const uniqueRoleIds = useMemo(
    () => [...new Set(members.map((member) => member.roleId).filter(Boolean))],
    [members]
  );

  // Call hooks for all unique account IDs at the top level
  const accountData: { [key: string]: ReturnType<typeof useAccountInfo> } = {};
  uniqueAccountIds.forEach((accountId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    accountData[accountId] = useAccountInfo(accountId);
  });

  // Call hooks for all unique role IDs at the top level
  const roleData: { [key: string]: ReturnType<typeof useRoleInfo> } = {};
  uniqueRoleIds.forEach((roleId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleData[roleId] = useRoleInfo(roleId);
  });

  // Check if member data is still loading
  const membersLoading =
    Object.values(accountData).some((query) => query.isLoading) ||
    Object.values(roleData).some((query) => query.isLoading);

  const handleEnrollProject = async (data: {
    role: "Principal" | "Researcher";
    message?: string;
  }) => {
    setEnrollLoading(true);
    try {
      console.log("Enrolling in project:", { projectId, ...data });
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowEnrollModal(false);
      // Refetch project data after enrollment
    } catch (error) {
      console.error("Failed to enroll in project:", error);
    } finally {
      setEnrollLoading(false);
    }
  };

  // Determine visible tabs based on membership
  const getVisibleTabs = () => {
    const baseTabs = ["overview"];

    if (projectResponse?.data["is-member"]) {
      // If user is a member, show all tabs
      baseTabs.push("team", "milestones", "documents", "budget");
    }

    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();
  const isMember = projectResponse?.data["is-member"] || false;
  const shouldShowEnrollButton = Boolean(user && !isMember);

  if (isLoading || membersLoading) {
    return <Loading />;
  }

  if (error || !projectResponse || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => navigate("/home")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const roleInProject = projectResponse.data["role-in-project"];

  // Helper function to determine team member role display
  const getTeamMemberRole = (
    roleName?: string
  ): "Researcher" | "Leader" | "Secretary" | "Principal Investigator" => {
    if (!roleName) return "Researcher";

    const name = roleName.toLowerCase();
    if (name.includes("principal") || name.includes("investigator")) {
      return "Principal Investigator";
    }
    if (name.includes("leader") || name.includes("lead")) {
      return "Leader";
    }
    if (name.includes("secretary")) {
      return "Secretary";
    }
    return "Researcher";
  };

  // Transform members with populated data
  const teamMembers = members.map((member) => {
    const accountQuery = accountData[member.accountId];
    const roleQuery = roleData[member.roleId];
    const account = accountQuery?.data;
    const role = roleQuery?.data;

    return {
      id: member.id,
      name: account?.["full-name"] || `none`,
      role: getTeamMemberRole(role?.name),
      major: account?.["company-name"] || "none",
      email: account?.email || `none`,
    };
  });

  console.log("team", teamMembers);

  // Prepare project data for components
  const projectData = {
    id: project.id,
    title: project["english-title"],
    vietnameseTitle: project["vietnamese-title"],
    logoUrl: project["logo-url"],
    category: project.category,
    type: project.type,
    description: project.description || "",
    abbreviations: project.abbreviations || "",
    requirementNote: project["requirement-note"] || "",
    language: project.language || "None",
    maximumMember: project["maximum-member"] || 0,
    status: project.status,
    progress: project.progress || 0,
    fieldName: majorProject?.["data-list"]?.[0]?.major?.field?.name || "",
    majorName: majorProject?.["data-list"]?.[0]?.major?.name || "",
    team: teamMembers,
    majors: project.majors || [],
    tags: project["project-tags"]?.map((tag) => tag.name) || [],
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        title={project["english-title"]}
        status={project.status}
        isMember={isMember}
        roleInProject={roleInProject}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full ${
            visibleTabs.length === 1
              ? "grid-cols-1"
              : visibleTabs.length === 2
              ? "grid-cols-2"
              : visibleTabs.length === 3
              ? "grid-cols-3"
              : visibleTabs.length === 4
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          } gap-1`}
        >
          {visibleTabs.includes("overview") && (
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          )}
          {visibleTabs.includes("team") && (
            <TabsTrigger value="team" className="text-xs sm:text-sm">
              Team
            </TabsTrigger>
          )}
          {visibleTabs.includes("milestones") && (
            <TabsTrigger value="milestones" className="text-xs sm:text-sm">
              Milestones
            </TabsTrigger>
          )}
          {visibleTabs.includes("documents") && (
            <TabsTrigger value="documents" className="text-xs sm:text-sm">
              Documents
            </TabsTrigger>
          )}
          {visibleTabs.includes("budget") && (
            <TabsTrigger value="budget" className="text-xs sm:text-sm">
              Budget
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            category={project.category}
            type={project.type}
            description={project.description || "No description available"}
            vietnameseTitle={project["vietnamese-title"]}
            logoUrl={
              project["logo-url"] ||
              "https://w0.peakpx.com/wallpaper/340/533/HD-wallpaper-chemistry-medical-biology-detail-medicine-psychedelic-science-abstract-abstraction-genetics-and-mobile-background-cool-abstract-science.jpg"
            }
            abbreviations={
              project.abbreviations || "No abbreviations available"
            }
            requirementNote={
              project["requirement-note"] || "No requirement note available"
            }
            language={project.language}
            maximumMember={project["maximum-member"] || 0}
            fieldName={projectData.fieldName}
            majorName={projectData.majorName}
            showEnrollButton={shouldShowEnrollButton}
            tags={projectData.tags}
            onEnrollProject={
              project.status === "created"
                ? () => setShowEnrollModal(true)
                : undefined
            }
          />
        </TabsContent>

        {visibleTabs.includes("team") && (
          <TabsContent value="team" className="space-y-4">
            <TeamTab team={projectData.team} />
          </TabsContent>
        )}

        {visibleTabs.includes("milestones") && (
          <TabsContent value="milestones" className="space-y-4">
            <MilestoneTab />
          </TabsContent>
        )}

        {visibleTabs.includes("documents") && (
          <TabsContent value="documents" className="space-y-4">
            <ProgressTab />
          </TabsContent>
        )}

        {visibleTabs.includes("budget") && (
          <TabsContent value="budget" className="space-y-4">
            <BudgetTab />
          </TabsContent>
        )}
      </Tabs>

      <ProjectEnrollModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onEnroll={handleEnrollProject}
        projectTitle={project["english-title"]}
        isLoading={enrollLoading}
      />
    </div>
  );
}

export default ProjectDetail;
