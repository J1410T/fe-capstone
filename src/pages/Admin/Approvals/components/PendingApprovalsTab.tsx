import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApprovalFilters } from "./ApprovalFilters";
import { PendingApprovalsTable, PendingApproval } from "./PendingApprovalsTable";

interface PendingApprovalsTabProps {
  approvals: PendingApproval[];
  searchTerm: string;
  typeFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onApprove: (approval: PendingApproval) => void;
  onReject: (approval: PendingApproval) => void;
  onViewDetails: (approval: PendingApproval) => void;
}

export const PendingApprovalsTab: React.FC<PendingApprovalsTabProps> = ({
  approvals,
  searchTerm,
  typeFilter,
  priorityFilter,
  onSearchChange,
  onTypeFilterChange,
  onPriorityFilterChange,
  onResetFilters,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>
          Review and process pending approval requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search and filters */}
          <ApprovalFilters
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            priorityFilter={priorityFilter}
            onSearchChange={onSearchChange}
            onTypeFilterChange={onTypeFilterChange}
            onPriorityFilterChange={onPriorityFilterChange}
            onResetFilters={onResetFilters}
            placeholder="Search pending approvals..."
            showTypeFilter={true}
            showPriorityFilter={true}
          />

          {/* Pending approvals table */}
          <PendingApprovalsTable
            approvals={approvals}
            onApprove={onApprove}
            onReject={onReject}
            onViewDetails={onViewDetails}
          />
        </div>
      </CardContent>
    </Card>
  );
};
