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
import DocumentTab from "./components/DocumentTab";
import ResultTab from "./components/ResultTab";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import MilestoneTab from "./components/MilestoneTab";
import { ArrowLeft } from "lucide-react";
import {
  useProject,
  useEnrollProjectAsPrincipal,
} from "@/hooks/queries/project";
import { useProjectMajors } from "@/hooks/queries/major";
// import { getEvaluationsByProject } from "./data/mockEvaluationApiData";
import EvaluationBoardTab from "./components/EvaluationBoardTab";
// import { Evaluation } from "@/types/evaluation-api";

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  // const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const { data: majorProject } = useProjectMajors(projectId || "");
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useProject(projectId || "");
  const enrollProjectMutation = useEnrollProjectAsPrincipal();

  // useEffect(() => {
  //   if (projectId) {
  //     getEvaluationsByProject(projectId).then(setEvaluations);
  //   }
  // }, [projectId]);

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
    const isMember = projectResponse?.data["is-member"];
    const projectStatus = project?.status;

    // Show all tabs if project is approved or inprogress
    if (projectStatus === "inprogress" || projectStatus === "completed") {
      baseTabs.push(
        "team",
        "milestones",
        "evaluation",
        "documents",
        "budget",
        "results"
      );
    } else if (isProposal) {
      // For Proposal projects: show Overview, Team, Document, Evaluation
      baseTabs.push("team", "documents", "evaluation");
    } else if (isMember) {
      // For other projects: show all tabs if member
      baseTabs.push(
        "team",
        "milestones",
        "evaluation",
        "documents",
        "budget",
        "results"
      );
    } else {
      // For non-members: show basic tabs including results for viewing
      // baseTabs.push("team", "documents");
    }
    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();
  const isMember = projectResponse?.data["is-member"] || false;
  const projectDetail = projectResponse?.data["project-detail"];

  // Check if project is completed and 30 days have passed since updated-at
  const isProjectLocked = (() => {
    if (projectDetail?.status !== "completed" || !projectDetail["updated-at"]) {
      return false;
    }

    const updatedAt = new Date(projectDetail["updated-at"]);
    const thirtyDaysLater = new Date(
      updatedAt.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const now = new Date();

    return now > thirtyDaysLater;
  })();

  const shouldShowEnrollButton = Boolean(
    user &&
      !isMember &&
      user.role === UserRole.PRINCIPAL_INVESTIGATOR &&
      projectDetail?.status === "created" &&
      !isProjectLocked
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

  const roleInProject = projectResponse.data["role-in-project"];

  // Block PI access to draft projects
  if (
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR &&
    projectDetail?.status === "draft"
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You cannot access the project in draft status.
        </p>
        <Button onClick={() => navigate("/pi/projects")}>
          <ArrowLeft className="h-4 w-4" />
          Back to My Projects
        </Button>
      </div>
    );
  }

  if (!projectDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project details could not be loaded.
        </p>
        <Button onClick={() => navigate("/home")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const projectData = {
    id: projectDetail.id,
    title: projectDetail["english-title"],
    vietnameseTitle: projectDetail["vietnamese-title"],
    logoUrl: projectDetail["logo-url"],
    category: projectDetail.category,
    type: projectDetail.type,
    description: projectDetail.description || "",
    abbreviations: projectDetail.abbreviations || "",
    requirementNote: projectDetail["requirement-note"] || "",
    language: projectDetail.language || "None",
    maximumMember: projectDetail["maximum-member"] || 0,
    status: projectDetail.status,
    progress: projectDetail.progress || 0,
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
      projectDetail.members?.map((member) => ({
        id: member.id,
        accountId: member["account-id"],
        name: member["full-name"] || `Member ${member.id.substring(0, 8)}`,
        role:
          member.name === "Principal Investigator"
            ? "Principal Investigator"
            : member.name === "Leader"
            ? "Leader"
            : member.name === "Secretary"
            ? "Secretary"
            : "Researcher",
        // major: member. || "Vietnam",
        email: member.email || `None`,
        avartar:
          member["avatar-url"] ||
          "https://wx4.sinaimg.cn/large/005D0pgely1i3dp60wdiaj32dc3k0nph.jpg",
      })) || [],
    majors: projectDetail.majors || [],
    tags: projectDetail["project-tags"]?.map((tag) => tag.name) || [],
    milestones: projectDetail.milestones?.map((milestone) => ({
      id: milestone.id,
      name: milestone.title,
      description: milestone.description,
      deadline: milestone["end-date"],
      status: milestone.status,
      tasks: milestone.tasks,
    })),
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        title={projectDetail["english-title"]}
        status={projectDetail.status}
        isMember={isMember}
        roleInProject={roleInProject}
        pictureUrl={projectDetail["picture-url"]}
        englishTitle={projectDetail["english-title"]}
        code={projectDetail.code}
        creator={projectDetail.creator}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap justify-center gap-1 w-full">
          {visibleTabs.map((tab) => {
            return (
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
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            projectId={projectDetail.id}
            category={projectDetail.category}
            type={projectDetail.type}
            description={
              projectDetail.description || "No description available"
            }
            vietnameseTitle={projectDetail["vietnamese-title"]}
            logoUrl={
              projectDetail["logo-url"] ||
              "https://w0.peakpx.com/wallpaper/340/533/HD-wallpaper-chemistry-medical-biology-detail-medicine-psychedelic-science-abstract-abstraction-genetics-and-mobile-background-cool-abstract-science.jpg"
            }
            abbreviations={
              projectDetail.abbreviations || "No abbreviations available"
            }
            requirementNote={
              projectDetail["requirement-note"] ||
              "No requirement note available"
            }
            language={projectDetail.language}
            maximumMember={projectDetail["maximum-member"] || 0}
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
            {isProjectLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Project Locked
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This project has been completed for more than 30 days.
                        All editing and adding features have been disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <MilestoneTab projectId={projectDetail.id} />
          </TabsContent>
        )}

        {visibleTabs.includes("documents") && (
          <TabsContent value="documents" className="space-y-4">
            {isProjectLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Project Locked
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This project has been completed for more than 30 days.
                        All editing and adding features have been disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DocumentTab
              projectId={projectDetail.id}
              isProposal={projectDetail.genre === "proposal"}
              projectStatus={projectDetail.status}
            />
          </TabsContent>
        )}

        {visibleTabs.includes("budget") && (
          <TabsContent value="budget" className="space-y-4">
            {isProjectLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Project Locked
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This project has been completed for more than 30 days.
                        All editing and adding features have been disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <BudgetTab
              projectId={projectDetail.id}
              category={projectDetail.category}
              isMember={projectResponse?.data["is-member"]}
              roleInProject={projectResponse?.data["role-in-project"]}
            />
          </TabsContent>
        )}

        {visibleTabs.includes("results") && (
          <TabsContent value="results" className="space-y-4">
            {isProjectLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Project Locked
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This project has been completed for more than 30 days.
                        All editing and adding features have been disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ResultTab
              projectId={projectDetail.id}
              category={projectDetail.category}
              isMember={projectResponse?.data["is-member"]}
              roleInProject={projectResponse?.data["role-in-project"]}
            />
          </TabsContent>
        )}

        {visibleTabs.includes("evaluation") && (
          <TabsContent value="evaluation" className="space-y-4">
            <EvaluationBoardTab
            // projectId={project.id}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default ProjectDetail;
