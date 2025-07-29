import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Save,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useDocumentsByFilter } from "@/hooks/queries/useDocumentsByFilter";
import { useCreateDocument } from "@/hooks/queries/useDocuments";
import { DocumentForm } from "@/types/document";
import { toast } from "sonner";

interface EvaluationDocumentTabProps {
  evaluationId: string;
  documentId?: string;
}

type EditorInstance = { getContent: () => string } | null;

// Available document templates for evaluations
const EVALUATION_TEMPLATES = [
  { value: "BM10", label: "BM10 - Evaluation Report" },
  { value: "BM11", label: "BM11 - Review Summary" },
  { value: "BM12", label: "BM12 - Assessment Form" },
];

export const EvaluationDocumentTab: React.FC<EvaluationDocumentTabProps> = ({
  evaluationId,
  documentId,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("BM10");
  const [documentContent, setDocumentContent] = useState<string>("");
  // const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Fetch template documents
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useDocumentsByFilter(selectedTemplate, true, 1, 10);

  const createDocument = useCreateDocument();

  // Load template content when template selection changes
  useEffect(() => {
    if (templateData?.data?.["data-list"]) {
      const templates: DocumentForm[] = templateData.data["data-list"];
      const selectedTemplateDoc = templates.find(
        (doc) => doc.type === selectedTemplate
      );

      if (selectedTemplateDoc?.["content-html"]) {
        setDocumentContent(selectedTemplateDoc["content-html"]);
        setHasUnsavedChanges(false);
      }
    }
  }, [templateData, selectedTemplate]);

  const handleTemplateChange = (value: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved changes. Are you sure you want to switch templates?"
      );
      if (!confirmChange) return;
    }

    setSelectedTemplate(value);
    setHasUnsavedChanges(false);
  };

  const handleEditorChange = (content: string) => {
    setDocumentContent(content);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const content = editorRef.current?.getContent() || documentContent;

      // Create or update document
      await createDocument.mutateAsync({
        name: `${selectedTemplate} - Evaluation ${evaluationId}`,
        type: selectedTemplate,
        contentHtml: content,
        isTemplate: false,
        evaluationId: evaluationId,
        individualEvaluationId: evaluationId,
      });

      setHasUnsavedChanges(false);
      toast.success("Document saved successfully!");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const content = editorRef.current?.getContent() || documentContent;
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Document Preview</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                line-height: 1.6;
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handleDownload = () => {
    const content = editorRef.current?.getContent() || documentContent;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate}_evaluation_${evaluationId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (templateError) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load document templates. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Evaluation Document
              </CardTitle>
              <CardDescription>
                Create and edit evaluation documents using templates
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  Unsaved Changes
                </Badge>
              )}
              {documentId && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
                disabled={isTemplateLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {EVALUATION_TEMPLATES.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!documentContent}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!documentContent}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Editor */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Document Editor
          </CardTitle>
          <CardDescription>
            Edit the document content using the rich text editor below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTemplateLoading ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading template...</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Editor
                apiKey={apiKey}
                onInit={(_, editor) => {
                  editorRef.current = editor;
                }}
                value={documentContent}
                onEditorChange={handleEditorChange}
                init={{
                  height: 600,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "save",
                    "print",
                  ],
                  toolbar: [
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter",
                    "alignright alignjustify | bullist numlist outdent indent |",
                    "removeformat | help | save | print | preview",
                  ].join(" "),
                  content_style: `
                    body { 
                      font-family: Arial, sans-serif; 
                      font-size: 14px; 
                      line-height: 1.6;
                      max-width: 800px;
                      margin: 0 auto;
                      padding: 20px;
                    }
                  `,
                  save_onsavecallback: handleSave,
                  branding: false,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong> Select a template above to load the
          document structure. Edit the content as needed and save your changes.
          The document will be associated with this evaluation and can be
          accessed later.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EvaluationDocumentTab;
