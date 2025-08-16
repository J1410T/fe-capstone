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
import { FileText, Plus, RefreshCw, AlertCircle, Save } from "lucide-react";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import {
  useDocumentsByFilter,
  useCreateDocument,
} from "@/hooks/queries/document";
import { useStaffProjectFilter } from "@/hooks/queries/project";
import { sendDocumentToPI } from "@/services/resources/notification";
import { toast } from "sonner";

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

  const editorRef = useRef<ScientificCVEditorRef>(null);

  // Get BM5 contract template
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
    refetch: refetchTemplate,
  } = useDocumentsByFilter("BM5", true, 1, 10, false);

  // Get projects for contract creation (try all projects first for debugging)
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useStaffProjectFilter(
    {
      "page-index": 1,
      "page-size": 50,
      statuses: [], // Get all projects to see what statuses exist
      genres: [],
      "sort-by": "createdate",
      desc: true,
      "include-creator": true,
      "include-members": true,
    },
    true
  );

  const createDocument = useCreateDocument();

  const projects = projectsData?.["data-list"] || [];
  const contractTemplates = templateData?.data?.["data-list"] || [];

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
      toast.error("Vui lòng chọn dự án trước");
      return;
    }

    // Load template content
    if (contractTemplates.length > 0) {
      const template = contractTemplates[0];
      const projectInfo = `
        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; background: #f9f9f9;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Thông tin Dự án</h3>
          <p><strong>Mã dự án:</strong> ${selectedProject.code}</p>
          <p><strong>Tên tiếng Việt:</strong> ${
            selectedProject["vietnamese-title"]
          }</p>
          <p><strong>Tên tiếng Anh:</strong> ${
            selectedProject["english-title"]
          }</p>
          <p><strong>Trạng thái:</strong> ${selectedProject.status}</p>
          <p><strong>Ngày tạo:</strong> ${new Date().toLocaleDateString(
            "vi-VN"
          )}</p>
        </div>
      `;

      setDocumentContent(projectInfo + (template["content-html"] || ""));
      setIsDocumentDialogOpen(true);
    } else {
      toast.error("Không tìm thấy template BM5. Vui lòng tạo template trước.");
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
      const documentResponse = await createDocument.mutateAsync({
        name: `Tài liệu BM5 - ${selectedProject["vietnamese-title"]}`,
        type: "BM5",
        status: "draft",
        "is-template": false,
        "content-html": content,
        "project-id": selectedProject.id,
      });

      // Get document ID from response (API returns document ID as string)
      const documentId = documentResponse.data;

      toast.success("Document saved successfully!");

      // Send notification to PI after successful save
      try {
        await sendDocumentToPI(documentId, selectedProject.id);
        toast.success("Đã gửi thông báo cho PI!");
      } catch (notificationError) {
        console.error("Failed to send notification to PI:", notificationError);
        const errorMessage =
          notificationError instanceof Error
            ? notificationError.message
            : "Lỗi không xác định";

        toast.warning(
          `Lưu tài liệu thành công nhưng không thể gửi thông báo cho PI: ${errorMessage}`,
          { duration: 8000 }
        );
      }

      // Reset form
      setIsDocumentDialogOpen(false);
      setSelectedProject(null);
      setSelectedProjectId("");
      setDocumentContent("");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Error saving document");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
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
          <p className="text-gray-600">Đang tải dự án...</p>
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
                  Quản lý Tài liệu
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Tạo và quản lý tài liệu BM5
                </p>
              </div>
            </div>
            <Button
              onClick={() => refetchProjects()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
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
                  Chọn dự án:
                </label>
                <Select
                  value={selectedProjectId}
                  onValueChange={handleProjectSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn một dự án..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">
                            [{project.code}] {project["vietnamese-title"]}
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
                Tạo Tài liệu
              </Button>
            </div>

            {selectedProject && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Dự án đã chọn:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <p>
                        <strong>Mã:</strong> {selectedProject.code}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong> {selectedProject.status}
                      </p>
                      <p>
                        <strong>Tên tiếng Việt:</strong>{" "}
                        {selectedProject["vietnamese-title"]}
                      </p>
                      <p>
                        <strong>Tên tiếng Anh:</strong>{" "}
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
                  Không có dự án
                </p>
                <p className="text-gray-600">Không tìm thấy dự án nào.</p>
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
                  Lỗi khi tải dự án
                </p>
                <p className="text-gray-600 mb-4">
                  {(projectsError as Error).message ||
                    "Không thể tải danh sách dự án"}
                </p>
                <button
                  onClick={() => refetchProjects()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Creation Dialog */}
      <Dialog
        open={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              Tạo Tài liệu BM5
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {isTemplateLoading ? (
                <div className="flex items-center justify-center h-[500px] bg-white rounded-xl shadow-inner">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải template...</p>
                  </div>
                </div>
              ) : templateError ? (
                <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow">
                  <div className="mb-4">
                    ⚠️ Lỗi template: {(templateError as Error).message}
                  </div>
                  <p>
                    Vui lòng tạo template BM5 trước hoặc liên hệ quản trị viên.
                  </p>
                </div>
              ) : (
                <div className="h-[500px] overflow-hidden">
                  <ScientificCVEditor
                    ref={editorRef}
                    value={documentContent}
                    onChange={handleEditorChange}
                    height={500}
                    preset="document"
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDocumentDialogOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>

              <Button
                onClick={handleSaveDocument}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu Tài liệu
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement;
