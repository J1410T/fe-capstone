import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ApprovalHeader,
  ApprovalTabs,
  ApprovalDecisionDialog,
} from "./components";

// Mock data for pending approvals
const pendingApprovals = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostics",
    projectCode: "PRJ-2023-001",
    type: "Proposal",
    submittedDate: "2023-07-10",
    dueDate: "2023-07-20",
    status: "Pending Approval",
    chairmanRecommendation: "Approve",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    projectCode: "PRJ-2023-002",
    type: "Proposal",
    submittedDate: "2023-07-12",
    dueDate: "2023-07-22",
    status: "Pending Approval",
    chairmanRecommendation: "Approve with Revisions",
  },
  {
    id: 3,
    title: "Biodiversity Conservation",
    projectCode: "PRJ-2023-003",
    type: "Milestone",
    submittedDate: "2023-07-05",
    dueDate: "2023-07-15",
    status: "Pending Approval",
    chairmanRecommendation: "Approve",
  },
];

// Mock data for completed approvals
const completedApprovals = [
  {
    id: 4,
    title: "Quantum Computing Applications",
    projectCode: "PRJ-2023-004",
    type: "Proposal",
    submittedDate: "2023-06-20",
    dueDate: "2023-06-30",
    status: "Approved",
    yourDecision: "Approve",
    finalDecision: "Approved",
  },
  {
    id: 5,
    title: "Genetic Engineering Ethics",
    projectCode: "PRJ-2023-005",
    type: "Milestone",
    submittedDate: "2023-06-15",
    dueDate: "2023-06-25",
    status: "Rejected",
    yourDecision: "Object",
    finalDecision: "Rejected",
  },
];

const ApprovalInterface: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // State for approval dialog
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [decision, setDecision] = useState("approve");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter approvals based on search term, type, and tab
  const filteredPendingApprovals = pendingApprovals.filter((approval) => {
    const matchesSearch = approval.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || approval.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredCompletedApprovals = completedApprovals.filter((approval) => {
    const matchesSearch = approval.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || approval.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleViewApproval = (approvalId: number) => {
    navigate(`/council/approval/${approvalId}`);
  };

  const handleOpenApprovalDialog = (approvalId: number) => {
    setSelectedApproval(approvalId);
    setDecision("approve");
    setComment("");
    setIsApprovalDialogOpen(true);
  };

  const handleSubmitDecision = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApprovalDialogOpen(false);
      toast.success(
        `Decision submitted: ${
          decision === "approve" ? "Approved" : "Objected"
        }`
      );
      // In a real app, you would update the state or refetch the data
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ApprovalHeader
        title="Approval Requests"
        description="Review and approve or object to chairman recommendations"
      />

      <ApprovalTabs
        activeTab={activeTab}
        searchTerm={searchTerm}
        selectedType={selectedType}
        pendingApprovals={filteredPendingApprovals}
        completedApprovals={filteredCompletedApprovals}
        onTabChange={setActiveTab}
        onSearchChange={setSearchTerm}
        onTypeChange={setSelectedType}
        onViewApproval={handleViewApproval}
        onOpenApprovalDialog={handleOpenApprovalDialog}
      />

      <ApprovalDecisionDialog
        isOpen={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        decision={decision}
        comment={comment}
        isSubmitting={isSubmitting}
        onDecisionChange={setDecision}
        onCommentChange={setComment}
        onSubmit={handleSubmitDecision}
      />
    </div>
  );
};

export default ApprovalInterface;
