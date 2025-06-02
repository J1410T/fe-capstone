import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectProgressProps {
  progress: number;
  spent: string;
  total: string;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({
  progress,
  spent,
  total,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Project Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-sm sm:text-base font-medium text-gray-900">
              {progress}% Complete
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">{spent}</span> of{" "}
              <span className="font-medium">{total}</span>
            </span>
          </div>
          <div className="w-full">
            <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
