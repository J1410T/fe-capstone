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
  placeholder?: string;
}

const PRESETS = {
  basic: {
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
      "table",
      "help",
      "wordcount",
      "quickbars",
      "autosave",
      "imagetools",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
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
      "table",
      "help",
      "wordcount",
      "pagebreak",
      "quickbars",
      "autosave",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | pagebreak | preview code fullscreen",
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
      "table",
      "help",
      "wordcount",
      "paste",
      "quickbars",
      "autosave",
      "imagetools",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
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
      "table",
      "help",
      "wordcount",
      "pagebreak",
      "quickbars",
      "autosave",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | pagebreak | preview code fullscreen",
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
      // Enhanced drag and drop functionality
      editor.on("init", () => {
        const editorBody = editor.getBody();

        // Add drag over styling
        editorBody.addEventListener("dragover", (e) => {
          e.preventDefault();
          editorBody.style.backgroundColor = "#f0f8ff";
          editorBody.style.border = "2px dashed #007cba";
        });

        // Remove drag over styling
        editorBody.addEventListener("dragleave", (e) => {
          e.preventDefault();
          editorBody.style.backgroundColor = "";
          editorBody.style.border = "";
        });

        // Handle file drop
        editorBody.addEventListener("drop", (e) => {
          e.preventDefault();
          editorBody.style.backgroundColor = "";
          editorBody.style.border = "";

          const files = Array.from(e.dataTransfer?.files || []);
          const imageFiles = files.filter((file) =>
            file.type.startsWith("image/")
          );

          imageFiles.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
              alert(
                `File "${file.name}" is too large. Please choose an image smaller than 5MB.`
              );
              return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
              const img = `<img src="${
                event.target?.result
              }" alt="${file.name.replace(/\.[^/.]+$/, "")}" title="${
                file.name
              }" />`;
              editor.insertContent(img);
            };
            reader.readAsDataURL(file);
          });
        });
      });

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

      // Add custom image resize handles
      editor.on("ObjectSelected", (e) => {
        if (e.target.tagName === "IMG") {
          const img = e.target as HTMLImageElement;
          // Add resize handles or custom styling if needed
          img.style.outline = "2px solid #007cba";
        }
      });

      editor.on("ObjectDeselected", (e) => {
        if (e.target.tagName === "IMG") {
          const img = e.target as HTMLImageElement;
          img.style.outline = "";
        }
      });
    };

    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <Editor
          apiKey={editorApiKey || "no-api-key"}
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

            // Content handling
            entity_encoding: "raw",
            verify_html: false,
            convert_urls: false,
            relative_urls: false,

            // Performance optimizations
            skin: "oxide",
            content_css: "default",

            // Better UX
            contextmenu: "link image table",
            quickbars_selection_toolbar:
              "bold italic | quicklink h2 h3 blockquote",
            quickbars_insert_toolbar: "quickimage quicktable",

            // Auto-save functionality
            autosave_ask_before_unload: false,
            autosave_interval: "30s",
            autosave_restore_when_empty: false,

            // Enhanced image upload capabilities
            image_description: false,
            image_title: true,
            image_caption: true,
            file_picker_types: "image",

            // File picker callback for image uploads
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            file_picker_callback: (callback: any, _value: any, meta: any) => {
              if (meta.filetype === "image") {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute(
                  "accept",
                  "image/jpeg,image/jpg,image/png,image/gif,image/webp"
                );
                input.setAttribute("multiple", "false");

                input.onchange = function () {
                  const file = (this as HTMLInputElement).files?.[0];
                  if (file) {
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert(
                        "File size too large. Please choose an image smaller than 5MB."
                      );
                      return;
                    }

                    // Validate file type
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/gif",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      alert(
                        "Invalid file type. Please choose a JPEG, PNG, GIF, or WebP image."
                      );
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = function () {
                      // Return the base64 image with metadata
                      callback(reader.result, {
                        alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
                        title: file.name,
                      });
                    };
                    reader.onerror = function () {
                      alert("Error reading file. Please try again.");
                    };
                    reader.readAsDataURL(file);
                  }
                };

                input.click();
              }
            },

            // Enhanced paste and drag-drop support
            paste_data_images: true,
            paste_as_text: false,
            automatic_uploads: true,

            // Drag and drop support
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            images_upload_handler: (blobInfo: any) => {
              return new Promise((resolve, reject) => {
                // Validate file size
                if (blobInfo.blob().size > 5 * 1024 * 1024) {
                  reject(
                    "File size too large. Please choose an image smaller than 5MB."
                  );
                  return;
                }

                // Convert blob to base64
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result as string);
                };
                reader.onerror = () => {
                  reject("Error processing image. Please try again.");
                };
                reader.readAsDataURL(blobInfo.blob());
              });
            },

            // Image upload settings
            images_upload_url: "", // Disable server upload, use base64
            images_reuse_filename: true,
            images_file_types: "jpg,jpeg,png,gif,webp",

            setup: setupEditor,
          }}
        />
      </div>
    );
  }
);

UnifiedTinyMCE.displayName = "UnifiedTinyMCE";

export default UnifiedTinyMCE;
