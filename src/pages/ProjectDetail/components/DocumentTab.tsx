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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Eye, FolderOpen } from "lucide-react";
import { DocumentProject } from "@/types/document";
import { formatDateTime } from "@/utils";
import { getStatusColor } from "../shared/utils";

interface DocumentTabProps {
  documents: DocumentProject[];
}

const DocumentTab: React.FC<DocumentTabProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] =
    React.useState<DocumentProject | null>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);

  const handleViewDocument = (document: DocumentProject) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  const handleDownloadDocument = (document: DocumentProject) => {
    console.log("Download", document.name);
    // TODO: implement actual download
  };

  return (
    <Card className="shadow-sm">
      {/* --- Table header --- */}
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
          Project Documents
        </CardTitle>
        <CardDescription className="text-sm sm:text-base mt-1">
          View and manage all project-related documents
        </CardDescription>
      </CardHeader>

      {/* --- Document table --- */}
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload</TableHead>
              <TableHead>Updated</TableHead>
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
                        className={`${getStatusColor(document.status)} text-xs`}
                      >
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{formatDateTime(document["upload-at"])}</TableCell>
                <TableCell>
                  {document["updated-at"]
                    ? formatDateTime(document["updated-at"])
                    : "Not updated"}
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
      </CardContent>

      {/* --- View Dialog --- */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument ? selectedDocument.name : "Document"}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Type:</strong> {selectedDocument.type}
                </div>
                <div>
                  <strong>Date:</strong> {selectedDocument.dateInDoc}
                </div>
                <div>
                  <strong>Status:</strong> {selectedDocument.status}
                </div>
              </div>

              {selectedDocument.documentFields &&
              selectedDocument.documentFields.length > 0 ? (
                <div className="space-y-6">
                  {selectedDocument.documentFields.map((field) => (
                    <div key={field.id} className="border-b pb-4">
                      {field.chapter && (
                        <h2 className="text-xl font-semibold mb-2">
                          {field.chapter}
                        </h2>
                      )}
                      {field.title && (
                        <h3 className="text-lg font-medium mb-2">
                          {field.title}
                        </h3>
                      )}
                      {field.subtitle && (
                        <h4 className="text-md font-medium mb-2 text-gray-700">
                          {field.subtitle}
                        </h4>
                      )}

                      {field.fieldContents &&
                        field.fieldContents.map((content) => (
                          <div key={content.id} className="mb-4">
                            {content.title && (
                              <h5 className="font-medium mb-2">
                                {content.title}
                              </h5>
                            )}
                            {content.content && (
                              <div className="prose prose-sm max-w-none">
                                <p>{content.content}</p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No document content available.</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No document selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentTab;
