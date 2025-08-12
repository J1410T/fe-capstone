import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, FileText } from "lucide-react";

const CreateIndividualEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, stageId } = useParams<{
    projectId: string;
    stageId: string;
  }>();

  const [formData, setFormData] = useState({
    evaluatorName: "",
    evaluatorEmail: "",
    totalRate: "",
    comment: "",
    reviewerResult: true,
    isAIReport: false,
  });

  const handleGoBack = () => {
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create individual evaluation
    console.log("Creating individual evaluation:", formData);

    // For now, just navigate back
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stage
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Individual Evaluation
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Add a new individual evaluation for this evaluation stage
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Evaluator Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Evaluator Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evaluator Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.evaluatorName}
                      onChange={(e) =>
                        handleInputChange("evaluatorName", e.target.value)
                      }
                      placeholder="Enter evaluator name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evaluator Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.evaluatorEmail}
                      onChange={(e) =>
                        handleInputChange("evaluatorEmail", e.target.value)
                      }
                      placeholder="Enter evaluator email"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Evaluation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Evaluation Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Score (0-100)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.totalRate}
                    onChange={(e) =>
                      handleInputChange("totalRate", e.target.value)
                    }
                    placeholder="Enter initial score (optional)"
                    className="w-full md:w-48"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty if evaluator will provide score later
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Comments
                  </label>
                  <Textarea
                    value={formData.comment}
                    onChange={(e) =>
                      handleInputChange("comment", e.target.value)
                    }
                    placeholder="Enter any initial comments (optional)"
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Evaluation Options
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.reviewerResult}
                      onChange={(e) =>
                        handleInputChange("reviewerResult", e.target.checked)
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Require reviewer approval
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isAIReport}
                      onChange={(e) =>
                        handleInputChange("isAIReport", e.target.checked)
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      AI-assisted evaluation
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Evaluation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateIndividualEvaluationPage;
