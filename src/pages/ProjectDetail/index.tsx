import {
  Button,
  Loading,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OverviewTab, ProjectHeader, TeamTab } from "./components";
import BudgetTab from "./components/BudgetTab";
import DocumentTab from "./components/DocumentTab";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import MilestoneTab from "./components/MilestoneTab";
import { ArrowLeft } from "lucide-react";
import {
  useProject,
  useEnrollProjectAsPrincipal,
} from "@/hooks/queries/project";
import { useProjectMajors } from "@/hooks/queries/major";
import {
  getEvaluationStagesByProject,
  getEvaluationSummaryByProject,
} from "./data/mockEvaluationData";
import EvaluationBoardTab from "./components/EvaluationBoardTab";
import { EvaluationStage, EvaluationSummary } from "@/types/task";

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [evaluationStages, setEvaluationStages] = useState<EvaluationStage[]>(
    []
  );
  const [evaluationSummary, setEvaluationSummary] =
    useState<EvaluationSummary | null>(null);

  const { data: majorProject } = useProjectMajors(projectId || "");
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useProject(projectId || "");
  const enrollProjectMutation = useEnrollProjectAsPrincipal();

  useEffect(() => {
    if (projectId) {
      getEvaluationStagesByProject(projectId).then(setEvaluationStages);
      getEvaluationSummaryByProject(projectId).then(setEvaluationSummary);
    }
  }, [projectId]);

  const handleEnrollProject = async () => {
    if (!projectId) return;
    try {
      const enrolledProject = await enrollProjectMutation.mutateAsync(
        projectId
      );
      if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
        navigate(`/pi/project/${enrolledProject.id}/enroll`);
      }
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  const getVisibleTabs = () => {
    const baseTabs = ["overview"];
    const project = projectResponse?.data["project-detail"];
    const isProposal = project?.genre === "proposal";

    if (isProposal) {
      // For Proposal projects: show Overview, Team, Document
      baseTabs.push("team", "documents", "evaluation");
    } else if (projectResponse?.data["is-member"]) {
      // For other projects: show all tabs if member
      baseTabs.push("team", "milestones", "documents", "budget", "evaluation");
    }
    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();
  const isMember = projectResponse?.data["is-member"] || false;
  const shouldShowEnrollButton = Boolean(
    user &&
      !isMember &&
      user.role === UserRole.PRINCIPAL_INVESTIGATOR &&
      projectResponse?.data["project-detail"]?.status === "created"
  );

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
    fieldName: majorProject?.["data-list"]
      ? [
          ...new Set(
            majorProject["data-list"]
              .map((item) => item.major?.field?.name)
              .filter(Boolean)
          ),
        ].join(", ")
      : "",
    majorName: majorProject?.["data-list"]
      ? majorProject["data-list"]
          .map((item) => item.major?.name)
          .filter(Boolean)
          .join(", ")
      : "",
    team:
      project.members?.map((member) => ({
        id: member.id,
        accountId: member.accountId,
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
          "https://wx4.sinaimg.cn/large/005D0pgely1i3dp60wdiaj32dc3k0nph.jpg",
      })) || [],
    majors: project.majors || [],
    tags: project["project-tags"]?.map((tag) => tag.name) || [],
    milestones: project.milestones?.map((milestone) => ({
      id: milestone.id,
      name: milestone.title,
      description: milestone.description,
      deadline: milestone.endDate,
      status: milestone.status,
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
        pictureUrl={project["picture-url"]}
        englishTitle={project["english-title"]}
        code={project.code}
        creator={project.creator}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full ${
            visibleTabs.length <= 3
              ? `grid-cols-${visibleTabs.length}`
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          } gap-1`}
        >
          {visibleTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs sm:text-sm">
              {tab === "overview" ? (
                <>
                  <span className="hidden sm:inline">Overview</span>
                  <span className="sm:hidden">Info</span>
                </>
              ) : (
                tab.charAt(0).toUpperCase() + tab.slice(1)
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            projectId={project.id}
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
            onEnrollProject={handleEnrollProject}
          />
        </TabsContent>

        {visibleTabs.includes("team") && (
          <TabsContent value="team" className="space-y-4">
            <TeamTab team={projectData.team as []} />
          </TabsContent>
        )}

        {visibleTabs.includes("milestones") && (
          <TabsContent value="milestones" className="space-y-4">
            <MilestoneTab projectId={project.id} />
          </TabsContent>
        )}

        {visibleTabs.includes("documents") && (
          <TabsContent value="documents" className="space-y-4">
            <DocumentTab
              projectId={project.id}
              isProposal={project.genre === "proposal"}
              projectStatus={project.status}
            />
          </TabsContent>
        )}

        {visibleTabs.includes("budget") && (
          <TabsContent value="budget" className="space-y-4">
            <BudgetTab transactions={project.transactions || []} />
          </TabsContent>
        )}

        {visibleTabs.includes("evaluation") && (
          <TabsContent value="evaluation" className="space-y-4">
            {evaluationSummary && evaluationStages.length >= 0 ? (
              <EvaluationBoardTab
                evaluationStages={evaluationStages}
                evaluationSummary={evaluationSummary}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading evaluation data...</p>
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default ProjectDetail;
