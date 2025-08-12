import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface ResponsiveTinyMCEViewerProps {
  content: string;
  height?: number | string;
  className?: string;
  apiKey?: string;
  maxHeight?: number | string;
  autoResize?: boolean;
}

export const ResponsiveTinyMCEViewer: React.FC<
  ResponsiveTinyMCEViewerProps
> = ({
  content,
  height = "auto",
  className = "",
  apiKey,
  maxHeight = "70vh",
  autoResize = true,
}) => {
  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;

  // Calculate height based on content or use provided height
  const editorHeight =
    height === "100%"
      ? "100%"
      : height === "auto"
      ? Math.min(Math.max(300, content.length / 8), 800)
      : height;

  return (
    <div
      className={`w-full ${
        autoResize ? "border rounded-lg overflow-hidden" : "h-full"
      } ${className}`}
      style={
        autoResize ? { maxHeight, minHeight: "300px" } : { height: "100%" }
      }
    >
      {!autoResize ? (
        <Editor
          apiKey={editorApiKey}
          value={content}
          init={{
            height: "100%",
            menubar: false,
            toolbar: false,
            statusbar: false,
            resize: false,
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                font-size: 14px; 
                line-height: 1.6; 
                margin: 16px; 
                color: #374151;
                max-width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
                color: #111827;
              }
              h1 { font-size: 1.5em; }
              h2 { font-size: 1.3em; }
              h3 { font-size: 1.1em; }
              p {
                margin-bottom: 1em;
                line-height: 1.6;
              }
              ul, ol {
                margin-bottom: 1em;
                padding-left: 1.5em;
              }
              li {
                margin-bottom: 0.25em;
              }
              strong {
                font-weight: 600;
                color: #111827;
              }
              em {
                font-style: italic;
              }
              blockquote {
                border-left: 4px solid #e5e7eb;
                padding-left: 1em;
                margin: 1em 0;
                font-style: italic;
                color: #6b7280;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
              }
              th, td {
                border: 1px solid #e5e7eb;
                padding: 0.5em;
                text-align: left;
              }
              th {
                background-color: #f9fafb;
                font-weight: 600;
              }
            `,
            plugins: [],
          }}
          disabled={true}
        />
      ) : (
        <div className="w-full h-full overflow-auto">
          <Editor
            apiKey={editorApiKey}
            value={content}
            init={{
              height: editorHeight,
              menubar: false,
              toolbar: false,
              statusbar: false,
              resize: false,
              content_style: `
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                  font-size: 14px; 
                  line-height: 1.6; 
                  margin: 16px; 
                  color: #374151;
                  max-width: 100%;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                }
                h1, h2, h3, h4, h5, h6 {
                  margin-top: 1.5em;
                  margin-bottom: 0.5em;
                  font-weight: 600;
                  color: #111827;
                }
                h1 { font-size: 1.5em; }
                h2 { font-size: 1.3em; }
                h3 { font-size: 1.1em; }
                p {
                  margin-bottom: 1em;
                  line-height: 1.6;
                }
                ul, ol {
                  margin-bottom: 1em;
                  padding-left: 1.5em;
                }
                li {
                  margin-bottom: 0.25em;
                }
                strong {
                  font-weight: 600;
                  color: #111827;
                }
                em {
                  font-style: italic;
                }
                blockquote {
                  border-left: 4px solid #e5e7eb;
                  padding-left: 1em;
                  margin: 1em 0;
                  font-style: italic;
                  color: #6b7280;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1em 0;
                }
                th, td {
                  border: 1px solid #e5e7eb;
                  padding: 0.5em;
                  text-align: left;
                }
                th {
                  background-color: #f9fafb;
                  font-weight: 600;
                }
              `,
              plugins: autoResize ? ["autoresize"] : [],
              ...(autoResize && {
                autoresize_on_init: true,
                autoresize_max_height:
                  typeof maxHeight === "number"
                    ? maxHeight
                    : parseInt(maxHeight as string) || 600,
                autoresize_min_height: 300,
              }),
            }}
            disabled={true}
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveTinyMCEViewer;
