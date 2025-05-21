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

// Mock data for proposed topics
const proposedTopics = [
  {
    id: 1,
    title: "Machine Learning for Medical Diagnosis",
    department: "Computer Science",
    status: "Waiting for PI",
    createdAt: "2023-05-15",
    applicants: 3,
  },
  {
    id: 2,
    title: "Renewable Energy Storage Solutions",
    department: "Engineering",
    status: "PI Assigned",
    createdAt: "2023-06-02",
    applicants: 2,
  },
  {
    id: 3,
    title: "Blockchain in Supply Chain Management",
    department: "Business",
    status: "Waiting for PI",
    createdAt: "2023-06-10",
    applicants: 1,
  },
  {
    id: 4,
    title: "Sustainable Urban Planning",
    department: "Architecture",
    status: "Waiting for PI",
    createdAt: "2023-06-15",
    applicants: 0,
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
    institution: "National University",
    experience: "8 years",
    publications: 18,
    degrees: ["Ph.D. in Artificial Intelligence", "M.Sc. in Computer Science"],
    status: "Pending Review",
    appliedFor: 1, // Topic ID
    appliedDate: "2023-05-22",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research project", url: "#" },
    ],
  },
  {
    id: 3,
    name: "Dr. Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 456-7890",
    department: "Computer Science",
    institution: "State University",
    experience: "12 years",
    publications: 30,
    degrees: ["Ph.D. in Machine Learning", "M.Sc. in Statistics"],
    status: "Pending Review",
    appliedFor: 1, // Topic ID
    appliedDate: "2023-05-25",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research project", url: "#" },
    ],
  },
  {
    id: 4,
    name: "Dr. Robert Chen",
    email: "robert.chen@example.com",
    phone: "+1 (555) 234-5678",
    department: "Engineering",
    institution: "Technical University",
    experience: "15 years",
    publications: 42,
    degrees: ["Ph.D. in Electrical Engineering", "M.Eng. in Renewable Energy"],
    status: "Pending Review",
    appliedFor: 2, // Topic ID
    appliedDate: "2023-06-05",
    documents: [
      { name: "CV", url: "#" },
      { name: "Publications List", url: "#" },
      { name: "Research project", url: "#" },
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

  const handleApprovePI = (applicantId: number) => {
    // Handle approve PI
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const handleRejectPI = (applicantId: number) => {
    // Handle reject PI
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const handleRequestRevision = (applicantId: number) => {
    // Handle request revision
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const filteredTopics = proposedTopics.filter(
    (topic) =>
      (topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDepartment === "all" ||
        topic.department === selectedDepartment) &&
      (selectedStatus === "all" || topic.status === selectedStatus)
  );

  const topicApplicants = selectedTopic
    ? piApplicants.filter((applicant) => applicant.appliedFor === selectedTopic)
    : [];

  const selectedApplicantData = selectedApplicant
    ? piApplicants.find((applicant) => applicant.id === selectedApplicant)
    : null;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ApprovalHeader />

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
        applicant={selectedApplicantData}
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
