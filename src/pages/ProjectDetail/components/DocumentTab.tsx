import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Custom Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
  showFooter = false,
  footerContent,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>

        {/* Footer */}
        {showFooter && footerContent && (
          <div className="border-t p-6">{footerContent}</div>
        )}
      </div>
    </div>
  );
};
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  // Download,
  Eye,
  Edit,
  FolderOpen,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
  // CheckSquare,
  Save,
} from "lucide-react";
import { DocumentWithUserRole } from "@/types/document";
import { formatDateTime } from "@/utils";
import { getStatusColor } from "../shared/utils";
import {
  TinyMCEViewer,
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import { UserRole } from "@/contexts/auth-types";
import {
  useScientificCVByEmail,
  useCreateDocument,
  useDocumentByProjectIdWithUserRole,
  useUpdateDocument,
} from "@/hooks/queries/document";
import { useMyAccountInfo, useStaffList } from "@/hooks/queries/useAuth";
// import { useUpdateProject } from "@/hooks/queries/project";
import { getAuthResponse } from "@/utils/cookie-manager";
import { toast } from "sonner";
import { useAuth } from "@/contexts";
import { useNavigate } from "react-router-dom";
import { NotificationRequest } from "@/types/notification";
import { useProject } from "@/hooks/queries/project";
import { useSendNotification } from "@/hooks/queries/notification";
// import { getAllRoles } from "@/services/resources/auth";

interface DocumentTabProps {
  projectId?: string;
  isProposal?: boolean;
  projectStatus?: string;
}

const DocumentTab: React.FC<DocumentTabProps> = ({
  projectId,
  isProposal,
  projectStatus,
}) => {
  const [selectedDocument, setSelectedDocument] =
    React.useState<DocumentWithUserRole | null>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editingDocument, setEditingDocument] =
    React.useState<DocumentWithUserRole | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showUploadConfirmDialog, setShowUploadConfirmDialog] =
    React.useState(false);
  const [isEditLoading, setIsEditLoading] = React.useState(false);
  const [editingContent, setEditingContent] = React.useState<string>("");

  // Editor ref for edit dialog
  const editEditorRef = React.useRef<ScientificCVEditorRef>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get email from auth response cookie
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  // Auth
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's Scientific CV by email
  const { data: scientificCV, isLoading: isCVLoading } = useScientificCVByEmail(
    userEmail,
    !!userEmail && isProposal
  );

  const { data: projectData } = useProject(projectId || "");

  // API hooks
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const sendNotification = useSendNotification();
  // const updateProject = useUpdateProject();
  const { data: myAccountInfo } = useMyAccountInfo();

  const { data: staffList } = useStaffList();

  // Determine document status based on project status
  // const getDocumentStatus = () => {
  //   if (projectStatus === "submitted") {
  //     return "submitted";
  //   }
  //   if (projectStatus === "Approved") {
  //     return "submitted";
  //   }
  //   return "draft";
  // };

  // Fetch documents by project ID with pagination and user role data
  const {
    data: documentsResponse,
    isLoading: isDocumentsLoading,
    refetch,
  } = useDocumentByProjectIdWithUserRole(
    {
      "is-template": false,
      // status: getDocumentStatus(),
      "page-index": currentPage,
      "page-size": pageSize,
      "project-id": projectId || "",
    },
    !!projectId
  );

  // Extract documents with user role data already included
  const documents = documentsResponse?.["data-list"] || [];
  const totalCount = documentsResponse?.["total-count"] || 0;
  const totalPages = documentsResponse?.["total-page"] || 1;

  const handleViewDocument = (document: DocumentWithUserRole) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  // Check if user can edit a document (specifically BM5 contracts)
  const canEditDocument = (document: DocumentWithUserRole): boolean => {
    if (!user || document.type !== "BM5") return false;

    // Cannot edit completed documents
    if (document.status === "completed") return false;

    // Only Principal Investigators can edit BM5 documents
    if (user.role !== UserRole.PRINCIPAL_INVESTIGATOR) return false;

    // Allow editing for draft and pending documents
    return document.status === "draft" || document.status === "pending";
  };

  const handleEditDocument = (document: DocumentWithUserRole) => {
    if (!user || user.role !== UserRole.PRINCIPAL_INVESTIGATOR) {
      toast.error("Only Principal Investigators can Edit documents");
      return;
    }
    console.log("handleEditDocument called with:", document);
    setEditingDocument(document);
    setEditingContent(document["content-html"] || "");
    setShowEditDialog(true);
  };

  const handleEditorChange = (content: string) => {
    console.log("📝 Editor content changed:", content.length, "characters");
    setEditingContent(content);
  };

  // const handleDownloadDocument = (document: DocumentWithUserRole) => {
  //   console.log("Download", document.name);
  //   // TODO: implement actual download
  // };

  const handleUploadScientificCV = () => {
    setShowUploadConfirmDialog(true);
  };

  const handleConfirmUploadScientificCV = async () => {
    if (!scientificCV?.data || !projectId || !myAccountInfo?.id) {
      toast.error(
        "Scientific CV not found, project ID missing, or account info missing"
      );
      return;
    }

    setIsUploading(true);
    setShowUploadConfirmDialog(false);

    try {
      // Check for existing ScienceCV document with matching account-id
      const existingScienceCVDoc = documents.find(
        (doc) => doc.type === "BM2" && doc["account-id"] === myAccountInfo.id
      );

      if (existingScienceCVDoc) {
        // Update existing document
        await updateDocument.mutateAsync({
          id: existingScienceCVDoc.id,
          name: "Scientific CV",
          type: "BM2",
          "is-template": scientificCV.data["is-template"],
          "content-html": scientificCV.data["content-html"],
          "project-id": projectId,
          status: "draft",
        });

        toast.success("Scientific CV updated successfully!");
      } else {
        // Create new document
        await createDocument.mutateAsync({
          name: "Scientific CV",
          type: "BM2",
          "is-template": scientificCV.data["is-template"],
          "content-html": scientificCV.data["content-html"],
          "project-id": projectId,
          status: "draft",
        });

        toast.success("Scientific CV uploaded successfully!");
      }
      await refetch();
    } catch (error) {
      console.error("Failed to upload Scientific CV:", error);
      toast.error("Failed to upload Scientific CV");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleSignDocument = async (document: DocumentWithUserRole) => {
  //   if (!user || user.role !== UserRole.PRINCIPAL_INVESTIGATOR) {
  //     toast.error("Only Principal Investigators can sign documents");
  //     return;
  //   }

  //   if (document.status !== "pending") {
  //     toast.error("Only pending documents can be signed");
  //     return;
  //   }

  //   try {
  //     await updateDocument.mutateAsync({
  //       id: document.id,
  //       name: document.name,
  //       type: document.type,
  //       status: "inprogress", // Change status to inprogress after PI signs
  //       "is-template": false,
  //       "content-html": document["content-html"],
  //       "project-id": document["project-id"],
  //     });

  //     toast.success("Document signed successfully!");
  //     await refetch(); // Refresh the document list
  //   } catch (error) {
  //     console.error("Failed to sign document:", error);
  //     toast.error("Failed to sign document");
  //   }
  // };

  // const handleSaveEditDocument = async () => {
  //   if (!editingDocument) {
  //     toast.error("No document selected for editing");
  //     return;
  //   }

  //   // Use state content instead of ref
  //   const content = editingContent.trim();
  //   if (!content) {
  //     toast.error("Please add content to the document");
  //     return;
  //   }

  //   console.log("💾 Saving document with content length:", content.length);

  //   setIsEditLoading(true);

  //   try {
  //     // Determine if this is a Contract document being completed
  //     // const isContractDocument = editingDocument.name
  //     //   ?.toLowerCase()
  //     //   .includes("contract");
  //     // const isBeingCompleted = editingDocument.status !== "completed"; // Will be completed after save

  //     await updateDocument.mutateAsync({
  //       id: editingDocument.id,
  //       name: editingDocument.name,
  //       type: editingDocument.type,
  //       status: editingDocument.status,
  //       "is-template": false,
  //       "content-html": content,
  //       "project-id": editingDocument["project-id"],
  //     });

  //     const staffAccountId =
  //       staffList?.["data-list"].map((item) => item["account-id"]) ?? [];

  //     const notificationRequest: NotificationRequest = {
  //       title: `Check and Sign Contract project: ${projectData?.data["project-detail"]["english-title"]}`,
  //       type: "project",
  //       status: "create",
  //       "objec-notification-id": projectId || "",
  //       "list-account-id": staffAccountId,
  //     };
  //     await sendNotification.mutateAsync(notificationRequest);

  //     // If this is a Contract document being completed, update project status to inprogress
  //     // if (isContractDocument && isBeingCompleted && projectId) {
  //     //   try {
  //     //     // Create minimal UpdateProjectRequest with required fields
  //     //     await updateProject.mutateAsync({
  //     //       projectId: projectId,
  //     //       data: {
  //     //         "english-title": "",
  //     //         "vietnamese-title": "",
  //     //         "maximum-member": 1,
  //     //         language: "Vietnamese",
  //     //         category: "basic",
  //     //         type: "basic",
  //     //         genre: "normal",
  //     //       },
  //     //       status: "inprogress",
  //     //     });
  //     //     toast.success(
  //     //       "Document completed and project status updated to In Progress!"
  //     //     );
  //     //   } catch (projectError) {
  //     //     console.error("Failed to update project status:", projectError);
  //     //     toast.success(
  //     //       "Document completed successfully, but failed to update project status"
  //     //     );
  //     //   }
  //     // } else {
  //     //   toast.success("Document updated successfully!");
  //     // }

  //     setShowEditDialog(false);
  //     setEditingDocument(null);
  //     setEditingContent("");
  //     await refetch(); // Refresh the document list
  //   } catch (error) {
  //     console.error("Failed to update document:", error);
  //     toast.error("Failed to update document");
  //   } finally {
  //     setIsEditLoading(false);
  //   }
  // };

  const handleSaveEditDocument = async () => {
    if (!editingDocument) {
      toast.error("No document selected for editing");
      return;
    }

    const content = editingContent.trim();
    if (!content) {
      toast.error("Please add content to the document");
      return;
    }

    console.log("💾 Saving document with content length:", content.length);

    setIsEditLoading(true);

    try {
      // 📌 1. Gọi update document
      await updateDocument.mutateAsync({
        id: editingDocument.id,
        name: editingDocument.name,
        type: editingDocument.type,
        status: editingDocument.status,
        "is-template": false,
        "content-html": content,
        "project-id": editingDocument["project-id"],
      });

      // ✅ Nếu tới đây không bị lỗi => update thành công
      toast.success("Document updated successfully!");

      // 📌 2. Lấy danh sách account-id từ staffList
      const staffAccountId =
        staffList?.["data-list"]?.map((item) => item["account-id"]) ?? [];

      // 📌 3. Gửi thông báo
      const notificationRequest: NotificationRequest = {
        title: `Check and Sign Contract project: ${projectData?.data["project-detail"]["english-title"]}`,
        type: "project",
        status: "create",
        "objec-notification-id": projectId || "",
        "list-account-id": staffAccountId,
      };

      await sendNotification.mutateAsync(notificationRequest);

      // 📌 4. Reset UI và reload dữ liệu
      setShowEditDialog(false);
      setEditingDocument(null);
      setEditingContent("");
      await refetch();
    } catch (error) {
      console.error("❌ Failed during document update or notification:", error);
      toast.error("Failed to update document or send notification");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleCreateDocument = () => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    // Navigate to create document page with project ID
    const basePath =
      user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "/pi" : "/researcher";
    navigate(`${basePath}/project/${projectId}/create-document`);
  };

  return (
    <Card className="shadow-sm">
      {/* --- Table header --- */}
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Project Documents
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              View and manage all project-related documents
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {user?.role === UserRole.PRINCIPAL_INVESTIGATOR &&
              projectStatus === "inprogress" && (
                <Button
                  onClick={handleCreateDocument}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Create Document
                </Button>
              )}
            {isProposal && projectStatus == "draft" && (
              <Button
                onClick={handleUploadScientificCV}
                disabled={isUploading || isCVLoading || !scientificCV?.data}
                className="ml-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Science CV"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* --- Document table --- */}
      <CardContent className="pt-0">
        {isDocumentsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm break-words">
                            {document.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              document.status
                            )} text-xs`}
                          >
                            {document.status}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>
                      {formatDateTime(document["upload-at"])}
                    </TableCell>
                    <TableCell>
                      {document["updated-at"]
                        ? formatDateTime(document["updated-at"])
                        : "Not updated"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            document["avatar-url"] ||
                            "https://hoseiki.vn/wp-content/uploads/2025/03/gai-anime-23.jpg"
                          }
                          alt={document["full-name"] || "User"}
                          className="w-6 h-6 rounded-full"
                        />

                        <span className="text-sm">
                          {document["full-name"] || "Unknown User"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        {canEditDocument(document) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDocument(document)}
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}
                        {/* Sign button for PI on pending documents */}
                        {/* {user?.role === UserRole.PRINCIPAL_INVESTIGATOR &&
                          document.status === "pending" &&
                          document.type === "BM5" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSignDocument(document)}
                              className="bg-green-50 hover:bg-green-100 border-green-200"
                            >
                              <CheckSquare className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Sign</span>
                            </Button>
                          )} */}
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(document)}
                        >
                =0          <Download className="w-3 h-3" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Items per page
                  </p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value))}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of{" "}
                    {totalCount} documents
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className="h-8 w-8"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No documents found</p>
            <p className="text-sm text-muted-foreground">
              No documents have been uploaded for this project yet.
            </p>
          </div>
        )}
      </CardContent>

      {/* --- View Modal --- */}
      <Modal
        isOpen={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        title={selectedDocument?.name || "Document"}
        size="xl"
      >
        {selectedDocument ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <strong>Type:</strong> {selectedDocument.type}
              </div>
              <div>
                <strong>Upload Date:</strong>{" "}
                {formatDateTime(selectedDocument["upload-at"])}
              </div>
              <div>
                <strong>Status:</strong> {selectedDocument.status}
              </div>
            </div>
            <div className="bg-white border rounded-lg">
              <div className="w-full">
                {selectedDocument?.["content-html"] ? (
                  <TinyMCEViewer
                    key={selectedDocument.id}
                    content={selectedDocument?.["content-html"] ?? ""}
                    height={600}
                    useTinyMCE={true}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-500 p-4">No content available.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading document...</p>
        )}
      </Modal>

      {/* Upload Scientific CV Confirmation Modal */}
      <Modal
        isOpen={showUploadConfirmDialog}
        onClose={() => setShowUploadConfirmDialog(false)}
        title="Upload Scientific CV"
        description="Are you sure you want to upload your Scientific CV to this project? If you already have a Scientific CV uploaded, it will be replaced with the new one."
        size="md"
        showFooter={true}
        footerContent={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUploadConfirmDialog(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUploadScientificCV}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Confirm Upload"
              )}
            </Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <p className="text-gray-600">
            This action will upload your current Scientific CV to this project.
          </p>
        </div>
      </Modal>

      {/* Edit Document Modal - Special Modal for TinyMCE */}
      {showEditDialog && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              // Check if there are any TinyMCE dialogs open before closing
              const tinyMCEDialogs =
                document.querySelectorAll(".tox-dialog-wrap");
              if (tinyMCEDialogs.length === 0) {
                setShowEditDialog(false);
                setEditingDocument(null);
                setEditingContent("");
              }
            }}
          />

          {/* Modal Content with higher z-index for TinyMCE */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] flex flex-col z-[9999]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Document - {editingDocument?.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Make changes to the document content. Changes will be saved
                  when you click Save.
                </p>
              </div>
              <button
                onClick={() => {
                  const tinyMCEDialogs =
                    document.querySelectorAll(".tox-dialog-wrap");
                  if (tinyMCEDialogs.length === 0) {
                    setShowEditDialog(false);
                    setEditingDocument(null);
                    setEditingContent("");
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="flex flex-col gap-4 h-full">
                {/* Document Info */}
                {editingDocument && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span>
                        <strong>Type:</strong> {editingDocument.type}
                      </span>
                      <span>
                        <strong>Status:</strong> {editingDocument.status}
                      </span>
                      <span>
                        <strong>Last Updated:</strong>{" "}
                        {formatDateTime(
                          editingDocument["updated-at"] ||
                            editingDocument["upload-at"]
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Editor with high z-index */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="h-[500px] overflow-hidden relative"
                    style={{ zIndex: 10000 }}
                  >
                    <ScientificCVEditor
                      ref={editEditorRef}
                      value={editingContent}
                      onChange={handleEditorChange}
                      height={500}
                      preset="document"
                      readOnly={editingDocument?.status === "completed"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingDocument(null);
                    setEditingContent("");
                  }}
                  disabled={isEditLoading}
                >
                  Cancel
                </Button>

                {/* Show different buttons based on document status */}
                {editingDocument?.status === "completed" ? (
                  /* Completed document - View only */
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>Document is completed and read-only</span>
                  </div>
                ) : (
                  /* Save button for non-completed documents */
                  <Button
                    onClick={handleSaveEditDocument}
                    disabled={isEditLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isEditLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DocumentTab;
