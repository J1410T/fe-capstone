import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Document {
  name: string;
  url: string;
}

interface DocumentsCardProps {
  documents: Document[];
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Related documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <a href={doc.url} download>
                <Download className="mr-2 h-4 w-4" />
                {doc.name}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
