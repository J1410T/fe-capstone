import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Clock,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  AlertCircle,
  Users,
  ArrowRight,
} from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";
import { FormMetadata, FormStatus, FORM_TYPES } from "@/pages/FormRegister/constants";
import { getStatusColor } from "@/utils/status";

interface FormStatusInfoProps {
  form: FormMetadata;
  currentUserRole: UserRole;
  showWorkflowInfo?: boolean;
  compact?: boolean;
}

export const FormStatusInfo: React.FC<FormStatusInfoProps> = ({
  form,
  currentUserRole,
  showWorkflowInfo = true,
  compact = false,
}) => {
  const formType = FORM_TYPES[form.formType];

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

  // Get status description
  const getStatusDescription = (status: FormStatus) => {
    switch (status) {
      case FormStatus.DRAFT:
        return "This form is currently being drafted and can be edited.";
      case FormStatus.SUBMITTED:
        return "This form has been submitted and is under review.";
      case FormStatus.WAITING_FOR_PI:
        return "This form is waiting for the Principal Investigator to review and edit.";
      case FormStatus.WAITING_FOR_STAFF:
        return "This form is waiting for Staff to review and edit.";
      case FormStatus.FINALIZED:
        return "This form has been finalized and no further edits are allowed.";
      case FormStatus.VIEW_ONLY:
        return "This form is view-only and cannot be edited.";
      default:
        return "Unknown status.";
    }
  };

  // Get workflow guidance
  const getWorkflowGuidance = () => {
    const canEdit = formType.workflow.canEdit(form.status, currentUserRole, form.lastUpdatedBy);
    const nextStatus = formType.workflow.nextStatus(form.status, currentUserRole);

    if (form.formType === "BM1") {
      if (form.status === FormStatus.DRAFT) {
        return {
          type: "info" as const,
          message: "BM1 forms become view-only after submission. Make sure to complete all sections before submitting.",
        };
      } else {
        return {
          type: "info" as const,
          message: "BM1 forms are view-only after submission to maintain proposal integrity.",
        };
      }
    }

    if (form.formType === "BM5") {
      if (form.status === FormStatus.DRAFT) {
        return {
          type: "info" as const,
          message: "BM5 forms can be edited collaboratively between PI and Staff until finalized.",
        };
      } else if (form.status === FormStatus.WAITING_FOR_PI) {
        if (currentUserRole === UserRole.PRINCIPAL_INVESTIGATOR) {
          return {
            type: "warning" as const,
            message: "This form is waiting for your review. After editing, it will be sent back to Staff.",
          };
        } else {
          return {
            type: "info" as const,
            message: "This form is currently with the Principal Investigator for review.",
          };
        }
      } else if (form.status === FormStatus.WAITING_FOR_STAFF) {
        if (currentUserRole === UserRole.STAFF) {
          return {
            type: "warning" as const,
            message: "This form is waiting for your review. You can edit it or finalize it.",
          };
        } else {
          return {
            type: "info" as const,
            message: "This form is currently with Staff for review.",
          };
        }
      } else if (form.status === FormStatus.FINALIZED) {
        return {
          type: "success" as const,
          message: "This contract has been finalized and is now in effect.",
        };
      }
    }

    if (canEdit && nextStatus !== form.status) {
      return {
        type: "info" as const,
        message: `You can edit this form. After submission, it will be marked as "${nextStatus}".`,
      };
    }

    return null;
  };

  const workflowGuidance = getWorkflowGuidance();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(form.status)} flex items-center gap-1`}
        >
          {getStatusIcon(form.status)}
          {form.status}
        </Badge>
        {workflowGuidance && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Info className="w-3 h-3" />
            <span className="truncate max-w-48">{workflowGuidance.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Badge and Description */}
      <div className="flex items-start gap-3">
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(form.status)} flex items-center gap-1 text-sm px-3 py-1`}
        >
          {getStatusIcon(form.status)}
          {form.status}
        </Badge>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{getStatusDescription(form.status)}</p>
        </div>
      </div>

      {/* Workflow Information */}
      {showWorkflowInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Workflow Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Form Type Workflow */}
            <div className="text-sm">
              <div className="font-medium text-gray-700 mb-2">
                {form.formType} Workflow:
              </div>
              {form.formType === "BM1" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Edit className="w-3 h-3" />
                  <span>Draft</span>
                  <ArrowRight className="w-3 h-3" />
                  <FileText className="w-3 h-3" />
                  <span>Submitted (View Only)</span>
                </div>
              )}
              {form.formType === "BM5" && (
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Edit className="w-3 h-3" />
                    <span>Draft</span>
                    <ArrowRight className="w-3 h-3" />
                    <Clock className="w-3 h-3" />
                    <span>Waiting for PI/Staff</span>
                    <ArrowRight className="w-3 h-3" />
                    <CheckCircle className="w-3 h-3" />
                    <span>Finalized</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    Can be edited back and forth between PI and Staff until finalized
                  </div>
                </div>
              )}
              {(form.formType === "BM2" || form.formType === "BM3" || form.formType === "BM4") && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Edit className="w-3 h-3" />
                  <span>Draft</span>
                  <ArrowRight className="w-3 h-3" />
                  <FileText className="w-3 h-3" />
                  <span>Submitted (View Only)</span>
                </div>
              )}
            </div>

            {/* Current Status Guidance */}
            {workflowGuidance && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {workflowGuidance.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Permissions */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                <span className="font-medium">Can view:</span>{" "}
                {formType.roles.map(role => {
                  switch (role) {
                    case UserRole.PRINCIPAL_INVESTIGATOR:
                      return "PI";
                    case UserRole.STAFF:
                      return "Staff";
                    case UserRole.RESEARCHER:
                      return "Researcher";
                    default:
                      return role;
                  }
                }).join(", ")}
              </div>
              <div>
                <span className="font-medium">Can edit:</span>{" "}
                {formType.workflow.canEdit(form.status, currentUserRole, form.lastUpdatedBy)
                  ? "Yes (current user)"
                  : "No (current user)"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
