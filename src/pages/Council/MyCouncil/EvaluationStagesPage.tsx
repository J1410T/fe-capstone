import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Users,
  Plus,
  FileText,
  Calendar,
  Star,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/auth-types";
import { Loading } from "@/components/ui/loaders";
import { councilApi } from "./api";
import { Evaluation } from "@/types/evaluation-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EvaluationComment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  "created-at": string;
  "author-role": string;
  evaluationId: string;
}

const EvaluationStagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, evaluationId } = useParams<{
    projectId: string;
    evaluationId: string;
  }>();
  const { user } = useAuth();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluationComments, setEvaluationComments] = useState<
    EvaluationComment[]
  >([]);
  const [newEvaluationComment, setNewEvaluationComment] = useState("");
  const [createStageOpen, setCreateStageOpen] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      console.log("EvaluationStagesPage - params:", {
        projectId,
        evaluationId,
      });

      if (evaluationId) {
        try {
          setLoading(true);
          console.log("Fetching evaluation detail for:", evaluationId);
          const data = await councilApi.getEvaluationDetail(evaluationId);
          console.log("Evaluation data received:", data);
          setEvaluation(data);

          // Fetch evaluation comments
          const comments = await councilApi.getEvaluationComments(evaluationId);
          setEvaluationComments(comments);
        } catch (error) {
          console.error("Error fetching evaluation:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No evaluationId provided");
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [evaluationId, projectId]);

  const handleBackToMilestones = () => {
    navigate(`/council/project-milestones/${projectId}`);
  };

  const handleViewIndividualEvaluation = (
    stageId: string,
    individualId: string
  ) => {
    navigate(
      `/council/individual-evaluation/${projectId}/${evaluationId}/${stageId}/${individualId}`
    );
  };

  const handleCreateIndividualEvaluation = (stageId: string) => {
    navigate(
      `/council/create-individual-evaluation/${projectId}/${evaluationId}/${stageId}`
    );
  };

  const handleAddEvaluationComment = async () => {
    if (!newEvaluationComment.trim() || !evaluationId) return;

    try {
      const comment = await councilApi.addEvaluationComment({
        content: newEvaluationComment,
        evaluationId,
        authorId: user?.id || "",
        authorName: user?.name || "Anonymous",
      });

      setEvaluationComments((prev) => [...prev, comment]);
      setNewEvaluationComment("");
    } catch (error) {
      console.error("Error adding evaluation comment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "created":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800">Approved</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Pending</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCreateEvaluations = user?.role === UserRole.APPRAISAL_COUNCIL;

  if (loading) {
    return (
      <div className="container mx-auto py-4 space-y-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loading className="w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-4 space-y-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Evaluation not found</p>
            <Button onClick={handleBackToMilestones}>Back to Milestones</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-4 max-w-6xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={handleBackToMilestones}
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Milestones
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
                  {evaluation.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {evaluation.code} • Created:{" "}
                  {formatDate(evaluation["create-date"])}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getStatusColor(evaluation.status)}
              >
                {evaluation.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Evaluation Comments Section */}
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg text-gray-900">
                  💬 Evaluation Comments
                </CardTitle>
                <CardDescription className="text-gray-600">
                  General comments about this evaluation (
                  {evaluationComments.length} comments)
                </CardDescription>
              </div>
            </div>
            {canCreateEvaluations && (
              <Button
                onClick={() => setCreateStageOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Evaluation Stage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Existing Comments */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {evaluationComments.map((comment) => (
              <div key={comment.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-blue-900 text-sm">
                    {comment.author}
                  </span>
                  <span className="text-blue-600 text-xs">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                <p className="text-blue-800 text-sm">{comment.content}</p>
              </div>
            ))}
            {evaluationComments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet
              </p>
            )}
          </div>

          {/* Add New Comment */}
          {canCreateEvaluations && (
            <div className="flex gap-2">
              <Textarea
                value={newEvaluationComment}
                onChange={(e) => setNewEvaluationComment(e.target.value)}
                placeholder="Add a comment about this evaluation..."
                rows={2}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleAddEvaluationComment}
                size="sm"
                disabled={!newEvaluationComment.trim()}
                className="text-sm px-3"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Stages */}
      <div className="space-y-4">
        {evaluation["evaluation-stages"].length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">
                  No evaluation stages found
                </p>
                <p className="text-sm text-gray-500">
                  This evaluation doesn't have any stages yet
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          evaluation["evaluation-stages"].map((stage) => (
            <Card key={stage.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">🏆 {stage.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Stage {stage["stage-order"]} • {stage.phrase} •{" "}
                        {(stage["individual-evaluations"] || []).length}{" "}
                        individual evaluation(s)
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canCreateEvaluations && (
                      <Button
                        onClick={() =>
                          handleCreateIndividualEvaluation(stage.id)
                        }
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Individual Evaluation
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Individual Evaluations */}
                {
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Individual Evaluations (
                        {(stage["individual-evaluations"] || []).length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {(stage["individual-evaluations"] || []).map(
                        (individual) => (
                          <Card
                            key={individual.id}
                            className="group cursor-pointer border bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            onClick={() =>
                              handleViewIndividualEvaluation(
                                stage.id,
                                individual.id
                              )
                            }
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 group-hover:text-blue-700 text-sm">
                                    {individual.name}
                                  </h5>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(individual["submitted-at"])}
                                    </span>
                                    {individual["total-rate"] && (
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        {individual["total-rate"]}/10
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getStatusColor(
                                      individual.status
                                    )}`}
                                  >
                                    {individual.status}
                                  </Badge>
                                  {getApprovalBadge(individual["is-approved"])}
                                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-3" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                }
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Evaluation Stage Dialog */}
      <CreateStageDialog
        evaluationId={evaluationId || ""}
        isOpen={createStageOpen}
        onClose={() => setCreateStageOpen(false)}
        onStageCreated={() => {
          // Refresh evaluation data
          if (evaluationId) {
            councilApi.getEvaluationDetail(evaluationId).then(setEvaluation);
          }
        }}
      />
    </div>
  );
};

// Create Stage Dialog Component
interface CreateStageDialogProps {
  evaluationId: string;
  isOpen: boolean;
  onClose: () => void;
  onStageCreated: () => void;
}

const CreateStageDialog: React.FC<CreateStageDialogProps> = ({
  evaluationId,
  isOpen,
  onClose,
  onStageCreated,
}) => {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [type, setType] = useState("review");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await councilApi.createEvaluationStage({
        name,
        phrase,
        type,
        evaluationId,
      });

      onStageCreated();
      setName("");
      setPhrase("");
      setType("review");
      onClose();
    } catch (error) {
      console.error("Error creating evaluation stage:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Evaluation Stage</DialogTitle>
          <DialogDescription>
            Add a new stage to this evaluation. Each stage can contain multiple
            individual evaluations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stage-name">Stage Name</Label>
            <Input
              id="stage-name"
              placeholder="e.g., Technical Review, Final Assessment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage-phrase">Stage Phrase</Label>
            <Input
              id="stage-phrase"
              placeholder="e.g., Technical Analysis, Final Recommendation"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage-type">Stage Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Stage</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationStagesPage;
