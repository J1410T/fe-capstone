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
import { ApplicantData } from "./types";

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
      teamMembers: [
        {
          name: "Dr. Alice Johnson",
          academicTitle: "Ph.D.",
          workUnit: "University of Technology",
          contribution: "Machine Learning Development",
          workDuration: "24 months",
        },
        {
          name: "Mr. David Lee",
          academicTitle: "M.Sc.",
          workUnit: "Tech Research Institute",
          contribution: "Data Analysis",
          workDuration: "18 months",
        },
      ],
      hostInstitution: {
        name: "University of Technology",
        address: "123 Tech Street, Boston, MA 02101",
      },
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
      teamMembers: [
        {
          name: "Dr. Mark Wilson",
          academicTitle: "Ph.D.",
          workUnit: "National Institute of Technology",
          contribution: "Algorithm Development",
          workDuration: "30 months",
        },
      ],
      hostInstitution: {
        name: "National Institute of Technology",
        address: "456 Research Ave, Pittsburgh, PA 15213",
      },
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
      teamMembers: [
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
            Project Applicants
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

export default ProjectApproval;
