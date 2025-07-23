import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

type EditorInstance = { getContent: () => string } | null;

interface DocumentFormEditorProps {
  documentType: string;
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DocumentFormEditor: React.FC<DocumentFormEditorProps> = ({
  documentType,
  initialContent = "",
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const editorRef = useRef<EditorInstance>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Load the form template when component mounts or documentType changes
  useEffect(() => {
    async function fetchFormTemplate() {
      try {
        const formFileName = `${documentType}.html`;
        const response = await fetch(`/src/components/forms/${formFileName}`);
        const htmlText = await response.text();

        // Extract <style> content
        const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        setFormStyles(styleMatch ? styleMatch[1] : "");

        // Extract <body> content or fallback to full content without styles
        const bodyMatch = htmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const content = bodyMatch
          ? bodyMatch[1]
          : htmlText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

        // Use initial content if provided, otherwise use template
        setFormContent(initialContent || content);
      } catch (error) {
        console.error("Failed to load form template:", error);
        // Fallback to initial content or empty
        setFormContent(initialContent || "");
        setFormStyles("");
      }
    }

    fetchFormTemplate();
  }, [documentType, initialContent]);

  const handleSave = () => {
    const content = editorRef.current?.getContent() ?? "";
    onSave(content);
  };

  // TinyMCE editor height to fit dialog
  const toolbarHeightPx = 56;
  const dialogPadding = 120; // Account for dialog header and buttons
  const availableHeight = Math.min(window.innerHeight - dialogPadding, 600);
  const contentHeight = availableHeight - toolbarHeightPx;

  return (
    <div className="space-y-4">
      {/* Editor Container */}
      <div
        className="bg-white rounded border border-gray-200 overflow-hidden"
        style={{
          height: `${availableHeight}px`,
          maxHeight: "600px",
        }}
      >
        <Editor
          key={formContent + formStyles + documentType}
          apiKey={apiKey}
          onInit={(_, editor) => (editorRef.current = editor)}
          initialValue={formContent}
          init={{
            height: contentHeight,
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
                min-height: ${contentHeight}px !important;
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
              .dotted-line {
                border-bottom: 1px dotted #333;
                display: inline-block;
                min-width: 100px;
              }
              .center {
                text-align: center;
              }
              .upper {
                text-transform: uppercase;
              }
              .italic {
                font-style: italic;
              }
              .bold {
                font-weight: bold;
              }
              .small {
                font-size: 0.9em;
              }
              h1, h2, h3, h4, h5, h6 {
                margin: 1em 0 0.5em 0;
                line-height: 1.3;
              }
              p {
                margin: 0.5em 0;
              }
              ul, ol {
                margin: 0.5em 0;
                padding-left: 2em;
              }
            `,
            paste_data_images: true,
            paste_as_text: false,
            paste_webkit_styles: "font-weight font-style color text-decoration",
            paste_retain_style_properties:
              "color font-size font-family font-weight font-style text-decoration",
            branding: false,
            promotion: false,
            resize: false,
            statusbar: false,
            elementpath: false,
            setup: (editor) => {
              editor.on("init", () => {
                // Ensure content is loaded properly
                if (formContent) {
                  editor.setContent(formContent);
                }
              });
            },
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Scientific CV"}
        </Button>
      </div>
    </div>
  );
};
