import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";

export interface CompletedApproval {
  id: string;
  title: string;
  projectCode: string;
  type: string;
  submittedBy: string;
  submittedDate: string;
  completedDate: string;
  status: string;
  approvedBy: string;
  amount: number;
}

interface CompletedApprovalsTableProps {
  approvals: CompletedApproval[];
  onViewDetails: (approval: CompletedApproval) => void;
  formatDate: (dateString: string) => string;
}

export const CompletedApprovalsTable: React.FC<CompletedApprovalsTableProps> = ({
  approvals,
  onViewDetails,
  formatDate,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Completed Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>
                <div className="font-medium">{approval.title}</div>
                <div className="text-xs text-muted-foreground">
                  {approval.projectCode}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{approval.type}</Badge>
              </TableCell>
              <TableCell>{approval.submittedBy}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span>{formatDate(approval.completedDate)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    approval.status === "Approved"
                      ? "success"
                      : "destructive"
                  }
                >
                  {approval.status === "Approved" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {approval.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span>{approval.amount.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails(approval)}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
