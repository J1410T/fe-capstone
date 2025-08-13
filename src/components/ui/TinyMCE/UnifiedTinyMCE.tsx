import { useRef, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

export interface TinyMCERef {
  getContent: () => string;
  setContent: (content: string) => void;
}

interface UnifiedTinyMCEProps {
  value: string;
  onChange: (content: string) => void;
  height?: number | string;
  disabled?: boolean;
  readOnly?: boolean;
  apiKey?: string;
  className?: string;

  // Preset types for quick setup
  preset?: "document" | "form" | "scientific-cv" | "basic";

  // Custom overrides
  customStyles?: string;
  toolbar?: string | false;
  menubar?: boolean | string;
  plugins?: string[];

  // Legacy props for backward compatibility
  formStyles?: string;
  formId?: string;
  placeholder?: string;
}

const PRESETS = {
  basic: {
    plugins: [
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
      "table",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
    menubar: false,
    styles: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        padding: 20px;
      }
    `,
  },

  document: {
    plugins: [
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
      "table",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
    menubar: false,
    styles: `
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
  },

  form: {
    plugins: [
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
      "table",
      "help",
      "wordcount",
      "paste",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
    menubar: true,
    styles: `
      html, body {
        width: 100% !important;
        background: #fff !important;
        margin: 0 auto !important;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        padding: 20px;
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
    `,
  },

  "scientific-cv": {
    plugins: [
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
      "table",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
    menubar: true,
    styles: `
      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 14px;
        line-height: 1.4;
        color: #333;
        padding: 20px;
      }
      .image-frame {
        width: 150px;
        height: 180px;
        border: 2px dashed #999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin: 10px 0;
      }
      .image-frame img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table, th, td {
        border: 1px solid #ccc;
      }
    `,
  },
};

export const UnifiedTinyMCE = forwardRef<TinyMCERef, UnifiedTinyMCEProps>(
  (
    {
      value,
      onChange,
      height = 400,
      disabled = false,
      readOnly = false,
      apiKey,
      className = "",
      preset = "basic",
      customStyles = "",
      toolbar,
      menubar,
      plugins,
      // Legacy props
      formStyles = "",
      formId,
      placeholder = "",
    },
    ref
  ) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
    const editorApiKey = apiKey || defaultApiKey;

    const presetConfig = PRESETS[preset];

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getContent() ?? "",
      setContent: (content: string) => editorRef.current?.setContent(content),
    }));

    const handleEditorChange = (content: string) => {
      onChange(content);
    };

    const setupEditor = (editor: TinyMCEEditor) => {
      // Scientific CV specific setup
      if (preset === "scientific-cv") {
        editor.on("NodeChange", (e) => {
          const imgs =
            e.element?.tagName === "IMG"
              ? [e.element as HTMLImageElement]
              : Array.from(editor.getBody().querySelectorAll("img"));

          imgs.forEach((img) => {
            const isFrameImg = img.classList.contains("frame-image");
            const alreadySized =
              img.style.width === "113px" && img.style.height === "151px";

            if (!alreadySized && !isFrameImg) {
              img.setAttribute("width", "113");
              img.setAttribute("height", "151");
              img.style.width = "113px";
              img.style.height = "151px";
              img.style.objectFit = "cover";
            }
          });
        });
      }
    };

    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <Editor
          key={formId || value.slice(0, 100)}
          apiKey={editorApiKey}
          onInit={(_, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={handleEditorChange}
          disabled={disabled}
          init={{
            height,
            menubar: menubar !== undefined ? menubar : presetConfig.menubar,
            plugins: plugins || presetConfig.plugins,
            toolbar: toolbar !== undefined ? toolbar : presetConfig.toolbar,
            content_style: `${presetConfig.styles}\n${customStyles}\n${formStyles}`,
            placeholder,
            branding: false,
            promotion: false,
            statusbar: !readOnly,
            resize: !readOnly,

            // Image upload capabilities
            image_description: false,
            image_title: true,
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
            paste_data_images: true,
            automatic_uploads: true,

            setup: setupEditor,
          }}
        />
      </div>
    );
  }
);

UnifiedTinyMCE.displayName = "UnifiedTinyMCE";

export default UnifiedTinyMCE;
