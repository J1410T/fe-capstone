import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TinyMCEViewDialog } from "./components/TinyMCEViewDialog";
import { ArrowLeft, FileText, User, Calendar, Plus, Eye } from "lucide-react";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  institution: string;
  experience: string;
  publications: number;
  degrees: string[];
  status: string;
  appliedFor: number;
  appliedDate: string;
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: "PI" | "Co-Investigator" | "Research Assistant" | "Consultant";
  email: string;
  institution: string;
  department: string;
  scientificCV: string; // TinyMCE content
}

interface AIReview {
  id: string;
  name: string;
  totalRate: number | null;
  comment: string;
  submittedAt: string;
  isApproved: boolean;
  reviewerResult: unknown | null;
  isAiReport: boolean;
  status: string;
  evaluationStageId: string;
  reviewerId: string | null;
  documents: unknown | null;
  projectsSimilarityResult: unknown | null;
}

interface IndividualEvaluation {
  id: string;
  evaluatorName: string;
  evaluatorRole: string;
  status: "completed" | "pending" | "in-progress";
  score: number | null;
  submittedAt: string | null;
  comment: string;
  totalRate?: number | null;
  isAiReport?: boolean;
}

interface EvaluationStage {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "pending";
  totalEvaluations: number;
  completedEvaluations: number;
  createdAt: string;
  aiReview?: AIReview;
  individualEvaluations: IndividualEvaluation[];
}

// Mock scientific CV data
const mockScientificCVs = {
  1: `
    <h2>Dr. Jane Smith - Scientific CV</h2>
    <h3>Personal Information</h3>
    <p><strong>Name:</strong> Dr. Jane Smith<br>
    <strong>Title:</strong> Professor of Computer Science<br>
    <strong>Institution:</strong> University of Technology<br>
    <strong>Email:</strong> jane.smith@example.com</p>
    
    <h3>Education</h3>
    <ul>
      <li><strong>Ph.D. in Computer Science</strong> - MIT (2015)</li>
      <li><strong>M.Sc. in Data Science</strong> - Stanford University (2010)</li>
      <li><strong>B.Sc. in Computer Science</strong> - University of California, Berkeley (2007)</li>
    </ul>
    
    <h3>Research Experience</h3>
    <p><strong>2015-Present:</strong> Professor, University of Technology<br>
    Research focus: Artificial Intelligence, Machine Learning, Medical Imaging</p>
    
    <h3>Publications (Last 5 Years)</h3>
    <ol>
      <li>Smith, J. et al. (2023). "AI-Driven Medical Diagnostics: A Comprehensive Review." <em>Nature Medicine</em>, 45(3), 123-145.</li>
      <li>Smith, J., Johnson, M. (2022). "Deep Learning Applications in Healthcare." <em>IEEE Transactions on Medical Imaging</em>, 41(8), 2156-2168.</li>
      <li>Smith, J. (2021). "Automated Diagnosis Systems Using Computer Vision." <em>Computer Vision and Pattern Recognition</em>, 2021, pp. 1234-1245.</li>
    </ol>
    
    <h3>Grants and Funding</h3>
    <ul>
      <li>NSF Grant #1234567 - "AI for Medical Diagnostics" ($500,000, 2020-2023)</li>
      <li>NIH Grant #7654321 - "Machine Learning in Healthcare" ($750,000, 2019-2022)</li>
    </ul>
  `,
  2: `
    <h2>Dr. Michael Johnson - Scientific CV</h2>
    <h3>Personal Information</h3>
    <p><strong>Name:</strong> Dr. Michael Johnson<br>
    <strong>Title:</strong> Associate Professor of Artificial Intelligence<br>
    <strong>Institution:</strong> National Institute of Technology<br>
    <strong>Email:</strong> michael.johnson@example.com</p>
    
    <h3>Education</h3>
    <ul>
      <li><strong>Ph.D. in Artificial Intelligence</strong> - Carnegie Mellon University (2018)</li>
      <li><strong>M.Sc. in Computer Science</strong> - Carnegie Mellon University (2013)</li>
      <li><strong>B.Sc. in Computer Science</strong> - University of Illinois (2010)</li>
    </ul>
    
    <h3>Research Experience</h3>
    <p><strong>2018-Present:</strong> Associate Professor, National Institute of Technology<br>
    Research focus: Deep Learning, Neural Networks, Healthcare AI</p>
    
    <h3>Publications (Last 5 Years)</h3>
    <ol>
      <li>Johnson, M., Smith, J. (2023). "Neural Networks for Medical Image Analysis." <em>Journal of AI in Medicine</em>, 12(4), 78-92.</li>
      <li>Johnson, M. et al. (2022). "Intelligent Diagnostic Platforms." <em>ACM Computing Surveys</em>, 54(7), 1-35.</li>
    </ol>
  `,
  3: `
    <h2>Dr. Sarah Williams - Scientific CV</h2>
    <h3>Personal Information</h3>
    <p><strong>Name:</strong> Dr. Sarah Williams<br>
    <strong>Title:</strong> Research Scientist<br>
    <strong>Institution:</strong> Tech University<br>
    <strong>Email:</strong> sarah.williams@example.com</p>
    
    <h3>Education</h3>
    <ul>
      <li><strong>Ph.D. in Machine Learning</strong> - University of Washington (2012)</li>
      <li><strong>M.Sc. in Computer Engineering</strong> - University of Washington (2007)</li>
    </ul>
    
    <h3>Research Experience</h3>
    <p><strong>2012-Present:</strong> Research Scientist, Tech University<br>
    Research focus: Machine Learning Frameworks, Medical Applications</p>
  `,
  4: `
    <h2>Dr. Robert Chen - Scientific CV</h2>
    <h3>Personal Information</h3>
    <p><strong>Name:</strong> Dr. Robert Chen<br>
    <strong>Title:</strong> Assistant Professor<br>
    <strong>Institution:</strong> University of Technology<br>
    <strong>Email:</strong> robert.chen@example.com</p>
    
    <h3>Education</h3>
    <ul>
      <li><strong>Ph.D. in Biomedical Engineering</strong> - Johns Hopkins University (2019)</li>
      <li><strong>M.Sc. in Electrical Engineering</strong> - MIT (2015)</li>
    </ul>
    
    <h3>Research Experience</h3>
    <p><strong>2019-Present:</strong> Assistant Professor, University of Technology<br>
    Research focus: Medical Device Development, Signal Processing</p>
  `,
};

