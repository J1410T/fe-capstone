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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { DocumentWithUserRole } from "@/types/document";
import { formatDateTime } from "@/utils";
import { getStatusColor } from "../shared/utils";
import { TinyMCEViewer } from "@/components/ui/TinyMCE";
import { FORM_TYPES, FormStatus } from "@/pages/FormRegister/constants";
import { UserRole } from "@/contexts/auth-types";
import {
  useScientificCVByEmail,
  useCreateDocument,
  useDocumentByProjectIdWithUserRole,
  useUpdateDocument,
} from "@/hooks/queries/document";
import { useMyAccountInfo } from "@/hooks/queries/useAuth";
import { getAuthResponse } from "@/utils/cookie-manager";
import { toast } from "sonner";
import { useAuth } from "@/contexts";
import { useNavigate } from "react-router-dom";

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
  const [isUploading, setIsUploading] = React.useState(false);
  const [showUploadConfirmDialog, setShowUploadConfirmDialog] =
    React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get email from auth response cookie
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  // Auth and navigation
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's Scientific CV by email
  const { data: scientificCV, isLoading: isCVLoading } = useScientificCVByEmail(
    userEmail,
    !!userEmail && isProposal
  );

  // API hooks
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const { data: myAccountInfo } = useMyAccountInfo();

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

    const formType = FORM_TYPES[document.type];
    if (!formType) return false;

    // Map document status to form status
    let formStatus: FormStatus;
    switch (document.status) {
      case "draft":
        formStatus = FormStatus.DRAFT;
        break;
      case "waiting-for-pi":
        formStatus = FormStatus.WAITING_FOR_PI;
        break;
      case "waiting-for-staff":
        formStatus = FormStatus.WAITING_FOR_STAFF;
        break;
      case "finalized":
        formStatus = FormStatus.FINALIZED;
        break;
      default:
        formStatus = FormStatus.DRAFT;
    }

    // Determine last updater role based on account-id and user info
    // This is a simplified logic - you might need more sophisticated role detection
    let lastUpdatedBy: UserRole = UserRole.STAFF; // Default to staff

    // If document has account-id, try to determine the role
    // This is a basic implementation - you might need to enhance this based on your user role system
    if (document["account-id"]) {
      // For now, assume if it's not the current user, it was updated by the other role
      if (document["account-id"] !== user.id) {
        lastUpdatedBy =
          user.role === UserRole.STAFF
            ? UserRole.PRINCIPAL_INVESTIGATOR
            : UserRole.STAFF;
      } else {
        lastUpdatedBy = user.role;
      }
    }

    return formType.workflow.canEdit(formStatus, user.role, lastUpdatedBy);
  };

  const handleEditDocument = (document: DocumentWithUserRole) => {
    if (document.type === "BM5") {
      // Navigate to form edit page for BM5 contracts
      navigate(`/forms/edit/${document.id}`);
    }
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
          status: "daft",
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
          status: "daft",
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
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(document)}
                        >
                          <Download className="w-3 h-3" />
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

      {/* --- View Dialog --- */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden px-4 pt-5">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name || "Document"}</DialogTitle>
          </DialogHeader>
          {selectedDocument ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
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
              <div className="flex-1 overflow-hidden p-4 bg-white">
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
                    <p className="text-gray-500">No content available.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading document...</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Scientific CV Confirmation Dialog */}
      <Dialog
        open={showUploadConfirmDialog}
        onOpenChange={setShowUploadConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Scientific CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to upload your Scientific CV to this
              project? If you already have a Scientific CV uploaded, it will be
              replaced with the new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentTab;
