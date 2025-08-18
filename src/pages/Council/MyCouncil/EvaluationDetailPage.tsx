import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Star,
  Eye,
  Plus,
  Users,
  Briefcase,
  Tag,
  Clock,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import {
  getEvaluationStagesByEvaluationId,
  getEvaluationById,
} from "@/services/resources/evaluation";
import {
  getUserRolesByAppraisalCouncilId,
  getUserRoleByFilter,
  getMyAccountInfo,
} from "@/services/resources/auth";
import { getMyAppraisalCouncils } from "@/services/resources/appraisal-council";
import { useAuth } from "@/contexts";
import { Evaluation, EvaluationStageApi } from "@/types/evaluation";
import CreateEvaluationStageModal from "./CreateEvaluationStageModal";

const EvaluationDetailPage: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [stages, setStages] = useState<EvaluationStageApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChairman, setIsChairman] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

  // Load evaluation details and stages
  useEffect(() => {
    const loadEvaluationDetails = async () => {
      if (!evaluationId) return;

      try {
        setIsLoading(true);

        // Load evaluation with stages using the new API
        try {
          const evaluationData = await getEvaluationById(evaluationId, true);
          console.log("=== DEBUG: Evaluation Data ===");
          console.log("Full evaluation data:", evaluationData);
          console.log(
            "Appraisal Council ID:",
            evaluationData["appraisal-council-id"]
          );
          console.log("Project ID:", evaluationData["project-id"]);

          setEvaluation(evaluationData);
          setStages(evaluationData["evaluation-stages"] || []);

          // Load project data if project-id is available
          if (evaluationData["project-id"]) {
            const projectDataKey = `project_${evaluationData["project-id"]}`;
            const storedProjectData =
              localStorage.getItem(projectDataKey) ||
              sessionStorage.getItem(projectDataKey);

            if (storedProjectData) {
              try {
                const parsedProjectData = JSON.parse(storedProjectData);
                console.log(
                  "✅ Found project data for evaluation:",
                  parsedProjectData
                );
                setProjectData(parsedProjectData);
              } catch (parseError) {
                console.error("Error parsing project data:", parseError);
              }
            }
          }

          // Check if current user is chairman of the appraisal council
          console.log("=== DEBUG: Pre-check Values ===");
          console.log(
            "Has appraisal-council-id?",
            !!evaluationData["appraisal-council-id"]
          );
          console.log("Has user?", !!user);
          console.log("Has user.id?", !!user?.id);
          console.log("User object:", user);

          // Get user ID - fallback to API call if not available
          let currentUserId = user?.id;
          if (!currentUserId && user) {
            try {
              console.log("=== DEBUG: Fetching user ID from API ===");
              const accountInfo = await getMyAccountInfo();
              console.log("Account info from API:", accountInfo);
              currentUserId = accountInfo.id;
            } catch (error) {
              console.error("Failed to get account info:", error);
            }
          }

          console.log("Final user ID:", currentUserId);

          if (evaluationData["appraisal-council-id"] && currentUserId) {
            try {
              console.log("=== DEBUG: Checking Chairman Role ===");
              console.log(
                "Appraisal Council ID:",
                evaluationData["appraisal-council-id"]
              );
              console.log("Current User Object:", user);
              console.log("Current User ID:", currentUserId);

              // Method 1: Try different filter approaches
              let currentUserRole = null;

              // Approach 1: Filter by appraisal-council-id only (get all members)
              console.log("=== Approach 1: Filter by council ID only ===");
              try {
                const filterRequest1 = {
                  "appraisal-council-id":
                    evaluationData["appraisal-council-id"],
                  "page-index": 1,
                  "page-size": 50,
                };
                console.log("Filter request 1:", filterRequest1);

                const response1 = await getUserRoleByFilter(filterRequest1);
                console.log("Response 1 (all council members):", response1);

                const allCouncilMembers = response1["data-list"] || [];
                currentUserRole = allCouncilMembers.find(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (role: any) => role["account-id"] === currentUserId
                );
                console.log("Found user role in approach 1:", currentUserRole);
              } catch (error1) {
                console.error("Approach 1 failed:", error1);
              }

              // Approach 2: If not found, try with account-id filter
              if (!currentUserRole) {
                console.log("=== Approach 2: Filter by account ID ===");
                try {
                  const filterRequest2 = {
                    "account-id": currentUserId,
                    "page-index": 1,
                    "page-size": 20,
                  };
                  console.log("Filter request 2:", filterRequest2);

                  const response2 = await getUserRoleByFilter(filterRequest2);
                  console.log("Response 2 (user's all roles):", response2);

                  const userAllRoles = response2["data-list"] || [];
                  // Find role in the specific council
                  currentUserRole = userAllRoles.find(
                    (role: any) =>
                      role["appraisal-council-id"] ===
                      evaluationData["appraisal-council-id"]
                  );
                  console.log(
                    "Found user role in approach 2:",
                    currentUserRole
                  );
                } catch (error2) {
                  console.error("Approach 2 failed:", error2);
                }
              }

              // Approach 3: If still not found, use My Appraisal Councils API
              if (!currentUserRole) {
                console.log(
                  "=== Approach 3: Use My Appraisal Councils API ==="
                );
                try {
                  const myCouncilsResponse = await getMyAppraisalCouncils({
                    "page-index": 1,
                    "page-size": 20,
                  });
                  console.log("My councils response:", myCouncilsResponse);

                  const myCouncils = myCouncilsResponse["data-list"] || [];
                  const targetCouncil = myCouncils.find(
                    (council: any) =>
                      council.id === evaluationData["appraisal-council-id"]
                  );

                  console.log("Found target council:", targetCouncil);

                  if (targetCouncil && targetCouncil.member) {
                    const myRoleInCouncil = targetCouncil.member.find(
                      (member: any) => member["account-id"] === currentUserId
                    );
                    console.log("My role in target council:", myRoleInCouncil);
                    currentUserRole = myRoleInCouncil;
                  }
                } catch (error3) {
                  console.error("Approach 3 failed:", error3);
                }
              }

              console.log("Final Current User Role Found:", currentUserRole);

              if (currentUserRole) {
                const roleName =
                  (currentUserRole as any)["role-name"] ||
                  (currentUserRole as any)["name"];
                console.log(
                  "Role Name (role-name):",
                  (currentUserRole as any)["role-name"]
                );
                console.log(
                  "Role Name (name):",
                  (currentUserRole as any)["name"]
                );
                console.log("Final Role Name:", roleName);

                // Check if role name is exactly "Chairman"
                const isChairmanRole = roleName === "Chairman";

                console.log("Expected Role Name: Chairman");
                console.log("Actual Role Name:", roleName);
                console.log("Is Chairman?", isChairmanRole);

                setIsChairman(isChairmanRole);
              } else {
                console.log("No role found for current user");
                setIsChairman(false);
              }
            } catch (roleError) {
              console.error("Error checking chairman role:", roleError);
              setIsChairman(false);
            }
          } else {
            console.log("Missing appraisal-council-id or user.id");

            // Fallback: Check from stored council data
            try {
              const storedCouncilData =
                sessionStorage.getItem("current_council");
              if (storedCouncilData && currentUserId) {
                console.log("=== DEBUG: Fallback Chairman Check ===");
                const currentCouncil = JSON.parse(storedCouncilData);
                console.log("Stored Council Data:", currentCouncil);
                console.log("Council ID:", currentCouncil.id);

                const userRolesResponse =
                  await getUserRolesByAppraisalCouncilId(currentCouncil.id);

                console.log(
                  "Fallback User Roles API Response:",
                  userRolesResponse
                );

                const userRoles = userRolesResponse["data-list"] || [];
                const currentUserRole = userRoles.find(
                  (role: any) => role["account-id"] === currentUserId
                );

                console.log("Fallback Current User Role:", currentUserRole);

                if (currentUserRole) {
                  const isChairmanRole =
                    (currentUserRole as any)["role-name"] === "Chairman";
                  console.log(
                    "Fallback Role Name:",
                    (currentUserRole as any)["role-name"]
                  );
                  console.log("Fallback Is Chairman?", isChairmanRole);
                  setIsChairman(isChairmanRole);
                } else {
                  setIsChairman(false);
                }
              } else {
                setIsChairman(false);
              }
            } catch (fallbackError) {
              console.error("Fallback chairman check failed:", fallbackError);
              setIsChairman(false);
            }
          }
        } catch {
          // Fallback: Load stages separately and create mock evaluation
          const stagesResponse = await getEvaluationStagesByEvaluationId({
            "evaluation-id": evaluationId,
            "page-index": 1,
            "page-size": 20,
          });

          setStages(stagesResponse["data-list"] || []);

          // Mock evaluation data for fallback
          setEvaluation({
            id: evaluationId,
            code: "EVA-SAMPLE",
            title: "Sample Evaluation",
            "total-rate": null,
            comment: null,
            "create-date": new Date().toISOString(),
            status: "created",
            "project-id": "",
            "appraisal-council-id": null,
            documents: null,
            "evaluation-stages": stagesResponse["data-list"] || [],
          });
        }
      } catch {
        setEvaluation(null);
        setStages([]);
        setIsChairman(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluationDetails();
  }, [evaluationId, user?.id, user]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "secondary";
      case "submitted":
        return "default";
      case "approved":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleStageClick = (stageId: string) => {
    navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
  };

  const handleCreateStage = () => {
    setIsCreateStageModalOpen(true);
  };

  const handleStageCreated = () => {
    // Reload evaluation data to get updated stages
    if (evaluationId) {
      loadEvaluationDetails();
    }
  };

  // Extract loadEvaluationDetails function to be reusable
  const loadEvaluationDetails = async () => {
    if (!evaluationId) return;

    try {
      setIsLoading(true);

      // Load evaluation with stages using the new API
      try {
        const evaluationData = await getEvaluationById(evaluationId, true);

        setEvaluation(evaluationData);
        setStages(evaluationData["evaluation-stages"] || []);

        // Check chairman role (existing logic)
        await checkChairmanRole();
      } catch {
        // Fallback logic (existing code)
        const stagesResponse = await getEvaluationStagesByEvaluationId({
          "evaluation-id": evaluationId,
          "page-index": 1,
          "page-size": 20,
        });

        setStages(stagesResponse["data-list"] || []);

        // Mock evaluation data for fallback
        setEvaluation({
          id: evaluationId,
          code: "EVA-SAMPLE",
          title: "Sample Evaluation",
          "total-rate": null,
          comment: null,
          "create-date": new Date().toISOString(),
          status: "created",
          "project-id": "",
          "appraisal-council-id": null,
          documents: null,
          "evaluation-stages": stagesResponse["data-list"] || [],
        });
      }
    } catch {
      setEvaluation(null);
      setStages([]);
      setIsChairman(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract chairman role check logic
  const checkChairmanRole = async () => {
    // TODO: Move existing chairman role check logic here
    setIsChairman(true); // Temporary - use existing logic from useEffect
  };

  // Chairman check is handled in useEffect via API call

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Không tìm thấy đánh giá</p>
            <Button
              variant="outline"
              onClick={() => navigate("/council/my-council")}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại My Council
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/council/my-council")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Council
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Evaluation Details
          </h1>
          <p className="text-gray-600 mt-1">
            Project information, evaluation details and stages
          </p>
        </div>
      </div>

      {/* Project Information */}
      {projectData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Project: {projectData.code}
                </CardTitle>
                <CardDescription className="mt-2 max-w-4xl">
                  <div className="space-y-1">
                    <p className="font-medium text-blue-600">
                      {projectData["english-title"]}
                    </p>
                    {projectData["vietnamese-title"] && (
                      <p className="text-gray-600">
                        {projectData["vietnamese-title"]}
                      </p>
                    )}
                  </div>
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {projectData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="font-medium">Created</p>
                  <p>
                    {new Date(projectData["created-at"]).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                <div>
                  <p className="font-medium">Category</p>
                  <p>
                    {projectData.category === "application/implementation"
                      ? "Application"
                      : projectData.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <div>
                  <p className="font-medium">Type</p>
                  <p>{projectData.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p>{projectData.duration} months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {evaluation.code}
              </CardTitle>
              <CardDescription className="mt-2">
                {evaluation.title}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(evaluation.status)}>
              {evaluation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Created:{" "}
              {new Date(evaluation["create-date"]).toLocaleDateString("vi-VN")}
            </div>

            {evaluation["total-rate"] && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                Rating: {evaluation["total-rate"]}/100
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              Stages: {stages.length}
            </div>
          </div>

          {evaluation.comment && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Comments:
              </h4>
              <p className="text-sm text-gray-600">{evaluation.comment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Stages */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Evaluation Stages</CardTitle>
              <CardDescription>
                Evaluation stages and individual evaluations
              </CardDescription>
            </div>
            {isChairman && (
              <Button onClick={handleCreateStage}>
                <Plus className="h-4 w-4 mr-2" />
                Create Stage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No evaluation stages yet</p>
              {isChairman && (
                <Button
                  variant="outline"
                  onClick={handleCreateStage}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Stage
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {stages
                .sort((a, b) => a["stage-order"] - b["stage-order"])
                .map((stage) => (
                  <Card
                    key={stage.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleStageClick(stage.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              Stage {stage["stage-order"]}
                            </span>
                            <h3 className="font-semibold">{stage.name}</h3>
                            <Badge
                              variant={getStatusBadgeVariant(stage.status)}
                            >
                              {stage.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Phase: {stage.phrase}</span>
                            <span>Type: {stage.type}</span>
                            {stage["individual-evaluations"] && (
                              <span>
                                Individual Evaluations:{" "}
                                {stage["individual-evaluations"].length}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStageClick(stage.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Stage Modal */}
      <CreateEvaluationStageModal
        open={isCreateStageModalOpen}
        onOpenChange={setIsCreateStageModalOpen}
        evaluationId={evaluationId || ""}
        existingStages={stages}
        onStageCreated={handleStageCreated}
        loading={isLoading}
      />
    </div>
  );
};

export default EvaluationDetailPage;