// Mock team members for each proposal
const mockTeamMembers: { [key: number]: TeamMember[] } = {
  1: [
    {
      id: 1,
      name: "Dr. Jane Smith",
      role: "PI",
      email: "jane.smith@example.com",
      institution: "University of Technology",
      department: "Computer Science",
      scientificCV: mockScientificCVs[1],
    },
    {
      id: 2,
      name: "Dr. Michael Johnson",
      role: "Co-Investigator",
      email: "michael.johnson@example.com",
      institution: "National Institute of Technology",
      department: "Computer Science",
      scientificCV: mockScientificCVs[2],
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      role: "Research Assistant",
      email: "sarah.williams@example.com",
      institution: "Tech University",
      department: "Machine Learning",
      scientificCV: mockScientificCVs[3],
    },
    {
      id: 4,
      name: "Dr. Robert Chen",
      role: "Consultant",
      email: "robert.chen@example.com",
      institution: "University of Technology",
      department: "Biomedical Engineering",
      scientificCV: mockScientificCVs[4],
    },
  ],
  2: [
    {
      id: 2,
      name: "Dr. Michael Johnson",
      role: "PI",
      email: "michael.johnson@example.com",
      institution: "National Institute of Technology",
      department: "Computer Science",
      scientificCV: mockScientificCVs[2],
    },
    {
      id: 1,
      name: "Dr. Jane Smith",
      role: "Co-Investigator",
      email: "jane.smith@example.com",
      institution: "University of Technology",
      department: "Computer Science",
      scientificCV: mockScientificCVs[1],
    },
  ],
};

