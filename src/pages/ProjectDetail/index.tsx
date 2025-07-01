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
import { useAuth } from "@/contexts/AuthContext";
import ProgressTab from "./components/ProgressTab";
import MilestoneTab from "./components/MilestoneTab";
import { ProjectEnrollModal } from "./components/ProjectEnrollModal";
import { ArrowLeft } from "lucide-react";

// Generate different project data based on project ID for testing access control
const generateProjectData = (
  projectId: string,
  userEmail?: string,
  userName?: string
) => {
  const id = parseInt(projectId) || 1;

  // Define different project scenarios for testing access control
  const projects = {
    1: {
      title: "Machine Learning for Medical Diagnosis",
      pi: "Test PI", // User has access as PI
      status: "In Progress",
      type: "Application",
      team: [
        {
          name: "Test PI",
          role: "Principal Investigator",
          department: "Computer Science",
          email: userEmail || "testpi@example.com",
        },
        {
          name: "Michael Johnson",
          role: "Leader",
          department: "Computer Science",
          email: "michael.johnson@example.com",
        },
        {
          name: "Sarah Williams",
          role: "Secretary",
          department: "Medicine",
          email: "sarah.williams@example.com",
        },
      ],
    },
    2: {
      title: "Quantum Computing Research",
      pi: "Dr. Alice Johnson", // User does NOT have access
      status: "Done",
      type: "Fundamental",
      team: [
        {
          name: "Dr. Alice Johnson",
          role: "Principal Investigator",
          department: "Physics",
          email: "alice.johnson@example.com",
        },
        {
          name: "Bob Smith",
          role: "Leader",
          department: "Physics",
          email: "bob.smith@example.com",
        },
        {
          name: "Carol Davis",
          role: "Member",
          department: "Mathematics",
          email: "carol.davis@example.com",
        },
      ],
    },
    3: {
      title: "Renewable Energy Systems",
      pi: "Prof. John Wilson", // User does NOT have access
      status: "Pending",
      type: "Technology",
      team: [
        {
          name: "Prof. John Wilson",
          role: "Principal Investigator",
          department: "Engineering",
          email: "john.wilson@example.com",
        },
        {
          name: "Jane Brown",
          role: "Leader",
          department: "Engineering",
          email: "jane.brown@example.com",
        },
        {
          name: "Mike Taylor",
          role: "Member",
          department: "Engineering",
          email: "mike.taylor@example.com",
        },
      ],
    },
    4: {
      title: "Artificial Intelligence in Education",
      pi: "Dr. Maria Garcia", // User has access as team member
      status: "Done",
      type: "Application",
      team: [
        {
          name: "Dr. Maria Garcia",
          role: "Principal Investigator",
          department: "Education",
          email: "maria.garcia@example.com",
        },
        {
          name: userName || "Test User",
          role: "Member",
          department: "Computer Science",
          email: userEmail || "testuser@example.com",
        },
        {
          name: "Alex Rodriguez",
          role: "Leader",
          department: "Education",
          email: "alex.rodriguez@example.com",
        },
      ],
    },
  };

  const project = projects[id as keyof typeof projects] || projects[1];

  return {
    id,
    title: project.title,
    category: "Basic scientific research topic",
    type: project.type,
    description: `This research project focuses on ${project.title.toLowerCase()}, utilizing cutting-edge methodologies and innovative approaches to advance the field.`,
    objective: `To develop and validate new approaches in ${project.title.toLowerCase()} that can significantly impact the field and provide practical solutions.`,
    pi: project.pi,
    department: "Computer Science",
    year: "2023",
    status: project.status,
    progress:
      project.status === "Done"
        ? 100
        : project.status === "In Progress"
        ? 65
        : 30,
    budget: {
      total: "$120,000",
      spent: "$78,000",
      allocated: {
        personnel: "$60,000",
        equipment: "$30,000",
        materials: "$15,000",
        other: "$5,000",
      },
    },
    objectives: [
      `Develop innovative solutions for ${project.title.toLowerCase()}`,
      "Create efficient algorithms and methodologies",
      "Design user-friendly interfaces",
      "Validate system accuracy through testing",
    ],
    team: project.team,
    tasks: [
      {
        id: 1,
        title: "Research planning and setup",
        assignee: project.team[0]?.name || "Team Lead",
        dueDate: "July 15, 2023",
        status: "Completed",
        priority: "High",
      },
      {
        id: 2,
        title: "Development and analysis",
        assignee: project.team[1]?.name || "Team Member",
        dueDate: "August 30, 2023",
        status: "In Progress",
        priority: "High",
      },
    ],
    documents: [
      {
        id: 1,
        name: "Project Proposal",
        type: "PDF",
        uploadedBy: project.pi,
        uploadDate: "January 5, 2023",
        size: "2.4 MB",
      },
      {
        id: 2,
        name: "Research Protocol",
        type: "DOCX",
        uploadedBy: project.team[1]?.name || "Team Member",
        uploadDate: "March 10, 2023",
        size: "1.8 MB",
      },
    ],
    reports: [
      {
        name: "Initial Progress Report",
        date: "April 15, 2023",
        status: "Submitted",
      },
      {
        name: "Quarterly Review Q2",
        date: "July 1, 2023",
        status: "Submitted",
      },
    ],
  };
};

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ReturnType<
    typeof generateProjectData
  > | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Check if user owns or is a member of the project
  const isOwnerOrMember = () => {
    if (!user || !project) {
      console.log("❌ No user or no project data");
      return false;
    }

    // Debug logging to help identify the issue
    console.log("=== ACCESS CONTROL CHECK ===");
    console.log("Checking access for user:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });
    console.log("Project ID:", project.id);
    console.log("Project PI:", project.pi);
    console.log(
      "Project team:",
      project.team.map((m) => ({ name: m.name, email: m.email }))
    );

    // Check if user is the principal investigator (by name match)
    const isPI = project.pi === user.name;
    console.log(`PI Check: "${project.pi}" === "${user.name}" = ${isPI}`);

    if (isPI) {
      console.log("✅ User is PI - granting access");
      return true;
    }

    // Check if user is a team member (by email match)
    const teamMemberMatch = project.team.find(
      (member: {
        name: string;
        role: string;
        department: string;
        email: string;
      }) => {
        const emailMatch = member.email === user.email;
        console.log(
          `Team member check: "${member.email}" === "${user.email}" = ${emailMatch}`
        );
        return emailMatch;
      }
    );

    if (teamMemberMatch) {
      console.log(
        "✅ User is team member - granting access:",
        teamMemberMatch.name
      );
      return true;
    }

    console.log("❌ User does not have access to this project");
    return false;
  };

  const hasProjectAccess = isOwnerOrMember();

  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data from an API
        // For now, we'll use the dynamic mock data
        setTimeout(() => {
          const dynamicProject = generateProjectData(
            projectId || "1",
            user?.email,
            user?.name
          );
          setProject(dynamicProject);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, user?.email, user?.name]);

  const handleEnrollProject = async (data: {
    role: "Principal" | "Member";
    message?: string;
  }) => {
    setEnrollLoading(true);
    try {
      // Simulate API call
      console.log("Enrolling in project:", { projectId, ...data });

      // In real app, you would make API call here
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowEnrollModal(false);
      // Refresh project data to show updated membership
      // In real app, refetch project data here
    } catch (error) {
      console.error("Failed to enroll in project:", error);
    } finally {
      setEnrollLoading(false);
    }
  };

  // Determine which tabs to show based on access control and project status
  const getVisibleTabs = () => {
    if (!user) return ["overview"];

    // All users can view overview
    const baseTabs = ["overview"];

    // Only members/owners can see additional tabs
    if (hasProjectAccess) {
      // Always show milestones, documents, and budget for project members
      baseTabs.push("milestones", "documents", "budget");

      // Only show team tab when project status is "Done"
      if (project?.status === "Done") {
        baseTabs.splice(1, 0, "team"); // Insert team tab after overview
        console.log("✅ Project is Done - showing team tab");
      } else {
        console.log(
          "⚠️ Project not Done - hiding team tab (current status:",
          project?.status,
          ")"
        );
      }

      console.log("✅ User has access - showing tabs:", baseTabs);
    } else {
      console.log("⚠️ User does not have access - showing only overview tab");
    }

    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();

  // Show Enroll Project button for users who are not already members
  const shouldShowEnrollButton = Boolean(user && !hasProjectAccess);

  if (isLoading) {
    return <Loading />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => navigate("/home")}>
          <ArrowLeft className=" h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header - Simplified without Show All switch */}
      <ProjectHeader
        title={project.title}
        status={project.status}
        pi={project.pi}
        hasAccess={hasProjectAccess}
      />

      {/* Project Tabs - Based on access control */}
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

        {/* Overview Tab */}
        {visibleTabs.includes("overview") && (
          <TabsContent value="overview" className="space-y-4">
            <OverviewTab
              category={project.category}
              type={project.type}
              description={project.description}
              objectives={project.objectives}
              showEnrollButton={shouldShowEnrollButton}
              onEnrollProject={() => setShowEnrollModal(true)}
            />
          </TabsContent>
        )}

        {/* Team Tab */}
        {visibleTabs.includes("team") && (
          <TabsContent value="team" className="space-y-4">
            <TeamTab
              team={
                project.team as Array<{
                  name: string;
                  role:
                    | "Member"
                    | "Leader"
                    | "Secretary"
                    | "Principal Investigator";
                  department: string;
                  email: string;
                }>
              }
            />
          </TabsContent>
        )}

        {/* Milestones Tab - renamed from Tasks */}
        {visibleTabs.includes("milestones") && (
          <TabsContent value="milestones" className="space-y-4">
            <MilestoneTab />
          </TabsContent>
        )}

        {/* Documents Tab - renamed from Progress */}
        {visibleTabs.includes("documents") && (
          <TabsContent value="documents" className="space-y-4">
            <ProgressTab />
          </TabsContent>
        )}

        {/* Budget Tab */}
        {visibleTabs.includes("budget") && (
          <TabsContent value="budget" className="space-y-4">
            <BudgetTab />
          </TabsContent>
        )}
      </Tabs>

      {/* Project Enrollment Modal */}
      <ProjectEnrollModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onEnroll={handleEnrollProject}
        projectTitle={project.title}
        isLoading={enrollLoading}
      />
    </div>
  );
}

export default ProjectDetail;
