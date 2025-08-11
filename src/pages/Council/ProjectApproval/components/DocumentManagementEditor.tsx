import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import EnhancedTinyMCEViewer from "./EnhancedTinyMCEViewer";

interface Document {
  id: string;
  title: string;
  type: string;
  fileSize: string;
  uploadedDate: string;
  content?: string;
  url?: string;
}

interface DocumentManagementEditorProps {
  documents: Document[];
  onDocumentsUpdate?: (documents: Document[]) => void;
  readOnly?: boolean;
  className?: string;
  title?: string;
}

export const DocumentManagementEditor: React.FC<
  DocumentManagementEditorProps
> = ({
  documents,
  onDocumentsUpdate,
  readOnly = false,
  className = "",
  title = "Document Management",
}) => {
  const generateDocumentContent = (): string => {
    if (documents && documents.length > 0) {
      return generateDocumentHTML(documents);
    }

    return `
      <h3>Project Documents</h3>
      <p><em>No documents have been uploaded yet. Use the editor to add document information and content.</em></p>

      <h4>Document Management Features:</h4>
      <ul>
        <li>Add document descriptions and metadata</li>
        <li>Include document summaries and key points</li>
        <li>Link to external document files</li>
        <li>Format content using rich text editor tools</li>
        <li>Organize documents by type and importance</li>
      </ul>

      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 12px; margin-top: 16px;">
        <p style="margin: 0; color: #0c4a6e;"><strong>Tip:</strong> Use this editor to create comprehensive document summaries,
        add review notes, or provide additional context for uploaded files.</p>
      </div>
    `;
  };

  const generateDocumentHTML = (docs: Document[]): string => {
    return `
      <h3>Project Documents (${docs.length})</h3>
      
      ${docs
        .map(
          (doc) => `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: #f9fafb;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h4 style="margin: 0; color: #1f2937;">${doc.title}</h4>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
              ${doc.type}
            </span>
          </div>
          
          <div style="margin-bottom: 12px;">
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              <strong>File Size:</strong> ${doc.fileSize}
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>Uploaded:</strong> ${new Date(
                doc.uploadedDate
              ).toLocaleDateString()}
            </p>
          </div>
          
          ${
            doc.content
              ? `
            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; margin-top: 12px;">
              <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Document Summary:</h5>
              <div style="color: #4b5563; font-size: 14px; line-height: 1.5;">
                ${doc.content}
              </div>
            </div>
          `
              : `
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin-top: 12px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <em>No summary available. Add document content using the editor.</em>
              </p>
            </div>
          `
          }
          
          ${
            doc.url
              ? `
            <div style="margin-top: 12px;">
              <a href="${doc.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px;" target="_blank">
                📎 View Original Document
              </a>
            </div>
          `
              : ""
          }
        </div>
      `
        )
        .join("")}
      
      <div style="margin-top: 24px; padding: 16px; background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">Document Review Notes</h4>
        <p style="margin: 0; color: #047857; font-size: 14px;">
          Use this section to add review comments, evaluation notes, or additional observations about the documents.
        </p>
        <div style="margin-top: 12px; padding: 12px; background-color: #ffffff; border-radius: 6px; min-height: 60px;">
          <p style="margin: 0; color: #6b7280; font-style: italic;">
            Add your review notes here...
          </p>
        </div>
      </div>
    `;
  };

  const handleDocumentSave = async (content: string) => {
    if (onDocumentsUpdate) {
      // In a real implementation, you'd parse the HTML and update document objects
      console.log("Saving document content:", content);
      // For now, just call the update function with existing documents
      onDocumentsUpdate(documents);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              View and manage project documents with rich text summaries
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {documents && documents.length > 0 && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-200"
              >
                {documents.length} Document{documents.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <EnhancedTinyMCEViewer
          content={generateDocumentContent()}
          height={500}
          editable={!readOnly}
          onSave={handleDocumentSave}
          showHeader={false}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentManagementEditor;
