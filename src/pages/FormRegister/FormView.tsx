import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  FileText,
  History,
  Download,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { FormMetadata, FORM_TYPES } from "./constants";
import { FormAPI } from "./api";
import { FormEditor } from "@/components/forms/FormEditor";
import { FormStatusInfo } from "@/components/forms/FormStatusInfo";

const FormView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState<FormMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const previousPage = location.state?.from || "/pi/forms";

  const loadForm = useCallback(async () => {
    if (!formId || !user) return;

    try {
      setLoading(true);
      const formData = await FormAPI.getForm(formId, user.role);
      if (formData) {
        setForm(formData);
      } else {
        toast.error("Form not found");
        navigate(previousPage);
      }
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form");
      navigate(previousPage);
    } finally {
      setLoading(false);
    }
  }, [formId, user, navigate, previousPage]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  // Handle back navigation
  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(previousPage);
    } else {
      navigate(-1);
    }
  };

  // Check if user can edit form
  const canEditForm = (form: FormMetadata) => {
    if (!user) return false;
    const formType = FORM_TYPES[form.formType];
    return formType.workflow.canEdit(
      form.status,
      user.role,
      form.lastUpdatedBy
    );
  };

  // Handle edit form
  const handleEditForm = () => {
    if (form) {
      navigate(`/pi/forms/${form.id}/edit`, {
        state: { from: location.pathname },
      });
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download (placeholder)
  const handleDownload = () => {
    toast.info("Download functionality coming soon");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Form not found
            </h3>
            <p className="text-gray-600 mb-4">
              The form you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button onClick={handleBackNavigation}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <Card className="border-none shadow-none pt-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackNavigation}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold">Form Details</CardTitle>
              <p className="text-gray-600 mt-1">View and manage form content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? "Hide" : "Show"} History
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            {canEditForm(form) && (
              <Button
                onClick={handleEditForm}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Form
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Form Status Information */}
      {user && (
        <FormStatusInfo
          form={form}
          currentUserRole={user.role}
          showWorkflowInfo={true}
          compact={false}
        />
      )}

      {/* Edit History */}
      {showHistory && form.editHistory && form.editHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Edit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.editHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{entry.updatedByName}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    {entry.changes && (
                      <p className="text-sm text-gray-600">{entry.changes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Content */}
      <FormEditor
        form={form}
        onSave={() => {}} // Not used in view mode
        onCancel={() => {}} // Not used in view mode
        readOnly={true}
        showMetadata={true}
      />
    </div>
  );
};

export default FormView;
