import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loaders";
import {
  ProposeHeader,
  CreateTopicForm,
  TopicsList,
  ApplicantsList,
  ApplicantProfile,
} from "./components";

// Mock data for topics
const topics = [
  {
    id: 1,
    title: "Machine Learning for Medical Diagnosis",
    department: "Computer Science",
    createdAt: "2023-05-15",
    applicants: 3,
    status: "Waiting for PI",
  },
  {
    id: 2,
    title: "Renewable Energy Storage Solutions",
    department: "Engineering",
    createdAt: "2023-06-02",
    applicants: 2,
    status: "PI Assigned",
  },
  {
    id: 3,
    title: "Blockchain in Supply Chain Management",
    department: "Business",
    createdAt: "2023-06-10",
    applicants: 1,
    status: "Waiting for PI",
  },
  {
    id: 4,
    title: "Sustainable Urban Planning",
    department: "Architecture",
    createdAt: "2023-06-15",
    applicants: 0,
    status: "Waiting for PI",
  },
];

// Mock data for applicants
const applicants = [
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
    documents: [
      { name: "CV.pdf", url: "#" },
      { name: "Publications.pdf", url: "#" },
      { name: "Research Proposal.pdf", url: "#" },
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
    documents: [
      { name: "CV.pdf", url: "#" },
      { name: "Publications.pdf", url: "#" },
      { name: "Research Proposal.pdf", url: "#" },
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
    documents: [
      { name: "CV.pdf", url: "#" },
      { name: "Publications.pdf", url: "#" },
      { name: "Research Proposal.pdf", url: "#" },
    ],
  },
];

const ProposePrincipalInvestigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(
    null
  );

  const waitingTopics = topics.filter(
    (topic) => topic.status === "Waiting for PI"
  );

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab("waiting");
      // Show success message
    }, 1500);
  };

  const handleCancelCreate = () => {
    setActiveTab("waiting");
  };

  const handleViewApplicants = (topicId: number) => {
    setSelectedTopic(topicId);
    setActiveTab("applications");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setActiveTab("waiting");
  };

  const handleViewProfile = (applicantId: number) => {
    setSelectedApplicant(applicantId);
  };

  const handleCloseProfile = () => {
    setSelectedApplicant(null);
  };

  const handleApprovePI = (_applicantId: number) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      setActiveTab("waiting");
      // Show success message
    }, 1500);
  };

  const handleRejectPI = (_applicantId: number) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const handleRequestMoreInfo = (_applicantId: number) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedApplicant(null);
      // Show success message
    }, 1500);
  };

  const filteredTopics = waitingTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topicApplicants = selectedTopic
    ? applicants.filter((a) => a.id <= 3) // Mock filtering
    : [];

  const selectedApplicantData = selectedApplicant
    ? applicants.find((a) => a.id === selectedApplicant)
    : null;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ProposeHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        waitingCount={waitingTopics.length}
        applicationsCount={applicants.length}
      />

      <Tabs value={activeTab}>
        {/* Create Topic Tab */}
        <TabsContent value="create" className="space-y-6">
          <CreateTopicForm
            onSubmit={handleCreateTopic}
            onCancel={handleCancelCreate}
          />
        </TabsContent>

        {/* Waiting for PI Tab */}
        <TabsContent value="waiting" className="space-y-6">
          <TopicsList
            topics={filteredTopics}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewApplicants={handleViewApplicants}
          />
        </TabsContent>

        {/* PI Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <ApplicantsList
            applicants={topicApplicants}
            selectedTopic={selectedTopic}
            topics={topics}
            onBackToTopics={handleBackToTopics}
            onViewProfile={handleViewProfile}
            onApprove={handleApprovePI}
            onReject={handleRejectPI}
            onRequestMoreInfo={handleRequestMoreInfo}
          />
        </TabsContent>
      </Tabs>

      {/* Applicant Profile Dialog */}
      <ApplicantProfile
        applicant={selectedApplicantData || null}
        isOpen={!!selectedApplicant}
        onClose={handleCloseProfile}
        onApprove={handleApprovePI}
        onReject={handleRejectPI}
        onRequestMoreInfo={handleRequestMoreInfo}
      />
    </div>
  );
};

export default ProposePrincipalInvestigator;
