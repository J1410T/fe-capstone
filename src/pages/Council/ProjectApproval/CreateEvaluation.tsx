import React, { useState, useRef } from "react";
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
import { ArrowLeft, Save, FileText, User } from "lucide-react";
import { toast } from "sonner";

interface CreateEvaluationFormData {
  evaluatorName: string;
  evaluatorRole: string;
  recommendation: "approve" | "reject" | "revise" | "pending";
  overallComments: string;
  evaluationContent: string;
}

type EditorInstance = { getContent: () => string } | null;

const CreateEvaluation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stageId = searchParams.get("stageId");
  const stageName = searchParams.get("stageName") || "Evaluation Stage";

  const [formData, setFormData] = useState<CreateEvaluationFormData>({
    evaluatorName: "",
    evaluatorRole: "",
    recommendation: "pending",
    overallComments: "",
    evaluationContent: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const handleInputChange = (
    field: keyof CreateEvaluationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      evaluationContent: content,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Get content from editor
      const editorContent =
        editorRef.current?.getContent() || formData.evaluationContent;

      // Validate required fields
      if (!formData.evaluatorName.trim()) {
        toast.error("Evaluator name is required");
        return;
      }

      if (!formData.evaluatorRole.trim()) {
        toast.error("Evaluator role is required");
        return;
      }

      if (!editorContent.trim()) {
        toast.error("Evaluation content is required");
        return;
      }

      // Create evaluation object
      const newEvaluation = {
        ...formData,
        evaluationContent: editorContent,
        stageId,
        submittedAt: new Date().toISOString(),
        status: "completed",
        totalScore: 0,
        maxTotalScore: 50,
        criteria: [],
        lastUpdated: new Date().toISOString(),
      };

      console.log("Creating new evaluation:", newEvaluation);

      // TODO: Replace with actual API call
      // await createEvaluationAPI(newEvaluation);

      toast.success("Evaluation created successfully!");

      // Navigate back to the evaluation stage
      navigate(-1);
    } catch (error) {
      console.error("Failed to create evaluation:", error);
      toast.error("Failed to create evaluation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="container mx-auto py-8 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {stageName}
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Create New Evaluation
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new evaluation for {stageName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Evaluation"}
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Evaluator Information
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="evaluatorName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Evaluator Name *
                  </Label>
                  <Input
                    id="evaluatorName"
                    value={formData.evaluatorName}
                    onChange={(e) =>
                      handleInputChange("evaluatorName", e.target.value)
                    }
                    placeholder="Enter evaluator name"
                    className="h-11 bg-white/50 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="evaluatorRole"
                    className="text-sm font-medium text-gray-700"
                  >
                    Evaluator Role *
                  </Label>
                  <Input
                    id="evaluatorRole"
                    value={formData.evaluatorRole}
                    onChange={(e) =>
                      handleInputChange("evaluatorRole", e.target.value)
                    }
                    placeholder="e.g., Senior Research Council Member"
                    className="h-11 bg-white/50 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="recommendation"
                  className="text-sm font-medium text-gray-700"
                >
                  Recommendation
                </Label>
                <Select
                  value={formData.recommendation}
                  onValueChange={(value) =>
                    handleInputChange("recommendation", value)
                  }
                >
                  <SelectTrigger className="h-11 bg-white/50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Select recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="revise">Revise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="overallComments"
                  className="text-sm font-medium text-gray-700"
                >
                  Overall Comments
                </Label>
                <Textarea
                  id="overallComments"
                  value={formData.overallComments}
                  onChange={(e) =>
                    handleInputChange("overallComments", e.target.value)
                  }
                  placeholder="Enter overall comments about the proposal"
                  rows={3}
                  className="bg-white/50 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl resize-none"
                />
              </div>
            </div>
          </div>

          {/* Evaluation Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Detailed Evaluation Report *
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Evaluation Content
                </Label>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <Editor
                    apiKey={apiKey}
                    onInit={(_evt, editor) => {
                      editorRef.current = editor;
                    }}
                    initialValue={
                      formData.evaluationContent ||
                      `
                      <h3>Evaluation Report</h3>
                      <h4>Executive Summary</h4>
                      <p>Please provide your overall assessment of the proposal...</p>
                      
                      <h4>Strengths</h4>
                      <ul>
                        <li>List key strengths of the proposal</li>
                      </ul>
                      
                      <h4>Areas for Improvement</h4>
                      <ul>
                        <li>List areas that need improvement</li>
                      </ul>
                      
                      <h4>Recommendation</h4>
                      <p>Provide your final recommendation and reasoning...</p>
                    `
                    }
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style: `
                        body { 
                          font-family: 'Merriweather', serif; 
                          font-size: 14px; 
                          line-height: 1.6;
                          padding: 16px;
                        }
                        p { margin-bottom: 12px; }
                        h1, h2, h3, h4, h5, h6 { margin-top: 16px; margin-bottom: 8px; }
                      `,
                    }}
                    onEditorChange={handleEditorChange}
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

export default CreateEvaluation;
