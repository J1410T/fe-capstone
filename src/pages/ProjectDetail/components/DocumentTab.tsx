import React from "react";
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
import { FileText, Download, Eye, FolderOpen } from "lucide-react";
import { DocumentProject } from "@/types/document";
import { formatDateTime } from "@/utils";

interface DocumentTabProps {
  documents: DocumentProject[];
}

const DocumentTab: React.FC<DocumentTabProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] =
    React.useState<DocumentProject | null>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDocument = (document: DocumentProject) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  const handleDownloadDocument = (document: DocumentProject) => {
    console.log("Downloading document:", document.name);
    // TODO: Implement actual download functionality
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Project Documents
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              View and manage all project-related documents
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sm:w-[300px]">
                  Document
                </TableHead>
                <TableHead className="min-w-[120px]">Type</TableHead>
                <TableHead className="min-w-[120px]">Upload Date</TableHead>
                <TableHead className="min-w-[120px]">Updated</TableHead>
                <TableHead className="text-right min-w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {document.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
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
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{document.type}</TableCell>
                  <TableCell className="text-sm">
                    {formatDateTime(document.uploadAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDateTime(document.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No documents found</p>
              <p className="text-sm text-muted-foreground">
                No documents have been uploaded for this project yet.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>Document Details</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedDocument.status)}
                    >
                      {selectedDocument.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Upload Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(selectedDocument.uploadAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(selectedDocument.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date in Document</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.dateInDoc}
                  </p>
                </div>
              </div>

              {selectedDocument.documentFields &&
                selectedDocument.documentFields.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Document Fields</p>
                    <div className="mt-2 space-y-2">
                      {selectedDocument.documentFields
                        .slice(0, 3)
                        .map((field) => (
                          <div
                            key={field.id}
                            className="p-2 bg-gray-50 rounded"
                          >
                            <p className="text-xs font-medium">
                              {field.chapter}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {field.title}
                            </p>
                          </div>
                        ))}
                      {selectedDocument.documentFields.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{selectedDocument.documentFields.length - 3} more
                          fields
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {selectedDocument && (
              <Button onClick={() => handleDownloadDocument(selectedDocument)}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentTab;
