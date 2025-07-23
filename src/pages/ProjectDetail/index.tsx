import {
  Button,
  Loading,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OverviewTab, ProjectHeader, TeamTab } from "./components";
import BudgetTab from "./components/BudgetTab";
import { useAuth } from "@/contexts/AuthContext";
import ProgressTab from "./components/ProgressTab";
import MilestoneTab from "./components/MilestoneTab";
import { ProjectEnrollModal } from "./components/ProjectEnrollModal";
import { ArrowLeft } from "lucide-react";
// import { useProjectMajors } from "@/hooks/queries/major";
import { useProject } from "@/hooks/queries/project";
import { useProjectMajors } from "@/hooks/queries/major";
// import { useProject, useProjectMajors } from "@/hooks/project";

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

  // const { data: majorResponse, isLoading: majorsLoading } = useProjectMajors(
  //   projectId || ""
  // );

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

  if (isLoading) {
    return <Loading />;
  }

  if (error || !projectResponse) {
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

  const project = projectResponse.data["project-detail"];
  const roleInProject = projectResponse.data["role-in-project"];

  console.log("Member project", project.members);

  // Prepare project data for components
  // const projectData = {
  //   id: project.id,
  //   title: project["english-title"],
  //   vietnameseTitle: project["vietnamese-title"],
  //   logoUrl: project["logo-url"],
  //   category: project.category,
  //   type: project.type,
  //   description: project.description || "",
  //   abbreviations: project.abbreviations || "",
  //   requirementNote: project["requirement-note"] || "",
  //   language: project.language || "None",
  //   maximumMember: project["maximum-member"] || 0,
  //   status: project.status,
  //   progress: project.progress || 0,
  //   fieldName: majorProject?.["data-list"]?.[0]?.major?.field?.name || "",
  //   majorName: majorProject?.["data-list"]?.[0]?.major?.name || "",
  //   team:
  //     project.members?.map((member) => ({
  //       name: `Member ${member.id.substring(0, 8)}`, // You might need to fetch actual names
  //       role: roleInProject.includes("Principal Investigator")
  //         ? "Principal Investigator"
  //         : "Researcher",
  //       department: "Unknown", // Add if available in your data
  //       email: `${member["accountId"]}@example.com`, // Replace with actual email if available
  //     })) || [],
  //   majors: project.majors || [],
  //   tags: project["project-tags"]?.map((tag) => tag.name) || [],
  // };

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
    // Clean team mapping that matches TeamResearcher interface
    team:
      project.members?.map((member) => ({
        id: member.id,
        name: member["full-name"] || `Member ${member.id.substring(0, 8)}`,
        role:
          member.name === "Principal Investigator"
            ? "Principal Investigator"
            : member.name === "Leader"
            ? "Leader"
            : member.name === "Secretary"
            ? "Secretary"
            : "Researcher",
        major: member.companyName || "Vietnam",
        email: member.email || `None`,
        avartar:
          member["avatar-url"] ||
          "https://c8.alamy.com/comp/R5RMNF/image-of-chemical-technology-abstract-background-science-wallpaper-with-school-chemistry-formulas-and-structures-R5RMNF.jpg",
      })) || [],
    majors: project.majors || [],
    tags: project["project-tags"]?.map((tag) => tag.name) || [],
    milestones: project.milestones?.map((milestone) => ({
      id: milestone.id,
      name: milestone.title,
      description: milestone.description,
      deadline: milestone.endDate,
      status: milestone.status,
      // progress: milestone.progress,
      tasks: milestone.tasks,
    })),
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
            <TeamTab team={projectData.team as []} />
          </TabsContent>
        )}

        {visibleTabs.includes("milestones") && (
          <TabsContent value="milestones" className="space-y-4">
            <MilestoneTab milestones={projectData.milestones || []} />
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
