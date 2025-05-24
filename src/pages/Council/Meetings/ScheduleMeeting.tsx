import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Save,
  Plus,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MeetingFormData {
  title: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  type: string;
  projectCode: string;
  location: string;
  meetingLink: string;
  description: string;
  attendees: string[];
}

const ScheduleMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MeetingFormData>({
    title: "",
    date: undefined,
    startTime: "",
    endTime: "",
    type: "",
    projectCode: "",
    location: "Virtual (Zoom)",
    meetingLink: "",
    description: "",
    attendees: [],
  });
  const [newAttendee, setNewAttendee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof MeetingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAttendee = () => {
    if (
      newAttendee.trim() &&
      !formData.attendees.includes(newAttendee.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()],
      }));
      setNewAttendee("");
    }
  };

  const handleRemoveAttendee = (attendee: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a !== attendee),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to create the meeting
      console.log("Creating meeting:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and redirect
      toast.success("Meeting scheduled successfully!");
      navigate("/council/meetings");
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      formData.type &&
      formData.projectCode.trim()
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/council/meetings")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meetings
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Schedule Meeting
          </h1>
          <p className="text-muted-foreground">
            Create a new council meeting for project evaluation
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>
              Fill in the details for the new council meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Project Evaluation: AI Research"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectCode">Project Code *</Label>
                  <Input
                    id="projectCode"
                    placeholder="e.g., PRJ-2024-001"
                    value={formData.projectCode}
                    onChange={(e) =>
                      handleInputChange("projectCode", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    <CalendarIcon className="inline mr-1 h-4 w-4" />
                    Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(formData.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) =>
                          setFormData((prev) => ({ ...prev, date }))
                        }
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>
                    <Clock className="inline mr-1 h-4 w-4" />
                    Start Time *
                  </Label>
                  <TimePicker
                    value={formData.startTime}
                    onChange={(time) =>
                      setFormData((prev) => ({ ...prev, startTime: time }))
                    }
                    placeholder="Select start time"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time *</Label>
                  <TimePicker
                    value={formData.endTime}
                    onChange={(time) =>
                      setFormData((prev) => ({ ...prev, endTime: time }))
                    }
                    placeholder="Select end time"
                  />
                </div>
              </div>

              <Separator />

              {/* Meeting Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Meeting Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proposal Evaluation">
                      Proposal Evaluation
                    </SelectItem>
                    <SelectItem value="Milestone Evaluation">
                      Milestone Evaluation
                    </SelectItem>
                    <SelectItem value="Final Review">Final Review</SelectItem>
                    <SelectItem value="General Meeting">
                      General Meeting
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location and Meeting Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="inline mr-1 h-4 w-4" />
                    Location
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virtual (Zoom)">
                        Virtual (Zoom)
                      </SelectItem>
                      <SelectItem value="Virtual (Google Meet)">
                        Virtual (Google Meet)
                      </SelectItem>
                      <SelectItem value="Virtual (Microsoft Teams)">
                        Virtual (Microsoft Teams)
                      </SelectItem>
                      <SelectItem value="Conference Room A">
                        Conference Room A
                      </SelectItem>
                      <SelectItem value="Conference Room B">
                        Conference Room B
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    placeholder="https://zoom.us/j/..."
                    value={formData.meetingLink}
                    onChange={(e) =>
                      handleInputChange("meetingLink", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Meeting agenda and objectives..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <Separator />

              {/* Attendees */}
              <div className="space-y-2">
                <Label>
                  <Users className="inline mr-1 h-4 w-4" />
                  Attendees
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter attendee name or email"
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddAttendee())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAttendee}
                    disabled={!newAttendee.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attendees.map((attendee, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <span>{attendee}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                          onClick={() => handleRemoveAttendee(attendee)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/council/meetings")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isFormValid() || isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
