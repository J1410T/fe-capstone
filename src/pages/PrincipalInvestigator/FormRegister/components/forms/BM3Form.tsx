import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BM3FormProps {
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
}

export const BM3Form: React.FC<BM3FormProps> = ({
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
    if (!formData.principalInvestigator?.trim()) {
      newErrors.principalInvestigator = "Principal investigator name is required";
    }
    if (!formData.projectPeriod?.trim()) {
      newErrors.projectPeriod = "Project period is required";
    }
    if (!formData.executiveSummary?.trim()) {
      newErrors.executiveSummary = "Executive summary is required";
    }
    if (!formData.objectives?.trim()) {
      newErrors.objectives = "Objectives are required";
    }
    if (!formData.methodology?.trim()) {
      newErrors.methodology = "Methodology is required";
    }
    if (!formData.results?.trim()) {
      newErrors.results = "Results are required";
    }
    if (!formData.conclusions?.trim()) {
      newErrors.conclusions = "Conclusions are required";
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
        <CardTitle className="text-lg">BM3: Project Summary Report</CardTitle>
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
                <Label htmlFor="principalInvestigator">Principal Investigator *</Label>
                <Input
                  id="principalInvestigator"
                  value={formData.principalInvestigator || ""}
                  onChange={(e) => handleInputChange("principalInvestigator", e.target.value)}
                  placeholder="Enter PI name"
                  className={errors.principalInvestigator ? "border-red-500" : ""}
                />
                {errors.principalInvestigator && (
                  <p className="text-sm text-red-500">{errors.principalInvestigator}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution || ""}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  placeholder="Enter institution name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectPeriod">Project Period *</Label>
                <Input
                  id="projectPeriod"
                  value={formData.projectPeriod || ""}
                  onChange={(e) => handleInputChange("projectPeriod", e.target.value)}
                  placeholder="e.g., January 2023 - December 2023"
                  className={errors.projectPeriod ? "border-red-500" : ""}
                />
                {errors.projectPeriod && (
                  <p className="text-sm text-red-500">{errors.projectPeriod}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Budget</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={formData.totalBudget || ""}
                  onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                  placeholder="Enter total budget (VND)"
                />
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Project Summary</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="executiveSummary">Executive Summary *</Label>
              <Textarea
                id="executiveSummary"
                value={formData.executiveSummary || ""}
                onChange={(e) => handleInputChange("executiveSummary", e.target.value)}
                placeholder="Provide a brief executive summary of the project"
                rows={4}
                className={errors.executiveSummary ? "border-red-500" : ""}
              />
              {errors.executiveSummary && (
                <p className="text-sm text-red-500">{errors.executiveSummary}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Project Objectives *</Label>
              <Textarea
                id="objectives"
                value={formData.objectives || ""}
                onChange={(e) => handleInputChange("objectives", e.target.value)}
                placeholder="List the main objectives of the project"
                rows={4}
                className={errors.objectives ? "border-red-500" : ""}
              />
              {errors.objectives && (
                <p className="text-sm text-red-500">{errors.objectives}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology *</Label>
              <Textarea
                id="methodology"
                value={formData.methodology || ""}
                onChange={(e) => handleInputChange("methodology", e.target.value)}
                placeholder="Describe the methodology used in the project"
                rows={4}
                className={errors.methodology ? "border-red-500" : ""}
              />
              {errors.methodology && (
                <p className="text-sm text-red-500">{errors.methodology}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Key Results *</Label>
              <Textarea
                id="results"
                value={formData.results || ""}
                onChange={(e) => handleInputChange("results", e.target.value)}
                placeholder="Summarize the key results and findings"
                rows={5}
                className={errors.results ? "border-red-500" : ""}
              />
              {errors.results && (
                <p className="text-sm text-red-500">{errors.results}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conclusions">Conclusions *</Label>
              <Textarea
                id="conclusions"
                value={formData.conclusions || ""}
                onChange={(e) => handleInputChange("conclusions", e.target.value)}
                placeholder="State the main conclusions drawn from the project"
                rows={4}
                className={errors.conclusions ? "border-red-500" : ""}
              />
              {errors.conclusions && (
                <p className="text-sm text-red-500">{errors.conclusions}</p>
              )}
            </div>
          </div>

          {/* Impact and Future Work */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Impact and Future Work</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="impact">Project Impact</Label>
              <Textarea
                id="impact"
                value={formData.impact || ""}
                onChange={(e) => handleInputChange("impact", e.target.value)}
                placeholder="Describe the impact and significance of the project"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publications">Publications and Outputs</Label>
              <Textarea
                id="publications"
                value={formData.publications || ""}
                onChange={(e) => handleInputChange("publications", e.target.value)}
                placeholder="List any publications, patents, or other outputs"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="futureWork">Future Work</Label>
              <Textarea
                id="futureWork"
                value={formData.futureWork || ""}
                onChange={(e) => handleInputChange("futureWork", e.target.value)}
                placeholder="Describe potential future work or follow-up projects"
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
