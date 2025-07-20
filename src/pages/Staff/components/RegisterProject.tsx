import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FolderPlus,
  Calendar as CalendarIcon,
  DollarSign,
  FileText,
  Save,
  Send,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  budget: string;
  duration: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  department: string;
  objectives: string;
  methodology: string;
  expectedOutcomes: string;
  keywords: string;
}

interface ProjectFormErrors {
  title?: string;
  description?: string;
  category?: string;
  budget?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  objectives?: string;
  methodology?: string;
  expectedOutcomes?: string;
  keywords?: string;
}

const ProjectRegistration: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    budget: "",
    duration: "",
    startDate: undefined,
    endDate: undefined,
    department: "",
    objectives: "",
    methodology: "",
    expectedOutcomes: "",
    keywords: "",
  });

  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ProjectFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Project data:", {
        ...formData,
        status: isDraft ? "draft" : "submitted",
      });

      // Reset form or redirect
      if (!isDraft) {
        setFormData({
          title: "",
          description: "",
          category: "",
          budget: "",
          duration: "",
          startDate: undefined,
          endDate: undefined,
          department: "",
          objectives: "",
          methodology: "",
          expectedOutcomes: "",
          keywords: "",
        });
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DatePicker = ({
    date,
    onDateChange,
    placeholder,
    error,
  }: {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    placeholder: string;
    error?: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            error && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Register New Project
          </h1>
          <p className="text-muted-foreground">
            Create a new research project in the system
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <FolderPlus className="w-4 h-4 mr-1" />
          New Project
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter project title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Provide a detailed description of the project"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objectives *</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) =>
                    handleInputChange("objectives", e.target.value)
                  }
                  placeholder="Provide the objectives of the project"
                  rows={4}
                  className={errors.objectives ? "border-red-500" : ""}
                />
                {errors.objectives && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.objectives}
                  </p>
                )}
              </div>

               <div className="space-y-2">
                <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
                <Textarea
                  id="expectedOutcomes"
                  value={formData.expectedOutcomes}
                  onChange={(e) =>
                    handleInputChange("expectedOutcomes", e.target.value)
                  }
                  placeholder="Provide the Expected Outcomes of the project"
                  rows={4}
                  className={errors.expectedOutcomes ? "border-red-500" : ""}
                />
                {errors.expectedOutcomes && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expectedOutcomes}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic-research">
                        Basic Research
                      </SelectItem>
                      <SelectItem value="applied-research">
                        Applied Research
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Budget & Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="e.g., $100,000"
                  className={errors.budget ? "border-red-500" : ""}
                />
                {errors.budget && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.budget}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="e.g., 24 months"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <DatePicker
                  date={formData.startDate}
                  onDateChange={(date) => handleInputChange("startDate", date)}
                  placeholder="Select start date"
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={formData.endDate}
                  onDateChange={(date) => handleInputChange("endDate", date)}
                  placeholder="Select end date"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={() => handleSubmit(false)}
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                className="w-full"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectRegistration;
