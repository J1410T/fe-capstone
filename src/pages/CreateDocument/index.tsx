import React, { useState, useRef } from "react";
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

// Document types that can be created by PI
const DOCUMENT_TYPES = [
  { value: "BM1", label: "Registration Form (BM1)" },
  { value: "BM2", label: "Scientific CV (BM2)" },
  { value: "BM3", label: "Evaluation Document (BM3)" },
  { value: "BM4", label: "Research Report (BM4)" },
  { value: "BM6", label: "Project Summary (BM6)" },
  { value: "BM10", label: "Progress Report (BM10)" },
  { value: "BM11", label: "Final Report (BM11)" },
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

    // Refetch template when type changes
    refetchTemplate();
  };

  const handleLoadTemplate = () => {
    if (
      templateData?.data?.["data-list"]?.length &&
      templateData.data["data-list"].length > 0
    ) {
      const template = templateData.data["data-list"][0];
      const templateContent = template["content-html"].replace(/\\"/g, '"');
      setForm((prev) => ({ ...prev, content: templateContent }));
      setSelectedTemplate(template.name);
      toast.success("Template loaded successfully!");
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Document
            </h1>
            <p className="text-gray-600">
              Create a new document for this project
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Details
                </CardTitle>
                <CardDescription>
                  Configure your document settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type">Document Type</Label>
                  <Select onValueChange={handleTypeChange} value={form.type}>
                    <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="name">Document Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter document name"
                  />
                </div>

                {form.type && (
                  <div>
                    <Button
                      onClick={handleLoadTemplate}
                      disabled={isTemplateLoading}
                      className="w-full"
                      variant="outline"
                    >
                      {isTemplateLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading Template...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Load Template
                        </>
                      )}
                    </Button>
                    {selectedTemplate && (
                      <p className="text-sm text-green-600 mt-2">
                        Template "{selectedTemplate}" loaded
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !form.name || !form.type}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Document Content</CardTitle>
                <CardDescription>
                  Create your document content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <ScientificCVEditor
                    ref={editorRef}
                    value={form.content}
                    onChange={handleEditorChange}
                    height={580}
                    preset="document"
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
