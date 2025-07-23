import React, { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils";

interface MilestoneSchedule {
  milestoneId: string;
  milestoneName: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

interface BulkMeetingData {
  projectId: string;
  projectName: string;
  council: string;
  meetingLinkTemplate: string;
  milestones: MilestoneSchedule[];
}

// Mock data for projects with milestones
const mockProjectsWithMilestones = [
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
];

const councils = [
  "Technical Council",
  "Environmental Council",
  "Medical Council",
  "Business Council",
  "Academic Council",
];

interface BulkMeetingCreationProps {
  onSubmit: (data: BulkMeetingData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BulkMeetingCreation: React.FC<BulkMeetingCreationProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<BulkMeetingData>({
    projectId: "",
    projectName: "",
    council: "",
    meetingLinkTemplate: "",
    milestones: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleProjectChange = (projectId: string) => {
    const project = mockProjectsWithMilestones.find((p) => p.id === projectId);
    if (project) {
      const milestoneSchedules: MilestoneSchedule[] = project.milestones.map(
        (milestone) => ({
          milestoneId: milestone.id,
          milestoneName: milestone.name,
          date: undefined,
          startTime: "10:00",
          endTime: "12:00",
        })
      );

      setFormData((prev) => ({
        ...prev,
        projectId,
        projectName: project.name,
        milestones: milestoneSchedules,
      }));
    }
  };

  const handleMilestoneScheduleChange = (
    milestoneId: string,
    field: keyof MilestoneSchedule,
    value: Date | string | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone) =>
        milestone.milestoneId === milestoneId
          ? { ...milestone, [field]: value }
          : milestone
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.projectId)
      newErrors.project = "Project selection is required";
    if (!formData.council) newErrors.council = "Council selection is required";
    if (!formData.meetingLinkTemplate.trim())
      newErrors.meetingLink = "Meeting link template is required";

    // Validate milestone schedules
    const incompleteMilestones = formData.milestones.filter(
      (milestone) =>
        !milestone.date || !milestone.startTime || !milestone.endTime
    );

    if (incompleteMilestones.length > 0) {
      newErrors.milestones = "All milestones must have date and time scheduled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const generateMeetingLink = (milestoneId: string) => {
    // Simple template replacement - in real app, this would be more sophisticated
    return formData.meetingLinkTemplate.replace("{milestone}", milestoneId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Selection */}
      <div className="space-y-2">
        <Label htmlFor="project">Select Project *</Label>
        <Select value={formData.projectId} onValueChange={handleProjectChange}>
          <SelectTrigger className={errors.project ? "border-red-300" : ""}>
            <SelectValue placeholder="Choose a project for bulk meeting creation" />
          </SelectTrigger>
          <SelectContent>
            {mockProjectsWithMilestones.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project && (
          <p className="text-sm text-red-600">{errors.project}</p>
        )}
      </div>

      {/* Council Selection */}
      <div className="space-y-2">
        <Label htmlFor="council">Select Council *</Label>
        <Select
          value={formData.council}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, council: value }))
          }
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

      {/* Meeting Link Template */}
      <div className="space-y-2">
        <Label htmlFor="meetingLink">Meeting Link Template *</Label>
        <Input
          id="meetingLink"
          placeholder="https://meet.google.com/abc-defg-hij (use {milestone} for milestone-specific links)"
          value={formData.meetingLinkTemplate}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              meetingLinkTemplate: e.target.value,
            }))
          }
          className={errors.meetingLink ? "border-red-300" : ""}
        />
        <p className="text-xs text-muted-foreground">
          Use {"{milestone}"} in the URL to create unique links for each
          milestone
        </p>
        {errors.meetingLink && (
          <p className="text-sm text-red-600">{errors.meetingLink}</p>
        )}
      </div>

      {/* Milestone Scheduling */}
      {formData.milestones.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              Schedule Milestone Meetings *
            </Label>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{formData.milestones.length} milestones</span>
            </Badge>
          </div>

          {errors.milestones && (
            <p className="text-sm text-red-600">{errors.milestones}</p>
          )}

          <div className="space-y-3">
            {formData.milestones.map((milestone, index) => (
              <Card key={milestone.milestoneId} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      {milestone.milestoneName}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      Milestone {index + 1}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Date */}
                    <div className="space-y-1">
                      <Label className="text-xs">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs",
                              !milestone.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {milestone.date
                              ? format(milestone.date, "MMM dd, yyyy")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={milestone.date}
                            onSelect={(date) =>
                              handleMilestoneScheduleChange(
                                milestone.milestoneId,
                                "date",
                                date
                              )
                            }
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Start Time */}
                    <div className="space-y-1">
                      <Label className="text-xs">Start Time</Label>
                      <Input
                        type="time"
                        value={milestone.startTime}
                        onChange={(e) =>
                          handleMilestoneScheduleChange(
                            milestone.milestoneId,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="text-xs"
                      />
                    </div>

                    {/* End Time */}
                    <div className="space-y-1">
                      <Label className="text-xs">End Time</Label>
                      <Input
                        type="time"
                        value={milestone.endTime}
                        onChange={(e) =>
                          handleMilestoneScheduleChange(
                            milestone.milestoneId,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Generated Meeting Link Preview */}
                  {formData.meetingLinkTemplate && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <span className="text-muted-foreground">
                        Meeting link:{" "}
                      </span>
                      <span className="font-mono">
                        {generateMeetingLink(milestone.milestoneId)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

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
          disabled={isSubmitting || formData.milestones.length === 0}
          className="flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>
            {isSubmitting
              ? "Creating..."
              : `Create ${formData.milestones.length} Meetings`}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default BulkMeetingCreation;
