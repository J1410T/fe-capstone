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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  Users,
  Building,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface ResearchField {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface FormData {
  title: string;
  field: string;
  startDate: string;
  endDate: string;
  budget: string;
  manager: string;
  institution: string;
  department: string;
}

interface ProjectInfoFormProps {
  formData: FormData;
  researchFields: ResearchField[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="pl-10"
                  value={formData.startDate}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="pl-10"
                  value={formData.endDate}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="budget"
                name="budget"
                placeholder="Enter the estimated budget"
                className="pl-10"
                value={formData.budget}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Manager</h3>

          <div className="space-y-2">
            <Label htmlFor="manager">Principal Investigator</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="manager"
                name="manager"
                placeholder="Enter the name of the principal investigator"
                className="pl-10"
                value={formData.manager}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="institution"
                  name="institution"
                  placeholder="Enter your institution"
                  className="pl-10"
                  value={formData.institution}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="department"
                  name="department"
                  placeholder="Enter your department"
                  className="pl-10"
                  value={formData.department}
                  onChange={onInputChange}
                  required
                />
              </div>
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
