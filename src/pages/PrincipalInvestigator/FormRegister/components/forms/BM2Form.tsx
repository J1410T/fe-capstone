import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormData } from "../../constants";

interface BM2FormData extends FormData {
  meetingDate: string;
  meetingTime: string;
  meetingLocation: string;
  chairperson: string;
  attendees: string;
  projectTitle: string;
  principalInvestigator: string;
  discussionPoints: string;
  recommendations: string;
  decision: string;
  nextSteps: string;
  additionalNotes: string;
}

interface BM2FormProps {
  formData: BM2FormData;
  onDataChange: (data: BM2FormData) => void;
  onSubmit: () => void;
}

export const BM2Form: React.FC<BM2FormProps> = ({
  formData,
  onDataChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    onDataChange(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.meetingDate?.trim()) {
      newErrors.meetingDate = "Meeting date is required";
    }
    if (!formData.meetingLocation?.trim()) {
      newErrors.meetingLocation = "Meeting location is required";
    }
    if (!formData.chairperson?.trim()) {
      newErrors.chairperson = "Chairperson name is required";
    }
    if (!formData.attendees?.trim()) {
      newErrors.attendees = "Attendees list is required";
    }
    if (!formData.projectTitle?.trim()) {
      newErrors.projectTitle = "Project title is required";
    }
    if (!formData.discussionPoints?.trim()) {
      newErrors.discussionPoints = "Discussion points are required";
    }
    if (!formData.decision?.trim()) {
      newErrors.decision = "Council decision is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          BM2: Minutes of the Meeting of the Council to Review the Outline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Meeting Information</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingDate">Meeting Date *</Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={String(formData.meetingDate || "")}
                  onChange={(e) =>
                    handleInputChange("meetingDate", e.target.value)
                  }
                  className={errors.meetingDate ? "border-red-500" : ""}
                />
                {errors.meetingDate && (
                  <p className="text-sm text-red-500">{errors.meetingDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  type="time"
                  value={String(formData.meetingTime || "")}
                  onChange={(e) =>
                    handleInputChange("meetingTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLocation">Meeting Location *</Label>
              <Input
                id="meetingLocation"
                value={String(formData.meetingLocation || "")}
                onChange={(e) =>
                  handleInputChange("meetingLocation", e.target.value)
                }
                placeholder="Enter meeting location"
                className={errors.meetingLocation ? "border-red-500" : ""}
              />
              {errors.meetingLocation && (
                <p className="text-sm text-red-500">{errors.meetingLocation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chairperson">Chairperson *</Label>
              <Input
                id="chairperson"
                value={formData.chairperson || ""}
                onChange={(e) =>
                  handleInputChange("chairperson", e.target.value)
                }
                placeholder="Enter chairperson name"
                className={errors.chairperson ? "border-red-500" : ""}
              />
              {errors.chairperson && (
                <p className="text-sm text-red-500">{errors.chairperson}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees *</Label>
              <Textarea
                id="attendees"
                value={formData.attendees || ""}
                onChange={(e) => handleInputChange("attendees", e.target.value)}
                placeholder="List all meeting attendees (one per line)"
                rows={4}
                className={errors.attendees ? "border-red-500" : ""}
              />
              {errors.attendees && (
                <p className="text-sm text-red-500">{errors.attendees}</p>
              )}
            </div>
          </div>

          {/* Project Review */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Project Under Review</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={formData.projectTitle || ""}
                onChange={(e) =>
                  handleInputChange("projectTitle", e.target.value)
                }
                placeholder="Enter project title"
                className={errors.projectTitle ? "border-red-500" : ""}
              />
              {errors.projectTitle && (
                <p className="text-sm text-red-500">{errors.projectTitle}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="principalInvestigator">
                Principal Investigator
              </Label>
              <Input
                id="principalInvestigator"
                value={formData.principalInvestigator || ""}
                onChange={(e) =>
                  handleInputChange("principalInvestigator", e.target.value)
                }
                placeholder="Enter PI name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discussionPoints">Discussion Points *</Label>
              <Textarea
                id="discussionPoints"
                value={formData.discussionPoints || ""}
                onChange={(e) =>
                  handleInputChange("discussionPoints", e.target.value)
                }
                placeholder="Describe the main discussion points and feedback"
                rows={6}
                className={errors.discussionPoints ? "border-red-500" : ""}
              />
              {errors.discussionPoints && (
                <p className="text-sm text-red-500">
                  {errors.discussionPoints}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                value={formData.recommendations || ""}
                onChange={(e) =>
                  handleInputChange("recommendations", e.target.value)
                }
                placeholder="List any recommendations or suggestions"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="decision">Council Decision *</Label>
              <Textarea
                id="decision"
                value={formData.decision || ""}
                onChange={(e) => handleInputChange("decision", e.target.value)}
                placeholder="State the final decision of the council"
                rows={3}
                className={errors.decision ? "border-red-500" : ""}
              />
              {errors.decision && (
                <p className="text-sm text-red-500">{errors.decision}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Additional Information</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Textarea
                id="nextSteps"
                value={formData.nextSteps || ""}
                onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                placeholder="Outline the next steps to be taken"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes || ""}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information or notes"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="min-w-[120px]">
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
