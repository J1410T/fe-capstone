import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed shadcn Dialog import - using custom dialog instead
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Plus,
  RefreshCw,
  AlertCircle,
  Save,
  Eye,
  X,
  EditIcon,
  Target,
} from "lucide-react";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
  TinyMCEViewer,
} from "@/components/ui/TinyMCE";
import {
  useDocumentsByFilter,
  useCreateDocument,
  useDocumentByProjectIdWithUserRole,
  useUpdateDocument,
  useCreateMilestoneByDocumentProject,
} from "@/hooks/queries/document";
import {
  useProject,
  useStaffProjectFilter,
  useUpdateProject,
} from "@/hooks/queries/project";
import { DocumentWithUserRole } from "@/types/document";
import { toast } from "sonner";
import { useBaseUserRoleId, usePIUserRoleByProjectId } from "@/hooks/queries";
import { NotificationRequest } from "@/types/notification";
import { useSendNotification } from "@/hooks/queries/notification";
import MilestoneModal from "./MilestoneModal";
import { Loading } from "@/components";

interface Project {
  id: string;
  "vietnamese-title": string;
  "english-title": string;
  status: string;
  code: string;
}

const DocumentManagement: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<DocumentWithUserRole | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const editorRef = useRef<ScientificCVEditorRef>(null);

  // Simple effect to handle ESC key for custom dialog
  useEffect(() => {
    if (!isDocumentDialogOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDocumentDialogOpen(false);
        setEditingDocument(null);
        setIsEditMode(false);
        setDocumentContent("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDocumentDialogOpen]);

  // Get BM5 contract template
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
    refetch: refetchTemplate,
  } = useDocumentsByFilter("BM5", true, 1, 10, false);

  // Get projects for contract creation (only approved projects)
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useStaffProjectFilter(
    {
      "page-index": 1,
      "page-size": 100,
      statuses: ["approved", "inprogress"],
      genres: ["proposal"],
      "sort-by": "createdate",
      desc: true,
      "include-creator": true,
      "include-members": true,
    },
    true
  );

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const updateProjectMutation = useUpdateProject();
  const createMilestoneByDocumentProject =
    useCreateMilestoneByDocumentProject();
  const { data: projectResponse } = useProject(selectedProjectId || "");
  const project = projectResponse?.data?.["project-detail"];
  const projectUpdateData = project
    ? {
        "english-title": project["english-title"],
        "vietnamese-title": project["vietnamese-title"],
        description: project.description,
        "requirement-note": project["requirement-note"],
        "maximum-member": project["maximum-member"] || 1,
        language: project.language,
        category: project.category,
        type: project.type,
        genre: project.genre,
      }
    : undefined;

  // Get documents for selected project
  const {
    data: projectDocumentsResponse,
    isLoading: isProjectDocumentsLoading,
    refetch: refetchProjectDocuments,
  } = useDocumentByProjectIdWithUserRole(
    {
      "is-template": false,
      "page-index": 1,
      "page-size": 50,
      "project-id": selectedProjectId || "",
    },
    !!selectedProjectId
  );

  const piUserRoleResponse = usePIUserRoleByProjectId(selectedProjectId || "");
  const sendNotification = useSendNotification();
  const piAccountId =
    piUserRoleResponse?.data?.["data-list"]?.[0]?.["account-id"];

  const { data: baseUserRoleId } = useBaseUserRoleId();

  const projects = useMemo(
    () => projectsData?.["data-list"] || [],
    [projectsData]
  );
  const contractTemplates = useMemo(
    () => templateData?.data?.["data-list"] || [],
    [templateData]
  );
  const allProjectDocuments = useMemo(
    () => projectDocumentsResponse?.["data-list"] || [],
    [projectDocumentsResponse]
  );

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  // ✅ FILTER BM1, BM5 documents
  const projectDocuments = allProjectDocuments.filter(
    (doc) => doc.type === "BM1" || doc.type === "BM5"
  );
  const hasBM5Document = projectDocuments.some((doc) => doc.type === "BM5");

  // ✅ FIX: Improved status filtering with fallback and normalization
  const normalizeStatus = (status: string | undefined | null): string => {
    if (!status) return "pending"; // Default fallback
    return status.toLowerCase().trim();
  };

  const pendingDocuments = projectDocuments.filter((doc) => {
    const status = normalizeStatus(doc.status);
    return status === "pending" || status === "draft" || status === "";
  });

  const inProgressDocuments = projectDocuments.filter((doc) => {
    const status = normalizeStatus(doc.status);
    return (
      status === "inprogress" || status === "in-progress" || status === "active"
    );
  });

  const completedDocuments = projectDocuments.filter((doc) => {
    const status = normalizeStatus(doc.status);
    return status === "completed" || status === "done" || status === "finished";
  });

  // ✅ NEW: Handle documents with unexpected statuses
  const otherStatusDocuments = projectDocuments.filter((doc) => {
    const status = normalizeStatus(doc.status);
    return ![
      "pending",
      "draft",
      "",
      "inprogress",
      "in-progress",
      "active",
      "completed",
      "done",
      "finished",
    ].includes(status);
  });

  useEffect(() => {
    if (projectsError) {
      console.error("Projects loading error:", projectsError);
    }
  }, [projectsData, projectsError, isProjectsLoading]);

  useEffect(() => {
    refetchTemplate();
    refetchProjects();
  }, [refetchTemplate, refetchProjects]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const firstProject = projects[0] as Project;
      setSelectedProjectId(firstProject.id);
      setSelectedProject(firstProject);
    }
  }, [projects, selectedProjectId]);

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find((p: Project) => p.id === projectId);
    setSelectedProjectId(projectId);
    setSelectedProject(project || null);
  };

  const handleCreateDocument = () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    if (contractTemplates.length > 0) {
      const template = contractTemplates[0];
      setDocumentContent(template["content-html"] || "");
      setIsDocumentDialogOpen(true);
    } else {
      toast.error("Cannot find BM5 template. Please create a template first.");
    }
  };

  const handleEditorChange = (content: string) => {
    setDocumentContent(content);
  };

  const handleSaveDocument = async () => {
    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to the document");
      return;
    }

    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    const bm1Document = projectDocuments.find((doc) => doc.type === "BM1");

    if (!bm1Document) {
      toast.error("BM1 document not found in this project");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      await createMilestoneByDocumentProject.mutateAsync({
        "section-title": "Tóm tắt kế hoạch và lộ trình triển khai nghiên cứu",
        description: "Nội dung, công việc chủ yếu",
        objective: "Kết quả phải đạt",
        "cost-estimate": "Dự kiến kinh phí",
        "time-estimate": "Thời gian",
        "project-id": bm1Document["project-id"] || "",
        "document-content": bm1Document["content-html"] || "",
        "creator-id": baseUserRoleId?.data || "",
      });

      await createDocument.mutateAsync({
        name: `Contract`,
        type: "BM5",
        status: "pending",
        "is-template": false,
        "content-html": content,
        "project-id": selectedProject.id,
      });

      toast.success("Document saved successfully!");

      setIsDocumentDialogOpen(false);
      setSelectedProject(null);
      setSelectedProjectId("");
      setDocumentContent("");
      setEditingDocument(null);
      setIsEditMode(false);

      if (selectedProjectId) {
        refetchProjectDocuments();
      }
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Error saving document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDocument = (document: DocumentWithUserRole) => {
    setEditingDocument(document);
    setDocumentContent(document["content-html"] || "");
    setIsEditMode(true);
    setIsDocumentDialogOpen(true);
  };

  const handleUpdateDocument = async () => {
    const content =
      editingDocument?.status === "completed"
        ? editingDocument["content-html"]
        : editorRef.current?.getContent() ?? "";

    if (!content.trim()) {
      toast.error("Please add content to the document");
      return;
    }

    if (!editingDocument) {
      toast.error("No document selected for editing");
      return;
    }

    setIsLoading(true);

    try {
      await updateDocument.mutateAsync({
        id: editingDocument.id,
        name: editingDocument.name,
        type: editingDocument.type,
        status: editingDocument.status,
        "is-template": false,
        "content-html": content,
        "project-id": editingDocument["project-id"],
      });

      toast.success("Document updated successfully!");

      setIsDocumentDialogOpen(false);
      setEditingDocument(null);
      setIsEditMode(false);
      setDocumentContent("");

      refetchProjectDocuments();
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Error updating document");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Renamed and updated function with confirmation dialog and sequential API calls
  const SubmitContract = async () => {
    if (!editingDocument || !selectedProject) {
      toast.error("No document selected");
      return;
    }

    setIsLoading(true);

    try {
      const content =
        editorRef.current?.getContent() ?? editingDocument["content-html"];

      // Find BM1 document in the project
      const bm1Document = projectDocuments.find((doc) => doc.type === "BM1");

      if (!bm1Document) {
        toast.error("BM1 document not found in this project");
        setIsLoading(false);
        return;
      }

      // Step 1: Update BM5 document to 'completed'
      await updateDocument.mutateAsync({
        id: editingDocument.id,
        name: editingDocument.name,
        type: editingDocument.type,
        status: "completed",
        "is-template": false,
        "content-html": content,
        "project-id": editingDocument["project-id"],
      });

      // Step 2: Update BM1 document to 'completed'
      await updateDocument.mutateAsync({
        id: bm1Document.id,
        name: bm1Document.name,
        type: bm1Document.type,
        status: "completed",
        "is-template": false,
        "content-html": bm1Document["content-html"],
        "project-id": bm1Document["project-id"],
      });

      // Step 4: Update project status to 'inprogress'
      if (projectUpdateData) {
        await updateProjectMutation.mutateAsync({
          projectId: selectedProjectId,
          data: projectUpdateData,
          status: "inprogress",
        });
      } else {
        throw new Error("Project update data is undefined");
      }

      // Step 5: Send notification to PI
      const notificationRequest: NotificationRequest = {
        title: `Successfully signed the project contract: ${selectedProject?.["english-title"]}`,
        type: "project",
        status: "created",
        "objec-notification-id": selectedProjectId || "",
        "list-account-id": [piAccountId || ""],
      };

      await sendNotification.mutateAsync(notificationRequest);

      toast.success("Contract submitted successfully!");

      setIsDocumentDialogOpen(false);
      setEditingDocument(null);
      setIsEditMode(false);
      setDocumentContent("");
      setShowConfirmDialog(false);

      refetchProjectDocuments();
    } catch (error) {
      console.error("Failed to submit contract:", error);
      toast.error("Error submitting contract");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case "pending":
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "inprogress":
      case "in-progress":
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case "completed":
      case "done":
      case "finished":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  // ✅ NEW: Function to determine button action for documents
  const getDocumentButton = (doc: DocumentWithUserRole) => {
    // For BM1 documents, always show View button regardless of status
    if (doc.type === "BM1") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditDocument(doc)}
          className="bg-blue-100 hover:bg-blue-200"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      );
    }

    // For BM5 documents, show Edit button if not completed, View if completed
    if (doc.status === "completed") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditDocument(doc)}
          className="bg-green-100 hover:bg-green-200"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEditDocument(doc)}
      >
        <EditIcon className="h-4 w-4 mr-1" />
        Edit
      </Button>
    );
  };

  if (isProjectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Contract Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage contracts (BM1, BM5)
                </p>
              </div>
            </div>
            <Button
              onClick={() => refetchProjects()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Project Selection and Contract Creation */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a project:
                </label>
                <Select
                  value={selectedProjectId}
                  onValueChange={handleProjectSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">
                            [{project.code}] {project["english-title"]}
                          </span>
                          {getStatusBadge(project.status)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedProject ? (
                <Button
                  disabled
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
              ) : hasBM5Document &&
                pendingDocuments.some((doc) => doc.type === "BM5") ? (
                <Button
                  onClick={() => setIsMilestoneModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Check Milestone
                </Button>
              ) : hasBM5Document ? (
                <Button
                  disabled
                  className="bg-gray-400 text-white cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Contract Exists
                </Button>
              ) : (
                <Button
                  onClick={handleCreateDocument}
                  disabled={isTemplateLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
              )}
            </div>

            {selectedProject && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Project:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <p>
                        <strong>Code:</strong> {selectedProject.code}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedProject.status}
                      </p>
                      <p>
                        <strong>Vietnamese Title:</strong>{" "}
                        {selectedProject["vietnamese-title"]}
                      </p>
                      <p>
                        <strong>English Title:</strong>{" "}
                        {selectedProject["english-title"]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {projects.length === 0 && !isProjectsLoading && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No project found
                </p>
                <p className="text-gray-600">Cannot find any project.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Documents Management */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Project Documents - {selectedProject["vietnamese-title"]}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Manage pending and in-progress documents (BM1, BM5 only)
            </p>
          </CardHeader>
          <CardContent>
            {isProjectDocumentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loading />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Documents */}
                {pendingDocuments.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Pending Documents ({pendingDocuments.length})
                    </h3>
                    <div className="grid gap-3">
                      {pendingDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Type:{" "}
                                <span className="font-medium">{doc.type}</span>{" "}
                                • Created:{" "}
                                {new Date(
                                  doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            {getDocumentButton(doc)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Documents */}
                {inProgressDocuments.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      In Progress Documents ({inProgressDocuments.length})
                    </h3>
                    <div className="grid gap-3">
                      {inProgressDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Type:{" "}
                                <span className="font-medium">{doc.type}</span>{" "}
                                • Updated:{" "}
                                {new Date(
                                  doc["updated-at"] || doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            {getDocumentButton(doc)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Documents */}
                {completedDocuments.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Completed Documents ({completedDocuments.length})
                    </h3>
                    <div className="grid gap-3">
                      {completedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Type:{" "}
                                <span className="font-medium">{doc.type}</span>{" "}
                                • Completed:{" "}
                                {new Date(
                                  doc["updated-at"] || doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            {getDocumentButton(doc)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {otherStatusDocuments.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Other Status Documents ({otherStatusDocuments.length})
                    </h3>
                    <div className="grid gap-3">
                      {otherStatusDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Type:{" "}
                                <span className="font-medium">{doc.type}</span>{" "}
                                • Status:{" "}
                                <span className="font-medium">
                                  {doc.status || "Unknown"}
                                </span>{" "}
                                •{" "}
                                {new Date(
                                  doc["updated-at"] || doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            {getDocumentButton(doc)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Documents */}
                {pendingDocuments.length === 0 &&
                  inProgressDocuments.length === 0 &&
                  completedDocuments.length === 0 &&
                  otherStatusDocuments.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No BM1/BM5 documents found
                      </p>
                      <p className="text-gray-600">
                        Create a contract for this project to get started.
                      </p>
                      {allProjectDocuments.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Found {allProjectDocuments.length} documents, but none
                          are BM1/BM5 type
                        </p>
                      )}
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Document Dialog - TinyMCE Friendly */}
      {isDocumentDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setIsDocumentDialogOpen(false);
              setEditingDocument(null);
              setIsEditMode(false);
              setDocumentContent("");
            }}
          />

          {/* Dialog Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 max-w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold">
                  {isEditMode ? "Edit Document" : "Create Contract"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsDocumentDialogOpen(false);
                  setEditingDocument(null);
                  setIsEditMode(false);
                  setDocumentContent("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-2 sm:p-3 lg:p-4 flex-1 overflow-hidden min-h-0">
              {!isEditMode && isTemplateLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <div className="text-center">
                    <Loading />
                  </div>
                </div>
              ) : !isEditMode && templateError ? (
                <div className="text-center text-red-500 p-6">
                  <div className="mb-4">
                    ⚠️ Template error: {(templateError as Error).message}
                  </div>
                  <p>Please create a template before creating a contract.</p>
                </div>
              ) : (
                <div className="h-[50vh] sm:h-[55vh] lg:h-[60vh] min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] max-h-[500px] overflow-hidden">
                  {editingDocument?.status === "completed" ||
                  editingDocument?.type === "BM1" ? (
                    <TinyMCEViewer
                      content={documentContent}
                      height={400}
                      useTinyMCE={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <ScientificCVEditor
                      ref={editorRef}
                      value={documentContent}
                      onChange={handleEditorChange}
                      height={400}
                      preset="document"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 p-3 sm:p-4 border-t bg-gray-50 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDocumentDialogOpen(false);
                  setEditingDocument(null);
                  setIsEditMode(false);
                  setDocumentContent("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {isEditMode ? (
                  <>
                    {editingDocument?.status === "completed" ||
                    editingDocument?.type === "BM1" ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>Document is read-only</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleUpdateDocument}
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>

                        {editingDocument?.status === "pending" &&
                          editingDocument?.type === "BM5" && (
                            <Button
                              onClick={() => setShowConfirmDialog(true)}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Close & Complete
                            </Button>
                          )}
                      </>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={handleSaveDocument}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Contract
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Confirmation Dialog for Contract Submission */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Contract Submission
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this contract? This action will:
              <ul className="mt-2 ml-4 space-y-1 text-sm">
                <li>• Mark BM5 document as completed</li>
                <li>• Mark BM1 document as completed</li>
                <li>• Create project milestone</li>
                <li>• Update project status to "In Progress"</li>
              </ul>
              <p className="mt-2 text-sm font-medium text-amber-700">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={SubmitContract}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Yes, Submit Contract"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={selectedProjectId}
        projectName={selectedProject?.["english-title"] || ""}
      />
    </div>
  );
};

export default DocumentManagement;
