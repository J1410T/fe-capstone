import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loaders";
import {
  OverviewTab,
  ProjectHeader,
  ProjectProgress,
  TeamTab,
} from "@/pages/HostInstitution/ProjectDetails/components";

// Mock project data for members (filtered version)
const memberProjectData = {
  id: 1,
  title: "Machine Learning for Medical Diagnosis",
  description:
    "This research project aims to develop AI algorithms for early disease detection and diagnosis, focusing on improving healthcare outcomes through machine learning and data analysis.",
  pi: "Dr. Jane Smith",
  department: "Computer Science",
  year: "2023",
  status: "In Progress",
  progress: 65,
  objectives: [
    "Develop machine learning models for disease prediction",
    "Create algorithms for medical image analysis",
    "Design user-friendly interfaces for healthcare professionals",
    "Validate system accuracy through clinical trials",
  ],
  timeline: [
    {
      phase: "Planning & Requirements",
      duration: "Jan 2023 - Feb 2023",
      status: "Completed",
    },
    {
      phase: "Data Collection & Analysis",
      duration: "Mar 2023 - May 2023",
      status: "Completed",
    },
    {
      phase: "Algorithm Development",
      duration: "Jun 2023 - Sep 2023",
      status: "In Progress",
    },
    {
      phase: "Testing & Validation",
      duration: "Oct 2023 - Dec 2023",
      status: "Pending",
    },
  ],
  team: [
    {
      name: "Dr. Jane Smith",
      role: "Principal Investigator",
      department: "Computer Science",
      email: "jane.smith@example.com",
    },
    {
      name: "Dr. Michael Johnson",
      role: "Co-Investigator",
      department: "Computer Science",
      email: "michael.johnson@example.com",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Research Associate",
      department: "Medicine",
      email: "sarah.williams@example.com",
    },
    {
      name: "Robert Chen",
      role: "PhD Student",
      department: "Computer Science",
      email: "robert.chen@example.com",
    },
    {
      name: "Emily Davis",
      role: "PhD Student",
      department: "Medicine",
      email: "emily.davis@example.com",
    },
  ],
};

const MemberProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<typeof memberProjectData | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data from an API with member-specific filtering
        setTimeout(() => {
          // Use the project data directly for members
          setProject(memberProjectData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => navigate("/member/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <ProjectHeader
        title={project.title}
        status={project.status}
        pi={project.pi}
      />

      {/* Project Progress - without budget info for members */}
      <ProjectProgress progress={project.progress} spent="$0" total="$0" />

      {/* Project Tabs - Only Overview and Team for members */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            description={project.description}
            objectives={project.objectives}
            timeline={project.timeline}
          />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <TeamTab team={project.team} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberProjectDetails;
