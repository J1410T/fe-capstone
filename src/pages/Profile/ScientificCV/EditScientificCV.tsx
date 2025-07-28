import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useScientificCV,
  useUpdateDocument,
} from "@/hooks/queries/useDocuments";
import { toast } from "sonner";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const EditScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const [isLoading, setIsLoading] = useState(false);

  const {
    data: scientificCV,
    isLoading: isCVLoading,
    error,
  } = useScientificCV(user?.id || "");
  const updateDocument = useUpdateDocument();

  const handleEditorChange = () => {
    // Optional: You can add any additional logic here
  };

  const handleSave = async () => {
    if (!scientificCV?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    setIsLoading(true);

    updateDocument.mutate(
      {
        id: scientificCV.id,
        data: {
          contentHtml: content,
        },
      },
      {
        onSuccess: () => {
          toast.success("Scientific CV updated successfully!");
          navigate("/profile/scientific-cv/view");
        },
        onError: (error) => {
          console.error("Failed to update Scientific CV:", error);
          toast.error("Failed to update Scientific CV");
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
          {isCVLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Scientific CV...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-6">
              ⚠️ Error: {(error as Error).message}
            </div>
          ) : (
            <Editor
              apiKey={apiKey}
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue={scientificCV?.contentHtml || ""}
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
          onClick={() => navigate("/profile/scientific-cv/view")}
          size="lg"
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to View
        </Button>
        <Button
          onClick={handleSave}
          size="lg"
          disabled={isLoading || isCVLoading}
          className="px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditScientificCV;
