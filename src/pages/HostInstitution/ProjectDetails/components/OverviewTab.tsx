import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";

interface TimelinePhase {
  phase: string;
  duration: string;
  status: string;
}

interface OverviewTabProps {
  description: string;
  objectives: string[];
  timeline: TimelinePhase[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  description,
  objectives,
  timeline,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>Key information about the research project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Description
          </h3>
          <p>{description}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Research Objectives
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Project Timeline
          </h3>
          <div className="space-y-3">
            {timeline.map((phase, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{phase.phase}</p>
                  <p className="text-sm text-muted-foreground">
                    {phase.duration}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(phase.status)}
                >
                  {getStatusIcon(phase.status)}
                  {phase.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
