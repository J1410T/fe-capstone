import React, { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EvaluationStageApi } from "@/types/evaluation";
import { useUpdateEvaluationStage } from "@/hooks/queries/evaluation";

interface UpdateEvaluationStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: EvaluationStageApi | null;
  onStageUpdated: () => void;
}

const UpdateEvaluationStageModal: React.FC<UpdateEvaluationStageModalProps> = ({
  isOpen,
  onClose,
  stage,
  onStageUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    "stage-order": 1,
    phrase: "",
    type: "",
    status: "approved", // Default value
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const updateStageMutation = useUpdateEvaluationStage();

  // Initialize form data function
  const initializeForm = () => {
    if (stage) {
      setFormData({
        name: stage.name || "",
        "stage-order": stage["stage-order"] || 1,
        phrase: stage.phrase || "",
        type: stage.type || "",
        status: stage.status || "approved",
      });
      setErrors({});
    }
  };

  // Initialize form data when modal opens with stage data
  useEffect(() => {
    if (isOpen && stage) {
      initializeForm();
    }
  }, [isOpen]); // Chỉ depend vào isOpen thôi

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phrase.trim()) {
      newErrors.phrase = "Phrase is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
    }

    if (!formData.status || !formData.status.trim()) {
      newErrors.status = "Status is required";
    }

    if (formData["stage-order"] <= 0) {
      newErrors["stage-order"] = "Stage order must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    if (!stage) return;

    try {
      const updateData = {
        id: stage.id,
        name: formData.name.trim(),
        "stage-order": formData["stage-order"],
        phrase: formData.phrase.trim(),
        type: formData.type.trim(),
        status: formData.status,
        "evaluation-id": stage["evaluation-id"],
        "milestone-id": stage["milestone-id"],
        "appraisal-council-id": stage["appraisal-council-id"],
      };

      await updateStageMutation.mutateAsync(updateData);

      toast.success("Stage updated successfully!");
      setShowConfirmDialog(false);
      onClose();
      onStageUpdated();
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error("Failed to update stage");
      setShowConfirmDialog(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!stage) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Evaluation Stage</DialogTitle>
            <DialogDescription>
              Update the evaluation stage information. Fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter stage name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage-order">Stage Order *</Label>
              <Input
                id="stage-order"
                type="number"
                min="1"
                value={formData["stage-order"]}
                onChange={(e) =>
                  handleInputChange(
                    "stage-order",
                    parseInt(e.target.value) || 1
                  )
                }
                className={errors["stage-order"] ? "border-red-500" : ""}
              />
              {errors["stage-order"] && (
                <p className="text-sm text-red-600">{errors["stage-order"]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phrase">Phrase *</Label>
              <Input
                id="phrase"
                value={formData.phrase}
                onChange={(e) => handleInputChange("phrase", e.target.value)}
                placeholder="Enter phrase"
                className={errors.phrase ? "border-red-500" : ""}
              />
              {errors.phrase && (
                <p className="text-sm text-red-600">{errors.phrase}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                placeholder="Enter type"
                className={errors.type ? "border-red-500" : ""}
              />
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateStageMutation.isPending}
            >
              {updateStageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this evaluation stage? This action
              will modify the stage information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdate}
              disabled={updateStageMutation.isPending}
            >
              {updateStageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateEvaluationStageModal;
