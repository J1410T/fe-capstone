import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AIRecommendationCard, { AIRecommendation } from "./AIRecommendationCard";
import { Evaluation } from "./EvaluationCard";
import DocumentManagementEditor from "./DocumentManagementEditor";
import EvaluationOverview from "./EvaluationOverview";
import EvaluationDetailView from "./EvaluationDetailView";
import EnhancedTeamInformation from "./EnhancedTeamInformation";
import MemberDetailProfileView from "./MemberDetailProfileView";

import {
  ApplicantData,
  EvaluationOverview as EvaluationOverviewType,
  EnhancedTeamMember,
} from "../types";

interface Topic {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  applicants: number;
  status: string;
  councilApprovals?: number;
  totalCouncilMembers?: number;
}

interface ProposalDetailViewProps {
  proposal: ApplicantData;
  topic: Topic;
  onApprove: (proposalId: number) => void;
  onReject: (proposalId: number) => void;
  onRequestRevision: (proposalId: number) => void;
}

export const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({
  proposal,
  onApprove,
  onReject,
  onRequestRevision,
}) => {
  const [currentView, setCurrentView] = useState<
    "overview" | "evaluation-detail"
  >("overview");
  const [selectedMember, setSelectedMember] =
    useState<EnhancedTeamMember | null>(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [showPIDetail, setShowPIDetail] = useState(false);
  // Mock AI recommendation using the new API format
  const aiRecommendation: AIRecommendation = {
    id: "e2105b84-b602-4ab8-917e-24f1e8439433",
    name: "AI Review",
    totalRate: null,
    comment:
      "The project titled \"Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy\" presents a compelling initiative aimed at enhancing the management of certification processes within an educational context, specifically tailored for aviation training.\n\n### Project Overview\n\n**Title:** Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy  \n**Description:** This system serves as a comprehensive tool to streamline the implementation and management of projects, beginning from registration through to certification issuance. The platform will facilitate students in easily searching, registering for, and tracking their projects, while also assisting instructors in managing, evaluating, and providing feedback to students efficiently.\n\n### Key Elements\n\n1. **Target Audience:** \n   - The primary users are students and instructors at an aviation academy. Students will benefit from a user-friendly interface that simplifies the certification process, while instructors will have tools to manage and evaluate student projects effectively.\n\n2. **Functionality:**\n   - The system will incorporate digital signature integration, enhancing the legitimacy and security of the issued certifications. This feature is crucial in ensuring that the documentation is tamper-proof and recognized within the aviation industry.\n\n3. **Team Composition:**\n   - The maximum number of team members for the project is set at six, indicating a collaborative approach that leverages diverse skills and expertise.\n\n4. **Project Type:** \n   - Classified as a cooperative project, emphasizing teamwork and shared responsibilities in the development and implementation phases.\n\n5. **Category and Genre:**\n   - The project falls under the application/implementation category and is framed as a proposal, suggesting it is in the planning stage and seeks approval or support for execution.\n\n### Conclusion\n\nThe proposed Online Certification Management System is a forward-thinking solution that addresses significant needs within the aviation education sector. By incorporating features that enhance usability for students and operational efficiency for instructors, it stands to contribute positively to the landscape of aviation training programs. The integration of digital signatures further adds value, ensuring that the certifications issued are secure and credible.\n\n**Next Steps:**\n- Detailed planning and resource allocation should be initiated to move from the proposal stage to implementation.\n- Engaging stakeholders for feedback and refining the system's functionalities based on their needs will be crucial for the project's success.\n\nThis project, if executed effectively, could serve as a model for similar educational initiatives across various fields.",
    submittedAt: "2025-08-11T14:05:12.0316727",
    isApproved: false,
    reviewerResult: null,
    isAiReport: true,
    status: "created",
    evaluationStageId: "a44bebc5-0324-4e3e-987e-4014cee7fef8",
    reviewerId: null,
    documents: null,
    projectsSimilarityResult: null,
  };

  // Mock evaluation data
  const mockEvaluations: Evaluation[] = [
    {
      id: "eval-1",
      evaluatorId: "eval-001",
      evaluatorName: "Dr. Emily Johnson",
      evaluatorRole: "Senior Researcher",
      status: "completed",
      submittedAt: "2024-01-15T10:30:00Z",
      dueDate: "2024-01-20T23:59:59Z",
      totalScore: 42,
      maxTotalScore: 50,
      recommendation: "approve",
      overallComments:
        "Excellent proposal with clear objectives and methodology. The research has strong potential for significant impact in the field.",
      criteria: [
        {
          id: "c1",
          name: "Research Significance",
          score: 9,
          maxScore: 10,
          weight: 25,
        },
        { id: "c2", name: "Methodology", score: 8, maxScore: 10, weight: 25 },
        { id: "c3", name: "Feasibility", score: 8, maxScore: 10, weight: 20 },
        {
          id: "c4",
          name: "PI Qualifications",
          score: 9,
          maxScore: 10,
          weight: 20,
        },
        { id: "c5", name: "Budget", score: 8, maxScore: 10, weight: 10 },
      ],
      lastUpdated: "2024-01-15T10:30:00Z",
    },
    {
      id: "eval-2",
      evaluatorId: "eval-002",
      evaluatorName: "Dr. Michael Smith",
      evaluatorRole: "Department Head",
      status: "in_progress",
      dueDate: "2024-01-25T23:59:59Z",
      totalScore: 0,
      maxTotalScore: 50,
      recommendation: "pending",
      criteria: [],
      lastUpdated: "2024-01-10T14:20:00Z",
    },
  ];

  // Mock evaluation overview data
  const mockEvaluationOverview: EvaluationOverviewType = {
    id: `overview-${proposal.id}`,
    proposalId: proposal.id,
    totalEvaluations: 3,
    completedEvaluations: 2,
    pendingEvaluations: 1,
    overdueEvaluations: 0,
    averageScore: 40,
    maxPossibleScore: 50,
    overallRecommendation: "approve",
    evaluations: mockEvaluations,
    lastUpdated: new Date().toISOString(),
  };

  // Mock enhanced team members
  const mockEnhancedTeamMembers: EnhancedTeamMember[] =
    proposal.evaluationData.teamResearchers.map((member, index) => ({
      id: `member-${index}`,
      name: member.name,
      academicTitle: member.academicTitle,
      workUnit: member.workUnit,
      contribution: member.contribution,
      workDuration: member.workDuration,
      documents: member.documents,
      detailedInfo: {
        personalInfo: {
          fullName: member.name,
          birthYear: "1985",
          gender: "Male",
          placeOfBirth: "Unknown",
          nativePlace: "Unknown",
        },
        contactInfo: {
          contactPhone: "+1 (555) 000-0000",
          contactEmail: `${member.name
            .toLowerCase()
            .replace(/\s+/g, ".")}@example.com`,
        },
        academicInfo: {
          academicTitle: member.academicTitle,
          academicTitleYear: "2015",
          academicTitleInstitution: member.workUnit,
        },
        workInfo: {
          workUnitName: member.workUnit,
          workUnitAddress: "123 Research Ave",
          workUnitPhone: "+1 (555) 100-2000",
          workUnitEmail: "info@research.edu",
        },
        educationHistory: [
          {
            level: "Doctorate",
            institution: member.workUnit,
            major: "Research",
            graduationYear: "2015",
          },
        ],
        researchExperience: "5+ years in research",
        publications: ["Research Paper 1", "Research Paper 2"],
        awards: ["Excellence Award"],
      },
      cv: `<h3>${member.name} - Scientific CV</h3><p>Detailed CV content for ${member.name}</p>`,
    }));

  // Handler functions
  const handleViewEvaluationDetails = () => {
    setCurrentView("evaluation-detail");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
  };

  const handleViewMemberDetail = (memberId: string) => {
    const member = mockEnhancedTeamMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setShowMemberDetail(true);
    }
  };

  const handleViewPIDetail = () => {
    setShowPIDetail(true);
  };

  const handleCloseMemberDetail = () => {
    setShowMemberDetail(false);
    setSelectedMember(null);
  };

  const handleClosePIDetail = () => {
    setShowPIDetail(false);
  };

  if (currentView === "evaluation-detail") {
    return (
      <EvaluationDetailView
        evaluationOverview={mockEvaluationOverview}
        onBack={handleBackToOverview}
        onCreateEvaluation={() => console.log("Create new evaluation")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation and Evaluation Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendation */}
        <AIRecommendationCard
          recommendation={aiRecommendation}
          title="AI Analysis - Proposal"
        />

        {/* Evaluation Overview */}
        <EvaluationOverview
          evaluationOverview={mockEvaluationOverview}
          onViewDetails={handleViewEvaluationDetails}
        />
      </div>

      <DocumentManagementEditor
        documents={[]}
        onDocumentsUpdate={() => {}}
        readOnly={true}
        title="Proposal Documents"
      />

      {/* Enhanced Team Information */}
      <EnhancedTeamInformation
        principalInvestigator={proposal.evaluationData.principalInvestigator}
        teamMembers={mockEnhancedTeamMembers}
        onViewMemberDetail={handleViewMemberDetail}
        onViewPIDetail={handleViewPIDetail}
      />

      {/* Decision Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            Council Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Current Status:</span>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
              >
                {proposal.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
              <ConfirmDialog
                trigger={
                  <Button variant="outline" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Request Revision
                  </Button>
                }
                title="Request Revision"
                description={`Are you sure you want to request a revision for "${proposal.proposalTitle}"? The submitter will be notified to update their submission.`}
                confirmText="Request Revision"
                onConfirm={() => {
                  onRequestRevision(proposal.id);
                  toast.success("Revision Requested", {
                    description: `Revision request has been sent for "${proposal.proposalTitle}".`,
                  });
                }}
              />
              <ConfirmDialog
                trigger={
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Proposal
                  </Button>
                }
                title="Reject Proposal"
                description={`Are you sure you want to reject "${proposal.proposalTitle}"? This action cannot be undone.`}
                confirmText="Reject"
                onConfirm={() => {
                  onReject(proposal.id);
                  toast.success("Proposal Rejected", {
                    description: `"${proposal.proposalTitle}" has been rejected.`,
                  });
                }}
              />
              <ConfirmDialog
                trigger={
                  <Button className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve Proposal
                  </Button>
                }
                title="Approve Proposal"
                description={`Are you sure you want to approve "${proposal.proposalTitle}"? This action cannot be undone.`}
                confirmText="Approve"
                onConfirm={() => {
                  onApprove(proposal.id);
                  toast.success("Proposal Approved", {
                    description: `"${proposal.proposalTitle}" has been successfully approved.`,
                  });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Detail Dialogs */}
      {selectedMember && (
        <MemberDetailProfileView
          member={selectedMember}
          isOpen={showMemberDetail}
          onClose={handleCloseMemberDetail}
          title={`${selectedMember.name} - Team Member Profile`}
        />
      )}

      <MemberDetailProfileView
        member={proposal.evaluationData.principalInvestigator}
        isOpen={showPIDetail}
        onClose={handleClosePIDetail}
        title={`${proposal.evaluationData.principalInvestigator.name} - Principal Investigator Profile`}
      />
    </div>
  );
};
