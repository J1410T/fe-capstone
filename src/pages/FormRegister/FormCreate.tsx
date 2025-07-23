import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { FORM_TYPES, FormType } from "./constants";
import { FormAPI } from "./api";

const FormCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [selectedFormType, setSelectedFormType] = useState<FormType | "">("");
  const [formTitle, setFormTitle] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const previousPage = location.state?.from || "/pi/forms";

  // Get available form types for the user
  const availableFormTypes = useMemo((): FormType[] => {
    if (!user?.role) return [];

    return Object.entries(FORM_TYPES)
      .filter(([, form]) => form.roles.includes(user.role))
      .map(([key]) => key as FormType);
  }, [user?.role]);

  // Handle back navigation
  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(previousPage);
    } else {
      navigate(-1);
    }
  };

  // Handle form type selection
  const handleFormTypeChange = (formType: string) => {
    setSelectedFormType(formType as FormType);
    if (formType) {
      const formConfig = FORM_TYPES[formType];
      setFormTitle(`${formConfig.title} ${formType}`);
    } else {
      setFormTitle("");
    }
  };

  // Validate form
  const validateForm = () => {
    if (!selectedFormType) {
      toast.error("Please select a form type");
      return false;
    }
    if (!formTitle.trim()) {
      toast.error("Please enter a form title");
      return false;
    }
    return true;
  };

  // Handle create form
  const handleCreateForm = async () => {
    if (!validateForm() || !user) return;

    try {
      setCreating(true);

      const newForm = await FormAPI.createForm(
        selectedFormType,
        user.role,
        user.name,
        {
          title: formTitle.trim(),
          projectTitle: projectTitle.trim() || undefined,
        }
      );

      toast.success("Form created successfully");

      // Navigate to edit the new form
      navigate(`/pi/forms/${newForm.id}/edit`, {
        state: { from: "/pi/forms" },
      });
    } catch (error) {
      console.error("Error creating form:", error);
      toast.error("Failed to create form");
    } finally {
      setCreating(false);
    }
  };

  if (availableFormTypes.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No forms available
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have permission to create any forms.
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
              <CardTitle className="text-2xl font-bold">
                Create New Form
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Choose a form type and provide basic information
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="formType">Form Type *</Label>
            <Select
              value={selectedFormType}
              onValueChange={handleFormTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a form type" />
              </SelectTrigger>
              <SelectContent>
                {availableFormTypes.map((formType) => (
                  <SelectItem key={formType} value={formType}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{formType}</span>
                      <span className="text-sm text-gray-600">
                        {FORM_TYPES[formType].title}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFormType && (
              <p className="text-sm text-gray-600">
                {FORM_TYPES[selectedFormType].title}
              </p>
            )}
          </div>

          {/* Form Title */}
          <div className="space-y-2">
            <Label htmlFor="formTitle">Form Title *</Label>
            <Input
              id="formTitle"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter a descriptive title for this form"
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              This will be the display name for your form
            </p>
          </div>

          {/* Project Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title (Optional)</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter the related project title"
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              Link this form to a specific project for better organization
            </p>
          </div>

          {/* Form Type Information */}
          {selectedFormType && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                About {selectedFormType} Forms
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedFormType === "BM1" && (
                  <>
                    <p>• Research Proposal Registration form</p>
                    <p>• View only after submission</p>
                    <p>• Used for initial project proposals</p>
                  </>
                )}
                {selectedFormType === "BM2" && (
                  <>
                    <p>• Council meeting minutes</p>
                    <p>• Documents review discussions</p>
                    <p>• View only after submission</p>
                  </>
                )}
                {selectedFormType === "BM5" && (
                  <>
                    <p>• Research Contract form</p>
                    <p>• Can be edited back and forth between PI and Staff</p>
                    <p>• Collaborative workflow until finalized</p>
                  </>
                )}
                {selectedFormType === "BM3" && (
                  <>
                    <p>• Project summary report</p>
                    <p>• Available for PI and Researchers</p>
                    <p>• View only after submission</p>
                  </>
                )}
                {selectedFormType === "BM4" && (
                  <>
                    <p>• Progress report form</p>
                    <p>• Available for Researchers</p>
                    <p>• View only after submission</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleBackNavigation}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateForm}
              disabled={creating || !selectedFormType || !formTitle.trim()}
              className="flex items-center gap-2"
            >
              {creating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {creating ? "Creating..." : "Create Form"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormCreate;
