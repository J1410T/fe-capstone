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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormData {
  description: string;
  objectives: string;
  methodology: string;
  expectedOutcomes: string;
}

interface ResearchDetailsFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const ResearchDetailsForm: React.FC<ResearchDetailsFormProps> = ({
  formData,
  onInputChange,
  onNextStep,
  onPrevStep,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Details</CardTitle>
        <CardDescription>
          Provide detailed information about your research project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a detailed description of your research project"
              rows={4}
              value={formData.description}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Research Objectives</Label>
            <Textarea
              id="objectives"
              name="objectives"
              placeholder="List the main objectives of your research"
              rows={4}
              value={formData.objectives}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodology">Methodology</Label>
            <Textarea
              id="methodology"
              name="methodology"
              placeholder="Describe the methodology you will use"
              rows={4}
              value={formData.methodology}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
            <Textarea
              id="expectedOutcomes"
              name="expectedOutcomes"
              placeholder="Describe the expected outcomes of your research"
              rows={4}
              value={formData.expectedOutcomes}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button type="button" onClick={onNextStep}>
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
