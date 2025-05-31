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
    <Card>
      <CardHeader>
        <CardTitle>Project Documents</CardTitle>
        <CardDescription>Access and manage project documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{document.uploadedBy}</TableCell>
                <TableCell>{document.uploadDate}</TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>
          <FileUp className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </CardFooter>
    </Card>
  );
};
