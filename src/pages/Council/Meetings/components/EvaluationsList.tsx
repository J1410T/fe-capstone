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

interface Evaluation {
  id: number;
  evaluator: string;
  score: number;
  maxScore: number;
  recommendation: string;
  submitted: boolean;
}

interface EvaluationsListProps {
  evaluations: Evaluation[];
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({
  evaluations,
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Individual Evaluations</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evaluator</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Recommendation</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell className="font-medium">
                {evaluation.evaluator}
              </TableCell>
              <TableCell>
                {evaluation.submitted ? (
                  <div className="flex items-center gap-2">
                    <span>
                      {evaluation.score}/{evaluation.maxScore}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {Math.round(
                        (evaluation.score / evaluation.maxScore) * 100
                      )}
                      %
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Pending</span>
                )}
              </TableCell>
              <TableCell>
                {evaluation.submitted
                  ? evaluation.recommendation
                  : "Pending"}
              </TableCell>
              <TableCell>
                {evaluation.submitted ? (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Submitted
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    Pending
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
