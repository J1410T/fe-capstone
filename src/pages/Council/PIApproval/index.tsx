import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loaders";
import {
  ApprovalHeader,
  TopicsTab,
  ApplicantsTab,
  ApplicantProfile,
} from "./components";

// Mock data for research topics
const proposedTopics = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostics",
    department: "Computer Science",
    createdAt: "2023-05-15",
    applicants: 3,
    status: "Waiting for PI",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    department: "Engineering",
    createdAt: "2023-05-10",
    applicants: 2,
    status: "Waiting for PI",
  },
  {
    id: 3,
    title: "Biodiversity Conservation",
    department: "Environmental Science",
    createdAt: "2023-05-05",
    applicants: 1,
    status: "PI Assigned",
  },
  {
    id: 4,
    title: "Quantum Computing Applications",
    department: "Physics",
    createdAt: "2023-05-01",
    applicants: 0,
    status: "Waiting for PI",
  },
  {
    id: 5,
    title: "Genetic Engineering Ethics",
    department: "Bioethics",
    createdAt: "2023-04-25",
    applicants: 2,
    status: "Waiting for PI",
  },
];

// Mock data for PI applicants
const piApplicants = [
  {
    id: 1,
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    institution: "University of Technology",
    experience: "10 years",
    publications: 25,
    degrees: ["Ph.D. in Computer Science", "M.Sc. in Data Science"],
    status: "Pending Review",
    appliedFor: 1, // Topic ID
    appliedDate: "2023-05-20",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research project", url: "#" },
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 987-6543",
    department: "Computer Science",
    institution: "National Institute of Technology",
    experience: "8 years",
    publications: 18,
    degrees: ["Ph.D. in Artificial Intelligence", "B.Sc. in Computer Science"],
    status: "Pending Review",
    appliedFor: 1, // Topic ID
    appliedDate: "2023-05-18",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research proposal", url: "#" },
    ],
  },
  {
    id: 3,
    name: "Dr. Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 456-7890",
    department: "Computer Science",
    institution: "Tech University",
    experience: "12 years",
    publications: 30,
    degrees: ["Ph.D. in Machine Learning", "M.Sc. in Computer Engineering"],
    status: "Pending Review",
    appliedFor: 1, // Topic ID
    appliedDate: "2023-05-15",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research background", url: "#" },
    ],
  },
];

const PIApproval: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("topics");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleViewApplicants = (topicId: number) => {
    setSelectedTopic(topicId);
    setActiveTab("applicants");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setActiveTab("topics");
  };

  const handleViewApplicantProfile = (applicantId: number) => {
    setSelectedApplicant(applicantId);
  };

  const handleCloseApplicantProfile = () => {
    setSelectedApplicant(null);
  };

  const handleApprovePI = (_applicantId: number) => {
    // Handle approve PI
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const handleRejectPI = (_applicantId: number) => {
    // Handle reject PI
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const handleRequestRevision = (_applicantId: number) => {
    // Handle request revision
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  // Filter topics based on search term, department, and status
  const filteredTopics = proposedTopics.filter((topic) => {
    const matchesSearch = topic.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || topic.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || topic.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get applicants for the selected topic
  const topicApplicants = selectedTopic
    ? piApplicants.filter((applicant) => applicant.appliedFor === selectedTopic)
    : [];

  // Get selected applicant data
  const selectedApplicantData = selectedApplicant
    ? piApplicants.find((applicant) => applicant.id === selectedApplicant)
    : null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ApprovalHeader />

      {isLoading && <Loading />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topics">Research Topics</TabsTrigger>
          <TabsTrigger value="applicants">
            PI Applicants
            {selectedTopic && (
              <Badge variant="secondary" className="ml-2">
                {topicApplicants.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          <TopicsTab
            topics={filteredTopics}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onViewApplicants={handleViewApplicants}
          />
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants" className="space-y-4">
          <ApplicantsTab
            applicants={topicApplicants}
            selectedTopic={selectedTopic}
            topics={proposedTopics}
            onBackToTopics={handleBackToTopics}
            onViewProfile={handleViewApplicantProfile}
          />
        </TabsContent>
      </Tabs>

      {/* Applicant Profile Dialog */}
      <ApplicantProfile
        applicant={selectedApplicantData || null}
        isOpen={!!selectedApplicant}
        onClose={handleCloseApplicantProfile}
        onApprove={handleApprovePI}
        onReject={handleRejectPI}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
};

export default PIApproval;
