import React, { useState } from "react";
import { TinyMCEViewer } from "@/components/ui/TinyMCE";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EnrollmentData } from "../index";
import { useParams, useNavigate } from "react-router-dom";
import { useUserRolesByProjectId, useAllRoles } from "@/hooks/queries/useAuth";
import {
  useDocumentByProjectIdWithUserRole,
  useUpdateDocument,
} from "@/hooks/queries/document";
import { useProject, useUpdateProject } from "@/hooks/queries/project";
import { TeamMember, UserRole } from "@/types/auth";
import { DocumentWithUserRole } from "@/types/document";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Crown,
  User,
  Send,
  FileText,
  Eye,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCreateFirstEvaluation } from "@/hooks/queries/evaluation";

interface ReviewSubmitStepProps {
  enrollmentData: EnrollmentData;
  projectTitle: string;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  enrollmentData,
  projectTitle,
  onPrevious,
  isSubmitting,
}) => {
  const { bm1Content } = enrollmentData;
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Fetch project data
  const { data: projectResponse } = useProject(projectId || "");
  const project = projectResponse?.data?.["project-detail"];

  // Mutation hooks
  const updateProjectMutation = useUpdateProject();
  const updateDocumentMutation = useUpdateDocument();
  const createFirstEvaluationMutation = useCreateFirstEvaluation();

  const handleProjectSubmission = async () => {
    if (!projectId || !project) {
      toast.error("Project information not found");
      return;
    }

    setIsSubmittingProject(true);
    try {
      // 1. Update project status to 'submitted'
      const projectUpdateData = {
        "english-title": project["english-title"],
        "vietnamese-title": project["vietnamese-title"],
        abbreviations: project.abbreviations,
        duration: project.duration,
        "start-date": project["start-date"],
        "end-date": project["end-date"],
        description: project.description,
        "requirement-note": project["requirement-note"],
        "maximum-member": project["maximum-member"] || 1,
        language: project.language,
        category: project.category,
        type: project.type,
        genre: project.genre,
      };

      console.log("Updating project...");
      await updateProjectMutation.mutateAsync({
        projectId,
        data: projectUpdateData,
        status: "submitted",
      });
      console.log("Project updated successfully");

      // 2. Update all documents to 'submitted' status
      if (documentsWithUserRole?.["data-list"]) {
        console.log(
          "Updating documents...",
          documentsWithUserRole["data-list"].length,
          "documents"
        );

        // Update documents one by one instead of Promise.all for better error handling
        const updateResults = [];
        for (const doc of documentsWithUserRole["data-list"]) {
          try {
            console.log(`Updating document ${doc.id} (${doc.type})`);
            const result = await updateDocumentMutation.mutateAsync({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              "is-template": doc["is-template"],
              "content-html": doc["content-html"],
              status: "submitted",
              "project-id": doc["project-id"],
            });
            updateResults.push({ success: true, docId: doc.id, result });
            console.log(`Document ${doc.id} updated successfully`);
          } catch (docError) {
            console.error(`Failed to update document ${doc.id}:`, docError);
            updateResults.push({
              success: false,
              docId: doc.id,
              error: docError,
            });
            // Continue with other documents instead of failing completely
          }
        }

        // Check if any documents failed to update
        const failedUpdates = updateResults.filter((r) => !r.success);
        if (failedUpdates.length > 0) {
          console.warn(
            `${failedUpdates.length} documents failed to update:`,
            failedUpdates
          );
          toast.warning(
            `Project submitted but ${failedUpdates.length} documents may need manual review`
          );
        } else {
          console.log("All documents updated successfully");
        }
      } else {
        console.log("No documents to update");
      }

      try {
        console.log("Creating first evaluation...");
        const evaluationResult =
          await createFirstEvaluationMutation.mutateAsync(projectId);
        console.log(
          "First evaluation created successfully:",
          evaluationResult.evaluationId
        );
      } catch (evaluationError) {
        console.error("Failed to create first evaluation:", evaluationError);
        toast.warning(
          "Project submitted successfully, but evaluation creation failed"
        );
        // Don't throw here as the main submission was successful
      }

      // 3. Show success toast and navigate to Project Detail
      toast.success("Project submitted successfully!");
      navigate(`/pi/project/${projectId}`);
    } catch (error) {
      console.error("Failed to submit project:", error);
      toast.error("Failed to submit project. Please try again.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Fetch user roles by project ID
  const { data: userRolesResponse } = useUserRolesByProjectId(
    projectId || "",
    1,
    100
  );

  // Fetch all roles to map role-id to role names
  const { data: allRoles } = useAllRoles();

  // Fetch documents with user role information
  const { data: documentsWithUserRole } = useDocumentByProjectIdWithUserRole(
    {
      "is-template": false,
      status: "draft",
      "page-index": 1,
      "page-size": 100,
      "project-id": projectId || "",
    },
    !!projectId
  );

  // Process team members from UserRole data
  const processedTeamMembers = React.useMemo(() => {
    if (!userRolesResponse?.["data-list"] || !allRoles) return [];

    // Group user roles by account-id
    const userRolesByAccount: Record<string, UserRole[]> = {};
    userRolesResponse["data-list"].forEach((userRole: UserRole) => {
      if (userRole.status === "approved") {
        const accountId = userRole["account-id"];
        if (!userRolesByAccount[accountId]) {
          userRolesByAccount[accountId] = [];
        }
        userRolesByAccount[accountId].push(userRole);
      }
    });

    // Process each account and prioritize roles
    const teamMembers: TeamMember[] = [];
    Object.entries(userRolesByAccount).forEach(([accountId, userRoles]) => {
      if (userRoles.length === 0) return;

      // Find role names for all user roles
      const rolesWithNames = userRoles.map((userRole) => {
        const role = allRoles.find((r) => r.id === userRole["role-id"]);
        return {
          ...userRole,
          roleName: role?.name || "Researcher",
        };
      });

      // Prioritize roles: Leader > Secretary > Researcher
      let selectedRole = rolesWithNames.find((r) => r.roleName === "Leader");
      if (!selectedRole) {
        selectedRole = rolesWithNames.find((r) => r.roleName === "Secretary");
      }
      if (!selectedRole) {
        selectedRole = rolesWithNames.find((r) => r.roleName === "Researcher");
      }
      if (!selectedRole) {
        selectedRole = rolesWithNames[0]; // Fallback to first role
      }

      teamMembers.push({
        id: accountId,
        accountId: accountId,
        name: selectedRole["full-name"] || "",
        email: selectedRole.email || "",
        avatar: selectedRole["avatar-url"] || "",
        role: selectedRole.roleName,
        status: selectedRole.status,
      });
    });

    return teamMembers;
  }, [userRolesResponse, allRoles]);

  // Get BM1 document for View Register dialog
  const bm1Document = React.useMemo(() => {
    if (!documentsWithUserRole?.["data-list"]) return null;
    return documentsWithUserRole["data-list"].find((doc) => doc.type === "BM1");
  }, [documentsWithUserRole]);

  // Get CV documents mapped by account-id
  const cvDocumentsByAccount = React.useMemo(() => {
    if (!documentsWithUserRole?.["data-list"]) return {};
    const cvDocs: Record<string, DocumentWithUserRole> = {};
    documentsWithUserRole["data-list"].forEach((doc) => {
      if (doc.type === "BM2" && doc["account-id"]) {
        cvDocs[doc["account-id"]] = doc;
      }
    });
    return cvDocs;
  }, [documentsWithUserRole]);

  const getRoleIcon = (role: "Leader" | "Researcher" | "Secretary") => {
    switch (role) {
      case "Leader":
        return <Crown className="w-4 h-4 text-amber-600" />;
      case "Secretary":
        return <User className="w-4 h-4 text-purple-600" />;
      case "Researcher":
      default:
        return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleBadgeVariant = (role: "Leader" | "Researcher" | "Secretary") => {
    switch (role) {
      case "Leader":
        return "default";
      case "Secretary":
        return "outline";
      case "Researcher":
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please verify the project details and team members before submitting.
        </p>
      </div>

      {/* Project Title + Register Dialog */}
      <Card className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {projectTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Project Registration Summary
            </p>
          </div>

          {/* Dialog View Register */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Register
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
              <div className="flex flex-col h-[85vh] bg-white">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-blue-50 shrink-0">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Project Register: {projectTitle}
                  </h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-4 bg-white">
                  <div className="h-full w-full">
                    <TinyMCEViewer
                      content={bm1Document?.["content-html"] || bm1Content}
                      height={600}
                      useTinyMCE={true}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* Team Members */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border border-pink-200">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Users className="w-5 h-5 text-purple-600" />
            Team Members
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-white text-gray-700 border-gray-300"
          >
            {processedTeamMembers.length} members
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-gray-600 flex gap-6">
            <span className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-600" />
              {
                processedTeamMembers.filter((u) => u.role === "Leader").length
              }{" "}
              Leader(s)
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-blue-600" />
              {
                processedTeamMembers.filter((u) => u.role === "Researcher")
                  .length
              }{" "}
              Member(s)
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-purple-600" />
              {
                processedTeamMembers.filter((u) => u.role === "Secretary")
                  .length
              }{" "}
              Secretary(s)
            </span>
          </div>
          <Separator />
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {processedTeamMembers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge
                    variant={getRoleBadgeVariant(
                      user.role as "Leader" | "Researcher" | "Secretary"
                    )}
                    className="flex items-center gap-1"
                  >
                    {getRoleIcon(
                      user.role as "Leader" | "Researcher" | "Secretary"
                    )}
                    {user.role}
                  </Badge>

                  {/* View CV Button */}
                  {cvDocumentsByAccount[user.accountId] && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View CV
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
                        <div className="flex flex-col h-[85vh] bg-white">
                          <div className="flex justify-between items-center p-4 border-b bg-blue-50 shrink-0">
                            <h2 className="text-xl font-semibold text-gray-800">
                              CV: {user.name}
                            </h2>
                          </div>
                          <div className="flex-1 overflow-hidden p-4 bg-white">
                            <div className="h-full w-full">
                              <TinyMCEViewer
                                content={
                                  cvDocumentsByAccount[user.accountId]?.[
                                    "content-html"
                                  ] || ""
                                }
                                height={600}
                                useTinyMCE={true}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Summary */}
      <Card className="bg-green-50 border border-green-200 shadow-sm">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="p-2 rounded-full bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-1 text-sm text-green-900">
            <h3 className="text-lg font-semibold">Ready to Submit</h3>
            <p>
              <strong>Project:</strong> {projectTitle}
            </p>
            <p>
              <strong>BM1 Content:</strong>{" "}
              {bm1Content ? "Completed" : "Not Provided"}
            </p>
            <p>
              <strong>Team Members:</strong> {processedTeamMembers.length}{" "}
              approved
            </p>
            <p className="mt-2">
              Your enrollment request will be sent to the project
              administrators. All invited members will receive an email.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              className="px-8 bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting || isSubmittingProject}
            >
              {isSubmitting || isSubmittingProject ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request Enroll
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Project Enrollment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit this project for enrollment?
                This action will:
                <br />
                • Update the project status to "submitted"
                <br />
                • Update all project documents to "submitted" status
                <br />
                • Send the project for review
                <br />
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmittingProject}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleProjectSubmission}
                disabled={isSubmittingProject}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmittingProject ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Request"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
