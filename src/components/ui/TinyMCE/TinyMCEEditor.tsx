import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  apiKey?: string;
  className?: string;
  toolbar?: string | false;
  menubar?: boolean | string;
  statusbar?: boolean;
  plugins?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init?: Record<string, any>;
}

export const TinyMCEEditorComponent: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = "Start typing...",
  disabled = false,
  apiKey,
  className = "",
  toolbar = "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat | help",
  menubar = false,
  statusbar = true,
  plugins = [
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
  init,
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const defaultInit = {
    height,
    menubar,
    plugins,
    toolbar,
    statusbar,
    placeholder,
    branding: false,
    promotion: false,
    resize: false,
    elementpath: false,
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
    // Enable image upload and file picker
    image_advtab: true,
    image_description: false,
    image_title: true,
    image_caption: true,
    // File picker for images
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
    ...init,
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <Editor
        apiKey={editorApiKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleEditorChange}
        init={defaultInit}
        disabled={disabled}
      />
    </div>
  );
};

export default TinyMCEEditorComponent;
