import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, FileText } from "lucide-react";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import { useDocumentsByFilter } from "@/hooks/queries/document";
import {
  createIndividualEvaluation,
  getIndividualEvaluationById,
  updateIndividualEvaluation,
} from "@/services/resources/evaluation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { getMyAccountInfo } from "@/services/resources/auth";

// Document types available for individual evaluation
const EVALUATION_DOCUMENT_TYPES = [
  { value: "BM4", label: "Individual Evaluation Form (BM4)" },
  { value: "BM10", label: "Project Evaluation Report (BM10)" },
  { value: "BM11", label: "Technical Review Form (BM11)" },
  { value: "BM12", label: "Final Assessment Report (BM12)" },
];

const CreateIndividualEvaluationPage: React.FC = () => {
  const { evaluationId, stageId, individualId } = useParams<{
    evaluationId: string;
    stageId: string;
    individualId?: string; // Present in edit mode
  }>();
  const navigate = useNavigate();
  const editorRef = useRef<ScientificCVEditorRef>(null);
  const { user } = useAuth();

  // Determine if this is edit mode
  const isEditMode = Boolean(individualId);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    content: "",
    rate: "",
    comment: "",
    status: "created",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get template for selected document type
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    refetch: refetchTemplate,
  } = useDocumentsByFilter(
    formData.type,
    true, // is-template
    1,
    1,
    !!formData.type // Only fetch when type is selected
  );

  // Load existing individual evaluation data in edit mode
  useEffect(() => {
    const loadExistingData = async () => {
      if (!isEditMode || !individualId) return;

      try {
        setIsLoading(true);
        const existingData = await getIndividualEvaluationById({
          id: individualId,
        });

        setFormData({
          name: existingData.name || "",
          type: "", // Type will need to be selected manually in edit mode
          content: existingData.comment || "",
          rate: existingData["total-rate"]?.toString() || "",
          comment: existingData.comment || "",
          status: existingData.status || "created",
        });

        // Set content in editor if available - with delay to ensure editor is ready
        if (existingData.comment) {
          setTimeout(() => {
            if (editorRef.current && existingData.comment) {
              editorRef.current.setContent(existingData.comment);
            }
          }, 500); // Wait for editor to be fully initialized
        }
      } catch (error) {
        console.error("Failed to load existing individual evaluation:", error);
        toast.error("Failed to load existing evaluation data");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [isEditMode, individualId]);

  // Load template content when available (only for Create mode)
  useEffect(() => {
    if (
      !isEditMode && // Only load template in create mode
      !isTemplateLoading &&
      templateData?.data?.["data-list"]?.[0]?.["content-html"] &&
      formData.type // Only load when type is selected
    ) {
      const templateContent = templateData.data["data-list"][0]["content-html"];
      setFormData((prev) => ({
        ...prev,
        content: templateContent,
      }));

      // Update the editor content with a small delay to ensure editor is ready
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.setContent(templateContent);
        }
      }, 100);
    }
  }, [templateData, isTemplateLoading, isEditMode, formData.type]);

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      name:
        EVALUATION_DOCUMENT_TYPES.find((type) => type.value === value)?.label ||
        "",
      content: "", // Reset content when changing type
    }));

    // Refetch template when type changes
    refetchTemplate();
  };

  const handleInputChange = (field: string, value: string) => {
    // Special handling for rating field
    if (field === "rate") {
      // Allow empty string for clearing the field
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
        return;
      }

      // Parse and validate numeric input
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        toast.error("Rating must be a valid number");
        return;
      }

      if (numValue < 0) {
        toast.error("Rating cannot be less than 0");
        return;
      }

      if (numValue > 100) {
        toast.error("Rating cannot exceed 100");
        return;
      }

      // Update with validated value
      setFormData((prev) => ({
        ...prev,
        [field]: numValue.toString(),
      }));
    } else {
      // Normal handling for other fields
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter evaluation name");
      return;
    }

    if (!formData.type) {
      toast.error("Please select document type");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter evaluation content");
      return;
    }

    if (!stageId) {
      toast.error("Stage ID is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get reviewer ID with fallback mechanism
      let reviewerId = user?.id;
      if (!reviewerId) {
        try {
          const accountInfo = await getMyAccountInfo();
          reviewerId = accountInfo?.id;
        } catch (error) {
          console.error("Failed to get account info:", error);
        }
      }

      // Prepare API request data according to the required format
      const rate = formData.rate ? parseInt(formData.rate) : 0;

      // Additional validation for rating
      if (formData.rate && (rate < 0 || rate > 100)) {
        toast.error("Rating must be between 0 and 100");
        return;
      }

      // Base data for both create and update
      const baseData = {
        name: formData.name.trim(),
        "total-rate": rate,
        comment: formData.content.trim() || formData.name.trim(),
        "reviewer-result": true,
        "is-ai-report": false,
      };

      // For create: include foreign keys
      const createData = {
        ...baseData,
        "evaluation-stage-id": stageId,
        "reviewer-id": reviewerId || "",
      };

      // For update: only base data (no foreign keys)
      const updateData = baseData;

      // Additional validation
      if (!baseData.name) {
        toast.error("Name cannot be empty");
        return;
      }
      // This validation is now handled above, but keep as backup
      if (rate < 0 || rate > 100) {
        toast.error("Rating must be between 0 and 100");
        return;
      }

      // Validation for create mode only
      if (!isEditMode) {
        if (!stageId) {
          toast.error("Stage ID is missing");
          return;
        }
        if (!reviewerId) {
          toast.error("Unable to identify user - please login again");
          return;
        }
      }

      const currentData = isEditMode ? updateData : createData;

      console.log("Mode:", isEditMode ? "Edit" : "Create");
      console.log("API data:", currentData);
      console.log("Data types:", {
        name: typeof currentData.name,
        "total-rate": typeof currentData["total-rate"],
        comment: typeof currentData.comment,
        "reviewer-result": typeof currentData["reviewer-result"],
        "is-ai-report": typeof currentData["is-ai-report"],
      });

      // Check if content contains images (base64)
      const hasImages = currentData.comment.includes("data:image/");
      const imageCount = (currentData.comment.match(/data:image\//g) || [])
        .length;
      console.log("Content analysis:", {
        hasImages,
        imageCount,
        contentSizeKB: Math.round(currentData.comment.length / 1024),
        contentPreview: currentData.comment.substring(0, 200) + "...",
      });

      // Real API call - Create or Update based on mode
      let response;
      if (isEditMode && individualId) {
        response = await updateIndividualEvaluation(individualId, updateData);
        console.log("Individual evaluation updated successfully:", response);
        toast.success("Individual evaluation updated successfully!");
      } else {
        response = await createIndividualEvaluation(createData);
        console.log("Individual evaluation created successfully:", response);
        toast.success("Individual evaluation created successfully!");
      }

      navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} individual evaluation:`,
        error
      );
      console.error(
        "Error details:",
        (error as Error & { response?: { data?: unknown } })?.response?.data
      );
      console.error(
        "Error status:",
        (error as Error & { response?: { status?: number } })?.response?.status
      );

      const axiosError = error as Error & {
        response?: {
          data?: { message?: string; error?: string };
        };
      };

      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        `An error occurred while ${
          isEditMode ? "updating" : "creating"
        } the evaluation`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
  };

  // Show loading spinner
  if (isTemplateLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? "Loading evaluation data..." : "Loading template..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stage
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode
              ? "Edit Individual Evaluation"
              : "Create Individual Evaluation"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Edit the individual evaluation for this stage"
              : "Create a new individual evaluation for this stage"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Basic information about the evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select onValueChange={handleTypeChange} value={formData.type}>
                <SelectTrigger
                  className={`${!formData.type ? "border-red-200" : ""}`}
                >
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {EVALUATION_DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.type && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a document type
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Evaluation Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter evaluation name..."
                required
              />
            </div>

            {/* Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Rating (0-100)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) => handleInputChange("rate", e.target.value)}
                  placeholder="Enter rating (0-100)..."
                />
              </div>
            </div>

            {/* Template Status */}
            {formData.type && (
              <div className="pt-2 border-t">
                {isTemplateLoading ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      🔄 Loading template for {formData.type}...
                    </p>
                  </div>
                ) : templateData?.data?.["data-list"]?.length ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✓ Template loaded for {formData.type}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      ⚠️ No template available for {formData.type}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Content *</CardTitle>
            <CardDescription>
              Write detailed evaluation content using the editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {!formData.type && (
                <div className="mb-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    Select Document Type First
                  </p>
                  <p className="text-sm text-gray-500">
                    Choose a document type to load the appropriate template
                  </p>
                </div>
              )}
              <ScientificCVEditor
                ref={editorRef}
                value={formData.content}
                onChange={(content: string) =>
                  handleInputChange("content", content)
                }
                height={500}
                placeholder={
                  formData.type
                    ? "Enter detailed evaluation content..."
                    : "Please select document type first..."
                }
                readOnly={!formData.type || isTemplateLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.type || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Evaluation" : "Create Evaluation"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateIndividualEvaluationPage;
