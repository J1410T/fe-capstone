import React from "react";
import { Badge } from "@/components/ui/badge";

interface ScoreSummaryProps {
  averageScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  averageScore,
  maxPossibleScore,
  scorePercentage,
}) => {
  return (
    <div className="text-center sm:text-left">
      <p className="text-sm font-medium">Average Score</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">
          {averageScore}/{maxPossibleScore}
        </span>
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          {scorePercentage}%
        </Badge>
      </div>
    </div>
  );
};
