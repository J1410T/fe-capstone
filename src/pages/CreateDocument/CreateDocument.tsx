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
import { ArrowLeft, Save, FileText, Loader2 } from "lucide-react";
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
import { Loading } from "@/components";

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

  const handleLoadTemplate = () => {
    if (
      templateData?.data?.["data-list"]?.length &&
      templateData.data["data-list"].length > 0
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

      toast.success("Template reloaded successfully!");
    } else {
      toast.error("No template found for this document type");
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <button
            onClick={handleBack}
            className="hover:text-gray-700 transition-colors"
          >
            Projects
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={handleBack}
            className="hover:text-gray-700 transition-colors"
          >
            Project Detail
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Create Document</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Document
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new document for this project
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Document Details
                </CardTitle>
                <CardDescription>
                  Configure your document settings before creating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium">
                    Document Type <span className="text-red-500">*</span>
                  </Label>
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
                  <Label htmlFor="name" className="text-sm font-medium">
                    Document Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter document name"
                    className={`mt-1 ${
                      !form.name.trim() ? "border-red-200" : ""
                    }`}
                  />
                  {!form.name.trim() && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a document name
                    </p>
                  )}
                </div>

                {form.type && (
                  <div className="pt-2">
                    {selectedTemplate ? (
                      <div className="space-y-2">
                        <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700">
                            ✓ Template "{selectedTemplate}" loaded automatically
                          </p>
                        </div>
                        <Button
                          onClick={handleLoadTemplate}
                          disabled={isTemplateLoading}
                          className="w-full"
                          variant="outline"
                          size="sm"
                        >
                          {isTemplateLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Reloading...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Reload Template
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-700">
                            {isTemplateLoading
                              ? "Loading template..."
                              : "No template available for this document type"}
                          </p>
                        </div>
                        {!isTemplateLoading && (
                          <Button
                            onClick={handleLoadTemplate}
                            className="w-full"
                            variant="outline"
                            size="sm"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Try Load Template
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !form.name.trim() || !form.type}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Document...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Document
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    The document will be saved with "draft" status
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Section */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Document Content
                </CardTitle>
                <CardDescription>
                  Create your document content using the rich text editor below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] relative">
                  {!form.type && (
                    <div className="absolute inset-0 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center z-10">
                      <div className="text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">
                          Select Document Type
                        </p>
                        <p className="text-sm">
                          Choose a document type to start editing
                        </p>
                      </div>
                    </div>
                  )}
                  {form.type && isTemplateLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center z-10">
                      <Loading />
                    </div>
                  )}
                  <ScientificCVEditor
                    ref={editorRef}
                    value={form.content}
                    onChange={handleEditorChange}
                    height={580}
                    preset="document"
                    readOnly={!form.type || isTemplateLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;
