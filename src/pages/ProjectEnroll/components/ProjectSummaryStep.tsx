import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

interface ProjectSummaryStepProps {
  projectId: string;
  bm1Content: string;
  onContentChange: (content: string) => void;
  onNext: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  projectId,
  bm1Content,
  onContentChange,
  onNext,
}) => {
  const editorRef = useRef<EditorInstance>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formContent, setFormContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Load BM1 template and any existing content
  useEffect(() => {
    const loadBM1Template = async () => {
      try {
        setIsLoading(true);

        // Try to fetch existing BM1 content for this project
        // In a real app, this would be an API call
        // const existingContent = await fetchBM1Content(projectId);

        // Load BM1 template
        const templateResponse = await fetch("/templates/BM1.html");
        const templateContent = await templateResponse.text();

        const stylesResponse = await fetch("/templates/BM1.css");
        const stylesContent = await stylesResponse.text();

        setFormStyles(stylesContent);

        // Use existing content if available, otherwise use template
        const contentToUse = bm1Content || templateContent;
        setFormContent(contentToUse);

        // Update parent component
        if (!bm1Content && templateContent) {
          onContentChange(templateContent);
        }
      } catch (error) {
        console.error("Failed to load BM1 template:", error);
        // Fallback content
        const fallbackContent = `
          <h1>Project Summary</h1>
          <h2>1. Project Overview</h2>
          <p>Please provide a comprehensive overview of your research project...</p>
          
          <h2>2. Research Objectives</h2>
          <p>List the main objectives of your research...</p>
          
          <h2>3. Methodology</h2>
          <p>Describe the research methodology you plan to use...</p>
          
          <h2>4. Expected Outcomes</h2>
          <p>What are the expected outcomes and impact of this research?</p>
          
          <h2>5. Timeline</h2>
          <p>Provide a detailed timeline for your research project...</p>
        `;
        setFormContent(fallbackContent);
        onContentChange(fallbackContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadBM1Template();
  }, [projectId, bm1Content, onContentChange]);

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  const handleNext = () => {
    // Save current content before proceeding
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Project Registration
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Provide a comprehensive of your research project.
        </p>
      </div>

      {/* Editor Card */}
      <Card className="border-0 shadow-lg bg-white pt-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project Summary Document
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below with your project details and research
            information.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* TinyMCE Editor */}
          <div className="min-h-[800px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[800px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading BM1 template...</p>
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
                    "paste",
                  ],
                  toolbar: [
                    "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify",
                    "bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
                  ].join(" | "),
                  content_style: `
                    html, body {
                      width: 100% !important;
                      min-height: 800px !important;
                      background: #fff !important;
                      margin: 0 auto !important;
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #333;
                      padding: 20px;
                      box-sizing: border-box !important;
                    }
                    ${formStyles}
                    * {
                      max-width: 100% !important;
                      box-sizing: border-box !important;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 1em 0;
                    }
                    table td, table th {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: left;
                    }
                    table th {
                      background-color: #f2f2f2;
                      font-weight: bold;
                    }
                    h1, h2, h3, h4, h5, h6 {
                      color: #333;
                      margin-top: 1.5em;
                      margin-bottom: 0.5em;
                    }
                    h1 { font-size: 2em; }
                    h2 { font-size: 1.5em; }
                    h3 { font-size: 1.3em; }
                    p { margin-bottom: 1em; }
                  `,
                  paste_data_images: true,
                  paste_as_text: false,
                  paste_webkit_styles:
                    "font-weight font-style color text-decoration",
                  paste_retain_style_properties:
                    "color font-size font-family font-weight font-style text-decoration",
                  branding: false,
                  promotion: false,
                  resize: false,
                  statusbar: true,
                  elementpath: false,
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8"
          disabled={isLoading}
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
