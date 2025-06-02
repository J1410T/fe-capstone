import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadCloud, FileUp } from "lucide-react";

interface Document {
  id: number;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
}

interface DocumentsTabProps {
  documents: Document[];
  onDownload: (documentId: number) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onDownload,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
          Project Documents
        </CardTitle>
        <CardDescription className="text-sm sm:text-base mt-1">
          Access and manage project documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-gray-900 flex-1 break-words">
                  {document.name}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {document.type}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Uploaded by:</span>
                  <span className="font-medium">{document.uploadedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{document.uploadDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{document.size}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => onDownload(document.id)}
              >
                <DownloadCloud className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sm:w-[300px]">
                  Document Name
                </TableHead>
                <TableHead className="min-w-[60px]">Type</TableHead>
                <TableHead className="min-w-[120px]">Uploaded By</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[80px]">Size</TableHead>
                <TableHead className="text-right min-w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium text-sm break-words">
                    {document.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {document.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.uploadedBy}
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.uploadDate}
                  </TableCell>
                  <TableCell className="text-sm">{document.size}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onDownload(document.id)}
                    >
                      <DownloadCloud className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center sm:justify-end pt-4 sm:pt-6">
        <Button className="w-full sm:w-auto text-sm sm:text-base">
          <FileUp className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
