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
import { FileText } from "lucide-react";

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

interface CompletedApprovalsListProps {
  approvals: CompletedApproval[];
  onViewApproval: (id: number) => void;
}

export const CompletedApprovalsList: React.FC<CompletedApprovalsListProps> = ({
  approvals,
  onViewApproval,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Project Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Your Decision</TableHead>
            <TableHead>Final Decision</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No completed approvals found.
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
                  <Badge
                    variant="outline"
                    className={
                      approval.yourDecision === "Approve"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {approval.yourDecision}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      approval.finalDecision === "Approved"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {approval.finalDecision}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApproval(approval.id)}
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
