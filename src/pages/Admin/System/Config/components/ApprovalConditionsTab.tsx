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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

export interface ApprovalConditions {
  budgetThreshold: number;
  requireSeniorReview: boolean;
  minCouncilApprovals: number;
  requireChairmanApproval: boolean;
  autoCloseInactiveDays: number;
}

interface ApprovalConditionsTabProps {
  approvalConditions: ApprovalConditions;
  onApprovalConditionsChange: (field: keyof ApprovalConditions, value: any) => void;
  onSave: () => void;
}

export const ApprovalConditionsTab: React.FC<ApprovalConditionsTabProps> = ({
  approvalConditions,
  onApprovalConditionsChange,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Fields & Approval Conditions</CardTitle>
        <CardDescription>
          Configure approval workflows and conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="budgetThreshold">
              Budget Threshold for Senior Review ($)
            </Label>
            <Input
              id="budgetThreshold"
              type="number"
              value={approvalConditions.budgetThreshold}
              onChange={(e) =>
                onApprovalConditionsChange("budgetThreshold", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minCouncilApprovals">
              Minimum Council Approvals Required
            </Label>
            <Input
              id="minCouncilApprovals"
              type="number"
              value={approvalConditions.minCouncilApprovals}
              onChange={(e) =>
                onApprovalConditionsChange("minCouncilApprovals", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoCloseInactiveDays">
              Auto-close Inactive Requests After (days)
            </Label>
            <Input
              id="autoCloseInactiveDays"
              type="number"
              value={approvalConditions.autoCloseInactiveDays}
              onChange={(e) =>
                onApprovalConditionsChange("autoCloseInactiveDays", parseInt(e.target.value))
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requireSeniorReview">
              Require Senior Staff Review for High Budgets
            </Label>
            <Switch
              id="requireSeniorReview"
              checked={approvalConditions.requireSeniorReview}
              onCheckedChange={(checked) =>
                onApprovalConditionsChange("requireSeniorReview", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requireChairmanApproval">
              Require Chairman Approval for Final Decisions
            </Label>
            <Switch
              id="requireChairmanApproval"
              checked={approvalConditions.requireChairmanApproval}
              onCheckedChange={(checked) =>
                onApprovalConditionsChange("requireChairmanApproval", checked)
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
