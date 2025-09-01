import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, Save, FileText, Star, Bot } from "lucide-react";
import { useCreateIndividualEvaluation } from "@/hooks/queries/evaluation";
import {
  useCreateDocumentByIndividualEvaluation,
  useUpdateDocument,
} from "@/hooks/queries/document";
import { useDocumentsByFilter } from "@/hooks/queries/document";
import {
  useGetIndividualEvaluationById,
  useGetIndividualEvaluationsByStageId,
} from "@/hooks/queries/evaluation";
import { useAuth } from "@/contexts";
import { TinyMCEEditor } from "@/components/ui/TinyMCE";
import { AIEvaluationDisplay } from "@/components/ui/ai-evaluation-display";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Document types available for individual evaluation
const EVALUATION_DOCUMENT_TYPES = [
  { value: "BM4", label: "Individual Evaluation Form (BM4)" },
  { value: "BM10", label: "Project Evaluation Report (BM10)" },
  { value: "BM11", label: "Technical Review Form (BM11)" },
  { value: "BM12", label: "Final Assessment Report (BM12)" },
];

interface EvaluationForm {
  name: string;
  "total-rate": number | null;
  comment: string;
  "reviewer-result": boolean;
  "is-ai-report": boolean;
  status: string;
  "evaluation-stage-id": string;
  "document-type": string;
}

