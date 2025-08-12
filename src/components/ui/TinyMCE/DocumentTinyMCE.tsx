import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

interface DocumentTinyMCEProps {
  value: string;
  onChange: (content: string) => void;
  height?: number | string;
  disabled?: boolean;
  apiKey?: string;
  className?: string;
}

/**
 * Specialized TinyMCE component for document forms with Times New Roman styling
 * and image upload capabilities
 */
export const DocumentTinyMCE: React.FC<DocumentTinyMCEProps> = ({
  value,
  onChange,
  height = "100%",
  disabled = false,
  apiKey,
  className = "",
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <Editor
        apiKey={editorApiKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          toolbar:
            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat | code",
          branding: false,
          promotion: false,
          resize: false,
          statusbar: false,
          elementpath: false,
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
          content_style: `
            body {
              font-family: 'Times New Roman', serif;
              padding: 24px;
              color: #222;
              background: #fff;
              font-size: 14px;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1em;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
            }
          `,
          // Image upload and file picker settings
          image_advtab: true,
          image_description: false,
          image_title: true,
          image_caption: true,
          file_picker_types: "image",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          file_picker_callback: (callback: any, _value: any, meta: any) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = function () {
                const file = (this as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function () {
                    callback(reader.result, { alt: file.name });
                  };
                  reader.readAsDataURL(file);
                }
              };

              input.click();
            }
          },
          // Allow pasting images
          paste_data_images: true,
          // Automatic uploads for pasted images
          automatic_uploads: true,
        }}
      />
    </div>
  );
};

export default DocumentTinyMCE;
