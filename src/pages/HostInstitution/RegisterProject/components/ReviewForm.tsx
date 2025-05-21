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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface FormData {
  title: string;
  field: string;
  startDate: string;
  endDate: string;
  budget: string;
  manager: string;
  institution: string;
  department: string;
  description: string;
  objectives: string;
  methodology: string;
  expectedOutcomes: string;
}

interface ResearchField {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface ReviewFormProps {
  formData: FormData;
  researchFields: ResearchField[];
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  formData,
  researchFields,
  onPrevStep,
  onSubmit,
}) => {
  const getFieldName = (fieldId: string) => {
    const field = researchFields.find((f) => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Review your project details before submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Project Name
              </p>
              <p className="text-base">{formData.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Research Field
              </p>
              <p className="text-base">{getFieldName(formData.field)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Start Date
              </p>
              <p className="text-base">{formData.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                End Date
              </p>
              <p className="text-base">{formData.endDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estimated Budget
              </p>
              <p className="text-base">{formData.budget}</p>
            </div>
          </div>

          <Separator />

          <h3 className="text-lg font-medium">Project Manager</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Principal Investigator
              </p>
              <p className="text-base">{formData.manager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Institution
              </p>
              <p className="text-base">{formData.institution}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Department
              </p>
              <p className="text-base">{formData.department}</p>
            </div>
          </div>

          <Separator />

          <h3 className="text-lg font-medium">Research Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Project Description
              </p>
              <p className="text-base whitespace-pre-line">
                {formData.description}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Research Objectives
              </p>
              <p className="text-base whitespace-pre-line">
                {formData.objectives}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Methodology
              </p>
              <p className="text-base whitespace-pre-line">
                {formData.methodology}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expected Outcomes
              </p>
              <p className="text-base whitespace-pre-line">
                {formData.expectedOutcomes}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button type="submit" onClick={onSubmit}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit Project
        </Button>
      </CardFooter>
    </Card>
  );
};