// Mock evaluation stages data
const mockEvaluationStages: EvaluationStage[] = [
  {
    id: "a44bebc5-0324-4e3e-987e-4014cee7fef8",
    name: "Initial Review",
    description:
      "First stage evaluation including AI review and individual assessments",
    status: "active",
    totalEvaluations: 4,
    completedEvaluations: 2,
    createdAt: "2025-08-11T14:05:12.0316727",
    aiReview: {
      id: "e2105b84-b602-4ab8-917e-24f1e8439433",
      name: "AI Review",
      totalRate: null,
      comment: `The project titled "Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy" presents a compelling initiative aimed at enhancing the management of certification processes within an educational context, specifically tailored for aviation training.

### Project Overview

**Title:** Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy  
**Description:** This system serves as a comprehensive tool to streamline the implementation and management of projects, beginning from registration through to certification issuance. The platform will facilitate students in easily searching, registering for, and tracking their projects, while also assisting instructors in managing, evaluating, and providing feedback to students efficiently.

### Key Elements

1. **Target Audience:** 
   - The primary users are students and instructors at an aviation academy. Students will benefit from a user-friendly interface that simplifies the certification process, while instructors will have tools to manage and evaluate student projects effectively.

2. **Functionality:**
   - The system will incorporate digital signature integration, enhancing the legitimacy and security of the issued certifications. This feature is crucial in ensuring that the documentation is tamper-proof and recognized within the aviation industry.

3. **Team Composition:**
   - The maximum number of team members for the project is set at six, indicating a collaborative approach that leverages diverse skills and expertise.

4. **Project Type:** 
   - Classified as a cooperative project, emphasizing teamwork and shared responsibilities in the development and implementation phases.

5. **Category and Genre:**
   - The project falls under the application/implementation category and is framed as a proposal, suggesting it is in the planning stage and seeks approval or support for execution.

### Conclusion

The proposed Online Certification Management System is a forward-thinking solution that addresses significant needs within the aviation education sector. By incorporating features that enhance usability for students and operational efficiency for instructors, it stands to contribute positively to the landscape of aviation training programs.
The integration of digital signatures further adds value, ensuring that the certifications issued are secure and credible.

**Next Steps:**
- Detailed planning and resource allocation should be initiated to move from the proposal stage to implementation.
- Engaging stakeholders for feedback and refining the system's functionalities based on their needs will be crucial for the project's success.

This project, if executed effectively, could serve as a model for similar educational initiatives across various fields.`,
      submittedAt: "2025-08-11T14:05:12.0316727",
      isApproved: false,
      reviewerResult: null,
      isAiReport: true,
      status: "created",
      evaluationStageId: "a44bebc5-0324-4e3e-987e-4014cee7fef8",
      reviewerId: null,
      documents: null,
      projectsSimilarityResult: null,
    },
    individualEvaluations: [
      {
        id: "eval-1",
        evaluatorName: "Prof. Dr. Emily Davis",
        evaluatorRole: "Technical Reviewer",
        status: "completed",
        score: 8.5,
        totalRate: 8.5,
        submittedAt: "2025-08-12T10:30:00.000Z",
        comment:
          "The technical approach is sound with good integration of digital signature technology. The system architecture is well-designed for scalability. I recommend approval with minor revisions to the security protocols.",
      },
      {
        id: "eval-2",
        evaluatorName: "Dr. Robert Wilson",
        evaluatorRole: "Domain Expert",
        status: "completed",
        score: 9.0,
        totalRate: 9.0,
        submittedAt: "2025-08-12T14:15:00.000Z",
        comment:
          "Excellent understanding of aviation academy requirements. The certification management process is well-structured and addresses industry needs. The digital signature integration is particularly well-thought-out and addresses compliance requirements.",
      },
      {
        id: "eval-3",
        evaluatorName: "Prof. Lisa Anderson",
        evaluatorRole: "Security Specialist",
        status: "in-progress",
        score: null,
        totalRate: null,
        submittedAt: null,
        comment:
          "Currently reviewing the digital signature implementation and security protocols. Initial assessment shows promising security architecture but requires detailed cryptographic analysis.",
      },
      {
        id: "e2105b84-b602-4ab8-917e-24f1e8439433",
        evaluatorName: "AI Evaluation System",
        evaluatorRole: "AI Reviewer",
        status: "completed",
        score: 8.7,
        totalRate: 8.7,
        submittedAt: "2025-08-11T14:05:12.000Z",
        comment:
          "AI-generated evaluation completed. The project shows strong technical merit and addresses practical needs in aviation education. Comprehensive analysis available in detailed view.",
        isAiReport: true,
      },
      {
        id: "eval-5",
        evaluatorName: "Dr. Mark Thompson",
        evaluatorRole: "Educational Technology Expert",
        status: "pending",
        score: null,
        totalRate: null,
        submittedAt: null,
        comment:
          "Evaluation not yet started. Will focus on user experience and educational effectiveness.",
      },
    ],
  },
];

