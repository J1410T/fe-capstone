import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BM4FormProps {
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
}

export const BM4Form: React.FC<BM4FormProps> = ({
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
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectTitle?.trim()) {
      newErrors.projectTitle = "Project title is required";
    }
    if (!formData.reportingPeriod?.trim()) {
      newErrors.reportingPeriod = "Reporting period is required";
    }
    if (!formData.progressSummary?.trim()) {
      newErrors.progressSummary = "Progress summary is required";
    }
    if (!formData.completedActivities?.trim()) {
      newErrors.completedActivities = "Completed activities are required";
    }
    if (!formData.currentStatus?.trim()) {
      newErrors.currentStatus = "Current status is required";
    }
    if (!formData.upcomingActivities?.trim()) {
      newErrors.upcomingActivities = "Upcoming activities are required";
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
          BM4: Report on the Progress of the Scientific Research Topic
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
                onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                placeholder="Enter project title"
                className={errors.projectTitle ? "border-red-500" : ""}
              />
              {errors.projectTitle && (
                <p className="text-sm text-red-500">{errors.projectTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principalInvestigator">Principal Investigator</Label>
                <Input
                  id="principalInvestigator"
                  value={formData.principalInvestigator || ""}
                  onChange={(e) => handleInputChange("principalInvestigator", e.target.value)}
                  placeholder="Enter PI name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingPeriod">Reporting Period *</Label>
                <Input
                  id="reportingPeriod"
                  value={formData.reportingPeriod || ""}
                  onChange={(e) => handleInputChange("reportingPeriod", e.target.value)}
                  placeholder="e.g., Q1 2024 (Jan - Mar 2024)"
                  className={errors.reportingPeriod ? "border-red-500" : ""}
                />
                {errors.reportingPeriod && (
                  <p className="text-sm text-red-500">{errors.reportingPeriod}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportDate">Report Date</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={formData.reportDate || ""}
                  onChange={(e) => handleInputChange("reportDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectPhase">Project Phase</Label>
                <Input
                  id="projectPhase"
                  value={formData.projectPhase || ""}
                  onChange={(e) => handleInputChange("projectPhase", e.target.value)}
                  placeholder="e.g., Phase 1, Implementation, etc."
                />
              </div>
            </div>
          </div>

          {/* Progress Report */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Progress Report</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="progressSummary">Progress Summary *</Label>
              <Textarea
                id="progressSummary"
                value={formData.progressSummary || ""}
                onChange={(e) => handleInputChange("progressSummary", e.target.value)}
                placeholder="Provide an overall summary of progress during this period"
                rows={4}
                className={errors.progressSummary ? "border-red-500" : ""}
              />
              {errors.progressSummary && (
                <p className="text-sm text-red-500">{errors.progressSummary}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="completedActivities">Completed Activities *</Label>
              <Textarea
                id="completedActivities"
                value={formData.completedActivities || ""}
                onChange={(e) => handleInputChange("completedActivities", e.target.value)}
                placeholder="List all activities completed during this reporting period"
                rows={5}
                className={errors.completedActivities ? "border-red-500" : ""}
              />
              {errors.completedActivities && (
                <p className="text-sm text-red-500">{errors.completedActivities}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Key Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements || ""}
                onChange={(e) => handleInputChange("achievements", e.target.value)}
                placeholder="Highlight major achievements and milestones reached"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentStatus">Current Status *</Label>
              <Textarea
                id="currentStatus"
                value={formData.currentStatus || ""}
                onChange={(e) => handleInputChange("currentStatus", e.target.value)}
                placeholder="Describe the current status of the project"
                rows={3}
                className={errors.currentStatus ? "border-red-500" : ""}
              />
              {errors.currentStatus && (
                <p className="text-sm text-red-500">{errors.currentStatus}</p>
              )}
            </div>
          </div>

          {/* Challenges and Future Plans */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Challenges and Future Plans</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="challenges">Challenges Encountered</Label>
              <Textarea
                id="challenges"
                value={formData.challenges || ""}
                onChange={(e) => handleInputChange("challenges", e.target.value)}
                placeholder="Describe any challenges or obstacles encountered"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutions">Solutions Implemented</Label>
              <Textarea
                id="solutions"
                value={formData.solutions || ""}
                onChange={(e) => handleInputChange("solutions", e.target.value)}
                placeholder="Describe solutions implemented to address challenges"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upcomingActivities">Upcoming Activities *</Label>
              <Textarea
                id="upcomingActivities"
                value={formData.upcomingActivities || ""}
                onChange={(e) => handleInputChange("upcomingActivities", e.target.value)}
                placeholder="List planned activities for the next reporting period"
                rows={4}
                className={errors.upcomingActivities ? "border-red-500" : ""}
              />
              {errors.upcomingActivities && (
                <p className="text-sm text-red-500">{errors.upcomingActivities}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Updated Timeline</Label>
              <Textarea
                id="timeline"
                value={formData.timeline || ""}
                onChange={(e) => handleInputChange("timeline", e.target.value)}
                placeholder="Provide any updates to the project timeline"
                rows={3}
              />
            </div>
          </div>

          {/* Budget and Resources */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Budget and Resources</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetUtilized">Budget Utilized</Label>
                <Input
                  id="budgetUtilized"
                  type="number"
                  value={formData.budgetUtilized || ""}
                  onChange={(e) => handleInputChange("budgetUtilized", e.target.value)}
                  placeholder="Amount spent (VND)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetRemaining">Budget Remaining</Label>
                <Input
                  id="budgetRemaining"
                  type="number"
                  value={formData.budgetRemaining || ""}
                  onChange={(e) => handleInputChange("budgetRemaining", e.target.value)}
                  placeholder="Amount remaining (VND)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourceNeeds">Resource Needs</Label>
              <Textarea
                id="resourceNeeds"
                value={formData.resourceNeeds || ""}
                onChange={(e) => handleInputChange("resourceNeeds", e.target.value)}
                placeholder="Describe any additional resources needed"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes || ""}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
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
