import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, CheckCircle } from "lucide-react";

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

interface PendingApprovalsListProps {
  approvals: PendingApproval[];
  onViewApproval: (id: number) => void;
  onOpenApprovalDialog: (id: number) => void;
}

export const PendingApprovalsList: React.FC<PendingApprovalsListProps> = ({
  approvals,
  onViewApproval,
  onOpenApprovalDialog,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Project Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Chairman Recommendation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No pending approvals found.
              </TableCell>
            </TableRow>
          ) : (
            approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell className="font-medium">
                  {approval.title}
                </TableCell>
                <TableCell>{approval.projectCode}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      approval.type === "Proposal"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-purple-100 text-purple-800 border-purple-200"
                    }
                  >
                    {approval.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                    {approval.dueDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {approval.chairmanRecommendation}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApproval(approval.id)}
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onOpenApprovalDialog(approval.id)}
                    >
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Respond
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
