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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Star,
  MessageSquare,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/auth-types";
import { Loading } from "@/components/ui/loaders";
import { TinyMCEEditor, TinyMCEViewer } from "@/components/ui/TinyMCE";
import {
  councilApi,
  IndividualEvaluationDetail,
  Document,
  Comment as EvaluationComment,
} from "./api";

interface CommentFormData {
  content: string;
}

interface DocumentUploadData {
  title: string;
  content: string;
}

const IndividualEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, evaluationId, individualId } = useParams<{
    projectId: string;
    evaluationId: string;
    individualId: string;
  }>();
  const { user } = useAuth();

  const [evaluation, setEvaluation] =
    useState<IndividualEvaluationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const [editedRate, setEditedRate] = useState(0);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (individualId) {
        try {
          setLoading(true);
          const data = await councilApi.getIndividualEvaluationDetail(
            individualId
          );
          if (data) {
            setEvaluation(data);
            setEditedContent(data.content);
            setEditedComment(data.comment);
            setEditedRate(data.rate);
          }
        } catch (error) {
          console.error("Error fetching individual evaluation:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvaluation();
  }, [individualId]);

  const handleBackToStages = () => {
    navigate(`/council/evaluation-stages/${projectId}/${evaluationId}`);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset to original values if canceling
      if (evaluation) {
        setEditedContent(evaluation.content);
        setEditedComment(evaluation.comment);
        setEditedRate(evaluation.rate);
      }
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    if (!evaluation || !individualId) return;

    try {
      setSubmitting(true);
      const updatedEvaluation = await councilApi.updateIndividualEvaluation(
        individualId,
        {
          content: editedContent,
          comment: editedComment,
          rate: editedRate,
        }
      );
      setEvaluation(updatedEvaluation);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating evaluation:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (data: CommentFormData) => {
    if (!evaluation) return;

    // Simulate adding comment (in real implementation, this would call an API)
    const newComment: EvaluationComment = {
      id: `comment-${Date.now()}`,
      content: data.content,
      author: user?.name || "Current User",
      timestamp: new Date().toISOString(),
      "created-at": new Date().toISOString(),
      "author-role": user?.role || UserRole.RESEARCHER,
      individualEvaluationId: evaluation.id,
    };

    setEvaluation({
      ...evaluation,
      comments: [...evaluation.comments, newComment],
    });

    setCommentDialogOpen(false);
  };

  const handleAddDocument = async (data: DocumentUploadData) => {
    if (!evaluation) return;

    // Simulate adding document (in real implementation, this would call an API)
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: data.title,
      content: data.content,
      "created-at": new Date().toISOString(),
      "individual-evaluation-id": evaluation.id,
      author: user?.name || "Current User",
      type: "tinymce",
    };

    setEvaluation({
      ...evaluation,
      documents: [...evaluation.documents, newDocument],
    });

    setDocumentDialogOpen(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canEdit =
    user?.role === UserRole.STAFF && evaluation?.status !== "completed";

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
            <p className="text-red-600 mb-4">Individual evaluation not found</p>
            <Button onClick={handleBackToStages}>Back to Stages</Button>
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
          onClick={handleBackToStages}
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
                  {evaluation.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Created: {formatDate(evaluation["created-at"])} • Submitted:{" "}
                  {formatDate(evaluation["submitted-at"])}
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
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 text-yellow-500" />
                {evaluation.rate}/10
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Evaluation Content */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Evaluation Content</CardTitle>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    {editMode ? (
                      <>
                        <Button
                          onClick={handleSaveChanges}
                          size="sm"
                          disabled={submitting}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={handleEditToggle}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleEditToggle}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">Document Content</Label>
                    <div className="mt-1">
                      <TinyMCEEditor
                        value={editedContent}
                        onChange={setEditedContent}
                        height={400}
                        placeholder="Enter evaluation document content using the rich text editor..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Rating (0-10)</Label>
                    <Input
                      id="rate"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editedRate}
                      onChange={(e) =>
                        setEditedRate(parseFloat(e.target.value) || 0)
                      }
                      className="mt-1 w-32"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <TinyMCEViewer
                    content={evaluation.content}
                    height={400}
                    className="rounded-md"
                  />
                  {evaluation.comment && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Comment:
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                          {evaluation.comment}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">
                    Comments ({evaluation.comments.length})
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {evaluation.comments.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No comments yet
                  </p>
                  <p className="text-xs text-gray-500">Start the discussion</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {evaluation.comments.map((comment) => (
                    <Card key={comment.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {comment.author}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {comment["author-role"]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(comment["created-at"])}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Comment Dialog */}
      <AddCommentDialog
        isOpen={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        onSubmit={handleAddComment}
      />

      {/* Add Document Dialog */}
      <AddDocumentDialog
        isOpen={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        onSubmit={handleAddDocument}
      />
    </div>
  );
};

// Add Comment Dialog Component
interface AddCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommentFormData) => void;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content });
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add a comment to this evaluation for discussion or feedback.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Enter your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Comment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add Document Dialog Component
interface AddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentUploadData) => void;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Create a new document with TinyMCE content for this evaluation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Document Content</Label>
            <TinyMCEEditor
              value={content}
              onChange={setContent}
              height={300}
              placeholder="Create your evaluation document using the rich text editor..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IndividualEvaluationDetailPage;
