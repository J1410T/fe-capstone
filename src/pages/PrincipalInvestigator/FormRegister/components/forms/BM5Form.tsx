import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "../../constants";

interface BM5FormData extends FormData {
  projectTitle: string;
  principalInvestigator: string;
  requestDate: string;
  projectPhase: string;
  urgency: string;
  changeType: string;
  changeDescription: string;
  currentSituation: string;
  justification: string;
  impact: string;
  risks: string;
  implementationPlan: string;
  proposedStartDate: string;
  estimatedDuration: string;
  resourceRequirements: string;
  additionalCosts: string;
  costSavings: string;
  budgetJustification: string;
  additionalNotes: string;
}

interface BM5FormProps {
  formData: BM5FormData;
  onDataChange: (data: BM5FormData) => void;
  onSubmit: () => void;
}

export const BM5Form: React.FC<BM5FormProps> = ({
  formData,
  onDataChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    onDataChange(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectTitle?.trim()) {
      newErrors.projectTitle = "Project title is required";
    }
    if (!formData.changeType?.trim()) {
      newErrors.changeType = "Change type is required";
    }
    if (!formData.changeDescription?.trim()) {
      newErrors.changeDescription = "Change description is required";
    }
    if (!formData.justification?.trim()) {
      newErrors.justification = "Justification is required";
    }
    if (!formData.impact?.trim()) {
      newErrors.impact = "Impact assessment is required";
    }
    if (!formData.implementationPlan?.trim()) {
      newErrors.implementationPlan = "Implementation plan is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          BM5: Proposed Changes During the Implementation of the Scientific
          Research Topic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Project Information</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={formData.projectTitle || ""}
                onChange={(e) =>
                  handleInputChange("projectTitle", e.target.value)
                }
                placeholder="Enter project title"
                className={errors.projectTitle ? "border-red-500" : ""}
              />
              {errors.projectTitle && (
                <p className="text-sm text-red-500">{errors.projectTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principalInvestigator">
                  Principal Investigator
                </Label>
                <Input
                  id="principalInvestigator"
                  value={formData.principalInvestigator || ""}
                  onChange={(e) =>
                    handleInputChange("principalInvestigator", e.target.value)
                  }
                  placeholder="Enter PI name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date</Label>
                <Input
                  id="requestDate"
                  type="date"
                  value={formData.requestDate || ""}
                  onChange={(e) =>
                    handleInputChange("requestDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectPhase">Current Project Phase</Label>
                <Input
                  id="projectPhase"
                  value={formData.projectPhase || ""}
                  onChange={(e) =>
                    handleInputChange("projectPhase", e.target.value)
                  }
                  placeholder="e.g., Phase 1, Implementation, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={formData.urgency || ""}
                  onValueChange={(value) => handleInputChange("urgency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Proposed Changes */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Proposed Changes</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="changeType">Type of Change *</Label>
              <Select
                value={formData.changeType || ""}
                onValueChange={(value) =>
                  handleInputChange("changeType", value)
                }
              >
                <SelectTrigger
                  className={errors.changeType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select type of change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope">Scope Change</SelectItem>
                  <SelectItem value="timeline">Timeline Change</SelectItem>
                  <SelectItem value="budget">Budget Change</SelectItem>
                  <SelectItem value="methodology">
                    Methodology Change
                  </SelectItem>
                  <SelectItem value="team">Team Change</SelectItem>
                  <SelectItem value="objectives">Objectives Change</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.changeType && (
                <p className="text-sm text-red-500">{errors.changeType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="changeDescription">
                Detailed Description of Changes *
              </Label>
              <Textarea
                id="changeDescription"
                value={formData.changeDescription || ""}
                onChange={(e) =>
                  handleInputChange("changeDescription", e.target.value)
                }
                placeholder="Provide a detailed description of the proposed changes"
                rows={5}
                className={errors.changeDescription ? "border-red-500" : ""}
              />
              {errors.changeDescription && (
                <p className="text-sm text-red-500">
                  {errors.changeDescription}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSituation">Current Situation</Label>
              <Textarea
                id="currentSituation"
                value={formData.currentSituation || ""}
                onChange={(e) =>
                  handleInputChange("currentSituation", e.target.value)
                }
                placeholder="Describe the current situation that necessitates these changes"
                rows={3}
              />
            </div>
          </div>

          {/* Justification and Impact */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">
              Justification and Impact
            </h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="justification">Justification for Changes *</Label>
              <Textarea
                id="justification"
                value={formData.justification || ""}
                onChange={(e) =>
                  handleInputChange("justification", e.target.value)
                }
                placeholder="Explain why these changes are necessary"
                rows={4}
                className={errors.justification ? "border-red-500" : ""}
              />
              {errors.justification && (
                <p className="text-sm text-red-500">{errors.justification}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact Assessment *</Label>
              <Textarea
                id="impact"
                value={formData.impact || ""}
                onChange={(e) => handleInputChange("impact", e.target.value)}
                placeholder="Assess the impact on timeline, budget, scope, and deliverables"
                rows={4}
                className={errors.impact ? "border-red-500" : ""}
              />
              {errors.impact && (
                <p className="text-sm text-red-500">{errors.impact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="risks">Risks and Mitigation</Label>
              <Textarea
                id="risks"
                value={formData.risks || ""}
                onChange={(e) => handleInputChange("risks", e.target.value)}
                placeholder="Identify potential risks and mitigation strategies"
                rows={3}
              />
            </div>
          </div>

          {/* Implementation Plan */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Implementation Plan</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="implementationPlan">Implementation Plan *</Label>
              <Textarea
                id="implementationPlan"
                value={formData.implementationPlan || ""}
                onChange={(e) =>
                  handleInputChange("implementationPlan", e.target.value)
                }
                placeholder="Describe how the changes will be implemented"
                rows={4}
                className={errors.implementationPlan ? "border-red-500" : ""}
              />
              {errors.implementationPlan && (
                <p className="text-sm text-red-500">
                  {errors.implementationPlan}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposedStartDate">Proposed Start Date</Label>
                <Input
                  id="proposedStartDate"
                  type="date"
                  value={formData.proposedStartDate || ""}
                  onChange={(e) =>
                    handleInputChange("proposedStartDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  value={formData.estimatedDuration || ""}
                  onChange={(e) =>
                    handleInputChange("estimatedDuration", e.target.value)
                  }
                  placeholder="e.g., 2 weeks, 1 month"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourceRequirements">
                Resource Requirements
              </Label>
              <Textarea
                id="resourceRequirements"
                value={formData.resourceRequirements || ""}
                onChange={(e) =>
                  handleInputChange("resourceRequirements", e.target.value)
                }
                placeholder="List any additional resources needed for implementation"
                rows={3}
              />
            </div>
          </div>

          {/* Budget Impact */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Budget Impact</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalCosts">Additional Costs</Label>
                <Input
                  id="additionalCosts"
                  type="number"
                  value={formData.additionalCosts || ""}
                  onChange={(e) =>
                    handleInputChange("additionalCosts", e.target.value)
                  }
                  placeholder="Amount (VND)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costSavings">Potential Cost Savings</Label>
                <Input
                  id="costSavings"
                  type="number"
                  value={formData.costSavings || ""}
                  onChange={(e) =>
                    handleInputChange("costSavings", e.target.value)
                  }
                  placeholder="Amount (VND)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetJustification">Budget Justification</Label>
              <Textarea
                id="budgetJustification"
                value={formData.budgetJustification || ""}
                onChange={(e) =>
                  handleInputChange("budgetJustification", e.target.value)
                }
                placeholder="Justify any budget changes"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes || ""}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information or notes"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="min-w-[120px]">
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
