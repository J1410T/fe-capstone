import React, { useState } from "react";
import { Loading } from "@/components/ui/loaders";
import { ApprovalHeader, TopicsTab, ApplicantProfile } from "./components";
import { ApplicantData } from "./types";

// Mock data for research topics
const proposedTopics = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostics",
    type: "Information Technology", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-05-15",
    applicants: 3,
    status: "Waiting for PI",
    councilApprovals: 4,
    totalCouncilMembers: 5,
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    type: "Environment", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-05-10",
    applicants: 2,
    status: "Waiting for PI",
    councilApprovals: 3,
    totalCouncilMembers: 5,
  },
  {
    id: 3,
    title: "Biodiversity Conservation",
    type: "Biology", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-05-05",
    applicants: 1,
    status: "PI Assigned",
    councilApprovals: 5,
    totalCouncilMembers: 5,
  },
  {
    id: 4,
    title: "Quantum Computing Applications",
    type: "Physics", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-05-01",
    applicants: 0,
    status: "Waiting for PI",
    councilApprovals: 2,
    totalCouncilMembers: 5,
  },
  {
    id: 5,
    title: "Genetic Engineering Ethics",
    type: "Biotechnology", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-04-25",
    applicants: 2,
    status: "Waiting for PI",
    councilApprovals: 3,
    totalCouncilMembers: 5,
  },
  {
    id: 6,
    title: "Smart City Infrastructure",
    type: "Civil Engineering", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-04-20",
    applicants: 1,
    status: "Waiting for PI",
    councilApprovals: 1,
    totalCouncilMembers: 5,
  },
  {
    id: 7,
    title: "Climate Change Modeling",
    type: "Environmental Science", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-04-15",
    applicants: 2,
    status: "PI Assigned",
    councilApprovals: 4,
    totalCouncilMembers: 5,
  },
];

