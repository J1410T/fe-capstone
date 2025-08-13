import React, { useEffect, useState, useCallback } from "react";
import { DocumentTinyMCE } from "@/components/ui/TinyMCE";
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
import { Loading } from "@/components";

interface ProjectSummaryStepProps {
  onContentChange: (content: string) => void;
  onNext: () => void;
  projectDocuments?: DocumentProject[] | null;
  onDocumentCreated?: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  onContentChange,
  onNext,
  onDocumentCreated,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [editorContent, setEditorContent] = useState<string>("");

  const [formContent, setFormContent] = useState<string>("");
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [documentCreated, setDocumentCreated] = useState(false);

  // Use useDocumentByProjectIdWithUserRole to find BM1 document
  const { data: documentsWithUserRole, isLoading: isLoadingDocuments } =
    useDocumentByProjectIdWithUserRole(
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

  // FIX: Wait for documents to load before deciding to fetch template
  // Only fetch template when we've confirmed there's no BM1 document
  const shouldFetchTemplate =
    !isLoadingDocuments &&
    !bm1Document &&
    !documentCreated &&
    !isCreatingDocument;

  // Only fetch template when needed
  const { data: templateData, isLoading: isLoadingTemplate } =
    useDocumentsByFilter("BM1", true, 1, 1, shouldFetchTemplate);

  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();

  const createDocumentFromTemplate = useCallback(async () => {
    // FIX: Wait for documents API to finish loading before attempting to create
    if (
      isLoadingDocuments || // Wait for documents to load
      bm1Document || // If we already have BM1 document, don't create
      !templateData?.data?.["data-list"]?.length ||
      isCreatingDocument ||
      documentCreated ||
      !projectId
    ) {
      return;
    }

    console.log("Creating BM1 document from template...");
    setIsCreatingDocument(true);
    const templateDoc: DocumentForm = templateData.data["data-list"][0];
    const templateContent = templateDoc["content-html"].replace(/\\"/g, '"');

    try {
      const newDocument = await createDocumentMutation.mutateAsync({
        name: "Registration form",
        type: "BM1",
        "is-template": false,
        "content-html": templateContent,
        "project-id": projectId,
        status: "draft",
      });

      console.log("BM1 document created successfully:", newDocument);
      setDocumentCreated(true);
      onDocumentCreated?.();

      // FIX: Set the created content to state
      setFormContent(templateContent);
      setEditorContent(templateContent);
    } catch (error) {
      console.error("Failed to create document:", error);
      // Fallback: use template content directly
      setFormContent(templateContent);
      setEditorContent(templateContent);
      toast.error("Failed to create document, using template content directly");
    } finally {
      setIsCreatingDocument(false);
    }
  }, [
    isLoadingDocuments, // FIX: Add this dependency
    bm1Document,
    templateData,
    isCreatingDocument,
    documentCreated,
    projectId,
    createDocumentMutation,
    onDocumentCreated,
  ]);

  useEffect(() => {
    // FIX: Wait for documents API to finish loading before making decisions
    if (isLoadingDocuments) {
      console.log("Still loading documents...");
      return;
    }

    if (bm1Document) {
      // FIX: If we have existing BM1 document, use it and don't try to create new one
      const unescapedHtml = bm1Document["content-html"].replace(/\\"/g, '"');
      setFormContent(unescapedHtml);
      setEditorContent(unescapedHtml);
      console.log("Using existing BM1 document:", bm1Document.id);
    } else if (!documentCreated && !isCreatingDocument) {
      // FIX: Only try to create if we haven't created one yet and not currently creating
      console.log("No BM1 document found, attempting to create from template");
      createDocumentFromTemplate();
    }
  }, [
    isLoadingDocuments, // FIX: Add this dependency
    bm1Document,
    createDocumentFromTemplate,
    documentCreated,
    isCreatingDocument,
  ]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onContentChange(content);
  };

  const handleNext = () => {
    onContentChange(editorContent);
    onNext();
  };

  const handleSave = async () => {
    if (!bm1Document || !projectId) {
      toast.error("Document not found or project ID missing");
      return;
    }

    onContentChange(editorContent);

    try {
      await updateDocumentMutation.mutateAsync({
        id: bm1Document.id,
        name: bm1Document.name,
        type: bm1Document.type,
        "is-template": false,
        "content-html": editorContent,
        status: "draft",
        "project-id": projectId,
      });

      toast.success("Document saved successfully!");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save document. Please try again.");
    }
  };

  const isLoading =
    isLoadingDocuments ||
    isLoadingTemplate ||
    isCreatingDocument ||
    createDocumentMutation.isPending;

  return (
    <div>
      <Card className="border-0 shadow-lg bg-white pt-0 p-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project Summary Document
          </CardTitle>
          <CardDescription>
            Create and edit project summary documents using templates.
          </CardDescription>
          <div className="mt-3 p-3 rounded-md border border-blue-300 bg-blue-50 text-sm text-blue-800">
            💡 <strong>Signing instruction:</strong> If you want to sign, please
            upload your signature image and place it exactly where you want the
            signature to appear in the document.
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-0 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <Loading className="w-full max-w-md" />
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
            <DocumentTinyMCE
              value={formContent}
              onChange={handleEditorChange}
              height={800}
              preset="document"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
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
