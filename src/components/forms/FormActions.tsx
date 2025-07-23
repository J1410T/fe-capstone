import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Eye,
  Edit,
  Send,
  CheckCircle,
  Trash2,
  MoreHorizontal,
  Clock,
  FileText,
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  FormMetadata,
  FormStatus,
  FORM_TYPES,
} from "@/pages/FormRegister/constants";
import { FormAPI } from "@/pages/FormRegister/api";
import { toast } from "sonner";
import { getStatusColor } from "@/utils/status";

interface FormActionsProps {
  form: FormMetadata;
  onFormUpdated?: (updatedForm: FormMetadata) => void;
  onNavigateToView?: (form: FormMetadata) => void;
  onNavigateToEdit?: (form: FormMetadata) => void;
  showDropdown?: boolean;
  size?: "sm" | "default";
}

export const FormActions: React.FC<FormActionsProps> = ({
  form,
  onFormUpdated,
  onNavigateToView,
  onNavigateToEdit,
  showDropdown = false,
  size = "default",
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);

  if (!user) return null;

  const formType = FORM_TYPES[form.formType];
  const canEdit = formType.workflow.canEdit(
    form.status,
    user.role,
    form.lastUpdatedBy
  );
  const canView = formType.workflow.canView(form.status, user.role);
  const canDelete =
    form.status === FormStatus.DRAFT && form.createdBy === user.role;
  const canSubmit = canEdit && form.status === FormStatus.DRAFT;
  const canFinalize =
    form.formType === "BM5" &&
    user.role === UserRole.STAFF &&
    (form.status === FormStatus.WAITING_FOR_PI ||
      form.status === FormStatus.WAITING_FOR_STAFF);

  // Handle view form
  const handleView = () => {
    if (onNavigateToView) {
      onNavigateToView(form);
    }
  };

  // Handle edit form
  const handleEdit = () => {
    if (onNavigateToEdit) {
      onNavigateToEdit(form);
    }
  };

  // Handle submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updatedForm = await FormAPI.submitForm(
        form.id,
        user.role,
        user.name
      );
      toast.success("Form submitted successfully");
      if (onFormUpdated) {
        onFormUpdated(updatedForm);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    } finally {
      setLoading(false);
      setShowSubmitDialog(false);
    }
  };

  // Handle finalize form (BM5 only)
  const handleFinalize = async () => {
    try {
      setLoading(true);
      const updatedForm = await FormAPI.finalizeForm(
        form.id,
        user.role,
        user.name
      );
      toast.success("Form finalized successfully");
      if (onFormUpdated) {
        onFormUpdated(updatedForm);
      }
    } catch (error) {
      console.error("Error finalizing form:", error);
      toast.error("Failed to finalize form");
    } finally {
      setLoading(false);
      setShowFinalizeDialog(false);
    }
  };

  // Handle delete form
  const handleDelete = async () => {
    try {
      setLoading(true);
      await FormAPI.deleteForm(form.id, user.role);
      toast.success("Form deleted successfully");
      if (onFormUpdated) {
        // Signal that form was deleted by passing null
        onFormUpdated(null as unknown as FormMetadata);
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Get status icon
  const getStatusIcon = (status: FormStatus) => {
    switch (status) {
      case FormStatus.DRAFT:
        return <Edit className="w-4 h-4" />;
      case FormStatus.SUBMITTED:
        return <FileText className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_PI:
        return <Clock className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_STAFF:
        return <Clock className="w-4 h-4" />;
      case FormStatus.FINALIZED:
        return <CheckCircle className="w-4 h-4" />;
      case FormStatus.VIEW_ONLY:
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Get next status message
  const getNextStatusMessage = () => {
    const nextStatus = formType.workflow.nextStatus(form.status, user.role);
    if (nextStatus === form.status) return null;

    switch (nextStatus) {
      case FormStatus.SUBMITTED:
        return "This will submit the form for review.";
      case FormStatus.WAITING_FOR_PI:
        return "This will send the form to the Principal Investigator for review.";
      case FormStatus.WAITING_FOR_STAFF:
        return "This will send the form to Staff for review.";
      case FormStatus.FINALIZED:
        return "This will finalize the form. No further edits will be allowed.";
      default:
        return null;
    }
  };

  if (showDropdown) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canView && (
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {canEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canSubmit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSubmitDialog(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </DropdownMenuItem>
              </>
            )}
            {canFinalize && (
              <DropdownMenuItem onClick={() => setShowFinalizeDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalize
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialogs */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit this form?{" "}
                {getNextStatusMessage()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showFinalizeDialog}
          onOpenChange={setShowFinalizeDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finalize Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to finalize this form? This action cannot
                be undone and no further edits will be allowed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinalize} disabled={loading}>
                {loading ? "Finalizing..." : "Finalize"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this form? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Regular button layout
  return (
    <div className="flex items-center gap-2">
      {/* Status Badge */}
      <Badge
        variant="secondary"
        className={`${getStatusColor(form.status)} flex items-center gap-1`}
      >
        {getStatusIcon(form.status)}
        {form.status}
      </Badge>

      {/* Action Buttons */}
      {canView && (
        <Button
          variant="ghost"
          size={size}
          onClick={handleView}
          className="flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
      )}
      {canEdit && (
        <Button
          variant="ghost"
          size={size}
          onClick={handleEdit}
          className="flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      )}
    </div>
  );
};
