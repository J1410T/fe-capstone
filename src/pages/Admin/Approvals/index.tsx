import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PendingApprovalsTab,
  CompletedApprovalsTab,
  ApprovalActionDialog,
  PendingApproval,
  CompletedApproval,
} from "./components";

// Sample approval data
const sampleApprovals: PendingApproval[] = [
  {
    id: "1",
    title: "Research on AI Ethics",
    projectCode: "AI-2023-001",
    type: "Project Proposal",
    submittedBy: "John Doe",
    submittedDate: "2023-06-10T10:30:00",
    dueDate: "2023-06-20T23:59:59",
    status: "Pending",
    priority: "High",
    amount: 75000,
  },
  {
    id: "2",
    title: "Climate Change Impact Study",
    projectCode: "CC-2023-002",
    type: "Budget Request",
    submittedBy: "Jane Smith",
    submittedDate: "2023-06-12T14:45:00",
    dueDate: "2023-06-22T23:59:59",
    status: "Pending",
    priority: "Medium",
    amount: 120000,
  },
  {
    id: "3",
    title: "Medical Research on Cancer Treatment",
    projectCode: "MED-2023-003",
    type: "BM05 Form",
    submittedBy: "Robert Johnson",
    submittedDate: "2023-06-08T09:15:00",
    dueDate: "2023-06-18T23:59:59",
    status: "Pending",
    priority: "High",
    amount: 250000,
  },
  {
    id: "4",
    title: "Renewable Energy Solutions",
    projectCode: "RE-2023-004",
    type: "BM06 Form",
    submittedBy: "Emily Davis",
    submittedDate: "2023-06-05T11:30:00",
    dueDate: "2023-06-15T23:59:59",
    status: "Pending",
    priority: "Low",
    amount: 50000,
  },
  {
    id: "5",
    title: "Urban Planning Innovations",
    projectCode: "UP-2023-005",
    type: "Project Proposal",
    submittedBy: "Michael Wilson",
    submittedDate: "2023-06-14T08:00:00",
    dueDate: "2023-06-24T23:59:59",
    status: "Pending",
    priority: "Medium",
    amount: 85000,
  },
];

// Sample completed approvals
const sampleCompletedApprovals: CompletedApproval[] = [
  {
    id: "6",
    title: "Biodiversity Conservation",
    projectCode: "BIO-2023-006",
    type: "Project Proposal",
    submittedBy: "Sarah Brown",
    submittedDate: "2023-05-20T16:20:00",
    completedDate: "2023-05-30T14:15:00",
    status: "Approved",
    approvedBy: "Admin User",
    amount: 95000,
  },
  {
    id: "7",
    title: "Quantum Computing Research",
    projectCode: "QC-2023-007",
    type: "Budget Request",
    submittedBy: "David Miller",
    submittedDate: "2023-05-18T13:10:00",
    completedDate: "2023-05-28T10:45:00",
    status: "Rejected",
    approvedBy: "Admin User",
    amount: 300000,
  },
  {
    id: "8",
    title: "Sustainable Agriculture",
    projectCode: "SA-2023-008",
    type: "BM05 Form",
    submittedBy: "Jennifer Taylor",
    submittedDate: "2023-05-25T10:45:00",
    completedDate: "2023-06-05T09:30:00",
    status: "Approved",
    approvedBy: "Admin User",
    amount: 110000,
  },
];

/**
 * Approval Management page for admin
 */
const ApprovalManagement: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState(sampleApprovals);
  const [completedApprovals, setCompletedApprovals] = useState(sampleCompletedApprovals);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null);
  const [approvalComment, setApprovalComment] = useState("");

  // Filter pending approvals based on search term and filters
  const filteredPendingApprovals = pendingApprovals.filter((approval) => {
    const matchesSearch =
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || approval.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || approval.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Filter completed approvals based on search term
  const filteredCompletedApprovals = completedApprovals.filter((approval) => {
    return (
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Handle approval action
  const handleApprovalAction = () => {
    if (!selectedApproval || !approvalAction) return;

    // Move from pending to completed
    const updatedPendingApprovals = pendingApprovals.filter(
      (approval) => approval.id !== selectedApproval.id
    );

    const completedApproval = {
      ...selectedApproval,
      status: approvalAction === "approve" ? "Approved" : "Rejected",
      completedDate: new Date().toISOString(),
      approvedBy: "Admin User",
    };

    setCompletedApprovals([completedApproval, ...completedApprovals]);
    setPendingApprovals(updatedPendingApprovals);
    
    setSelectedApproval(null);
    setApprovalAction(null);
    setApprovalComment("");
  };

  // Handle approve action
  const handleApprove = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setApprovalAction("approve");
  };

  // Handle reject action
  const handleReject = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setApprovalAction("reject");
  };

  // Handle view details action
  const handleViewDetails = (approval: PendingApproval | CompletedApproval) => {
    console.log("View details for approval:", approval);
    // Implement view details functionality
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPriorityFilter("all");
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setSelectedApproval(null);
    setApprovalAction(null);
    setApprovalComment("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Approval Management</h1>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="completed">Completed Approvals</TabsTrigger>
        </TabsList>

        {/* Pending Approvals Tab */}
        <TabsContent value="pending">
          <PendingApprovalsTab
            approvals={filteredPendingApprovals}
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            priorityFilter={priorityFilter}
            onSearchChange={setSearchTerm}
            onTypeFilterChange={setTypeFilter}
            onPriorityFilterChange={setPriorityFilter}
            onResetFilters={handleResetFilters}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        {/* Completed Approvals Tab */}
        <TabsContent value="completed">
          <CompletedApprovalsTab
            approvals={filteredCompletedApprovals}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onResetFilters={handleResetFilters}
            onViewDetails={handleViewDetails}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      {/* Approval Action Dialog */}
      <ApprovalActionDialog
        isOpen={!!selectedApproval && !!approvalAction}
        onClose={handleDialogClose}
        approval={selectedApproval}
        action={approvalAction}
        comment={approvalComment}
        onCommentChange={setApprovalComment}
        onSubmit={handleApprovalAction}
      />
    </div>
  );
};

export default ApprovalManagement;
