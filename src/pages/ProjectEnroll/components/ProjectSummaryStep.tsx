import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, File } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";
import { DocumentForm } from "@/types/document";
import { documentQueryKeys } from "@/hooks/queries/useDocuments";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

interface ProjectSummaryStepProps {
  onContentChange: (content: string) => void;
  onNext: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  onContentChange,
  onNext,
}) => {
  const editorRef = useRef<EditorInstance>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Fetch BM1 templates from API with error handling
  const {
    data: documentsResponse,
    isLoading: documentsLoading,
    error: documentsError,
  } = useQuery({
    queryKey: documentQueryKeys.list({ type: "BM1", "is-template": true }),
    queryFn: async () => {
      try {
        console.log("Attempting to fetch BM1 templates from API...");
        const result = await queryApi.getPaginated<DocumentForm>("/documents", {
          type: "BM1",
          "is-template": true,
        });
        console.log("API call successful:", result);
        return result;
      } catch (error) {
        console.error("Error fetching BM1 templates:", error);
        // Return empty result instead of throwing
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    },
    throwOnError: false,
    retry: false,
    enabled: true, // Always try to fetch
  });

  // Load BM1 template from API
  useEffect(() => {
    console.log("ProjectSummaryStep - Template loading effect:", {
      documentsLoading,
      documentsResponse,
      documentsError,
      hasData: documentsResponse?.data?.length || 0,
    });

    if (!documentsLoading) {
      const defaultContent = `<h2>Project Summary (BM1)</h2><p><strong>Project Title:</strong> [Enter project title]</p><p><strong>Project Description:</strong></p><p>[Enter detailed project description here]</p><p><strong>Objectives:</strong></p><ul><li>[Objective 1]</li><li>[Objective 2]</li></ul><p><strong>Methodology:</strong></p><p>[Enter methodology here]</p><p><strong>Expected Outcomes:</strong></p><p>[Enter expected outcomes here]</p>`;

      if (documentsError) {
        console.error("Error loading BM1 templates:", documentsError);
        console.log("Using default content due to API error");
        setFormContent(defaultContent);
        onContentChange(defaultContent);
        setFormStyles("");
        setIsLoading(false);
        return;
      }

      if (
        documentsResponse &&
        documentsResponse.data &&
        documentsResponse.data.length > 0
      ) {
        console.log("Found BM1 templates:", documentsResponse.data);
        const templateDoc = documentsResponse.data[0];
        const htmlContent =
          templateDoc["content-html"] || templateDoc.contentHtml || "";

        console.log("Template HTML content:", htmlContent);

        if (htmlContent) {
          const styleMatch = htmlContent.match(
            /<style[^>]*>([\s\S]*?)<\/style>/i
          );
          const extractedStyles = styleMatch ? styleMatch[1] : "";
          setFormStyles(extractedStyles);

          const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          const content = bodyMatch
            ? bodyMatch[1]
            : htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

          console.log("Extracted styles:", extractedStyles);
          console.log("Extracted content:", content);

          setFormContent(content);
          onContentChange(content);
        } else {
          console.log("No HTML content found in template, using default");
          setFormContent(defaultContent);
          onContentChange(defaultContent);
          setFormStyles("");
        }
      } else {
        console.log("No BM1 templates found, using default content");
        setFormContent(defaultContent);
        onContentChange(defaultContent);
        setFormStyles("");
      }
      setIsLoading(false);
    }
  }, [documentsLoading, documentsResponse, documentsError, onContentChange]);

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

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white pt-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project Summary Document
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading || documentsLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading BM1 template...</p>
                <p className="text-xs text-gray-500 mt-2">
                  API Status: {documentsError ? "Error" : "Loading..."}
                </p>
              </div>
            </div>
          ) : documentsError ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="text-red-500 mb-4">⚠️</div>
                <p className="text-gray-600 mb-2">
                  API Error - Using Default Template
                </p>
                <p className="text-xs text-gray-500">
                  Error: {documentsError.message || "Unknown error"}
                </p>
                <Editor
                  key={formContent + formStyles}
                  apiKey={apiKey}
                  onInit={(_, editor) => (editorRef.current = editor)}
                  initialValue={formContent}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 600,
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
                    toolbar: [
                      "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify",
                      "bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
                    ].join(" | "),
                    content_style: `
                      ${formStyles}
                      body {
                        font-family: "Times New Roman", Times, serif;
                        font-size: 13px;
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
                      th, td {
                        padding: 8px;
                        text-align: left;
                      }
                    `,
                  }}
                />
              </div>
            </div>
          ) : (
            <Editor
              key={formContent + formStyles}
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
                toolbar: [
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify",
                  "bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
                ].join(" | "),
                content_style: `
                  ${formStyles}
                  body {
                    font-family: "Times New Roman", Times, serif;
                    font-size: 13px;
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
                  th, td {
                    padding: 8px;
                    text-align: left;
                  }
                `,
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
          className="px-8 mr-3"
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
