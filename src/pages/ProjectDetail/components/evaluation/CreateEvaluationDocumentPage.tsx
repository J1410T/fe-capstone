import React, { useState, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Save, AlertCircle, ChevronLeft } from "lucide-react";
import { useCreateDocument } from "@/hooks/queries/useDocuments";
import { toast } from "sonner";
import Header from "@/components/layout/header";
import { useNavigate, useParams } from "react-router-dom";

const EVALUATION_TEMPLATES = [
  { value: "BM10", label: "BM10 - Evaluation Report" },
  { value: "BM11", label: "BM11 - Review Summary" },
  { value: "BM12", label: "BM12 - Assessment Form" },
];

const CreateEvaluationDocumentPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("BM10");
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isSaving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<{ getContent: () => string } | null>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const evaluation = { projectId }; // Mock evaluation object to fix the error

  const createDocument = useCreateDocument();

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

      await createDocument.mutateAsync({
        name: `${selectedTemplate} - New Evaluation Document`,
        type: selectedTemplate,
        contentHtml: content,
        isTemplate: false,
      });

      setHasUnsavedChanges(false);
      toast.success("Document created successfully!");
    } catch (error) {
      console.error("Failed to create document:", error);
      toast.error("Failed to create document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-6 space-y-6 mt-15">
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 flex items-center gap-1"
            onClick={() =>
              navigate(`/project/${evaluation.projectId}/evaluation/stage/$`)
            }
          >
            <ChevronLeft className="w-4 h-4" /> Evaluation Stage Detail
          </Button>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">
            Create New Evaluation
          </span>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Create Evaluation Document
                </CardTitle>
                <CardDescription>
                  Select a template and create a new evaluation document
                </CardDescription>
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
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>

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
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Instructions:</strong> Select a template above to load the
            document structure. Edit the content as needed and save your
            changes. The document will be created and can be accessed later.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CreateEvaluationDocumentPage;
