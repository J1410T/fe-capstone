import React, { useState, useRef, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  RefreshCw,
  AlertCircle,
  Save,
  Edit,
  Eye,
  X,
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
} from "@/hooks/queries/document";
import {
  useProject,
  useStaffProjectFilter,
  useUpdateProject,
} from "@/hooks/queries/project";
import { DocumentWithUserRole } from "@/types/document";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

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

  const editorRef = useRef<ScientificCVEditorRef>(null);

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
      "page-size": 50,
      statuses: ["approved"], // Only get approved projects
      genres: [],
      "sort-by": "createdate",
      desc: true,
      "include-creator": true,
      "include-members": true,
    },
    true
  );

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const updateProject = useUpdateProject();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectResponse } = useProject(projectId || "");
  const project = projectResponse?.data?.["project-detail"];
  const projectUpdateData = {
    "english-title": project?.["english-title"] || "",
    "vietnamese-title": project?.["vietnamese-title"] || "",
    abbreviations: project?.abbreviations || "",
    duration: project?.duration || 12,
    "start-date":
      project?.["start-date"] || new Date().toISOString().split("T")[0],
    "end-date":
      project?.["end-date"] ||
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    description: project?.description || "",
    "requirement-note": project?.["requirement-note"] || "",
    "maximum-member": project?.["maximum-member"] || 1,
    language: project?.language || "Vietnamese",
    category: project?.category || "Research",
    type: project?.type || "Basic",
    genre: project?.genre || "Academic",
  };

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

  const projects = projectsData?.["data-list"] || [];
  const contractTemplates = templateData?.data?.["data-list"] || [];
  const projectDocuments = projectDocumentsResponse?.["data-list"] || [];

  // Filter documents by status for staff workflow
  const pendingDocuments = projectDocuments.filter(
    (doc) => doc.status === "pending"
  );
  const inProgressDocuments = projectDocuments.filter(
    (doc) => doc.status === "inprogress"
  );
  const completedDocuments = projectDocuments.filter(
    (doc) => doc.status === "completed"
  );

  useEffect(() => {
    if (projectsError) {
      console.error("Projects loading error:", projectsError);
    }
  }, [projectsData, projectsError, isProjectsLoading]);

  useEffect(() => {
    refetchTemplate();
    refetchProjects();
  }, [refetchTemplate, refetchProjects]);

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

    // Load template content
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

    setIsLoading(true);

    try {
      await createDocument.mutateAsync({
        name: `Contract`,
        type: "BM5",
        status: "pending", // Staff creates with pending status
        "is-template": false,
        "content-html": content,
        "project-id": selectedProject.id,
      });

      // Get document ID from response (API returns document ID as string)
      // const documentId = documentResponse.data;

      toast.success("Document saved successfully!");

      // Reset form
      setIsDocumentDialogOpen(false);
      setSelectedProject(null);
      setSelectedProjectId("");
      setDocumentContent("");
      setEditingDocument(null);
      setIsEditMode(false);

      // Refetch project documents to show updated list
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
    // For completed documents, use existing content since they're view-only
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
        status: editingDocument.status, // Keep current status
        "is-template": false,
        "content-html": content,
        "project-id": editingDocument["project-id"],
      });

      toast.success("Document updated successfully!");

      // Reset form
      setIsDocumentDialogOpen(false);
      setEditingDocument(null);
      setIsEditMode(false);
      setDocumentContent("");

      // Refetch project documents
      refetchProjectDocuments();
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Error updating document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDocument = async () => {
    if (!editingDocument) {
      toast.error("No document selected");
      return;
    }

    setIsLoading(true);

    try {
      // Save current content and update status to completed
      const content =
        editingDocument?.status === "completed"
          ? editingDocument["content-html"]
          : editorRef.current?.getContent() ?? editingDocument["content-html"];

      await updateDocument.mutateAsync({
        id: editingDocument.id,
        name: editingDocument.name,
        type: editingDocument.type,
        status: "completed", // Change status to completed
        "is-template": false,
        "content-html": content,
        "project-id": editingDocument["project-id"],
      });

      // Always update project status to "inprogress" when closing any document
      if (selectedProject && editingDocument["project-id"]) {
        try {
          await updateProject.mutateAsync({
            projectId: editingDocument["project-id"],
            data: {
              ...projectUpdateData,
              status: "inprogress", // Always set to inprogress when closing document
            },
          });
          toast.success(
            "Document completed and project status updated to In Progress!"
          );
        } catch (projectError) {
          console.error("Failed to update project status:", projectError);
          toast.success(
            "Document completed successfully, but failed to update project status"
          );
        }
      } else {
        toast.success("Document completed successfully!");
      }

      // Reset form
      setIsDocumentDialogOpen(false);
      setEditingDocument(null);
      setIsEditMode(false);
      setDocumentContent("");

      // Refetch project documents
      refetchProjectDocuments();
    } catch (error) {
      console.error("Failed to close document:", error);
      toast.error("Error closing document");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "inprogress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isProjectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
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
                  Create and manage contracts
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
          </div>{" "}
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

              <Button
                onClick={handleCreateDocument}
                disabled={!selectedProject || isTemplateLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </Button>
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
                <div className="mt-4 text-xs text-gray-500">
                  Debug: Projects data loaded = {projectsData ? "Yes" : "No"},
                  Count = {projects.length}
                </div>
              </div>
            )}

            {isProjectsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            )}
            {projectsError && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Error loading projects
                </p>
                <p className="text-gray-600 mb-4">
                  {(projectsError as Error).message || "Cannot load projects"}
                </p>
                <button
                  onClick={() => refetchProjects()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Retry
                </button>
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
              Manage pending and in-progress documents
            </p>
          </CardHeader>
          <CardContent>
            {isProjectDocumentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                <p className="ml-2 text-gray-600">Loading documents...</p>
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
                                Type: {doc.type} • Created:{" "}
                                {new Date(
                                  doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDocument(doc)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
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
                                Type: {doc.type} • Signed by PI • Updated:{" "}
                                {new Date(
                                  doc["updated-at"] || doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDocument(doc)}
                              className="bg-blue-100 hover:bg-blue-200"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
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
                                Type: {doc.type} • Completed:{" "}
                                {new Date(
                                  doc["updated-at"] || doc["upload-at"]
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDocument(doc)}
                              className="bg-green-100 hover:bg-green-200"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Documents */}
                {pendingDocuments.length === 0 &&
                  inProgressDocuments.length === 0 &&
                  completedDocuments.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No documents found
                      </p>
                      <p className="text-gray-600">
                        Create a contract for this project to get started.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Document Creation Dialog */}
      <Dialog
        open={isDocumentDialogOpen}
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange:", open);
          // Only close if user explicitly wants to close, not when clicking on TinyMCE dialogs
          if (!open) {
            // Check if there are any TinyMCE dialogs open
            const tinyMCEDialogs =
              document.querySelectorAll(".tox-dialog-wrap");
            if (tinyMCEDialogs.length === 0) {
              setIsDocumentDialogOpen(false);
            }
          } else {
            setIsDocumentDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              {isEditMode ? "Edit Document" : "Create Contract"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {/* Show loading only for create mode when template is loading */}
              {!isEditMode && isTemplateLoading ? (
                <div className="flex items-center justify-center h-[500px] bg-white rounded-xl shadow-inner">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading template...</p>
                  </div>
                </div>
              ) : !isEditMode && templateError ? (
                <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow">
                  <div className="mb-4">
                    ⚠️ Template error: {(templateError as Error).message}
                  </div>
                  <p>Please create a template before creating a contract.</p>
                </div>
              ) : (
                <div className="h-[500px] overflow-hidden">
                  {/* Use TinyMCEViewer for completed documents (view-only), ScientificCVEditor for editable documents */}
                  {editingDocument?.status === "completed" ? (
                    <TinyMCEViewer
                      content={documentContent}
                      height={500}
                      useTinyMCE={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <ScientificCVEditor
                      ref={editorRef}
                      value={documentContent}
                      onChange={handleEditorChange}
                      height={500}
                      preset="document"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
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

              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    {/* Show different buttons based on document status */}
                    {editingDocument?.status === "completed" ? (
                      /* Completed document - View only */
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>Document is completed and read-only</span>
                      </div>
                    ) : (
                      <>
                        {/* Edit mode buttons for pending/inprogress documents */}
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

                        {/* Only show Close button for inprogress documents */}
                        {editingDocument?.status === "inprogress" && (
                          <Button
                            onClick={handleCloseDocument}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Closing...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Close & Complete
                              </>
                            )}
                          </Button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  /* Create mode button */
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement;
