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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

export interface PendingApproval {
  id: string;
  title: string;
  projectCode: string;
  type: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  status: string;
  priority: string;
  amount: number;
}

interface PendingApprovalsTableProps {
  approvals: PendingApproval[];
  onApprove: (approval: PendingApproval) => void;
  onReject: (approval: PendingApproval) => void;
  onViewDetails: (approval: PendingApproval) => void;
}

export const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({
  approvals,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
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
                  <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span>{new Date(approval.dueDate).toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    approval.priority === "High"
                      ? "destructive"
                      : approval.priority === "Medium"
                      ? "default"
                      : "outline"
                  }
                >
                  {approval.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span>{approval.amount.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onApprove(approval)}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReject(approval)}>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewDetails(approval)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
