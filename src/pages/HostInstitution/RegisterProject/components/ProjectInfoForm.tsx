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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui";

interface ResearchField {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface FormData {
  title: string;
  field: string;
  overview: string;
  target: string;
  type: string;
}

interface ProjectInfoFormProps {
  formData: FormData;
  researchFields: ResearchField[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onNextStep: () => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  formData,
  researchFields,
  onInputChange,
  onSelectChange,
  onNextStep,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
        <CardDescription>
          Provide the basic details about your research project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter the full name of your research project"
              value={formData.title}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Research Field</Label>
            <Select
              value={formData.field}
              onValueChange={(value) => onSelectChange("field", value)}
              required
            >
              <SelectTrigger id="field">
                <SelectValue placeholder="Select a research field" />
              </SelectTrigger>
              <SelectContent>
                {researchFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    <div className="flex items-center">
                      <field.icon className="mr-2 h-4 w-4" />
                      {field.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Project Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onSelectChange("type", value)}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" Đề tài nghiên cứu ứng dụn">
                  Đề tài nghiên cứu ứng dụng
                </SelectItem>
                <SelectItem value="Đề tài nghiên cứu cơ bản">
                  Đề tài nghiên cứu cơ bản
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Overview</Label>
            <Textarea
              id="overview"
              name="overview"
              placeholder="Provide a detailed description of your research project"
              rows={4}
              value={formData.overview}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Project Target</Label>
            <Textarea
              id="target"
              name="target"
              placeholder="Provide a detailed target of your research project"
              rows={4}
              value={formData.target}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={onNextStep}>
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
