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

interface CreateEvaluationStageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationId: string;
  existingStages: Array<{ "stage-order": number }>;
  onStageCreated: () => void;
  loading?: boolean;
}

interface StageFormData {
  name: string;
  "stage-order": number;
  phrase: string;
  type: string;
}

const CreateEvaluationStageModal: React.FC<CreateEvaluationStageModalProps> = ({
  open,
  onOpenChange,
  evaluationId,
  existingStages,
  onStageCreated,
  loading = false,
}) => {
  // Calculate next stage order
  const nextStageOrder = (existingStages.length || 0) + 1;

  // Form state
  const [formData, setFormData] = useState<StageFormData>({
    name: "",
    "stage-order": nextStageOrder,
    phrase: "Approval",
    type: "project",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleInputChange = (
    field: keyof StageFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to create stage
      await createEvaluationStage({
        ...formData,
        "evaluation-id": evaluationId,
        status: "created",
      });

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
    } catch {
      toast.error("Failed to create evaluation stage. Please try again.");
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

          {/* Stage Info */}
          <div className="space-y-2">
            <Label>Stage Information</Label>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Order:</strong> {nextStageOrder}
              </p>
              <p>
                <strong>Phrase:</strong> Approval
              </p>
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              disabled={isSubmitting || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
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
              disabled={isSubmitting || loading || !formData.name.trim()}
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
