import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Edit, Download } from "lucide-react";
import { ProjectDocument } from "./types";

interface DocumentViewerProps {
  document: ProjectDocument;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{document.name}</h3>
          <div className="grid grid-cols-1 gap-3 text-base">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Type:</span>
              <span className="text-gray-600 capitalize">{document.type.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Uploaded:</span>
              <span className="text-gray-600">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Uploaded by:</span>
              <span className="text-gray-600">{document.uploadedBy}</span>
            </div>
            {document.size && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">File size:</span>
                <span className="text-gray-600">{document.size}</span>
              </div>
            )}
          </div>
        </div>
        <Separator />
      </div>
      
      {/* Document Content */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Document Content</h4>
        <ScrollArea className="h-[500px] w-full border rounded-lg">
          <div className="p-8 bg-white">
            <div 
              className="prose prose-base max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: document.content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#374151'
              }}
            />
          </div>
        </ScrollArea>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-3 pt-6 border-t">
        <Button variant="outline" size="default" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="default" className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit Document
        </Button>
        <Button variant="default" size="default" className="flex-1">
          <FileText className="w-4 h-4 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );
};