const CreateIndividualEvaluationPage: React.FC = () => {
  const { evaluationId, stageId, individualId } = useParams<{
    evaluationId: string;
    stageId: string;
    individualId?: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine if this is edit mode
  const isEditMode = Boolean(individualId);

  // Get individual evaluation data if in edit mode
  const { data: existingEvaluation } = useGetIndividualEvaluationById(
    individualId || ""
  );

  // Get AI evaluations for reference in create mode
  const { data: aiEvaluationsData } = useGetIndividualEvaluationsByStageId(
    stageId || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [evaluationContent, setEvaluationContent] = useState("");
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    name: "",
    "total-rate": null,
    comment: "",
    "reviewer-result": false,
    "is-ai-report": false,
    status: "created",
    "evaluation-stage-id": stageId || "",
    "document-type": "BM4",
  });

  // Get template data for evaluation document type
  const { data: templateData } = useDocumentsByFilter(
    evaluationForm["document-type"] || "BM4", // evaluation document type
    true, // is template
    1, // page index
    10, // page size
    true, // enabled
    "created" // status
  );

  const createIndividualEvaluationMutation = useCreateIndividualEvaluation();
  const createDocumentMutation = useCreateDocumentByIndividualEvaluation();
  const updateDocumentMutation = useUpdateDocument();

  // Load existing evaluation data if in edit mode
  useEffect(() => {
    if (isEditMode && existingEvaluation) {
      const data = existingEvaluation;
      setEvaluationForm({
        name: data.name || "",
        "total-rate": data["total-rate"] || null,
        comment: data.comment || "",
        "reviewer-result": Boolean(data["reviewer-result"]) || false,
        "is-ai-report": data["is-ai-report"] || false,
        status: data.status || "created",
        "evaluation-stage-id": data["evaluation-stage-id"] || stageId || "",
        "document-type": "BM4", // Default to BM4 for edit mode
      });

      // Load existing document content if available
      if (data.documents && data.documents.length > 0) {
        const firstDocument = data.documents[0];
        if (firstDocument["content-html"]) {
          setEvaluationContent(firstDocument["content-html"]);
        }
      }
    }
  }, [existingEvaluation, isEditMode, stageId]);

  // Load template content when templateData is available (only in create mode)
  useEffect(() => {
    if (
      !isEditMode &&
      templateData?.data?.["data-list"]?.[0]?.["content-html"]
    ) {
      const templateContent = templateData.data["data-list"][0]["content-html"];
      setEvaluationContent(templateContent);
    }
  }, [templateData, isEditMode]);

  // Update evaluation stage id when available
  useEffect(() => {
    if (stageId) {
      setEvaluationForm((prev) => ({
        ...prev,
        "evaluation-stage-id": stageId,
      }));
    }
  }, [stageId]);

  const handleInputChange = (
    field: keyof EvaluationForm,
    value: string | number | boolean | null
  ) => {
    setEvaluationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setEvaluationForm((prev) => ({
      ...prev,
      "document-type": value,
      name:
        EVALUATION_DOCUMENT_TYPES.find((type) => type.value === value)?.label ||
        "",
    }));
  };

  const handleSubmit = async () => {
    if (!stageId) {
      console.error("Evaluation stage ID not found");
      return;
    }

    // Validation cho total rate
    if (evaluationForm["total-rate"] !== null) {
      if (
        evaluationForm["total-rate"] < 0 ||
        evaluationForm["total-rate"] > 100
      ) {
        toast.error("Score must be between 0 and 100!");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isEditMode && individualId) {
        // Edit mode: Only update document content, keep evaluation unchanged
        if (
          existingEvaluation?.documents &&
          existingEvaluation.documents.length > 0
        ) {
          const firstDocument = existingEvaluation.documents[0];
          await updateDocumentMutation.mutateAsync({
            id: firstDocument.id,
            name: firstDocument.name, // Keep original name
            type: firstDocument.type, // Keep original type
            "is-template": firstDocument["is-template"], // Keep original template status
            status: firstDocument.status, // Keep original status
            "content-html": evaluationContent || firstDocument["content-html"], // Only update content
            "project-id": firstDocument["project-id"], // Keep original project link if any
            "individual-evaluation-id":
              firstDocument["individual-evaluation-id"], // Keep original evaluation link
          });

          console.log("Document content updated:", firstDocument.id);
          toast.success("Evaluation document updated successfully!");
        } else {
          toast.error("No document found to update");
        }
      } else {
        // Create mode: Create new evaluation
        // Step 1: Create Individual Evaluation
        const individualEvaluationResponse =
          await createIndividualEvaluationMutation.mutateAsync({
            ...evaluationForm,
            "total-rate": evaluationForm["total-rate"] || 0,
            comment: evaluationForm.comment || "",
            "evaluation-stage-id": stageId,
            "reviewer-id": user?.id || "",
          });

        // Step 2: Create Document by Individual Evaluation ID with content from TinyMCE
        const documentResponse = await createDocumentMutation.mutateAsync({
          name: evaluationForm.name || "Individual Evaluation Document",
          type: evaluationForm["document-type"],
          "is-template": false,
          status: "created",
          "content-html":
            evaluationContent ||
            `<html lang="en"><head><meta charset="UTF-8" /></head><body><p>Default evaluation content</p></body></html>`,
          "individual-evaluation-id": individualEvaluationResponse.id,
        });

        console.log(
          "Individual Evaluation created:",
          individualEvaluationResponse.id
        );
        console.log("Document created:", documentResponse.id);

        toast.success("Individual evaluation created successfully!");
      }

      // Navigate back to evaluation stage
      navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
    } catch (error) {
      console.error("Error processing evaluation:", error);
      toast.error(
        isEditMode ? "Failed to update document" : "Failed to create evaluation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`)
            }
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {isEditMode
                ? "Edit Individual Evaluation"
                : "Create Individual Evaluation"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? "View detailed evaluation for this stage"
                : "Create a detailed evaluation for this stage"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Star className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Evaluation Details
              </h3>
              <p className="text-sm text-gray-500">
                {isEditMode
                  ? "Evaluation information"
                  : "Provide evaluation information"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document Type - Only show in create mode */}
            {!isEditMode && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Document Type *
                </Label>
                <Select
                  value={evaluationForm["document-type"]}
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVALUATION_DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Evaluation Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Evaluation Name *
              </Label>
              <Input
                value={evaluationForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter evaluation name"
                className="mt-1"
                readOnly={isEditMode}
              />
            </div>

            {/* Total Rate */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Total Rate (0-100) *
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={
                  evaluationForm["total-rate"] !== null &&
                  evaluationForm["total-rate"] !== undefined
                    ? evaluationForm["total-rate"]
                    : ""
                }
                onChange={(e) => {
                  if (isEditMode) return; // Disable editing in view mode

                  const value = e.target.value;

                  if (value === "") {
                    handleInputChange("total-rate", null);
                    return;
                  }

                  const numValue = parseInt(value, 10);

                  if (isNaN(numValue)) {
                    return;
                  }

                  if (numValue > 100) {
                    toast.error("Score cannot exceed 100!");
                    return;
                  }
                  if (numValue < 0) {
                    toast.error("Score must be greater than or equal to 0!");
                    return;
                  }

                  handleInputChange("total-rate", numValue);
                }}
                onKeyDown={(e) => {
                  if (isEditMode) return;

                  // Prevent typing if current value would exceed 100
                  if (e.key >= "0" && e.key <= "9") {
                    const currentValue = evaluationForm["total-rate"] || 0;
                    const newValue = parseInt(
                      currentValue.toString() + e.key,
                      10
                    );
                    if (newValue > 100) {
                      e.preventDefault();
                      toast.error("Score cannot exceed 100!");
                    }
                  }
                }}
                placeholder="Enter total rate (e.g., 85)"
                className="mt-1"
                readOnly={isEditMode}
              />
            </div>

            {/* Reviewer Result */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Reviewer Result *
              </Label>
              <Select
                value={evaluationForm["reviewer-result"] ? "true" : "false"}
                onValueChange={(value) =>
                  handleInputChange("reviewer-result", value === "true")
                }
                disabled={isEditMode}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Approve</SelectItem>
                  <SelectItem value="false">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Short Comment Field - Full width */}
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700">
              Short Comment *
            </Label>
            <textarea
              value={evaluationForm.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              placeholder="Enter short comment (about 2–3 sentences)"
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
              readOnly={isEditMode}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !evaluationForm.name ||
                evaluationForm["total-rate"] === null ||
                evaluationForm["total-rate"] === undefined ||
                !stageId
              }
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium rounded-xl px-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Evaluation" : "Submit Evaluation"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Evaluation Content - Full width */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Detailed Evaluation
                </h3>
                <p className="text-sm text-gray-500">
                  {isEditMode
                    ? "Evaluation content"
                    : "Create your comprehensive evaluation"}
                </p>
              </div>
            </div>

            {/* AI Reference Button - Only show in create mode */}
            {!isEditMode &&
              aiEvaluationsData?.["data-list"] &&
              aiEvaluationsData["data-list"].filter(
                (evaluation) => evaluation["is-ai-report"] === true
              ).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIPopup(true)}
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="font-medium">AI Reference</span>
                  <span className="ml-2 bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {
                      aiEvaluationsData["data-list"].filter(
                        (evaluation) => evaluation["is-ai-report"] === true
                      ).length
                    }
                  </span>
                </Button>
              )}
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Evaluation Document *
            </Label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <TinyMCEEditor
                value={evaluationContent}
                onChange={setEvaluationContent}
                height={600}
                placeholder="Create your comprehensive evaluation document. Include analysis, findings, recommendations, and detailed feedback..."
                readOnly={isEditMode}
              />
            </div>
          </div>
        </div>

        {/* AI Reference Dialog */}
        <Dialog open={showAIPopup} onOpenChange={setShowAIPopup}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI Reference
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">
                    AI-generated evaluations to guide your assessment
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              {aiEvaluationsData?.["data-list"]
                ?.filter((evaluation) => evaluation["is-ai-report"] === true)
                .map((aiEvaluation) => (
                  <div
                    key={aiEvaluation.id}
                    className="border border-purple-200 rounded-lg overflow-hidden bg-gradient-to-r from-purple-50/50 to-indigo-50/50 hover:from-purple-100/50 hover:to-indigo-100/50 transition-all duration-200"
                  >
                    <AIEvaluationDisplay
                      content={
                        aiEvaluation.comment || "No AI analysis available"
                      }
                      title={aiEvaluation.name}
                      score={aiEvaluation["total-rate"]}
                      status={aiEvaluation.status}
                      submittedAt={aiEvaluation["submitted-at"]}
                      compact={false}
                    />
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateIndividualEvaluationPage;
