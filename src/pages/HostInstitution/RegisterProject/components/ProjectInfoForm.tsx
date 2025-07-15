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
import { useFieldList } from "@/hooks/queries/field";
import { useMajorsByField } from "@/hooks/queries/major";

interface FormData {
  englishTitle: string;
  vietnameseTitle: string;
  abbreviations: string;
  duration: string;
  description: string;
  requirementNote: string;
  maximumMember: string;
  language: string;
  category: string;
  type: string;
  field: string;
  major: string;
}

interface ProjectInfoFormProps {
  formData: FormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onNextStep: () => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onNextStep,
}) => {
  const { data: fields, isLoading: fieldsLoading } = useFieldList();
  const { data: majors, isLoading: majorsLoading } = useMajorsByField(
    formData.field
  );

  const handleFieldChange = (value: string) => {
    onSelectChange("field", value);
    // Reset major selection when field changes
    onSelectChange("major", "");
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="englishTitle">English Title</Label>
              <Input
                id="englishTitle"
                name="englishTitle"
                placeholder="Enter the English title"
                value={formData.englishTitle}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vietnameseTitle">Vietnamese Title</Label>
              <Input
                id="vietnameseTitle"
                name="vietnameseTitle"
                placeholder="Enter the Vietnamese title"
                value={formData.vietnameseTitle}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="abbreviations">Abbreviations</Label>
              <Input
                id="abbreviations"
                name="abbreviations"
                placeholder="Enter abbreviations"
                value={formData.abbreviations}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Enter duration in months"
                value={formData.duration}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
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
            <Label htmlFor="requirementNote">Requirement Note</Label>
            <Textarea
              id="requirementNote"
              name="requirementNote"
              placeholder="Provide requirements and notes"
              rows={3}
              value={formData.requirementNote}
              onChange={onInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maximumMember">Maximum Members</Label>
              <Input
                id="maximumMember"
                name="maximumMember"
                type="number"
                placeholder="Enter maximum number of members"
                value={formData.maximumMember}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => onSelectChange("language", value)}
                required
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="application/implementation">
                    Application
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => onSelectChange("type", value)}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school level">School Level</SelectItem>
                  <SelectItem value="cooperate">Cooperate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field">Field</Label>
              <Select
                value={formData.field}
                onValueChange={handleFieldChange}
                required
              >
                <SelectTrigger id="field">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    Array.isArray(fields) &&
                    fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Select
                value={formData.major}
                onValueChange={(value) => onSelectChange("major", value)}
                disabled={!formData.field || majorsLoading}
                required
              >
                <SelectTrigger id="major">
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  {majorsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    majors?.map((major) => (
                      <SelectItem key={major.id} value={major.id}>
                        {major.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
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