// Mock data for proposals submitted to PI
const piApplicants: ApplicantData[] = [
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
    proposalTitle: "Advanced AI Diagnostic System for Medical Imaging",
    proposalSummary:
      "A comprehensive proposal for developing an AI-powered diagnostic system that can analyze medical images with 95% accuracy, reducing diagnosis time by 60%.",
    proposalType: "Research Proposal",
    submittedBy: "Dr. Jane Smith",
    profileData: {
      personalInformation: {
        fullName: "Dr. Jane Smith",
        birthYear: "1985",
        gender: "Female",
        placeOfBirth: "New York, USA",
        nativePlace: "California, USA",
      },
      contactInformation: {
        contactPhone: "+1 (555) 123-4567",
        contactEmail: "jane.smith@example.com",
      },
      academicTitle: {
        academicTitle: "Ph.D.",
        academicTitleYear: "2015",
        academicTitleInstitution: "MIT",
      },
      workUnit: {
        workUnitName: "University of Technology",
        workUnitAddress: "123 Tech Street, Boston, MA",
        workUnitPhone: "+1 (555) 100-2000",
        workUnitEmail: "info@utech.edu",
      },
      educationHistory: [
        {
          level: "Bachelor",
          institution: "Stanford University",
          major: "Computer Science",
          graduationYear: "2007",
        },
        {
          level: "Master",
          institution: "MIT",
          major: "Data Science",
          graduationYear: "2010",
        },
        {
          level: "Doctorate",
          institution: "MIT",
          major: "Computer Science",
          graduationYear: "2015",
        },
        {
          level: "Postdoctoral",
          institution: "",
          major: "",
          graduationYear: "",
        },
      ],
    },
    evaluationData: {
      researchTitle: {
        vietnamese: "Ứng dụng AI trong chẩn đoán y tế",
        english: "AI Applications in Medical Diagnostics",
      },
      implementationTime: {
        durationMonths: "24",
        startMonth: "01",
        startYear: "2024",
        endMonth: "12",
        endYear: "2025",
      },
      principalInvestigator: {
        name: "Dr. Jane Smith",
        academicTitle: "Ph.D.",
        dateOfBirth: "1985-03-15",
        gender: "Female",
        specialization: "Artificial Intelligence",
        scientificTitle: "Associate Professor",
        phone: "+1 (555) 123-4567",
        email: "jane.smith@example.com",
        workUnit: "University of Technology",
        workAddress: "123 Tech Street, Boston, MA",
      },
      secretary: {
        name: "Dr. Robert Brown",
        dateOfBirth: "1980-07-22",
        gender: "Male",
        specialization: "Computer Science",
        scientificTitle: "Assistant Professor",
        phone: "+1 (555) 234-5678",
        email: "robert.brown@example.com",
        workUnit: "University of Technology",
        workAddress: "123 Tech Street, Boston, MA",
      },
      teamResearchers: [
        {
          name: "Dr. Alice Johnson",
          academicTitle: "Ph.D.",
          workUnit: "University of Technology",
          contribution: "Machine Learning Development",
          workDuration: "24 months",
          documents: [
            {
              id: "doc-1",
              title: "Registration Form - Machine Learning Specialist",
              type: "Registration Form",
              description: "Application for ML specialist role",
              uploadedDate: "2023-05-18",
              fileSize: "2.1 MB",
            },
            {
              id: "doc-2",
              title: "Technical Qualifications Certificate",
              type: "Certificate",
              description: "ML certification and qualifications",
              uploadedDate: "2023-05-18",
              fileSize: "1.5 MB",
            },
          ],
        },
        {
          name: "Mr. David Lee",
          academicTitle: "M.Sc.",
          workUnit: "Tech Research Institute",
          contribution: "Data Analysis",
          workDuration: "18 months",
          documents: [
            {
              id: "doc-3",
              title: "Data Analyst Registration Form",
              type: "Registration Form",
              description: "Application for data analyst position",
              uploadedDate: "2023-05-19",
              fileSize: "1.8 MB",
            },
          ],
        },
      ],
      hostInstitution: {
        name: "University of Technology",
        address: "123 Tech Street, Boston, MA 02101",
      },
      proposalDocuments: [
        {
          id: "prop-1",
          title: "Main Research Proposal - AI Diagnostic System",
          type: "Research Proposal",
          description:
            "Comprehensive proposal document outlining the AI diagnostic system development",
          uploadedDate: "2023-05-20",
          fileSize: "5.2 MB",
        },
        {
          id: "prop-2",
          title: "Technical Specifications Document",
          type: "Technical Document",
          description:
            "Detailed technical specifications and implementation plan",
          uploadedDate: "2023-05-20",
          fileSize: "3.8 MB",
        },
        {
          id: "prop-3",
          title: "Budget and Timeline",
          type: "Financial Document",
          description: "Project budget breakdown and implementation timeline",
          uploadedDate: "2023-05-20",
          fileSize: "1.2 MB",
        },
      ],
    },
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
    proposalTitle: "Intelligent Medical Diagnosis Platform Using Deep Learning",
    proposalSummary:
      "Development of a comprehensive AI platform that integrates multiple diagnostic tools and machine learning algorithms to provide accurate medical diagnoses across various specialties.",
    proposalType: "Technical Proposal",
    submittedBy: "Dr. Michael Johnson",
    profileData: {
      personalInformation: {
        fullName: "Dr. Michael Johnson",
        birthYear: "1988",
        gender: "Male",
        placeOfBirth: "Chicago, USA",
        nativePlace: "Illinois, USA",
      },
      contactInformation: {
        contactPhone: "+1 (555) 987-6543",
        contactEmail: "michael.johnson@example.com",
      },
      academicTitle: {
        academicTitle: "Ph.D.",
        academicTitleYear: "2018",
        academicTitleInstitution: "Carnegie Mellon University",
      },
      workUnit: {
        workUnitName: "National Institute of Technology",
        workUnitAddress: "456 Research Ave, Pittsburgh, PA",
        workUnitPhone: "+1 (555) 200-3000",
        workUnitEmail: "info@nit.edu",
      },
      educationHistory: [
        {
          level: "Bachelor",
          institution: "University of Illinois",
          major: "Computer Science",
          graduationYear: "2010",
        },
        {
          level: "Master",
          institution: "Carnegie Mellon",
          major: "Artificial Intelligence",
          graduationYear: "2013",
        },
        {
          level: "Doctorate",
          institution: "Carnegie Mellon",
          major: "Artificial Intelligence",
          graduationYear: "2018",
        },
        {
          level: "Postdoctoral",
          institution: "",
          major: "",
          graduationYear: "",
        },
      ],
    },
    evaluationData: {
      researchTitle: {
        vietnamese: "Hệ thống AI thông minh cho chẩn đoán",
        english: "Intelligent AI Systems for Diagnostics",
      },
      implementationTime: {
        durationMonths: "30",
        startMonth: "03",
        startYear: "2024",
        endMonth: "08",
        endYear: "2026",
      },
      principalInvestigator: {
        name: "Dr. Michael Johnson",
        academicTitle: "Ph.D.",
        dateOfBirth: "1988-11-10",
        gender: "Male",
        specialization: "Artificial Intelligence",
        scientificTitle: "Assistant Professor",
        phone: "+1 (555) 987-6543",
        email: "michael.johnson@example.com",
        workUnit: "National Institute of Technology",
        workAddress: "456 Research Ave, Pittsburgh, PA",
      },
      secretary: {
        name: "Dr. Emily Davis",
        dateOfBirth: "1985-04-18",
        gender: "Female",
        specialization: "Machine Learning",
        scientificTitle: "Research Scientist",
        phone: "+1 (555) 345-6789",
        email: "emily.davis@example.com",
        workUnit: "National Institute of Technology",
        workAddress: "456 Research Ave, Pittsburgh, PA",
      },
      teamResearchers: [
        {
          name: "Dr. Mark Wilson",
          academicTitle: "Ph.D.",
          workUnit: "National Institute of Technology",
          contribution: "Algorithm Development",
          workDuration: "30 months",
          documents: [
            {
              id: "doc-4",
              title: "Algorithm Developer Registration Form",
              type: "Registration Form",
              description: "Application for algorithm development role",
              uploadedDate: "2023-05-17",
              fileSize: "1.9 MB",
            },
          ],
        },
      ],
      hostInstitution: {
        name: "National Institute of Technology",
        address: "456 Research Ave, Pittsburgh, PA 15213",
      },
      proposalDocuments: [
        {
          id: "prop-4",
          title: "Intelligent AI Platform Proposal",
          type: "Research Proposal",
          description: "Main proposal document for the AI diagnostic platform",
          uploadedDate: "2023-05-18",
          fileSize: "4.7 MB",
        },
        {
          id: "prop-5",
          title: "Implementation Roadmap",
          type: "Technical Document",
          description: "Detailed implementation plan and milestones",
          uploadedDate: "2023-05-18",
          fileSize: "2.3 MB",
        },
      ],
    },
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
    proposalTitle:
      "Machine Learning Framework for Enhanced Medical Diagnostics",
    proposalSummary:
      "A novel machine learning framework that combines deep learning with traditional diagnostic methods to improve accuracy and reduce false positives in medical imaging analysis.",
    proposalType: "Research & Development Proposal",
    submittedBy: "Dr. Sarah Williams",
    profileData: {
      personalInformation: {
        fullName: "Dr. Sarah Williams",
        birthYear: "1982",
        gender: "Female",
        placeOfBirth: "Seattle, USA",
        nativePlace: "Washington, USA",
      },
      contactInformation: {
        contactPhone: "+1 (555) 456-7890",
        contactEmail: "sarah.williams@example.com",
      },
      academicTitle: {
        academicTitle: "Ph.D.",
        academicTitleYear: "2012",
        academicTitleInstitution: "University of Washington",
      },
      workUnit: {
        workUnitName: "Tech University",
        workUnitAddress: "789 Innovation Blvd, Seattle, WA",
        workUnitPhone: "+1 (555) 300-4000",
        workUnitEmail: "info@techuni.edu",
      },
      educationHistory: [
        {
          level: "Bachelor",
          institution: "University of Washington",
          major: "Computer Engineering",
          graduationYear: "2004",
        },
        {
          level: "Master",
          institution: "University of Washington",
          major: "Computer Engineering",
          graduationYear: "2007",
        },
        {
          level: "Doctorate",
          institution: "University of Washington",
          major: "Machine Learning",
          graduationYear: "2012",
        },
        {
          level: "Postdoctoral",
          institution: "Stanford University",
          major: "AI Research",
          graduationYear: "2014",
        },
      ],
    },
    evaluationData: {
      researchTitle: {
        vietnamese: "Học máy tiên tiến cho chẩn đoán y tế",
        english: "Advanced Machine Learning for Medical Diagnostics",
      },
      implementationTime: {
        durationMonths: "36",
        startMonth: "06",
        startYear: "2024",
        endMonth: "05",
        endYear: "2027",
      },
      principalInvestigator: {
        name: "Dr. Sarah Williams",
        academicTitle: "Ph.D.",
        dateOfBirth: "1982-09-25",
        gender: "Female",
        specialization: "Machine Learning",
        scientificTitle: "Professor",
        phone: "+1 (555) 456-7890",
        email: "sarah.williams@example.com",
        workUnit: "Tech University",
        workAddress: "789 Innovation Blvd, Seattle, WA",
      },
      secretary: {
        name: "Dr. James Miller",
        dateOfBirth: "1979-12-03",
        gender: "Male",
        specialization: "Data Science",
        scientificTitle: "Associate Professor",
        phone: "+1 (555) 567-8901",
        email: "james.miller@example.com",
        workUnit: "Tech University",
        workAddress: "789 Innovation Blvd, Seattle, WA",
      },
      teamResearchers: [
        {
          name: "Dr. Lisa Chen",
          academicTitle: "Ph.D.",
          workUnit: "Tech University",
          contribution: "Deep Learning Research",
          workDuration: "36 months",
        },
        {
          name: "Dr. Kevin Park",
          academicTitle: "Ph.D.",
          workUnit: "Medical Research Center",
          contribution: "Medical Domain Expertise",
          workDuration: "24 months",
        },
        {
          name: "Ms. Anna Rodriguez",
          academicTitle: "M.Sc.",
          workUnit: "Tech University",
          contribution: "Data Processing",
          workDuration: "18 months",
        },
      ],
      hostInstitution: {
        name: "Tech University",
        address: "789 Innovation Blvd, Seattle, WA 98195",
      },
    },
  },
];

const ProjectApproval: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all"); // Changed from selectedDepartment
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleViewApplicantProfile = (applicantId: number) => {
    setSelectedApplicant(applicantId);
  };

  const handleCloseApplicantProfile = () => {
    setSelectedApplicant(null);
  };

  const handleApprovePI = (applicantId: number) => {
    // Handle approve PI
    setIsLoading(true);
    console.log("Approving PI with ID:", applicantId);

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
    console.log("Rejecting PI with ID:", applicantId);

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
    console.log("Requesting revision for PI with ID:", applicantId);

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
    const matchesType = selectedType === "all" || topic.type === selectedType; // Changed from department
    const matchesCategory =
      selectedCategory === "all" || topic.category === selectedCategory; // New filter
    const matchesStatus =
      selectedStatus === "all" || topic.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Get selected applicant data
  const selectedApplicantData = selectedApplicant
    ? piApplicants.find((applicant) => applicant.id === selectedApplicant)
    : null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ApprovalHeader />

      {isLoading && <Loading />}

      <TopicsTab
        topics={filteredTopics}
        applicants={piApplicants}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onViewProfile={handleViewApplicantProfile}
      />

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

export default ProjectApproval;
