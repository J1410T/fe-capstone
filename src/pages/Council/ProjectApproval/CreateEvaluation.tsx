import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {stageName}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Evaluation
            </h1>
            <p className="text-gray-600">
              Create a new evaluation for {stageName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Evaluation"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Evaluator Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evaluatorName">Evaluator Name *</Label>
                <Input
                  id="evaluatorName"
                  value={formData.evaluatorName}
                  onChange={(e) =>
                    handleInputChange("evaluatorName", e.target.value)
                  }
                  placeholder="Enter evaluator name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluatorRole">Evaluator Role *</Label>
                <Input
                  id="evaluatorRole"
                  value={formData.evaluatorRole}
                  onChange={(e) =>
                    handleInputChange("evaluatorRole", e.target.value)
                  }
                  placeholder="e.g., Senior Research Council Member"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendation">Recommendation</Label>
              <Select
                value={formData.recommendation}
                onValueChange={(value) =>
                  handleInputChange("recommendation", value)
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="overallComments">Overall Comments</Label>
              <Textarea
                id="overallComments"
                value={formData.overallComments}
                onChange={(e) =>
                  handleInputChange("overallComments", e.target.value)
                }
                placeholder="Enter overall comments about the proposal"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Evaluation Report *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Evaluation Content</Label>
              <div className="border rounded-lg">
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
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvaluation;
