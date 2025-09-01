import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  uploadImageToAzure,
  getImageUrlFromAzure,
  deleteImageFromAzure,
} from "@/services/resources/azure-image";
import type { Editor as TinyMCEEditor } from "tinymce";
import SignaturePad from "@/components/common/SignaturePad";
import { toast } from "sonner";

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
  customSetup?: (editor: TinyMCEEditor) => void;

  // Legacy props for backward compatibility
  formStyles?: string;
  placeholder?: string;
}

const PRESETS = {
  basic: {
    plugins: [
      "advlist",
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
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | signature | preview code fullscreen | help",
    menubar: false,
    styles: `
      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 16px;
        line-height: 1.8;
        color: #000;
        padding: 30px;
        background: #fff;
        max-width: none;
        word-wrap: break-word;
      }
      p {
        margin: 1em 0;
        line-height: 1.8;
        text-align: justify;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Times New Roman", Times, serif;
        font-weight: bold;
        margin: 1.5em 0 1em 0;
        line-height: 1.4;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
    `,
  },

  document: {
    plugins: [
      "advlist",
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
      "pagebreak",
      "quickbars",
      "autosave",
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | pagebreak | preview code fullscreen",
    menubar: false,
    styles: `
      body {
        font-family: "Times New Roman", Times, serif;
        padding: 30px;
        color: #000;
        background: #fff;
        font-size: 16px;
        line-height: 1.8;
        max-width: none;
        word-wrap: break-word;
      }
      p {
        margin: 1em 0;
        line-height: 1.8;
        text-align: justify;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Times New Roman", Times, serif;
        font-weight: bold;
        margin: 1.5em 0 1em 0;
        line-height: 1.4;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: 16px;
      }
      th, td {
        border: 1px solid #000;
        padding: 12px 8px;
        vertical-align: middle;
        line-height: 1.4;
      }
      th {
        background-color: #f8f9fa;
        font-weight: bold;
        text-align: center;
      }
      td {
        text-align: left;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
      /* Signature boxes alignment */
      .signature-container {
        display: flex;
        margin-top: 3em;
        page-break-inside: avoid;
      }
      .signature-container.single {
        justify-content: flex-end;
      }
      .signature-container.double {
        justify-content: space-between;
      }
      .signature-container.triple {
        justify-content: space-between;
      }
    `,
  },

  form: {
    plugins: [
      "advlist",
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
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen | help",
    menubar: true,
    styles: `
      html, body {
        width: 100% !important;
        background: #fff !important;
        margin: 0 auto !important;
        font-family: "Times New Roman", Times, serif;
        font-size: 16px;
        line-height: 1.8;
        color: #000;
        padding: 30px;
        box-sizing: border-box !important;
        max-width: none;
        word-wrap: break-word;
      }
      p {
        margin: 1em 0;
        line-height: 1.8;
        text-align: justify;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Times New Roman", Times, serif;
        font-weight: bold;
        margin: 1.5em 0 1em 0;
        line-height: 1.4;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.5em 0;
        font-size: 16px;
      }
      table td, table th {
        border: 1px solid #000;
        padding: 12px 8px;
        vertical-align: middle;
        line-height: 1.4;
      }
      table th {
        background-color: #f8f9fa;
        font-weight: bold;
        text-align: center;
      }
      table td {
        text-align: left;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
      /* Signature boxes alignment */
      .signature-container {
        display: flex;
        margin-top: 3em;
        page-break-inside: avoid;
      }
      .signature-container.single {
        justify-content: flex-end;
      }
      .signature-container.double {
        justify-content: space-between;
      }
      .signature-container.triple {
        justify-content: space-between;
      }
      .signature-box {

        width: 200px;
        height: 120px;
        text-align: center;
        padding: 15px;
        margin: 0 10px;
        font-size: 14px;
        line-height: 1.4;
      }
    `,
  },

  "scientific-cv": {
    plugins: [
      "advlist",
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
        font-size: 16px;
        line-height: 1.8;
        color: #000;
        padding: 30px;
        background: #fff;
        max-width: none;
        word-wrap: break-word;
      }
      p {
        margin: 1em 0;
        line-height: 1.8;
        text-align: justify;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Times New Roman", Times, serif;
        font-weight: bold;
        margin: 1.5em 0 1em 0;
        line-height: 1.4;
      }
      .image-frame {
        width: 150px;
        height: 180px;
        border: 2px dashed #999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin: 15px auto;
      }
      .image-frame img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: 16px;
      }
      table, th, td {
        border: 1px solid #000;
      }
      th, td {
        padding: 12px 8px;
        text-align: center;
        vertical-align: middle;
        line-height: 1.4;
      }
      th {
        background-color: #f8f9fa;
        font-weight: bold;
        text-align: center;
      }
      td {
        text-align: left;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
      /* Signature boxes alignment */
      .signature-container {
        display: flex;
        margin-top: 3em;
        page-break-inside: avoid;
      }
      .signature-container.single {
        justify-content: flex-end;
      }
      .signature-container.double {
        justify-content: space-between;
      }
      .signature-container.triple {
        justify-content: space-between;
      }
      .signature-box {

        width: 200px;
        height: 120px;
        text-align: center;
        padding: 15px;
        margin: 0 10px;
        font-size: 14px;
        line-height: 1.4;
      }
    `,
  },
};

export const UnifiedTinyMCE = forwardRef<TinyMCERef, UnifiedTinyMCEProps>(
  (
    {
      value,
      onChange,
      height = 500,
      disabled = false,
      readOnly = false,
      apiKey,
      className = "",
      preset = "basic",
      customStyles = "",
      toolbar,
      menubar,
      plugins,
      customSetup,
      // Legacy props
      formStyles = "",
      placeholder = "",
    },
    ref
  ) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
    const editorApiKey = apiKey || defaultApiKey;
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    const presetConfig = PRESETS[preset];

    // Signature handling
    const handleSignatureComplete = (signatureDataUrl: string) => {
      setShowSignaturePad(false);

      if (editorRef.current) {
        editorRef.current.insertContent(
          `<div class="signature-container" style="margin: 20px 0; text-align: center;">
            <img src="${signatureDataUrl}" alt="Digital Signature" style="max-width: 200px; height: auto; border: 1px solid #ccc; padding: 10px; background: white;" />
          </div>`
        );
        toast.success("Signature added to document!");
      }
    };

    // Helper function để extract blob name từ Azure URL
    const extractBlobNameFromUrl = (url: string): string | null => {
      try {
        // Azure URL format: https://storage00image.blob.core.windows.net/srpm-public/68e5dc06-ed9a-48d5-bfbb-e455451ded67.jpg
        const match = url.match(/\/srpm-public\/(.+)$/);
        return match ? match[1] : null;
      } catch (error) {
        console.error("Error extracting blob name from URL:", error);
        return null;
      }
    };

    // Function để xóa ảnh từ Azure khi user xóa trong editor
    const handleImageDelete = async (imageUrl: string) => {
      const blobName = extractBlobNameFromUrl(imageUrl);
      if (blobName) {
        try {
          await deleteImageFromAzure(blobName);
          console.log(`Image deleted from Azure: ${blobName}`);
        } catch (error) {
          console.error(
            `Failed to delete image from Azure: ${blobName}`,
            error
          );
        }
      }
    };

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getContent() ?? "",
      setContent: (content: string) => editorRef.current?.setContent(content),
    }));

    const handleEditorChange = (content: string) => {
      onChange(content);
    };

    const setupEditor = (editor: TinyMCEEditor) => {
      // Add signature button
      editor.ui.registry.addButton("signature", {
        text: "Add Signature",
        icon: "edit-block",
        onAction: () => {
          setShowSignaturePad(true);
        },
      });

      // Theo dõi khi ảnh bị xóa khỏi editor
      let previousImages: string[] = [];
      let isInitialized = false;

      // TEMPORARILY DISABLED FOR DEBUGGING - Theo dõi thay đổi content để phát hiện ảnh bị xóa
      // Chỉ theo dõi sau khi editor đã được khởi tạo hoàn toàn
      editor.on("NodeChange", () => {
        const currentImages = editor
          .getBody()
          .querySelectorAll('img[src*="storage00image.blob.core.windows.net"]');
        const currentImageUrls = Array.from(currentImages).map(
          (img) => (img as HTMLImageElement).src
        );

        // Auto-delete logic - Enable when needed
        if (isInitialized) {
          // Chỉ xóa ảnh khi số lượng ảnh hiện tại ít hơn trước đó
          // và ảnh thực sự bị remove (không phải do thêm ảnh mới)
          if (currentImageUrls.length < previousImages.length) {
            const deletedImages = previousImages.filter(
              (url) => !currentImageUrls.includes(url)
            );

            // Xóa các ảnh đã bị remove khỏi Azure
            deletedImages.forEach((imageUrl) => {
              console.log("Deleting removed image:", imageUrl);
              handleImageDelete(imageUrl);
            });
          }
        }

        // Cập nhật danh sách ảnh hiện tại
        previousImages = [...currentImageUrls];
      });

      // DEBUG: Theo dõi tất cả commands
      editor.on("ExecCommand", (e) => {
        if (e.command === "mceInsertContent" || e.command === "mceImage") {
          console.log("📸 Image command detected:", e.command);
          // Delay một chút để đảm bảo ảnh đã được thêm vào DOM
          setTimeout(() => {
            const currentImages = editor
              .getBody()
              .querySelectorAll(
                'img[src*="storage00image.blob.core.windows.net"]'
              );
            const currentImageUrls = Array.from(currentImages).map(
              (img) => (img as HTMLImageElement).src
            );
            previousImages = [...currentImageUrls];
            console.log(
              "✅ Updated previousImages after image insert:",
              previousImages
            );
          }, 500);
        }
      });

      // Enhanced drag and drop functionality
      editor.on("init", () => {
        const editorBody = editor.getBody();

        // Lưu danh sách ảnh ban đầu khi editor được khởi tạo
        const images = editorBody.querySelectorAll(
          'img[src*="storage00image.blob.core.windows.net"]'
        );
        previousImages = Array.from(images).map(
          (img) => (img as HTMLImageElement).src
        );

        // Đánh dấu editor đã được khởi tạo hoàn toàn
        setTimeout(() => {
          isInitialized = true;
        }, 1000); // Delay 1 giây để đảm bảo editor đã stable

        // Set default font for new content
        editorBody.style.fontFamily = '"Times New Roman", Times, serif';

        // Apply default styling to existing content
        const paragraphs = editorBody.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (!p.style.fontFamily) {
            p.style.fontFamily = '"Times New Roman", Times, serif';
          }
        });

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

      // Auto-apply font formatting to new content
      editor.on("NodeChange", () => {
        const selection = editor.selection;
        const node = selection.getNode();

        // Apply default font to new paragraphs
        if (node.tagName === "P") {
          const p = node as HTMLParagraphElement;
          if (!p.style.fontFamily) {
            p.style.fontFamily = '"Times New Roman", Times, serif';
          }
        }
      });

      // Ensure new content gets proper font formatting
      editor.on("keydown", (e) => {
        if (e.key === "Enter") {
          setTimeout(() => {
            const selection = editor.selection;
            const node = selection.getNode();
            if (node.tagName === "P") {
              const p = node as HTMLParagraphElement;
              p.style.fontFamily = '"Times New Roman", Times, serif';
            }
          }, 10);
        }
      });

      // Scientific CV specific setup
      if (preset === "scientific-cv") {
        // Function to handle frame images
        const handleFrameImages = () => {
          const imgs = Array.from(editor.getBody().querySelectorAll("img"));

          imgs.forEach((img) => {
            const isInFrame = img.closest(".image-frame");
            const isFrameImg = img.classList.contains("frame-image");
            const alreadySized =
              img.style.width === "113px" && img.style.height === "151px";

            // Nếu ảnh nằm trong .image-frame thì tự động add class frame-image
            if (isInFrame && !isFrameImg) {
              img.classList.add("frame-image");
            }

            // Áp dụng kích thước 3x4 cho tất cả ảnh trong frame
            if ((isFrameImg || isInFrame) && !alreadySized) {
              img.setAttribute("width", "113");
              img.setAttribute("height", "151");
              img.style.width = "113px";
              img.style.height = "151px";
              img.style.objectFit = "contain";
            }
          });
        };

        // Handle on various events
        editor.on("NodeChange", handleFrameImages);
        editor.on("SetContent", handleFrameImages);
        editor.on("input", handleFrameImages);
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

      // Call custom setup if provided
      if (customSetup) {
        customSetup(editor);
      }
    };

    return (
      <>
        <div
          className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}
        >
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

              // Default content formatting
              forced_root_block: "p",
              forced_root_block_attrs: {
                style:
                  'font-family: "Times New Roman", Times, serif; font-size: 16px; line-height: 1.8;',
              },

              // Auto-save functionality
              autosave_ask_before_unload: false,
              autosave_interval: "30s",
              autosave_restore_when_empty: false,

              // Z-index configuration to ensure dialogs appear above other modals
              base_url: undefined,
              suffix: ".min",
              // Ensure TinyMCE dialogs have higher z-index than parent modals
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              init_instance_callback: (_editor: TinyMCEEditor) => {
                // Set z-index for TinyMCE dialogs to be above parent modal
                const style = document.createElement("style");
                style.textContent = `
                .tox-dialog-wrap {
                  z-index: 99999 !important;
                  position: fixed !important;
                }
                .tox-dialog {
                  z-index: 99999 !important;
                  position: relative !important;
                }
                .tox-dialog__backdrop {
                  z-index: 99998 !important;
                  position: fixed !important;
                }
                .tox-tinymce-aux {
                  z-index: 99999 !important;
                  position: fixed !important;
                }
                .tox-dialog__header {
                  pointer-events: auto !important;
                }
                .tox-dialog__body {
                  pointer-events: auto !important;
                }
                .tox-dialog__footer {
                  pointer-events: auto !important;
                }
                .tox-button {
                  pointer-events: auto !important;
                }
                .tox-textfield {
                  pointer-events: auto !important;
                }
                .tox-selectfield {
                  pointer-events: auto !important;
                }
                /* Ensure TinyMCE dialogs are not affected by parent modal event handling */
                .tox-dialog-wrap * {
                  pointer-events: auto !important;
                }
                .tox-dialog-wrap {
                  isolation: isolate;
                }
              `;
                document.head.appendChild(style);
              },

              // Enhanced image upload capabilities
              image_description: false,
              image_title: true,
              image_caption: true,
              file_picker_types: "image",

              // File picker callback for image uploads
              file_picker_callback: async (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                callback: any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _value: any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                meta: any
              ) => {
                if (meta.filetype === "image") {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute(
                    "accept",
                    "image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  );
                  input.setAttribute("multiple", "false");

                  input.onchange = async function () {
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

                      try {
                        // Upload ảnh lên Azure
                        const uploadResponse = await uploadImageToAzure(file);
                        console.log("Upload response:", uploadResponse);

                        // Lấy URL đầy đủ của ảnh
                        const imageUrl = await getImageUrlFromAzure(
                          uploadResponse.url
                        );
                        console.log("Image URL:", imageUrl);

                        // Trả về URL ảnh cho TinyMCE
                        callback(imageUrl, {
                          alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
                          title: file.name,
                        });
                      } catch (error) {
                        console.error("Error uploading image:", error);
                        alert("Error uploading image. Please try again.");
                      }
                    }
                  };

                  input.click();
                }
              },

              // Enhanced paste and drag-drop support

              // Image upload settings
              images_upload_url: "", // Sử dụng custom handler thay vì URL
              images_reuse_filename: true,
              images_file_types: "jpg,jpeg,png,gif,webp",

              // Drag and drop support - upload lên Azure
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

                  // Tạo File object từ blob
                  const file = new File(
                    [blobInfo.blob()],
                    blobInfo.filename() || "image.png",
                    {
                      type: blobInfo.blob().type,
                    }
                  );

                  // Upload ảnh lên Azure (async operation)
                  uploadImageToAzure(file)
                    .then((uploadResponse) => {
                      console.log(
                        "Drag & drop upload response:",
                        uploadResponse
                      );
                      // Lấy URL đầy đủ của ảnh
                      return getImageUrlFromAzure(uploadResponse.url);
                    })
                    .then((imageUrl) => {
                      console.log("Drag & drop image URL:", imageUrl);
                      // Trả về URL ảnh cho TinyMCE
                      resolve(imageUrl);
                    })
                    .catch((error) => {
                      console.error(
                        "Error uploading image via drag & drop:",
                        error
                      );
                      reject("Error uploading image. Please try again.");
                    });
                });
              },

              setup: setupEditor,
            }}
          />
        </div>

        {/* Signature Pad Modal */}
        {showSignaturePad && (
          <SignaturePad
            onComplete={handleSignatureComplete}
            onClose={() => setShowSignaturePad(false)}
          />
        )}
      </>
    );
  }
);

UnifiedTinyMCE.displayName = "UnifiedTinyMCE";

export default UnifiedTinyMCE;
