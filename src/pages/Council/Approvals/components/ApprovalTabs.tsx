import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalFilters } from "./ApprovalFilters";
import { PendingApprovalsList } from "./PendingApprovalsList";
import { CompletedApprovalsList } from "./CompletedApprovalsList";

interface PendingApproval {
  id: number;
  title: string;
  projectCode: string;
  type: string;
  submittedDate: string;
  dueDate: string;
  status: string;
  chairmanRecommendation: string;
}

interface CompletedApproval {
  id: number;
  title: string;
  projectCode: string;
  type: string;
  submittedDate: string;
  dueDate: string;
  status: string;
  yourDecision: string;
  finalDecision: string;
}

interface ApprovalTabsProps {
  activeTab: string;
  searchTerm: string;
  selectedType: string;
  pendingApprovals: PendingApproval[];
  completedApprovals: CompletedApproval[];
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onViewApproval: (id: number) => void;
  onOpenApprovalDialog: (id: number) => void;
}

export const ApprovalTabs: React.FC<ApprovalTabsProps> = ({
  activeTab,
  searchTerm,
  selectedType,
  pendingApprovals,
  completedApprovals,
  onTabChange,
  onSearchChange,
  onTypeChange,
  onViewApproval,
  onOpenApprovalDialog,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        <TabsTrigger value="completed">Completed Approvals</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval Requests</CardTitle>
            <CardDescription>
              Review and respond to chairman recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={onSearchChange}
              onTypeChange={onTypeChange}
            />
            <PendingApprovalsList
              approvals={pendingApprovals}
              onViewApproval={onViewApproval}
              onOpenApprovalDialog={onOpenApprovalDialog}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Completed Approvals</CardTitle>
            <CardDescription>
              History of your approval decisions and final outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={onSearchChange}
              onTypeChange={onTypeChange}
            />
            <CompletedApprovalsList
              approvals={completedApprovals}
              onViewApproval={onViewApproval}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
