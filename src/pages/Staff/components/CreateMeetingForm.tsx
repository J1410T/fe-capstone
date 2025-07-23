import React, { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils";

interface MeetingFormData {
  title: string;
  projectId: string;
  milestoneId: string;
  council: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  meetingLink: string;
  notes: string;
}

interface MeetingFormErrors {
  title?: string;
  projectId?: string;
  milestoneId?: string;
  council?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  meetingLink?: string;
  notes?: string;
}

// Mock data for projects and milestones
const mockProjects = [
  {
    id: "PRJ-2024-001",
    name: "AI-Driven Medical Diagnostics",
    milestones: [
      { id: "MS-001-01", name: "Project Planning and Setup" },
      { id: "MS-001-02", name: "Data Collection and Preprocessing" },
      { id: "MS-001-03", name: "Model Development" },
      { id: "MS-001-04", name: "Testing and Validation" },
      { id: "MS-001-05", name: "Final Deployment" },
    ],
  },
  {
    id: "PRJ-2024-002",
    name: "Sustainable Energy Solutions",
    milestones: [
      { id: "MS-002-01", name: "Research and Analysis" },
      { id: "MS-002-02", name: "Prototype Development" },
      { id: "MS-002-03", name: "Testing Phase" },
      { id: "MS-002-04", name: "Implementation" },
    ],
  },
  {
    id: "PRJ-2024-003",
    name: "Smart City Infrastructure",
    milestones: [
      { id: "MS-003-01", name: "Infrastructure Assessment" },
      { id: "MS-003-02", name: "System Design" },
      { id: "MS-003-03", name: "Pilot Implementation" },
      { id: "MS-003-04", name: "Full Deployment" },
    ],
  },
];

const councils = [
  "Technical Council",
  "Environmental Council",
  "Medical Council",
  "Business Council",
  "Academic Council",
];

interface CreateMeetingFormProps {
  onSubmit: (data: MeetingFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CreateMeetingForm: React.FC<CreateMeetingFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    title: "",
    projectId: "",
    milestoneId: "",
    council: "",
    date: undefined,
    startTime: "",
    endTime: "",
    meetingLink: "",
    notes: "",
  });

  const [errors, setErrors] = useState<MeetingFormErrors>({});

  const selectedProject = mockProjects.find((p) => p.id === formData.projectId);
  const availableMilestones = selectedProject?.milestones || [];

  const handleInputChange = (
    field: keyof MeetingFormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleProjectChange = (projectId: string) => {
    setFormData((prev) => ({
      ...prev,
      projectId,
      milestoneId: "", // Reset milestone when project changes
    }));

    // Auto-generate meeting title based on project and milestone
    const project = mockProjects.find((p) => p.id === projectId);
    if (project) {
      setFormData((prev) => ({
        ...prev,
        title: `Milestone Review: ${project.name}`,
      }));
    }
  };

  const handleMilestoneChange = (milestoneId: string) => {
    setFormData((prev) => ({
      ...prev,
      milestoneId,
    }));

    // Update meeting title with milestone info
    const project = mockProjects.find((p) => p.id === formData.projectId);
    const milestone = project?.milestones.find((m) => m.id === milestoneId);

    if (project && milestone) {
      setFormData((prev) => ({
        ...prev,
        title: `${milestone.name} Review: ${project.name}`,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: MeetingFormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Meeting title is required";
    if (!formData.projectId)
      newErrors.projectId = "Project selection is required";
    if (!formData.milestoneId)
      newErrors.milestoneId = "Milestone selection is required";
    if (!formData.council) newErrors.council = "Council selection is required";
    if (!formData.date) newErrors.date = "Meeting date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.meetingLink.trim())
      newErrors.meetingLink = "Meeting link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meeting Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Milestone 2 Review"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={errors.title ? "border-red-300" : ""}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Project Selection */}
      <div className="space-y-2">
        <Label htmlFor="project">Select Project *</Label>
        <Select value={formData.projectId} onValueChange={handleProjectChange}>
          <SelectTrigger className={errors.projectId ? "border-red-300" : ""}>
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {mockProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && (
          <p className="text-sm text-red-600">{errors.projectId}</p>
        )}
      </div>

      {/* Milestone Selection */}
      <div className="space-y-2">
        <Label htmlFor="milestone">Select Milestone *</Label>
        <Select
          value={formData.milestoneId}
          onValueChange={handleMilestoneChange}
          disabled={!formData.projectId}
        >
          <SelectTrigger className={errors.milestoneId ? "border-red-300" : ""}>
            <SelectValue placeholder="Choose a milestone" />
          </SelectTrigger>
          <SelectContent>
            {availableMilestones.map((milestone) => (
              <SelectItem key={milestone.id} value={milestone.id}>
                {milestone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.milestoneId && (
          <p className="text-sm text-red-600">{errors.milestoneId}</p>
        )}
      </div>

      {/* Council Selection */}
      <div className="space-y-2">
        <Label htmlFor="council">Select Council *</Label>
        <Select
          value={formData.council}
          onValueChange={(value) => handleInputChange("council", value)}
        >
          <SelectTrigger className={errors.council ? "border-red-300" : ""}>
            <SelectValue placeholder="Choose a council" />
          </SelectTrigger>
          <SelectContent>
            {councils.map((council) => (
              <SelectItem key={council} value={council}>
                {council}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.council && (
          <p className="text-sm text-red-600">{errors.council}</p>
        )}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Meeting Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground",
                  errors.date && "border-red-300"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleInputChange("date", date)}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className={errors.startTime ? "border-red-300" : ""}
          />
          {errors.startTime && (
            <p className="text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className={errors.endTime ? "border-red-300" : ""}
          />
          {errors.endTime && (
            <p className="text-sm text-red-600">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Meeting Link */}
      <div className="space-y-2">
        <Label htmlFor="meetingLink">Meeting Link *</Label>
        <Input
          id="meetingLink"
          placeholder="https://meet.google.com/... or https://zoom.us/j/..."
          value={formData.meetingLink}
          onChange={(e) => handleInputChange("meetingLink", e.target.value)}
          className={errors.meetingLink ? "border-red-300" : ""}
        />
        {errors.meetingLink && (
          <p className="text-sm text-red-600">{errors.meetingLink}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any agenda items or supporting information..."
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Creating..." : "Create Meeting"}</span>
        </Button>
      </div>
    </form>
  );
};

export default CreateMeetingForm;
