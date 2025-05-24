import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export interface SystemLimits {
  maxBudgetRegular: number;
  maxBudgetLarge: number;
  maxDisbursementRounds: number;
  projectDurationMonths: number;
  maxTeamMembers: number;
  maxActiveProjects: number;
}

interface SystemLimitsTabProps {
  systemLimits: SystemLimits;
  onSystemLimitsChange: (field: keyof SystemLimits, value: number) => void;
  onSave: () => void;
}

export const SystemLimitsTab: React.FC<SystemLimitsTabProps> = ({
  systemLimits,
  onSystemLimitsChange,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Limits</CardTitle>
        <CardDescription>
          Configure maximum values and limits for projects and budgets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxBudgetRegular">
              Maximum Budget for Regular Projects ($)
            </Label>
            <Input
              id="maxBudgetRegular"
              type="number"
              value={systemLimits.maxBudgetRegular}
              onChange={(e) =>
                onSystemLimitsChange("maxBudgetRegular", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxBudgetLarge">
              Maximum Budget for Large Projects ($)
            </Label>
            <Input
              id="maxBudgetLarge"
              type="number"
              value={systemLimits.maxBudgetLarge}
              onChange={(e) =>
                onSystemLimitsChange("maxBudgetLarge", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDisbursementRounds">
              Maximum Disbursement Rounds
            </Label>
            <Input
              id="maxDisbursementRounds"
              type="number"
              value={systemLimits.maxDisbursementRounds}
              onChange={(e) =>
                onSystemLimitsChange("maxDisbursementRounds", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDurationMonths">
              Maximum Project Duration (months)
            </Label>
            <Input
              id="projectDurationMonths"
              type="number"
              value={systemLimits.projectDurationMonths}
              onChange={(e) =>
                onSystemLimitsChange("projectDurationMonths", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTeamMembers">
              Maximum Team Members per Project
            </Label>
            <Input
              id="maxTeamMembers"
              type="number"
              value={systemLimits.maxTeamMembers}
              onChange={(e) =>
                onSystemLimitsChange("maxTeamMembers", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxActiveProjects">
              Maximum Active Projects per PI
            </Label>
            <Input
              id="maxActiveProjects"
              type="number"
              value={systemLimits.maxActiveProjects}
              onChange={(e) =>
                onSystemLimitsChange("maxActiveProjects", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
