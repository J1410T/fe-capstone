import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FormData {
  [key: string]: string | number | boolean;
}

interface BM1FormProps {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onSubmit: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

export const BM1Form: React.FC<BM1FormProps> = ({
  formData,
  onDataChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      const newData = { ...formData, [field]: value };
      onDataChange(newData);

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [formData, onDataChange, errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    const requiredFields = [
      { key: "projectTitle", message: "Project title is required" },
      {
        key: "principalInvestigator",
        message: "Principal investigator name is required",
      },
      { key: "institution", message: "Institution is required" },
      {
        key: "researchObjectives",
        message: "Research objectives are required",
      },
      { key: "methodology", message: "Methodology is required" },
      { key: "expectedOutcomes", message: "Expected outcomes are required" },
    ];

    requiredFields.forEach(({ key, message }) => {
      const value = formData[key];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[key] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit();
      }
    },
    [validateForm, onSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          BM1: Evaluation and Appraisal of the Outline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Project Information</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={String(formData.projectTitle || "")}
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

              <div className="space-y-2">
                <Label htmlFor="principalInvestigator">
                  Principal Investigator *
                </Label>
                <Input
                  id="principalInvestigator"
                  value={String(formData.principalInvestigator || "")}
                  onChange={(e) =>
                    handleInputChange("principalInvestigator", e.target.value)
                  }
                  placeholder="Enter PI name"
                  className={
                    errors.principalInvestigator ? "border-red-500" : ""
                  }
                />
                {errors.principalInvestigator && (
                  <p className="text-sm text-red-500">
                    {errors.principalInvestigator}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={String(formData.institution || "")}
                onChange={(e) =>
                  handleInputChange("institution", e.target.value)
                }
                placeholder="Enter institution name"
                className={errors.institution ? "border-red-500" : ""}
              />
              {errors.institution && (
                <p className="text-sm text-red-500">{errors.institution}</p>
              )}
            </div>
          </div>

          {/* Research Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Research Details</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="researchObjectives">Research Objectives *</Label>
              <Textarea
                id="researchObjectives"
                value={String(formData.researchObjectives || "")}
                onChange={(e) =>
                  handleInputChange("researchObjectives", e.target.value)
                }
                placeholder="Describe the research objectives"
                rows={4}
                className={errors.researchObjectives ? "border-red-500" : ""}
              />
              {errors.researchObjectives && (
                <p className="text-sm text-red-500">
                  {errors.researchObjectives}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology *</Label>
              <Textarea
                id="methodology"
                value={String(formData.methodology || "")}
                onChange={(e) =>
                  handleInputChange("methodology", e.target.value)
                }
                placeholder="Describe the research methodology"
                rows={4}
                className={errors.methodology ? "border-red-500" : ""}
              />
              {errors.methodology && (
                <p className="text-sm text-red-500">{errors.methodology}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
              <Textarea
                id="expectedOutcomes"
                value={String(formData.expectedOutcomes || "")}
                onChange={(e) =>
                  handleInputChange("expectedOutcomes", e.target.value)
                }
                placeholder="Describe the expected outcomes"
                rows={4}
                className={errors.expectedOutcomes ? "border-red-500" : ""}
              />
              {errors.expectedOutcomes && (
                <p className="text-sm text-red-500">
                  {errors.expectedOutcomes}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Additional Information</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <Input
                id="budget"
                type="number"
                value={String(formData.budget || "")}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="Enter estimated budget (VND)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration (months)</Label>
              <Input
                id="duration"
                type="number"
                value={String(formData.duration || "")}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="Enter project duration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={String(formData.additionalNotes || "")}
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
