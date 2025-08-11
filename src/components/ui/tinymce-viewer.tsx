import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEViewerProps {
  content: string;
  height?: number;
  className?: string;
  apiKey?: string;
}

export const TinyMCEViewer: React.FC<TinyMCEViewerProps> = ({
  content,
  height = 400,
  className = "",
  apiKey,
}) => {
  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;
  return (
    <div className={`border rounded-lg ${className}`}>
      <Editor
        apiKey={editorApiKey}
        value={content}
        init={{
          height,
          menubar: false,
          toolbar: false,
          statusbar: false,
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; margin: 20px; }',
        }}
        disabled={true}
      />
    </div>
  );
};

export default TinyMCEViewer;
