import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { createEvaluationStage } from "@/services/resources/evaluation";
import { toast } from "sonner";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";

interface CreateEvaluationStageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationId: string;
  existingStages: Array<{ "stage-order": number }>;
  onStageCreated: () => void;
  loading?: boolean;
  projectId?: string;
}

interface StageFormData {
  name: string;
  "stage-order": number;
  phrase: string;
  type: string;
  "milestone-id"?: string;
}

const CreateEvaluationStageModal: React.FC<CreateEvaluationStageModalProps> = ({
  open,
  onOpenChange,
  evaluationId,
  existingStages,
  onStageCreated,
  loading = false,
  projectId,
}) => {
  // Fetch milestones if projectId is available
  const { data: milestonesData, isLoading: isLoadingMilestones } =
    useMilestonesByProjectId(projectId || "");

  // Calculate next stage order - always start from 1, then 2, 3, 4...
  const nextStageOrder =
    existingStages.length > 0
      ? Math.max(...existingStages.map((stage) => stage["stage-order"])) + 1
      : 1;

  // Form state
  const [formData, setFormData] = useState<StageFormData>({
    name: "",
    "stage-order": nextStageOrder,
    phrase: "Approval",
    type: "project",
  });

  // Update stage order when existingStages changes
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      "stage-order": nextStageOrder,
    }));
  }, [nextStageOrder]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleInputChange = (
    field: keyof StageFormData,
    value: string | number
  ) => {
    // If selecting a milestone ID, set type to milestone and store milestone-id
    if (field === "type" && value !== "project") {
      setFormData((prev) => ({
        ...prev,
        type: "milestone",
        "milestone-id": value as string,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Reset milestone-id when type changes to project
      if (field === "type" && value === "project") {
        setFormData((prev) => ({
          ...prev,
          "milestone-id": undefined,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter stage name");
      return;
    }

    // Validate milestone selection for milestone type
    if (formData.type === "milestone" && !formData["milestone-id"]) {
      toast.error("Please select a milestone for milestone type evaluation");
      return;
    }

    // Check if milestone already has a stage
    if (formData.type === "milestone" && formData["milestone-id"]) {
      const milestoneHasStage = existingStages.some(
        (stage: any) => stage["milestone-id"] === formData["milestone-id"]
      );

      if (milestoneHasStage) {
        toast.error(
          "This milestone already has an evaluation stage. Please select a different milestone."
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        "evaluation-id": evaluationId,
        status: "created",
      };

      // API call to create stage
      await createEvaluationStage(payload);

      toast.success("Evaluation stage created successfully");

      // Reset form
      setFormData({
        name: "",
        "stage-order": nextStageOrder,
        phrase: "Approval",
        type: "project",
      });

      // Close modal and refresh data
      onOpenChange(false);
      onStageCreated();
    } catch (error: any) {
      console.error("Create stage error:", error);

      // Handle specific API errors
      if (error.response?.data?.ErrorMessage) {
        toast.error(error.response.data.ErrorMessage);
      } else {
        toast.error("Failed to create evaluation stage. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: "",
      "stage-order": nextStageOrder,
      phrase: "Approval",
      type: "project",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Evaluation Stage</DialogTitle>
          <DialogDescription>
            Add a new stage to this evaluation process. Each stage will contain
            individual evaluations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stage Name */}
          <div className="space-y-2">
            <Label htmlFor="stage-name">Stage Name *</Label>
            <Input
              id="stage-name"
              placeholder="e.g., Outline Approval, Final Review, etc."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitting || loading}
              required
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Type / Milestone</Label>
            <Select
              value={
                formData.type === "milestone"
                  ? formData["milestone-id"]
                  : formData.type
              }
              onValueChange={(value) => handleInputChange("type", value)}
              disabled={isSubmitting || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project or milestone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project</SelectItem>
                {isLoadingMilestones ? (
                  <SelectItem value="" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading milestones...
                    </div>
                  </SelectItem>
                ) : Array.isArray(milestonesData?.data) &&
                  milestonesData.data.length > 0 ? (
                  milestonesData.data
                    .filter((milestone: any) => {
                      // Only show milestones that don't have stages yet
                      return !existingStages.some(
                        (stage: any) => stage["milestone-id"] === milestone.id
                      );
                    })
                    .map((milestone: any) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !formData.name.trim() ||
                (formData.type === "milestone" && !formData["milestone-id"])
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Stage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationStageModal;
