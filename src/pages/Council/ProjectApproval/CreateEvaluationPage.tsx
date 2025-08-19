import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
// import { Editor } from "@tinymce/tinymce-react";
import { ArrowLeft, Save, FileText, Star } from "lucide-react";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import { useCreateIndividualEvaluation } from "@/hooks/queries/evaluation";
import { useCreateDocumentByIndividualEvaluation } from "@/hooks/queries/document";
import { useDocumentsByFilter } from "@/hooks/queries/document";
import { useAuth } from "@/contexts";
import { TinyMCEEditor } from "@/components/ui/TinyMCE";
import { toast } from "sonner";

interface EvaluationForm {
  name: string;
  "total-rate": number | null;
  comment: string;
  "reviewer-result": boolean;
  "is-ai-report": boolean;
  status: string;
  "evaluation-stage-id": string;
}

export const CreateEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const { user } = useAuth();

  const { data: evaluationData } = useGetEvaluationsByProjectId(
    proposalId || ""
  );

  // Get template data for evaluation document type
  const { data: templateData } = useDocumentsByFilter(
    "BM3", // evaluation document type
    true, // is template
    1, // page index
    10, // page size
    true, // enabled
    "created" // status
  );

  const evaluation = evaluationData?.["data-list"];
  const evaluationStageId = evaluation?.[0]?.["evaluation-stages"]?.[0]?.id;

  const createIndividualEvaluationMutation = useCreateIndividualEvaluation();
  const createDocumentMutation = useCreateDocumentByIndividualEvaluation();

  const [isLoading, setIsLoading] = useState(false);
  const [evaluationContent, setEvaluationContent] = useState("");
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    name: "",
    "total-rate": null as any,
    comment: "",
    "reviewer-result": false,
    "is-ai-report": false,
    status: "created",
    "evaluation-stage-id": evaluationStageId || "",
  });

  // Load template content when templateData is available
  useEffect(() => {
    if (templateData?.data?.["data-list"]?.[0]?.["content-html"]) {
      const templateContent = templateData.data["data-list"][0]["content-html"];
      setEvaluationContent(templateContent);
    }
  }, [templateData]);

  // Update evaluation stage id when available
  useEffect(() => {
    if (evaluationStageId) {
      setEvaluationForm((prev) => ({
        ...prev,
        "evaluation-stage-id": evaluationStageId,
      }));
    }
  }, [evaluationStageId]);

  const handleInputChange = (
    field: keyof EvaluationForm,
    value: string | number | boolean | null
  ) => {
    setEvaluationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!evaluationStageId) {
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
      // Step 1: Create Individual Evaluation
      const individualEvaluationResponse =
        await createIndividualEvaluationMutation.mutateAsync({
          ...evaluationForm,
          "total-rate": evaluationForm["total-rate"] || 0,
          comment: evaluationContent || "No evaluation content provided", // Sử dụng TinyMCE content làm comment
          "evaluation-stage-id": evaluationStageId,
          "reviewer-id": user?.id || "",
        });

      // Step 2: Create Document by Individual Evaluation ID with content from TinyMCE
      const documentResponse = await createDocumentMutation.mutateAsync({
        name: "Feedback Science Research Document",
        type: "BM3",
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

      // Navigate back to proposal detail
      navigate(`/council/project-approval/proposal/${proposalId}`);
    } catch (error) {
      console.error("Error creating evaluation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveDraft = async () => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call for saving draft
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     console.log("Saving draft:", {
  //       ...evaluationForm,
  //       contentHtml: evaluationContent,
  //     });

  //     // Show success message or stay on page
  //   } catch (error) {
  //     console.error("Error saving draft:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-4 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/council/project-approval/proposal/${proposalId}`)
            }
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposal
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Individual Evaluation
            </h1>
            <p className="text-gray-600 mt-1">
              Create a detailed evaluation for proposal #{proposalId}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Form Fields */}
          <div className="lg:col-span-1 space-y-4">
            {/* Scoring */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Star className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Evaluation Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Provide evaluation information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Evaluation Name *
                  </Label>
                  <Input
                    value={evaluationForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter evaluation name"
                    className="mt-1"
                  />
                </div>

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
                        : 0
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        handleInputChange("total-rate", 0); // luôn mặc định là 0
                      } else {
                        const numValue = parseInt(value, 10);

                        if (numValue > 100) {
                          toast.error("Score must be between 0 and 100!");
                          return;
                        }
                        if (numValue < 0) {
                          toast.error(
                            "Score must be greater than or equal to 0!"
                          );
                          return;
                        }

                        handleInputChange("total-rate", numValue);
                      }
                    }}
                    placeholder="Enter total rate (e.g., 85)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Reviewer Result *
                  </Label>
                  <Select
                    value={evaluationForm["reviewer-result"] ? "true" : "false"}
                    onValueChange={(value) =>
                      handleInputChange("reviewer-result", value === "true")
                    }
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
            </div>

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    !evaluationForm.name ||
                    evaluationForm["total-rate"] === null ||
                    evaluationForm["total-rate"] === undefined ||
                    !evaluationStageId
                  }
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit Evaluation
                    </>
                  )}
                </Button>

                {/* <Button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button> */}
              </div>
            </div>
          </div>

          {/* Main Content - Evaluation Form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Evaluation Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detailed Evaluation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Provide comprehensive evaluation using the rich text editor
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Evaluation Document *
                </Label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={evaluationContent}
                    onEditorChange={(content: string) =>
                      setEvaluationContent(content)
                    }
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }} */}
                  <TinyMCEEditor
                    value={evaluationContent}
                    onChange={setEvaluationContent}
                    height={400}
                    placeholder="Create your comprehensive evaluation document. Include analysis, findings, recommendations, and detailed feedback..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvaluationPage;
