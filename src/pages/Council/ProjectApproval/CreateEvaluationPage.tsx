import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@tinymce/tinymce-react";
import { ArrowLeft, Save, FileText, Star } from "lucide-react";

interface EvaluationForm {
  evaluatorName: string;
  evaluatorRole: string;
  evaluationType: string;
  score: number | null;
  totalRate: number | null;
  evaluationContent: string;
  recommendation: string;
  comments: string;
}

export const CreateEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");

  const [isLoading, setIsLoading] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    evaluatorName: "",
    evaluatorRole: "",
    evaluationType: "",
    score: null,
    totalRate: null,
    evaluationContent: "",
    recommendation: "",
    comments: "",
  });

  const handleInputChange = (
    field: keyof EvaluationForm,
    value: string | number | null
  ) => {
    setEvaluationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Creating evaluation:", evaluationForm);

      // Navigate back to proposal detail
      navigate(`/council/project-approval/proposal/${proposalId}`);
    } catch (error) {
      console.error("Error creating evaluation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for saving draft
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving draft:", evaluationForm);

      // Show success message or stay on page
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Individual Evaluation
            </h1>
            <p className="text-gray-600 mt-1">
              Create a detailed evaluation for proposal #{proposalId}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Form Fields */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scoring */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Evaluation Scoring
                  </h3>
                  <p className="text-sm text-gray-500">
                    Provide scores and ratings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Individual Score (0-10)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={evaluationForm.score || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "score",
                        parseFloat(e.target.value) || null
                      )
                    }
                    placeholder="Enter score (e.g., 8.5)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Total Rate (0-10)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={evaluationForm.totalRate || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "totalRate",
                        parseFloat(e.target.value) || null
                      )
                    }
                    placeholder="Enter total rate (e.g., 8.5)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Recommendation *
                  </Label>
                  <Select
                    value={evaluationForm.recommendation}
                    onValueChange={(value) =>
                      handleInputChange("recommendation", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approve">Approve</SelectItem>
                      <SelectItem value="Approve with Minor Revisions">
                        Approve with Minor Revisions
                      </SelectItem>
                      <SelectItem value="Major Revisions Required">
                        Major Revisions Required
                      </SelectItem>
                      <SelectItem value="Reject">Reject</SelectItem>
                      <SelectItem value="Conditional Approval">
                        Conditional Approval
                      </SelectItem>
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
                    !evaluationForm.evaluatorName ||
                    !evaluationForm.evaluatorRole ||
                    !evaluationForm.evaluationType ||
                    !evaluationForm.recommendation
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

                <Button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Evaluation Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Evaluation Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
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
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={evaluationForm.evaluationContent}
                    onEditorChange={(content: string) =>
                      handleInputChange("evaluationContent", content)
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
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Additional Comments
                  </h3>
                  <p className="text-sm text-gray-500">
                    Provide specific feedback and suggestions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Comments & Feedback *
                </Label>
                <Textarea
                  value={evaluationForm.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  placeholder="Enter detailed comments, suggestions, and feedback about the proposal..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Provide constructive feedback that will help improve the
                  proposal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvaluationPage;
