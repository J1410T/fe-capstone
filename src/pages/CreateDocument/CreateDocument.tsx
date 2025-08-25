import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, FileText } from "lucide-react";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import {
  useCreateDocument,
  useDocumentsByFilter,
} from "@/hooks/queries/document";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";
import { toast } from "sonner";

// Document types that can be created by PI
const DOCUMENT_TYPES = [
  { value: "BM6", label: "Project Summary (BM6)" },
  { value: "BM7", label: "Amendment to the Process(BM7)" },
  { value: "BM8", label: "Register Seminar(BM8)" },
  { value: "BM9", label: "Progress Report(BM9)" },
  { value: "BM13", label: "Acceptance and Settlement of Contract (BM13)" },
];

interface CreateDocumentForm {
  name: string;
  type: string;
  content: string;
}

const CreateDocument: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<ScientificCVEditorRef>(null);

  const [form, setForm] = useState<CreateDocumentForm>({
    name: "",
    type: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // API hooks
  const createDocument = useCreateDocument();

  // Fetch template when document type is selected
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    refetch: refetchTemplate,
  } = useDocumentsByFilter(
    form.type,
    true, // is-template
    1,
    1,
    !!form.type // Only fetch when type is selected
  );

  const handleBack = () => {
    const basePath =
      user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "/pi" : "/researcher";
    navigate(`${basePath}/project/${projectId}`);
  };

  const handleTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      type: value,
      name: DOCUMENT_TYPES.find((type) => type.value === value)?.label || "",
    }));

    // Reset template and content when changing type
    setSelectedTemplate("");
    setForm((prev) => ({ ...prev, content: "" }));

    // Refetch template when type changes
    refetchTemplate();
  };

  // Automatically load template when templateData is available
  useEffect(() => {
    if (
      templateData?.data?.["data-list"]?.length &&
      templateData.data["data-list"].length > 0 &&
      form.type &&
      !selectedTemplate // Only load if no template is already selected
    ) {
      const template = templateData.data["data-list"][0];
      const templateContent = template["content-html"].replace(/\\"/g, '"');
      setForm((prev) => ({ ...prev, content: templateContent }));
      setSelectedTemplate(template.name);

      // Update the editor content with a small delay to ensure editor is ready
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.setContent(templateContent);
        }
      }, 100);

      toast.success(`Template "${template.name}" loaded automatically!`);
    }
  }, [templateData, form.type, selectedTemplate]);

  const handleEditorChange = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    if (!form.type) {
      toast.error("Please select a document type");
      return;
    }

    const content = editorRef.current?.getContent() || form.content;
    if (!content.trim()) {
      toast.error("Please add content to the document");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      await createDocument.mutateAsync({
        name: form.name,
        type: form.type,
        "content-html": content,
        "project-id": projectId,
        status: "draft",
        "is-template": false,
      });

      toast.success("Document created successfully!");
      handleBack();
    } catch (error) {
      console.error("Failed to create document:", error);
      toast.error("Failed to create document");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authorized
  if (!user || user.role !== UserRole.PRINCIPAL_INVESTIGATOR) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Only Principal Investigators can create documents.
            </p>
            <Button onClick={handleBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Document</h1>
          <p className="text-gray-600 mt-1">
            Create a new document for this project
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Details
            </CardTitle>
            <CardDescription>
              Configure your document settings before creating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Document Type *</Label>
              <Select onValueChange={handleTypeChange} value={form.type}>
                <SelectTrigger
                  className={`mt-1 ${!form.type ? "border-red-200" : ""}`}
                >
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!form.type && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a document type
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter document name"
                className={`mt-1 ${!form.name.trim() ? "border-red-200" : ""}`}
              />
              {!form.name.trim() && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a document name
                </p>
              )}
            </div>

            {/* Template Status */}
            {form.type && (
              <div className="pt-2 border-t">
                {isTemplateLoading ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      🔄 Loading template for {form.type}...
                    </p>
                  </div>
                ) : selectedTemplate ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✓ Template "{selectedTemplate}" loaded automatically
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      ⚠️ No template available for {form.type}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Document Content *</CardTitle>
            <CardDescription>
              Write detailed document content using the editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {!form.type && (
                <div className="mb-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    Select Document Type First
                  </p>
                  <p className="text-sm text-gray-500">
                    Choose a document type to load the appropriate template
                  </p>
                </div>
              )}
              <ScientificCVEditor
                ref={editorRef}
                value={form.content}
                onChange={handleEditorChange}
                height={500}
                preset="document"
                placeholder={
                  form.type
                    ? "Enter detailed document content..."
                    : "Please select document type first..."
                }
                readOnly={!form.type || isTemplateLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !form.type || !form.name.trim()}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateDocument;
