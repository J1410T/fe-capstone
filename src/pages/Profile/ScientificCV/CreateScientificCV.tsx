import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useDocumentsByFilter } from "@/hooks/queries/document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDocument } from "@/hooks/queries/useDocuments";
import { toast } from "sonner";
import { DocumentForm } from "@/types/document";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const CreateScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const {
    data,
    isLoading: isTemplateLoading,
    error,
  } = useDocumentsByFilter("BM2", true, 1, 1);
  const createDocument = useCreateDocument();

  useEffect(() => {
    const documentList: DocumentForm[] = data?.data?.["data-list"] ?? [];
    const firstDoc: DocumentForm | undefined = documentList[0];
    if (firstDoc?.["content-html"]) {
      setFormContent(firstDoc["content-html"]);
    }
  }, [data]);

  const handleEditorChange = () => {
    // Optional: You can add any additional logic here
    // For now, we'll just let the editor handle the content
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    setIsLoading(true);

    createDocument.mutate(
      {
        name: "Scientific CV",
        type: "BM2",
        contentHtml: content,
        isTemplate: false,
      },
      {
        onSuccess: () => {
          toast.success("Scientific CV created successfully!");
          navigate("/profile");
        },
        onError: (error) => {
          console.error("Failed to create Scientific CV:", error);
          toast.error("Failed to create Scientific CV");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
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

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white pt-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project BM2 Document
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-0 pt-0">
          {isTemplateLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading BM2 template...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-6">
              ⚠️ API Error: {(error as Error).message}
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

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/profile")}
          size="lg"
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        <Button
          onClick={handleSave}
          size="lg"
          disabled={isLoading || isTemplateLoading}
          className="px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Scientific CV
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateScientificCV;
