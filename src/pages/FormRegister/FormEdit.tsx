import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { FormMetadata, FORM_TYPES } from "./constants";
import { FormAPI } from "./api";
import { FormEditor } from "@/components/forms/FormEditor";

const FormEdit: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState<FormMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const previousPage = location.state?.from || `/pi/forms/${formId}/view`;

  const loadForm = useCallback(async () => {
    if (!formId || !user) return;

    try {
      setLoading(true);
      const formData = await FormAPI.getForm(formId, user.role);
      if (formData) {
        // Check if user can edit this form
        const formType = FORM_TYPES[formData.formType];
        if (
          !formType.workflow.canEdit(
            formData.status,
            user.role,
            formData.lastUpdatedBy
          )
        ) {
          toast.error("You don't have permission to edit this form");
          navigate(previousPage);
          return;
        }
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

  // Handle save (update content without changing status)
  const handleSave = async (content: string) => {
    if (!form || !user) return;

    try {
      setSaving(true);
      const updatedForm = await FormAPI.updateForm(
        form.id,
        user.role,
        user.name,
        { content }
      );
      setForm(updatedForm);
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  // Handle submit (save and change status)
  const handleSubmit = async (content: string) => {
    if (!form || !user) return;

    try {
      setSubmitting(true);

      // First update the content
      await FormAPI.updateForm(form.id, user.role, user.name, { content });

      // Then submit the form (change status)
      const submittedForm = await FormAPI.submitForm(
        form.id,
        user.role,
        user.name
      );

      setForm(submittedForm);
      toast.success("Form submitted successfully");

      // Navigate back to view page
      navigate(`/pi/forms/${form.id}/view`, {
        state: { from: "/pi/forms" },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    handleBackNavigation();
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Form not found
            </h3>
            <p className="text-gray-600 mb-4">
              The form you're trying to edit doesn't exist or you don't have
              permission to edit it.
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
              <CardTitle className="text-2xl font-bold">Edit Form</CardTitle>
              <p className="text-gray-600 mt-1">
                Make changes to your form content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(form.content || "")}
              disabled={saving || submitting}
              className="flex items-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={() => handleSubmit(form.content || "")}
              disabled={saving || submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Form Editor */}
      <FormEditor
        form={form}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={saving}
        readOnly={false}
        showMetadata={true}
      />
    </div>
  );
};

export default FormEdit;
