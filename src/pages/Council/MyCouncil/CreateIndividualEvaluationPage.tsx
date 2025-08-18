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
// Select components removed - using Input for rating instead
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
    content: "",
    rate: "",
    comment: "",
    status: "created",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get BM3 template for individual evaluation
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    refetch: refetchTemplate,
  } = useDocumentsByFilter("BM3", true, 1, 1, false);

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

  // Fetch template on component mount
  useEffect(() => {
    refetchTemplate();
  }, [refetchTemplate]);

  // Load template content when available (only for Create mode)
  useEffect(() => {
    if (
      !isEditMode && // Only load template in create mode
      !isTemplateLoading &&
      templateData?.data?.["data-list"]?.[0]?.["content-html"]
    ) {
      const templateContent = templateData.data["data-list"][0]["content-html"];
      setFormData((prev) => ({
        ...prev,
        content: templateContent,
      }));
    }
  }, [templateData, isTemplateLoading, isEditMode]);

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
              <ScientificCVEditor
                ref={editorRef}
                value={formData.content}
                onChange={(content: string) =>
                  handleInputChange("content", content)
                }
                height={500}
                placeholder="Enter detailed evaluation content..."
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
            <Button type="submit" disabled={isSubmitting}>
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
