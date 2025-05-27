import React, { useState } from "react";
import { Loading } from "@/components/ui/loaders";
import {
  ManagementHeader,
  ProjectOverview,
  MilestonesList,
} from "./components";
import { getStatusColor, getStatusIcon } from "./utils/statusHelpers";

// Mock data for project
const project = {
  id: 1,
  title: "AI-Driven Healthcare Solutions",
  pi: "Dr. Jane Smith",
  department: "Computer Science",
  startDate: "2023-05-01",
  endDate: "2024-04-30",
  status: "In Progress",
  progress: 65,
  budget: "$120,000",
  description:
    "This research project aims to develop AI algorithms for early disease detection and diagnosis, focusing on improving healthcare outcomes through machine learning and data analysis.",
};

// Mock data for milestones
const milestones = [
  {
    id: 1,
    title: "Project Initiation and Planning",
    description:
      "Define project scope, objectives, and assemble the research team",
    dueDate: "2023-06-15",
    status: "Completed",
    documents: [
      { id: 1, name: "Project Plan.pdf", type: "PDF", size: "2.4 MB" },
      { id: 2, name: "Team Assignments.xlsx", type: "Excel", size: "1.1 MB" },
    ],
    comments: [
      {
        id: 1,
        user: "Dr. Jane Smith",
        text: "All team members have been assigned their roles.",
        date: "2023-06-10",
      },
      {
        id: 2,
        user: "Host Admin",
        text: "Project plan approved. Proceed to the next phase.",
        date: "2023-06-15",
      },
    ],
  },
  {
    id: 2,
    title: "Literature Review and Data Collection",
    description:
      "Review existing research and collect initial datasets for analysis",
    dueDate: "2023-08-30",
    status: "Completed",
    documents: [
      { id: 3, name: "Literature Review.pdf", type: "PDF", size: "4.7 MB" },
      { id: 4, name: "Dataset Documentation.pdf", type: "PDF", size: "3.2 MB" },
    ],
    comments: [
      {
        id: 3,
        user: "Dr. Jane Smith",
        text: "Literature review completed with 50+ relevant papers identified.",
        date: "2023-08-15",
      },
      {
        id: 4,
        user: "Host Admin",
        text: "Dataset documentation looks comprehensive. Approved.",
        date: "2023-08-28",
      },
    ],
  },
  {
    id: 3,
    title: "Algorithm Development",
    description: "Develop and test initial AI algorithms for disease detection",
    dueDate: "2023-11-30",
    status: "In Progress",
    documents: [
      {
        id: 5,
        name: "Algorithm Specifications.pdf",
        type: "PDF",
        size: "2.8 MB",
      },
    ],
    comments: [
      {
        id: 5,
        user: "Dr. Jane Smith",
        text: "Initial algorithm prototypes have been developed. Testing in progress.",
        date: "2023-10-20",
      },
    ],
  },
  {
    id: 4,
    title: "Validation and Testing",
    description: "Validate algorithm performance with clinical data",
    dueDate: "2024-02-28",
    status: "Pending",
    documents: [],
    comments: [],
  },
  {
    id: 5,
    title: "Final Report and Publication",
    description: "Prepare final report and research papers for publication",
    dueDate: "2024-04-15",
    status: "Pending",
    documents: [],
    comments: [],
  },
];

const ProjectManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [commentText, setCommentText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleDownloadDocument = (documentName: string) => {
    setIsLoading(true);
    console.log("Downloading document:", documentName);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1500);
  };

  const handleAddComment = (milestoneId: number) => {
    if (!commentText.trim()) return;

    setIsLoading(true);
    console.log("Adding comment to milestone:", milestoneId);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCommentText("");
      // Show success message
    }, 1500);
  };

  const handleConfirmMilestone = (milestoneId: number) => {
    setIsLoading(true);
    console.log("Confirming milestone:", milestoneId);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1500);
  };

  const handleRequestRevision = (milestoneId: number) => {
    if (!feedbackText.trim()) return;

    setIsLoading(true);
    console.log("Requesting revision for milestone:", milestoneId);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setFeedbackText("");
      // Show success message
    }, 1500);
  };

  const filteredMilestones = milestones.filter((milestone) => {
    const matchesSearch =
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || milestone.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ManagementHeader />

      {/* Project Overview */}
      <ProjectOverview
        project={project}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />

      {/* Milestones */}
      <MilestonesList
        milestones={filteredMilestones}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        feedbackText={feedbackText}
        onFeedbackTextChange={setFeedbackText}
        onDownloadDocument={handleDownloadDocument}
        onAddComment={handleAddComment}
        onConfirmMilestone={handleConfirmMilestone}
        onRequestRevision={handleRequestRevision}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
    </div>
  );
};

export default ProjectManagement;
