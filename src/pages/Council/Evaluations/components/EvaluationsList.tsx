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
import { Calendar, Clock, FileText } from "lucide-react";

interface Evaluation {
  id: number;
  projectTitle: string;
  projectCode: string;
  submittedDate: string;
  dueDate: string;
  type: string;
  status: string;
}

interface EvaluationsListProps {
  evaluations: Evaluation[];
  onViewEvaluation: (id: number) => void;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({
  evaluations,
  onViewEvaluation,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Project Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No evaluations found.
              </TableCell>
            </TableRow>
          ) : (
            evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell className="font-medium">
                  {evaluation.projectTitle}
                </TableCell>
                <TableCell>{evaluation.projectCode}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      evaluation.type === "Proposal"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-purple-100 text-purple-800 border-purple-200"
                    }
                  >
                    {evaluation.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                    {evaluation.submittedDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                    {evaluation.dueDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      evaluation.status === "Pending"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }
                  >
                    {evaluation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewEvaluation(evaluation.id)}
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Evaluate
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
