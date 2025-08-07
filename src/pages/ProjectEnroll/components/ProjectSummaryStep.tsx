import React, { useRef, useEffect, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useParams } from "react-router-dom";
import {
  useDocumentsByFilter,
  useCreateDocument,
  useUpdateDocument,
  useDocumentByProjectIdWithUserRole,
} from "@/hooks/queries/document";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, File } from "lucide-react";
import { DocumentForm, DocumentProject } from "@/types/document";
import { toast } from "sonner";

type EditorInstance = TinyMCEEditor | null;

interface ProjectSummaryStepProps {
  onContentChange: (content: string) => void;
  onNext: () => void;
  projectDocuments?: DocumentProject[] | null;
  onDocumentCreated?: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  onContentChange,
  onNext,
  // projectDocuments,
  onDocumentCreated,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const [formContent, setFormContent] = useState<string>("");
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [documentCreated, setDocumentCreated] = useState(false);

  // Use useDocumentByProjectIdWithUserRole to find BM1 document like in InviteMembersStep
  const { data: documentsWithUserRole } = useDocumentByProjectIdWithUserRole(
    {
      "is-template": false,
      status: "draft",
      "page-index": 1,
      "page-size": 100,
      "project-id": projectId || "",
    },
    !!projectId
  );

  // Find BM1 document from the API response
  const bm1Document = documentsWithUserRole?.["data-list"]?.find(
    (doc) => doc.type === "BM1"
  );
  const shouldFetchTemplate = !bm1Document && !documentCreated;

  // Only fetch template when needed
  const { data: templateData, isLoading: isLoadingTemplate } =
    useDocumentsByFilter("BM1", true, 1, 1, shouldFetchTemplate);

  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();

  const createDocumentFromTemplate = useCallback(async () => {
    if (
      !shouldFetchTemplate ||
      !templateData?.data?.["data-list"]?.length ||
      isCreatingDocument ||
      documentCreated ||
      !projectId
    ) {
      return;
    }

    setIsCreatingDocument(true);
    const templateDoc: DocumentForm = templateData.data["data-list"][0];
    const templateContent = templateDoc["content-html"].replace(/\\"/g, '"');

    try {
      await createDocumentMutation.mutateAsync({
        name: "Registration form",
        type: "BM1",
        "is-template": false,
        "content-html": templateContent,
        "project-id": projectId,
        status: "draft",
      });

      setDocumentCreated(true);
      onDocumentCreated?.();
    } catch (error) {
      console.error("Failed to create document:", error);
      // Fallback: use template content directly
      setFormContent(templateContent);
    } finally {
      setIsCreatingDocument(false);
    }
  }, [
    shouldFetchTemplate,
    templateData,
    isCreatingDocument,
    documentCreated,
    projectId,
    createDocumentMutation,
    onDocumentCreated,
  ]);

  useEffect(() => {
    if (bm1Document) {
      // Use existing BM1 document from project
      const unescapedHtml = bm1Document["content-html"].replace(/\\"/g, '"');
      setFormContent(unescapedHtml);
    } else {
      // Create document from template
      createDocumentFromTemplate();
    }
  }, [bm1Document, createDocumentFromTemplate]);

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  const handleNext = () => {
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
    onNext();
  };

  const handleSave = async () => {
    if (!bm1Document || !projectId) {
      toast.error("Document not found or project ID missing");
      return;
    }

    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);

    try {
      await updateDocumentMutation.mutateAsync({
        id: bm1Document.id,
        name: bm1Document.name,
        type: bm1Document.type,
        "is-template": false,
        "content-html": currentContent,
        status: "draft",
        "project-id": projectId,
      });

      toast.success("Document saved successfully!");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save document. Please try again.");
    }
  };

  const formStyles = `
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 14px;
      line-height: 1.4;
      color: #333;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #ccc;
    }
  `;

  const isLoading =
    isLoadingTemplate || isCreatingDocument || createDocumentMutation.isPending;

  return (
    <div>
      <Card className="border-0 shadow-lg bg-white pt-0 p-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project Summary Document
          </CardTitle>
          <CardDescription>
            Create and edit project summary documents using templates
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 mt-0 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isCreatingDocument
                    ? "Creating document..."
                    : "Loading BM1 template..."}
                </p>
              </div>
            </div>
          ) : createDocumentMutation.isError ? (
            <div className="text-center text-red-500 p-6">
              ⚠️ Error creating document:{" "}
              {createDocumentMutation.error?.message}
            </div>
          ) : (
            <Editor
              apiKey={apiKey}
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue={formContent}
              onEditorChange={handleEditorChange}
              init={{
                height: 800,
                width: "100%",
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
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
                content_style: formStyles,
              }}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleSave}
          size="lg"
          className="px-8 mr-4"
          disabled={
            isLoading || updateDocumentMutation.isPending || !bm1Document
          }
        >
          <File className="w-4 h-4 mr-2" />
          {updateDocumentMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button onClick={handleNext} size="lg" disabled={isLoading}>
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
