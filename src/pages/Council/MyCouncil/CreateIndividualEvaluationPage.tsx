import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  Star,
  MessageSquare,
  Eye,
  Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TinyMCEEditor, TinyMCEViewer } from "@/components/ui/TinyMCE";
import { councilApi } from "./api";

const CreateIndividualEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, evaluationId, stageId } = useParams<{
    projectId: string;
    evaluationId: string;
    stageId: string;
  }>();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    navigate(`/council/evaluation-stages/${projectId}/${evaluationId}`);
  };

  const handleSaveDraft = async () => {
    if (!stageId || !evaluationId) return;

    try {
      setSaving(true);
      await councilApi.createIndividualEvaluation({
        name,
        content,
        comment,
        rate,
        stageId,
        evaluationId,
        reviewerId: user?.id || "",
      });

      // Navigate back to evaluation stages
      navigate(`/council/evaluation-stages/${projectId}/${evaluationId}`);
    } catch (error) {
      console.error("Error saving individual evaluation:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!stageId || !evaluationId) return;

    try {
      setSubmitting(true);
      const newEvaluation = await councilApi.createIndividualEvaluation({
        name,
        content,
        comment,
        rate,
        stageId,
        evaluationId,
        reviewerId: user?.id || "",
      });

      // Submit the evaluation
      if (newEvaluation.id) {
        await councilApi.submitIndividualEvaluation(newEvaluation.id, {
          rate,
          comment,
          isApproved: rate >= 7, // Auto-approve if rating is 7 or higher
        });
      }

      // Navigate back to evaluation stages
      navigate(`/council/evaluation-stages/${projectId}/${evaluationId}`);
    } catch (error) {
      console.error("Error submitting individual evaluation:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = name.trim() && content.trim() && comment.trim() && rate > 0;

  return (
    <div className="container mx-auto py-4 space-y-4 max-w-6xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Evaluation Stages
        </Button>
      </div>

      {/* Header */}
      <Card className="bg-white shadow-sm border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Create Individual Evaluation
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Create a comprehensive evaluation with document content,
                  comments, and ratings
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {!previewMode ? (
            /* Edit Mode */
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Evaluation Content</CardTitle>
                <CardDescription>
                  Create your detailed evaluation using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Evaluation Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter evaluation name (e.g., Expert Review - Literature Analysis)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Document Content</Label>
                  <div className="mt-1">
                    <TinyMCEEditor
                      value={content}
                      onChange={setContent}
                      height={400}
                      placeholder="Create your comprehensive evaluation document. Include analysis, findings, recommendations, and detailed feedback..."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use the rich text editor to format your evaluation with
                    headings, lists, tables, and images.
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="comment">Evaluation Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Provide a summary comment about this evaluation..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="rate">Rating (0-10)</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input
                      id="rate"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={rate || ""}
                      onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                      className="w-32"
                      placeholder="0.0"
                    />
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{rate}/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Rate the quality and completeness of the work being
                    evaluated.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Preview Mode */
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {name || "Untitled Evaluation"}
                    </CardTitle>
                    <CardDescription>Evaluation Preview</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800"
                    >
                      Draft
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {rate}/10
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Document Content:
                  </p>
                  <div className="border rounded-lg bg-gray-50 p-1">
                    <TinyMCEViewer
                      content={content || "<p><em>No content yet...</em></p>"}
                      height={400}
                      className="rounded-md"
                    />
                  </div>
                </div>

                {comment && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Comment:
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-gray-800 leading-relaxed">
                          {comment}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="w-full"
                disabled={!isValid || saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={handleSubmitEvaluation}
                className="w-full"
                disabled={!isValid || submitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Submitting..." : "Submit Evaluation"}
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Evaluation Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Document Content
                </h4>
                <p className="text-gray-600">
                  Provide comprehensive analysis, findings, and recommendations.
                  Use headings, lists, and formatting for clarity.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Rating Scale</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 9-10: Excellent</li>
                  <li>• 7-8: Good</li>
                  <li>• 5-6: Satisfactory</li>
                  <li>• 3-4: Needs Improvement</li>
                  <li>• 1-2: Poor</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Comments</h4>
                <p className="text-gray-600">
                  Summarize key points, highlight strengths and areas for
                  improvement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Additional Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Upload supporting documents after creating the evaluation.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <Upload className="h-3 w-3 mr-1" />
                Available after creation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateIndividualEvaluationPage;
