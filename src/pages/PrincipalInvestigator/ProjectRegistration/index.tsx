import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Send, AlertTriangle, ArrowLeft } from "lucide-react";
// import { Project } from "../shared/types";
import {
  canCreateProjectType,
  getProjectTypeRestrictionMessage,
  getCurrentQuarter,
  getTimeLimit,
} from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProjectFormData {
  name: string;
  type: "Basic" | "Application" | "";
  objective: string;
  description: string;
  relatedProjects: string;
}

interface ProjectFormErrors {
  name?: string;
  type?: string;
  objective?: string;
  description?: string;
  relatedProjects?: string;
}

const ProjectRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    type: "",
    objective: "",
    description: "",
    relatedProjects: "",
  });
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [timeLimit, setTimeLimit] = useState(getTimeLimit());

  useEffect(() => {
    // Update time limit information
    setTimeLimit(getTimeLimit());
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.type) {
      newErrors.type = "Project type is required";
    } else if (
      !canCreateProjectType(formData.type as "Basic" | "Application")
    ) {
      newErrors.type =
        "This project type cannot be created in the current quarter";
    }

    if (!formData.objective.trim()) {
      newErrors.objective = "Project objective is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to submit project registration
      setTimeout(() => {
        // In a real app, this would send the project data to the server
        console.log("Submitting project:", {
          name: formData.name,
          type: formData.type,
          objective: formData.objective,
          description: formData.description,
          relatedProjects: formData.relatedProjects,
          pi: user?.name || "Unknown",
        });

        toast.success("Project registration submitted successfully");
        navigate("/pi/projects");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project registration");
      setIsLoading(false);
    }
  };

  const currentQuarter = getCurrentQuarter();
  const restrictionMessage = getProjectTypeRestrictionMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/pi/projects")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Registration
            </h1>
            <p className="text-muted-foreground">
              Form BM01 - Register a new research project
            </p>
          </div>
        </div>
      </div>

      {/* Form Badge */}
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <FileText className="w-3 h-3 mr-1" />
          BM01
        </Badge>
        <span className="text-sm text-muted-foreground">
          Project Registration Form
        </span>
      </div>

      {/* Time Limit Warning */}
      {!timeLimit.isActive && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {restrictionMessage}
          </AlertDescription>
        </Alert>
      )}

      {timeLimit.isActive && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Quarter {currentQuarter}: {restrictionMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Basic details about your research project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter the project name"
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Project Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className={errors.type ? "border-red-300" : ""}>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Basic"
                    disabled={!canCreateProjectType("Basic")}
                  >
                    Basic Research
                    {!canCreateProjectType("Basic") &&
                      " (Not available this quarter)"}
                  </SelectItem>
                  <SelectItem
                    value="Application"
                    disabled={!canCreateProjectType("Application")}
                  >
                    Application Research
                    {!canCreateProjectType("Application") &&
                      " (Not available this quarter)"}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Project Objective */}
            <div className="space-y-2">
              <Label htmlFor="objective">Project Objective *</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) => handleInputChange("objective", e.target.value)}
                placeholder="Describe the main objective of your research project"
                rows={4}
                className={errors.objective ? "border-red-300" : ""}
              />
              {errors.objective && (
                <p className="text-sm text-red-600">{errors.objective}</p>
              )}
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Provide a detailed description of your research project, methodology, and expected outcomes"
                rows={6}
                className={errors.description ? "border-red-300" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Related Projects */}
            <div className="space-y-2">
              <Label htmlFor="relatedProjects">
                Related Projects (Optional)
              </Label>
              <Textarea
                id="relatedProjects"
                value={formData.relatedProjects}
                onChange={(e) =>
                  handleInputChange("relatedProjects", e.target.value)
                }
                placeholder="List any related or previous projects that connect to this research"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/pi/projects")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !timeLimit.isActive}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectRegistration;