// Mock data - in real app this would come from API
const mockApplicants: Applicant[] = [
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
    appliedFor: 1,
    appliedDate: "2023-05-20",
    proposalTitle: "Advanced AI Diagnostic System for Medical Imaging",
    proposalSummary:
      "A comprehensive proposal for developing an AI-powered diagnostic system that can analyze medical images with 95% accuracy, reducing diagnosis time by 60%.",
    proposalType: "Research Proposal",
    submittedBy: "Dr. Jane Smith",
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
    appliedFor: 1,
    appliedDate: "2023-05-18",
    proposalTitle: "Intelligent Medical Diagnosis Platform Using Deep Learning",
    proposalSummary:
      "Development of a comprehensive AI platform that integrates multiple diagnostic tools and machine learning algorithms to provide accurate medical diagnoses across various specialties.",
    proposalType: "Technical Proposal",
    submittedBy: "Dr. Michael Johnson",
  },
];

export const ProposalDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams<{ proposalId: string }>();
  const [selectedCV, setSelectedCV] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [evaluationStages] = useState<EvaluationStage[]>(mockEvaluationStages);
  const [selectedProposalContent, setSelectedProposalContent] = useState<
    string | null
  >(null);

  const proposal = mockApplicants.find((a) => a.id === Number(proposalId));
  const teamMembers = mockTeamMembers[Number(proposalId)] || [];

  const handleViewCV = (member: TeamMember) => {
    setSelectedCV({
      name: member.name,
      content: member.scientificCV,
    });
  };

  const handleCloseCVDialog = () => {
    setSelectedCV(null);
  };

  const handleViewProposalDocument = () => {
    const mockProposalContent = `
      <h2>Advanced AI Diagnostic System for Medical Imaging</h2>
      <h3>Project Overview</h3>
      <p>This project aims to develop a comprehensive AI-powered diagnostic system that can analyze medical images with 95% accuracy, reducing diagnosis time by 60%.</p>
      
      <h3>Technical Approach</h3>
      <p>We will utilize deep learning algorithms and convolutional neural networks to process and analyze medical imaging data.</p>
      
      <h3>Expected Outcomes</h3>
      <ul>
        <li>Improved diagnostic accuracy</li>
        <li>Reduced time for medical image analysis</li>
        <li>Enhanced patient care through faster diagnosis</li>
      </ul>
      
      <h3>Implementation Timeline</h3>
      <p>The project will be completed over 24 months with the following milestones:</p>
      <ol>
        <li>Data collection and preprocessing (Months 1-6)</li>
        <li>Model development and training (Months 7-18)</li>
        <li>Testing and validation (Months 19-24)</li>
      </ol>
    `;

    setSelectedProposalContent(mockProposalContent);
  };

  const handleCloseProposalDialog = () => {
    setSelectedProposalContent(null);
  };

  const handleViewIndividualEvaluation = (evaluationId: string) => {
    // Check if this is an AI evaluation
    const evaluation = evaluationStages[0]?.individualEvaluations.find(
      (item) => item.id === evaluationId
    );

    if (evaluation?.isAiReport) {
      navigate(`/council/ai-evaluation/${evaluationId}`);
    } else {
      navigate(`/council/individual-evaluation/${evaluationId}`);
    }
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="container mx-auto py-8">
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">Proposal not found</p>
            <Button
              onClick={() => navigate("/council/project-approval")}
              className="mt-4"
            >
              Back to Topics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateEvaluation = () => {
    navigate(`/council/evaluation/create?proposalId=${proposal.id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 space-y-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Proposal Review
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review and evaluate proposal details
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent"></div>
        </div>

        {/* Proposal Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-blue-700">
                {proposal.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {proposal.proposalTitle}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-xs"
                >
                  {proposal.proposalType}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-xs"
                >
                  {proposal.status}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-gray-500 px-3 py-1 bg-gray-50 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Applied{" "}
                    {new Date(proposal.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Proposal Document
              </h3>
              <Button
                onClick={handleViewProposalDocument}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-xs"
              >
                <FileText className="h-3 w-3" />
                View Full Document
              </Button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {proposal.proposalSummary}
            </p>
          </div>

          {/* Team Members Table */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Research Team & Scientific CVs
            </h3>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2 border-b border-gray-200">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Team Members
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scientific CV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-blue-700">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-1
                              ${
                                member.role === "PI"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : member.role === "Co-Investigator"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : member.role === "Research Assistant"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                              }
                            `}
                          >
                            {member.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {member.institution}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {member.department}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCV(member)}
                            className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-xs"
                          >
                            <Eye className="h-3 w-3" />
                            View CV
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Applicant Information */}
        </div>

        {/* Evaluation Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
          <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Evaluation Stages
                  </h3>
                  <p className="text-xs text-gray-500">
                    View and manage evaluation stages for this proposal
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCreateEvaluation}
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Create Evaluation
              </Button>
            </div>
          </div>

          <div className="p-3">
            {evaluationStages.length > 0 ? (
              <div className="space-y-3">
                {evaluationStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Individual Evaluations */}
                    <div className="p-3 bg-white">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Individual Evaluations
                      </h5>
                      <div className="space-y-1">
                        {stage.individualEvaluations.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${
                              evaluation.isAiReport
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 shadow-sm"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            }`}
                            onClick={() =>
                              handleViewIndividualEvaluation(evaluation.id)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                                  evaluation.isAiReport
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {evaluation.isAiReport ? (
                                  <span className="text-[10px] font-bold">
                                    AI
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium">
                                    {evaluation.evaluatorName.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    evaluation.isAiReport
                                      ? "text-emerald-900"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {evaluation.evaluatorName}
                                </p>
                                <p
                                  className={`text-xs ${
                                    evaluation.isAiReport
                                      ? "text-emerald-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {evaluation.evaluatorRole}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {(evaluation.score || evaluation.totalRate) && (
                                <div className="text-right">
                                  <p className="text-xs font-medium text-gray-900">
                                    {evaluation.isAiReport
                                      ? `Rate: ${evaluation.totalRate}/10`
                                      : `Score: ${
                                          evaluation.score ||
                                          evaluation.totalRate
                                        }/10`}
                                  </p>
                                </div>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-xs px-2 py-1 ${
                                  evaluation.status === "completed"
                                    ? evaluation.isAiReport
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                    : evaluation.status === "in-progress"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {evaluation.isAiReport &&
                                evaluation.status === "completed"
                                  ? "AI Generated"
                                  : evaluation.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No evaluation stages yet
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Start by creating an evaluation stage for this proposal
                    </p>
                    <Button
                      onClick={handleCreateEvaluation}
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Evaluation Stage
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Document Dialog */}
      {selectedProposalContent && (
        <TinyMCEViewDialog
          isOpen={true}
          onClose={handleCloseProposalDialog}
          title={`${proposal.proposalTitle} - Full Document`}
          content={selectedProposalContent}
          height="auto"
        />
      )}

      {/* Scientific CV Dialog */}
      {selectedCV && (
        <TinyMCEViewDialog
          isOpen={true}
          onClose={handleCloseCVDialog}
          title={`${selectedCV.name} - Scientific CV`}
          content={selectedCV.content}
          height="auto"
        />
      )}
    </div>
  );
};
