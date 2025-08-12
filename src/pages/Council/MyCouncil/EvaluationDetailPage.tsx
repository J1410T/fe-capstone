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
  FileText,
  Users,
  Bot,
  User,
  Plus,
  MessageCircle,
  Edit3,
  Save,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loaders";
import { Evaluation, EvaluationStageApi, IndividualEvaluationApi } from "@/types/evaluation-api";
import { councilApi } from "./api";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  individualEvaluationId: string;
}

interface IndividualEvaluationFormData {
  name: string;
  content: string;
  stageId: string;
}

const EvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, evaluationId } = useParams<{ projectId: string; evaluationId: string }>();
  const { user } = useAuth();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [createIndividualOpen, setCreateIndividualOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [editingDocument, setEditingDocument] = useState<{ [key: string]: boolean }>({});
  const [documentContent, setDocumentContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEvaluationDetail = async () => {
      if (evaluationId) {
        try {
          setLoading(true);
          const data = await councilApi.getEvaluationDetail(evaluationId);
          setEvaluation(data);
          
          // Initialize document content for each individual evaluation
          if (data?.["evaluation-stages"]) {
            const content: { [key: string]: string } = {};
            data["evaluation-stages"].forEach((stage: EvaluationStageApi) => {
              stage["individual-evaluations"]?.forEach((individual: IndividualEvaluationApi) => {
                content[individual.id] = individual.comment || "";
              });
            });
            setDocumentContent(content);
          }
        } catch (error) {
          console.error("Error fetching evaluation detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvaluationDetail();
  }, [evaluationId]);

  const handleBackToMilestones = () => {
    navigate(`/council/project-milestones/${projectId}`);
  };

  const handleCreateIndividualEvaluation = async (data: IndividualEvaluationFormData) => {
    try {
      await councilApi.createIndividualEvaluation({
        ...data,
        evaluationId: evaluationId!,
        reviewerId: user?.id || "",
      });
      
      // Refresh evaluation detail
      if (evaluationId) {
        const updatedEvaluation = await councilApi.getEvaluationDetail(evaluationId);
        setEvaluation(updatedEvaluation);
      }
      
      setCreateIndividualOpen(false);
    } catch (error) {
      console.error("Error creating individual evaluation:", error);
    }
  };

  const handleAddComment = async (individualEvaluationId: string) => {
    const commentText = newComment[individualEvaluationId];
    if (!commentText?.trim()) return;

    try {
      const comment = await councilApi.addComment({
        content: commentText,
        individualEvaluationId,
        authorId: user?.id || "",
        authorName: user?.name || "Anonymous",
      });

      // Add comment to local state
      setComments(prev => ({
        ...prev,
        [individualEvaluationId]: [...(prev[individualEvaluationId] || []), comment],
      }));

      // Clear input
      setNewComment(prev => ({
        ...prev,
        [individualEvaluationId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditDocument = (individualId: string) => {
    setEditingDocument(prev => ({ ...prev, [individualId]: true }));
  };

  const handleSaveDocument = async (individualId: string) => {
    // In a real implementation, this would call an API to save the document
    console.log("Saving document for individual:", individualId, "Content:", documentContent[individualId]);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEditingDocument(prev => ({ ...prev, [individualId]: false }));
    
    // Here you would typically call an API to update the individual evaluation content
    // await updateIndividualEvaluationContent(individualId, documentContent[individualId]);
  };

  const handleCancelEdit = (individualId: string) => {
    // Reset content to original
    if (evaluation?.["evaluation-stages"]) {
      evaluation["evaluation-stages"].forEach(stage => {
        const individual = stage["individual-evaluations"]?.find(ind => ind.id === individualId);
        if (individual) {
          setDocumentContent(prev => ({
            ...prev,
            [individualId]: individual.comment || "",
          }));
        }
      });
    }
    setEditingDocument(prev => ({ ...prev, [individualId]: false }));
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

  const getApprovalBadge = (isApproved: boolean, reviewerResult: string | null) => {
    if (isApproved) {
      if (reviewerResult === "approved_with_conditions") {
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Approved with Conditions
          </Badge>
        );
      }
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Not Approved</Badge>;
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

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loading className="w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-6 space-y-6">
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
      {/* Back Button - Smaller */}
      <div className="flex items-center">
        <Button
          onClick={handleBackToMilestones}
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Milestones
        </Button>
      </div>

      {/* Header - More Compact */}
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
                  {evaluation.code} • {formatDate(evaluation["create-date"])}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={getStatusColor(evaluation.status)}
            >
              {evaluation.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Evaluation Stages - More Compact */}
      <div className="space-y-4">
        {evaluation["evaluation-stages"].length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      No evaluation stages found
                    </p>
                    <p className="text-sm text-gray-500">
                      This evaluation doesn't have any stages yet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          evaluation["evaluation-stages"].map((stage) => (
            <Card key={stage.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Stage {stage["stage-order"]} • {stage.phrase}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(stage.status)}
                    >
                      {stage.status}
                    </Badge>
                    <Button
                      onClick={() => {
                        setSelectedStageId(stage.id);
                        setCreateIndividualOpen(true);
                      }}
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Evaluation
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                {(stage["individual-evaluations"] || []).length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-3 text-sm">No individual evaluations yet</p>
                    <Button
                      onClick={() => {
                        setSelectedStageId(stage.id);
                        setCreateIndividualOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create First Evaluation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(stage["individual-evaluations"] || []).map((individual) => (
                      <Card key={individual.id} className="border border-gray-100 bg-gray-50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {individual["is-ai-report"] ? (
                                <Bot className="h-5 w-5 text-purple-600" />
                              ) : (
                                <User className="h-5 w-5 text-blue-600" />
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {individual.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {formatDate(individual["submitted-at"])}
                                  {individual["total-rate"] && (
                                    <span className="ml-2">
                                      Rate: <span className="font-semibold">{individual["total-rate"]}/10</span>
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusColor(individual.status)}`}
                              >
                                {individual.status}
                              </Badge>
                              {getApprovalBadge(
                                individual["is-approved"],
                                individual["reviewer-result"] as string | null
                              )}
                              {individual["is-ai-report"] && (
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-600 border-purple-200 text-xs"
                                >
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                          {/* Document Content - More Compact */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium text-gray-700">
                                Document Content
                              </Label>
                              {!individual["is-ai-report"] && (
                                <div className="flex gap-1">
                                  {editingDocument[individual.id] ? (
                                    <>
                                      <Button
                                        onClick={() => handleSaveDocument(individual.id)}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 px-2 text-xs"
                                      >
                                        <Save className="h-3 w-3 mr-1" />
                                        Save
                                      </Button>
                                      <Button
                                        onClick={() => handleCancelEdit(individual.id)}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 px-2 text-xs"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      onClick={() => handleEditDocument(individual.id)}
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-xs"
                                    >
                                      <Edit3 className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {editingDocument[individual.id] ? (
                              <div className="space-y-1">
                                <Textarea
                                  value={documentContent[individual.id] || ""}
                                  onChange={(e) => setDocumentContent(prev => ({
                                    ...prev,
                                    [individual.id]: e.target.value,
                                  }))}
                                  placeholder="Enter your evaluation content..."
                                  rows={6}
                                  className="min-h-[120px] text-xs"
                                />
                                <p className="text-xs text-gray-500">
                                  Note: In real implementation, this would be TinyMCE editor.
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 bg-white rounded border max-h-40 overflow-y-auto">
                                <div 
                                  className="prose prose-xs max-w-none text-gray-700"
                                  dangerouslySetInnerHTML={{ 
                                    __html: documentContent[individual.id] || individual.comment || "No content available" 
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Comments Section - More Compact */}
                          <div className="space-y-2 border-t pt-3">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-gray-600" />
                              <Label className="text-xs font-medium text-gray-700">
                                Comments ({(comments[individual.id] || []).length})
                              </Label>
                            </div>

                            {/* Existing Comments */}
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {(comments[individual.id] || []).map((comment) => (
                                <div key={comment.id} className="p-2 bg-blue-50 rounded text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-blue-900">
                                      {comment.author}
                                    </span>
                                    <span className="text-blue-600">
                                      {formatDate(comment.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-blue-800">{comment.content}</p>
                                </div>
                              ))}
                            </div>

                            {/* Add New Comment */}
                            <div className="flex gap-1">
                              <Textarea
                                value={newComment[individual.id] || ""}
                                onChange={(e) => setNewComment(prev => ({
                                  ...prev,
                                  [individual.id]: e.target.value,
                                }))}
                                placeholder="Add a comment..."
                                rows={2}
                                className="flex-1 text-xs"
                              />
                              <Button
                                onClick={() => handleAddComment(individual.id)}
                                size="sm"
                                disabled={!newComment[individual.id]?.trim()}
                                className="text-xs px-2"
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Individual Evaluation Dialog */}
      <CreateIndividualEvaluationDialog
        stageId={selectedStageId}
        isOpen={createIndividualOpen}
        onClose={() => setCreateIndividualOpen(false)}
        onSubmit={handleCreateIndividualEvaluation}
      />
    </div>
  );
};

// Create Individual Evaluation Dialog Component
interface CreateIndividualEvaluationDialogProps {
  stageId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IndividualEvaluationFormData) => void;
}

const CreateIndividualEvaluationDialog: React.FC<CreateIndividualEvaluationDialogProps> = ({
  stageId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, content, stageId });
    setName("");
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Individual Evaluation</DialogTitle>
          <DialogDescription>
            Create a new individual evaluation with document content and comments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Evaluation Name</Label>
            <Input
              id="name"
              placeholder="Enter evaluation name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter evaluation content (in real implementation, this would be TinyMCE)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
            <p className="text-xs text-gray-500">
              Note: In a real implementation, this would be a TinyMCE rich text editor for creating rich documents.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationDetailPage;
