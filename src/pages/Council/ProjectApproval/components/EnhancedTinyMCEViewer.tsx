import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, Download } from "lucide-react";
import { toast } from "sonner";

interface EnhancedTinyMCEViewerProps {
  content: string;
  title?: string;
  height?: number;
  className?: string;
  editable?: boolean;
  onSave?: (content: string) => void;
  onContentChange?: (content: string) => void;
  showHeader?: boolean;
  badge?: string;
  apiKey?: string;
}

type EditorInstance = { getContent: () => string } | null;

export const EnhancedTinyMCEViewer: React.FC<EnhancedTinyMCEViewerProps> = ({
  content,
  title,
  height = 400,
  className = "",
  editable = false,
  onSave,
  onContentChange,
  showHeader = true,
  badge,
  apiKey,
}) => {
  const editorRef = useRef<EditorInstance>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);

  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const editorContent = editorRef.current?.getContent() || currentContent;

      if (onSave) {
        await onSave(editorContent);
      }

      setCurrentContent(editorContent);
      setIsEditing(false);
      toast.success("Content saved successfully!");
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentContent(content);
  };

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  const handleExport = () => {
    const exportContent = editorRef.current?.getContent() || currentContent;
    const blob = new Blob([exportContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title?.replace(/\s+/g, "_") || "content"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Content exported successfully!");
  };

  const editorConfig = {
    height,
    width: "100%",
    menubar: isEditing,
    toolbar: isEditing
      ? [
          "undo redo | blocks | bold italic underline | alignleft aligncenter alignright",
          "bullist numlist outdent indent | removeformat | table | link | help",
        ].join(" | ")
      : false,
    statusbar: isEditing,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "insertdatetime",
      "table",
      "help",
      "wordcount",
    ],
    content_style: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        max-width: 100%;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #1f2937;
        margin-bottom: 0.5em;
      }
      p {
        margin-bottom: 1em;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
    `,
    branding: false,
    promotion: false,
    resize: false,
  };

  const WrapperComponent = showHeader ? Card : "div";
  const ContentComponent = showHeader ? CardContent : "div";

  return (
    <WrapperComponent className={className}>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {badge && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

              {editable && (
                <>
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <ContentComponent className={showHeader ? "space-y-4" : ""}>
        <div
          className={`border rounded-lg ${showHeader ? "" : "min-h-[400px]"}`}
        >
          <Editor
            apiKey={editorApiKey}
            onInit={(_, editor) => (editorRef.current = editor)}
            value={currentContent}
            onEditorChange={handleContentChange}
            disabled={!isEditing}
            init={editorConfig}
          />
        </div>
      </ContentComponent>
    </WrapperComponent>
  );
};

export default EnhancedTinyMCEViewer;
