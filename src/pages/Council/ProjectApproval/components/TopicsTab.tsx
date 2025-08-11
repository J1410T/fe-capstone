import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CheckCircle, Users, BookOpen, FolderOpen } from "lucide-react";
import { TopicDetailView } from "./TopicDetailView";
import { ProposalDetailView } from "./ProposalDetailView";
import { ProfileData, EvaluationData } from "../types";

interface Topic {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  applicants: number;
  status: string;
  councilApprovals?: number; // Number of council members who approved
  totalCouncilMembers?: number; // Total number of council members
}

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
  // Proposal-specific information
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
  profileData: ProfileData; // Add missing property
  evaluationData: EvaluationData; // Add missing property
}

// Breadcrumb navigation types
interface BreadcrumbItem {
  id: string;
  label: string;
  type: "topics" | "topic-detail" | "proposal-detail";
  data?: Topic | Applicant;
}

// View state types
type ViewState = "topics-list" | "topic-detail" | "proposal-detail";

interface TopicsTabProps {
  topics: Topic[];
  applicants: Applicant[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onViewProfile: (applicantId: number) => void;
  onApproveProposal?: (proposalId: number) => void;
  onRejectProposal?: (proposalId: number) => void;
  onRequestRevision?: (proposalId: number) => void;
}

export const TopicsTab: React.FC<TopicsTabProps> = ({
  topics,
  applicants,
  onViewProfile,
  onApproveProposal,
  onRejectProposal,
  onRequestRevision,
}) => {
  // Breadcrumb navigation state
  const [currentView, setCurrentView] = useState<ViewState>("topics-list");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Applicant | null>(
    null
  );
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "topics", label: "Research Topics", type: "topics" },
  ]);
  // const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  // const [approvalProposal, setApprovalProposal] = useState<Applicant | null>(
  //   null
  // );

  console.log("Topics:", topics);

  // Navigation functions
  const navigateToTopicDetail = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedProposal(null);
    setCurrentView("topic-detail");
    setBreadcrumbs([
      { id: "topics", label: "Research Topics", type: "topics" },
      {
        id: `topic-${topic.id}`,
        label: topic.title,
        type: "topic-detail",
        data: topic,
      },
    ]);
  };

  const navigateToProposalDetail = (proposal: Applicant) => {
    setSelectedProposal(proposal);
    setCurrentView("proposal-detail");
    const topic =
      selectedTopic || topics.find((t) => t.id === proposal.appliedFor);
    if (topic) {
      setBreadcrumbs([
        { id: "topics", label: "Research Topics", type: "topics" },
        {
          id: `topic-${topic.id}`,
          label: topic.title,
          type: "topic-detail",
          data: topic,
        },
        {
          id: `proposal-${proposal.id}`,
          label: proposal.proposalTitle,
          type: "proposal-detail",
          data: proposal,
        },
      ]);
    }
  };

  const navigateToBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    const index = breadcrumbs.findIndex((b) => b.id === breadcrumb.id);
    if (index !== -1) {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);

      switch (breadcrumb.type) {
        case "topics":
          setCurrentView("topics-list");
          setSelectedTopic(null);
          setSelectedProposal(null);
          break;
        case "topic-detail":
          setCurrentView("topic-detail");
          setSelectedTopic(breadcrumb.data as Topic);
          setSelectedProposal(null);
          break;
        case "proposal-detail":
          setCurrentView("proposal-detail");
          setSelectedProposal(breadcrumb.data as Applicant);
          break;
      }
    }
  };

  // Approval functions
  const handleApproveProposal = (proposalId: number) => {
    if (onApproveProposal) {
      onApproveProposal(proposalId);
    }
  };

  const handleRejectProposal = (proposalId: number) => {
    if (onRejectProposal) {
      onRejectProposal(proposalId);
    }
  };

  const handleRequestRevision = (proposalId: number) => {
    if (onRequestRevision) {
      onRequestRevision(proposalId);
    }
  };

  // const closeApprovalDialog = () => {
  //   setApprovalProposal(null);
  //   setShowApprovalDialog(false);
  // };

  return (
    <Card>
      <CardHeader>
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 1 && (
          <div className="">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.id}>
                    {index > 0 && <BreadcrumbSeparator />}
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          onClick={() => navigateToBreadcrumb(breadcrumb)}
                          className="cursor-pointer"
                        >
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Render different views based on current state */}
        {currentView === "topics-list" && (
          <>
            {topics.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <FolderOpen className="h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No projects found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border rounded-lg bg-white shadow-sm p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigateToTopicDetail(topic)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {topic.councilApprovals || 0}/
                            {topic.totalCouncilMembers || 5} Approved
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {topic.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{topic.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FolderOpen className="h-4 w-4" />
                            <span>{topic.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {topic.applicants} Proposal
                              {topic.applicants !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className={
                            topic.status === "Waiting for PI"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                          }
                        >
                          {topic.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {currentView === "topic-detail" && selectedTopic && (
          <TopicDetailView
            topic={selectedTopic}
            applicants={applicants}
            onViewProposal={navigateToProposalDetail}
            onViewProfile={onViewProfile}
          />
        )}

        {currentView === "proposal-detail" &&
          selectedProposal &&
          selectedTopic && (
            <ProposalDetailView
              proposal={selectedProposal}
              topic={selectedTopic}
              onApprove={handleApproveProposal}
              onReject={handleRejectProposal}
              onRequestRevision={handleRequestRevision}
            />
          )}
      </CardContent>

      {/* Proposal Approval Dialog */}
      {/* <ProposalApprovalDialog
        isOpen={showApprovalDialog}
        onClose={closeApprovalDialog}
        proposal={approvalProposal}
        topic={
          approvalProposal
            ? topics.find((t) => t.id === approvalProposal.appliedFor) || null
            : null
        }
        onApprove={handleApproveProposal}
        onReject={handleRejectProposal}
        onRequestRevision={handleRequestRevision}
      /> */}
    </Card>
  );
};
