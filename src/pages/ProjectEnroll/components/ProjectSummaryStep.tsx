import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useDocumentsByFilter } from "@/hooks/queries/useDocumentsByFilter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, File } from "lucide-react";
import { DocumentForm } from "@/types/document";

type EditorInstance = TinyMCEEditor | null;

interface ProjectSummaryStepProps {
  onContentChange: (content: string) => void;
  onNext: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  onContentChange,
  onNext,
}) => {
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const { data, isLoading, error } = useDocumentsByFilter("BM1", true, 1, 1);
  const [formContent, setFormContent] = useState<string>("");

  useEffect(() => {
    const documentList: DocumentForm[] = data?.data?.["data-list"] ?? [];
    const firstDoc: DocumentForm | undefined = documentList[0];
    if (firstDoc?.["content-html"]) {
      // Giải mã chuỗi JSON có \\\" thành "
      const unescapedHtml = firstDoc["content-html"].replace(/\\"/g, '"');
      setFormContent(unescapedHtml);
    }
  }, [data]);

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  const handleNext = () => {
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
    onNext();
  };
  const handleSave = () => {
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
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
                <p className="text-gray-600">Loading BM1 template...</p>
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

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleSave}
          size="lg"
          className="px-8 mr-4"
        >
          <File className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={handleNext} size="lg" disabled={isLoading}>
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
