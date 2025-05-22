import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApprovalFilters } from "./ApprovalFilters";
import { CompletedApprovalsTable, CompletedApproval } from "./CompletedApprovalsTable";

interface CompletedApprovalsTabProps {
  approvals: CompletedApproval[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onViewDetails: (approval: CompletedApproval) => void;
  formatDate: (dateString: string) => string;
}

export const CompletedApprovalsTab: React.FC<CompletedApprovalsTabProps> = ({
  approvals,
  searchTerm,
  onSearchChange,
  onResetFilters,
  onViewDetails,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Approvals</CardTitle>
        <CardDescription>
          View history of processed approval requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <ApprovalFilters
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onResetFilters={onResetFilters}
            placeholder="Search completed approvals..."
            showTypeFilter={false}
            showPriorityFilter={false}
          />

          {/* Completed approvals table */}
          <CompletedApprovalsTable
            approvals={approvals}
            onViewDetails={onViewDetails}
            formatDate={formatDate}
          />
        </div>
      </CardContent>
    </Card>
  );
};
