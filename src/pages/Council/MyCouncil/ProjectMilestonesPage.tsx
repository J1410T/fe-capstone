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
import {
  ArrowLeft,
  Target,
  Plus,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/auth-types";
import { Loading } from "@/components/ui/loaders";
import { councilApi, ProjectMilestone } from "./api";
import { Evaluation } from "@/types/evaluation-api";

interface CreateEvaluationData {
  title: string;
  code: string;
  projectId: string;
}

const ProjectMilestonesPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [milestoneEvaluations, setMilestoneEvaluations] = useState<{
    [milestoneId: string]: Evaluation[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [createEvaluationOpen, setCreateEvaluationOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("");

  useEffect(() => {
    const fetchMilestones = async () => {
      if (projectId) {
        try {
          setLoading(true);
          const data = await councilApi.getProjectMilestones(projectId);
          setMilestones(data);

          // Fetch evaluations for each milestone
          const evaluationsData: { [milestoneId: string]: Evaluation[] } = {};
          for (const milestone of data) {
            try {
              console.log(
                `Fetching evaluations for milestone: ${milestone.id}`
              );
              const evaluations = await councilApi.getMilestoneEvaluations(
                milestone.id
              );
              console.log(
                `Found ${evaluations.length} evaluations for milestone ${milestone.id}:`,
                evaluations
              );
              evaluationsData[milestone.id] = evaluations;
            } catch (error) {
              console.error(
                `Error fetching evaluations for milestone ${milestone.id}:`,
                error
              );
              evaluationsData[milestone.id] = [];
            }
          }
          console.log("All milestone evaluations:", evaluationsData);
          setMilestoneEvaluations(evaluationsData);
        } catch (error) {
          console.error("Error fetching milestones:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMilestones();
  }, [projectId]);

  const handleBackToProjects = () => {
    navigate("/council/my-council");
  };

  const handleCreateEvaluation = async (data: CreateEvaluationData) => {
    try {
      await councilApi.createEvaluation(selectedMilestoneId, {
        title: data.title,
        code: data.code,
      });
      // Refresh evaluations for the specific milestone
      const updatedEvaluations = await councilApi.getMilestoneEvaluations(
        selectedMilestoneId
      );
      setMilestoneEvaluations((prev) => ({
        ...prev,
        [selectedMilestoneId]: updatedEvaluations,
      }));
      setCreateEvaluationOpen(false);
    } catch (error) {
      console.error("Error creating evaluation:", error);
    }
  };

  const handleViewEvaluation = (projectId: string, evaluationId: string) => {
    console.log("Navigating to evaluation stages:", {
      projectId,
      evaluationId,
    });
    navigate(`/council/evaluation-stages/${projectId}/${evaluationId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div className="container mx-auto py-4 space-y-4 max-w-6xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={handleBackToProjects}
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Header */}
      <Card className="bg-white shadow-sm border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Project Milestones
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Track and evaluate project progress
                </CardDescription>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {milestones.length} milestones
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">
                  No milestones found
                </p>
                <p className="text-sm text-gray-500">
                  This project doesn't have any milestones yet
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          milestones.map((milestone) => (
            <Card key={milestone.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(milestone.status)}
                    <div>
                      <CardTitle className="text-lg">
                        {milestone.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {milestone.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(milestone.status)}
                    >
                      {milestone.status}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {formatDate(milestone["due-date"])}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Evaluations Section */}
                {(milestoneEvaluations[milestone.id] || []).length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      No evaluations yet
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Create an evaluation to track this milestone's progress
                    </p>
                    {canCreateEvaluations && (
                      <Button
                        onClick={() => {
                          setSelectedMilestoneId(milestone.id);
                          setCreateEvaluationOpen(true);
                        }}
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Evaluation
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Evaluations (
                        {(milestoneEvaluations[milestone.id] || []).length})
                      </h4>
                      {canCreateEvaluations && (
                        <Button
                          onClick={() => {
                            setSelectedMilestoneId(milestone.id);
                            setCreateEvaluationOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Evaluation
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      {(milestoneEvaluations[milestone.id] || []).map(
                        (evaluation: Evaluation) => (
                          <Card
                            key={evaluation.id}
                            className="group cursor-pointer border bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            onClick={() =>
                              handleViewEvaluation(projectId!, evaluation.id)
                            }
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 group-hover:text-blue-700 text-sm">
                                    {evaluation.title}
                                  </h5>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span>{evaluation.code}</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(evaluation["create-date"])}
                                    </span>
                                    <span>
                                      {evaluation["evaluation-stages"].length}{" "}
                                      stages
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(
                                    evaluation.status
                                  )}`}
                                >
                                  {evaluation.status}
                                </Badge>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-3" />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Evaluation Dialog */}
      <CreateEvaluationDialog
        milestoneId={selectedMilestoneId}
        projectId={projectId || ""}
        isOpen={createEvaluationOpen}
        onClose={() => setCreateEvaluationOpen(false)}
        onSubmit={handleCreateEvaluation}
      />
    </div>
  );
};

// Create Evaluation Dialog Component
interface CreateEvaluationDialogProps {
  milestoneId: string;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEvaluationData) => void;
}

const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  projectId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, code, projectId });
    setTitle("");
    setCode("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Evaluation</DialogTitle>
          <DialogDescription>
            Create a new evaluation for this milestone to track progress and
            collect feedback.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Evaluation Title</Label>
            <Input
              id="title"
              placeholder="Enter evaluation title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Evaluation Code</Label>
            <Input
              id="code"
              placeholder="Enter evaluation code (e.g., EVAL-2024-001)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Evaluation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestonesPage;
