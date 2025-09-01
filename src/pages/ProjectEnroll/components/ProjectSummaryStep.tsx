import React, { useRef, useEffect, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useParams } from "react-router-dom";
import {
  useDocumentsByFilter,
  useCreateDocument,
  useUpdateDocument,
  useDocumentByProjectIdWithUserRole,
} from "@/hooks/queries/document";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, File, AlertCircle } from "lucide-react";
import { DocumentForm, DocumentProject } from "@/types/document";
import { toast } from "sonner";
import { Loading } from "@/components";
import {
  uploadImageToAzure,
  getImageUrlFromAzure,
  deleteImageFromAzure,
} from "@/services/resources/azure-image";
import SignaturePad from "@/components/common/SignaturePad";

type EditorInstance = TinyMCEEditor | null;

interface ProjectSummaryStepProps {
  onContentChange: (content: string) => void;
  onNext: () => void;
  projectDocuments?: DocumentProject[] | null;
  onDocumentCreated?: () => void;
}

export const ProjectSummaryStep: React.FC<ProjectSummaryStepProps> = ({
  onContentChange,
  onNext,
  onDocumentCreated,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const [formContent, setFormContent] = useState<string>("");
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [documentCreated, setDocumentCreated] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

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

  // Use useDocumentByProjectIdWithUserRole to find BM1 document
  const { data: documentsWithUserRole, isLoading: isLoadingDocuments } =
    useDocumentByProjectIdWithUserRole(
      {
        "is-template": false,
        status: "draft",
        "page-index": 1,
        "page-size": 100,
        "project-id": projectId || "",
      },
      !!projectId
    );

  // Find BM1 document from the API response
  const bm1Document = documentsWithUserRole?.["data-list"]?.find(
    (doc) => doc.type === "BM1"
  );

  // FIX: Wait for documents to load before deciding to fetch template
  // Only fetch template when we've confirmed there's no BM1 document
  const shouldFetchTemplate =
    !isLoadingDocuments &&
    !bm1Document &&
    !documentCreated &&
    !isCreatingDocument;

  // Only fetch template when needed
  const { data: templateData, isLoading: isLoadingTemplate } =
    useDocumentsByFilter("BM1", true, 1, 1, shouldFetchTemplate);

  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();

  const createDocumentFromTemplate = useCallback(async () => {
    // FIX: Wait for documents API to finish loading before attempting to create
    if (
      isLoadingDocuments || // Wait for documents to load
      bm1Document || // If we already have BM1 document, don't create
      !templateData?.data?.["data-list"]?.length ||
      isCreatingDocument ||
      documentCreated ||
      !projectId
    ) {
      return;
    }

    console.log("Creating BM1 document from template...");
    setIsCreatingDocument(true);
    const templateDoc: DocumentForm = templateData.data["data-list"][0];
    const templateContent = templateDoc["content-html"].replace(/\\"/g, '"');

    try {
      const newDocument = await createDocumentMutation.mutateAsync({
        name: "Registration form",
        type: "BM1",
        "is-template": false,
        "content-html": templateContent,
        "project-id": projectId,
        status: "draft",
      });

      console.log("BM1 document created successfully:", newDocument);
      setDocumentCreated(true);
      onDocumentCreated?.();

      // FIX: Set the created content to state
      setFormContent(templateContent);
    } catch (error) {
      console.error("Failed to create document:", error);
      // Fallback: use template content directly
      setFormContent(templateContent);
      toast.error("Failed to create document, using template content directly");
    } finally {
      setIsCreatingDocument(false);
    }
  }, [
    isLoadingDocuments, // FIX: Add this dependency
    bm1Document,
    templateData,
    isCreatingDocument,
    documentCreated,
    projectId,
    createDocumentMutation,
    onDocumentCreated,
  ]);

  useEffect(() => {
    // FIX: Wait for documents API to finish loading before making decisions
    if (isLoadingDocuments) {
      console.log("Still loading documents...");
      return;
    }

    if (bm1Document) {
      // FIX: If we have existing BM1 document, use it and don't try to create new one
      const unescapedHtml = bm1Document["content-html"].replace(/\\"/g, '"');
      setFormContent(unescapedHtml);
      console.log("Using existing BM1 document:", bm1Document.id);
    } else if (!documentCreated && !isCreatingDocument) {
      // FIX: Only try to create if we haven't created one yet and not currently creating
      console.log("No BM1 document found, attempting to create from template");
      createDocumentFromTemplate();
    }
  }, [
    isLoadingDocuments, // FIX: Add this dependency
    bm1Document,
    createDocumentFromTemplate,
    documentCreated,
    isCreatingDocument,
  ]);

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  // Shared set to track uploaded images for deletion
  const uploadedImagesRef = useRef(new Set<string>());

  const handleNext = async () => {
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
    await handleSave();
    onNext();
  };

  const handleSave = async () => {
    if (!bm1Document || !projectId) {
      toast.error("Document not found or project ID missing");
      return;
    }

    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);

    try {
      await updateDocumentMutation.mutateAsync({
        id: bm1Document.id,
        name: bm1Document.name,
        type: bm1Document.type,
        "is-template": false,
        "content-html": currentContent,
        status: "draft",
        "project-id": projectId,
      });

      toast.success("Document saved successfully!");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save document. Please try again.");
    }
  };

  const formStyles = `
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 14px;
      line-height: 1.4;
      color: #333;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #ccc;
    }
    
    /* Custom styles for source code dialog */
    .tox-dialog[aria-label*="HTML Source Code"] {
      width: 90vw !important;
      max-width: 1200px !important;
      height: 80vh !important;
      max-height: 800px !important;
    }
    
    .tox-dialog[aria-label*="HTML Source Code"] .tox-dialog__body {
      padding: 20px !important;
      max-height: none !important;
    }
    
    .tox-dialog[aria-label*="HTML Source Code"] textarea[name="source"] {
      font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
      min-height: 500px !important;
      height: 500px !important;
      resize: vertical !important;
      white-space: pre !important;
      word-wrap: break-word !important;
      tab-size: 2 !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      padding: 12px !important;
      background-color: #f8f9fa !important;
    }
  `;

  const isLoading =
    isLoadingDocuments ||
    isLoadingTemplate ||
    isCreatingDocument ||
    createDocumentMutation.isPending;

  return (
    <div>
      {/* Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                To upload your photo, use the <strong>Upload Image</strong>{" "}
                button from the toolbar or drag & drop images directly into the
                editor.
              </li>
              <li>
                To download your Document, go to <strong>File → Print</strong>,
                then choose <strong>"Save"</strong> in the print dialog.
              </li>
              <li>
                <strong>Milestones</strong> must be displayed in{" "}
                <strong>Bold</strong>, while <strong>Tasks</strong> must be
                displayed in <strong>Regular</strong> font in "Tóm tắt kế hoạch
                và lộ trình triển khai nghiên cứu".
              </li>
              <li>
                The <strong>Time</strong> must be in the format{" "}
                <strong>(start, end): dd/mm/yyyy, dd/mm/yyyy</strong>
              </li>
              <li>
                Do not change the order of the sections, and do not remove the
                suggested notes (in parentheses)
              </li>
              <li>
                <strong>Table shortcuts:</strong> Use{" "}
                <strong>Ctrl+Shift+R</strong> to add row,
                <strong>Ctrl+Shift+C</strong> to add column, or use the quick
                buttons in toolbar. Right-click on table for more options.
              </li>
              <li>
                <strong>Copy-Paste Tables:</strong> You can copy tables from
                Excel/Word and paste directly. Use the "Copy Table" button to
                copy entire tables. Tables will maintain their structure when
                pasted.
              </li>
              <li>
                <strong>Source Code:</strong> Use the{" "}
                <strong>"View Source"</strong> button or press{" "}
                <strong>Ctrl+Shift+S</strong> to view and edit the HTML source
                code directly. You can also use the <strong>"Code"</strong>{" "}
                button for inline code editing.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Card className="border-0 shadow-lg bg-white pt-0 p-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-blue-600" />
            Project Summary Document
          </CardTitle>
          <CardDescription>
            Create and edit project summary documents using templates.
          </CardDescription>
          <div className="mt-3 p-3 rounded-md border border-blue-300 bg-blue-50 text-sm text-blue-800">
            💡 <strong>Signing instruction:</strong> If you want to sign, please
            upload your signature image and place it exactly where you want the
            signature to appear in the document.
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-0 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <Loading className="w-full max-w-md" />
                <p className="text-gray-600">
                  {isCreatingDocument
                    ? "Creating document..."
                    : "Loading BM1 template..."}
                </p>
              </div>
            </div>
          ) : createDocumentMutation.isError ? (
            <div className="text-center text-red-500 p-6">
              ⚠️ Error creating document:{" "}
              {createDocumentMutation.error?.message}
            </div>
          ) : (
            <Editor
              apiKey={apiKey}
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue={formContent}
              onEditorChange={handleEditorChange}
              init={{
                height: 800,
                width: "100%",
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table help wordcount",
                  "textcolor colorpicker hr pagebreak",
                  "contextmenu", // Thêm context menu cho right-click
                  "paste", // Plugin paste để xử lý copy-paste tốt hơn
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table quickAddRow quickAddCol copyTable | tablerowheader tablecol tablerow tablecell | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tableprops tablerowprops tablecellprops tabledelete | link image uploadImage signaturePad | preview code codesample viewSource fullscreen | insertSignature | forecolor backcolor | fontsize | hr pagebreak | searchreplace",
                setup: (editor) => {
                  // Use shared ref to track uploaded images for deletion
                  const uploadedImages = uploadedImagesRef.current;

                  // Custom buttons for quick table operations
                  editor.ui.registry.addButton("quickAddRow", {
                    text: "Add Row",
                    icon: "table-insert-row-after",
                    tooltip: "Quickly add row below",
                    onAction: () => {
                      editor.execCommand("mceTableInsertRowAfter");
                    },
                  });

                  editor.ui.registry.addButton("quickAddCol", {
                    text: "Add Column",
                    icon: "table-insert-column-after",
                    tooltip: "Quickly add column to the right",
                    onAction: () => {
                      editor.execCommand("mceTableInsertColAfter");
                    },
                  });

                  // Button để copy table
                  editor.ui.registry.addButton("copyTable", {
                    text: "Copy Table",
                    icon: "copy",
                    tooltip: "Copy entire table",
                    onAction: () => {
                      const selectedNode = editor.selection.getNode();
                      const table = editor.dom.getParent(selectedNode, "table");

                      if (table) {
                        // Select toàn bộ table
                        editor.selection.select(table);

                        // Copy table
                        editor.execCommand("copy");

                        toast.success("Table copied to clipboard!");
                      } else {
                        toast.error("Please place cursor inside a table first");
                      }
                    },
                  });

                  // Custom Source Code Viewer button
                  editor.ui.registry.addButton("viewSource", {
                    text: "View Source",
                    icon: "sourcecode",
                    tooltip: "View/Edit HTML Source Code",
                    onAction: () => {
                      // Get current content from editor
                      const currentContent = editor.getContent();

                      // Create a dialog to show/edit source code
                      editor.windowManager.open({
                        title: "HTML Source Code",
                        size: "large", // Make dialog larger
                        body: {
                          type: "panel",
                          items: [
                            {
                              type: "textarea",
                              name: "source",
                              label: "HTML Source:",
                              maximized: true, // Make textarea take full space
                              placeholder:
                                "HTML source code will appear here...",
                            },
                          ],
                        },
                        buttons: [
                          {
                            type: "cancel",
                            text: "Cancel",
                          },
                          {
                            type: "custom",
                            text: "Copy to Clipboard",
                            name: "copy",
                          },
                          {
                            type: "submit",
                            text: "Update",
                            primary: true,
                          },
                        ],
                        initialData: {
                          source: currentContent,
                        },
                        onAction: (api, details) => {
                          if (details.name === "copy") {
                            const data = api.getData();
                            navigator.clipboard
                              .writeText(data.source)
                              .then(() => {
                                toast.success(
                                  "Source code copied to clipboard!"
                                );
                              })
                              .catch(() => {
                                toast.error("Failed to copy to clipboard");
                              });
                          }
                        },
                        onSubmit: (api) => {
                          const data = api.getData();
                          // Update editor content with modified source
                          editor.setContent(data.source);
                          api.close();
                          toast.success("Source code updated successfully!");
                        },
                        onCancel: () => {
                          // Optional: Add any cleanup when dialog is cancelled
                        },
                      });
                    },
                  });

                  // Custom Upload Image button
                  editor.ui.registry.addButton("uploadImage", {
                    text: "Upload Image",
                    icon: "image",
                    onAction: () => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.style.display = "none";

                      input.onchange = async (e) => {
                        const target = e.target as HTMLInputElement;
                        const file = target.files?.[0];
                        if (!file) return;

                        // Validate file size (5MB max)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error(
                            "File size too large. Please choose an image smaller than 5MB."
                          );
                          return;
                        }

                        try {
                          toast.info("Uploading image...");

                          // Upload to Azure
                          const uploadResponse = await uploadImageToAzure(file);
                          console.log("Upload response:", uploadResponse);

                          // Get full image URL
                          const imageUrl = await getImageUrlFromAzure(
                            uploadResponse.url
                          );
                          console.log("Image URL:", imageUrl);

                          // Track this image for potential deletion
                          uploadedImages.add(imageUrl);

                          // Insert image into editor
                          editor.insertContent(
                            `<img src="${imageUrl}" alt="${file.name}" style="max-width:100%;height:auto;" />`
                          );

                          toast.success("Image uploaded successfully!");
                        } catch (error) {
                          console.error("Error uploading image:", error);
                          toast.error(
                            "Error uploading image. Please try again."
                          );
                        }
                      };

                      input.click();
                    },
                  });

                  // Custom Signature Pad button
                  editor.ui.registry.addButton("signaturePad", {
                    text: "Add Signature",
                    icon: "edit-block",
                    onAction: () => {
                      setShowSignaturePad(true);
                    },
                  });

                  // Function to extract image filename from Azure URL
                  const extractImageFilename = (
                    imageUrl: string
                  ): string | null => {
                    try {
                      // Azure blob URL format: https://{account}.blob.core.windows.net/{container}/{filename}
                      const url = new URL(imageUrl);
                      const pathParts = url.pathname.split("/");
                      return pathParts[pathParts.length - 1]; // Get the filename
                    } catch (error) {
                      console.error(
                        "Error extracting filename from URL:",
                        error
                      );
                      return null;
                    }
                  };

                  // Function to delete image from Azure
                  const deleteImageFromEditor = async (imageUrl: string) => {
                    try {
                      const filename = extractImageFilename(imageUrl);
                      if (filename) {
                        await deleteImageFromAzure(filename);
                        uploadedImages.delete(imageUrl);
                        console.log("Image deleted from Azure:", filename);
                        toast.success("Image deleted successfully!");
                      }
                    } catch (error) {
                      console.error("Error deleting image from Azure:", error);
                      toast.error("Error deleting image from storage.");
                    }
                  };

                  // Listen for content changes to detect deleted images
                  let previousImages = new Set<string>();

                  editor.on("NodeChange", () => {
                    // Get all current images in the editor
                    const currentImages = new Set<string>();
                    const imgElements = editor
                      .getBody()
                      .querySelectorAll("img");

                    imgElements.forEach((img) => {
                      const src = img.getAttribute("src");
                      if (src && uploadedImages.has(src)) {
                        currentImages.add(src);
                      }
                    });

                    // Find deleted images (were in previous but not in current)
                    previousImages.forEach((imageUrl) => {
                      if (!currentImages.has(imageUrl)) {
                        console.log("Image deleted from editor:", imageUrl);
                        deleteImageFromEditor(imageUrl);
                      }
                    });

                    // Update previous images for next comparison
                    previousImages = new Set(currentImages);
                  });

                  // Keyboard shortcuts for table operations
                  editor.addShortcut("Ctrl+Shift+R", "Add row below", () => {
                    editor.execCommand("mceTableInsertRowAfter");
                  });

                  editor.addShortcut(
                    "Ctrl+Shift+C",
                    "Add column to right",
                    () => {
                      editor.execCommand("mceTableInsertColAfter");
                    }
                  );

                  editor.addShortcut(
                    "Ctrl+Shift+D",
                    "Delete current row",
                    () => {
                      editor.execCommand("mceTableDeleteRow");
                    }
                  );

                  // Keyboard shortcut for source code view
                  editor.addShortcut(
                    "Ctrl+Shift+S",
                    "View/Edit Source Code",
                    () => {
                      // Get current content from editor
                      const currentContent = editor.getContent();

                      // Create a dialog to show/edit source code
                      editor.windowManager.open({
                        title: "HTML Source Code",
                        size: "large", // Make dialog larger
                        body: {
                          type: "panel",
                          items: [
                            {
                              type: "textarea",
                              name: "source",
                              label: "HTML Source:",
                              maximized: true, // Make textarea take full space
                              placeholder:
                                "HTML source code will appear here...",
                            },
                          ],
                        },
                        buttons: [
                          {
                            type: "cancel",
                            text: "Cancel",
                          },
                          {
                            type: "custom",
                            text: "Copy to Clipboard",
                            name: "copy",
                          },
                          {
                            type: "submit",
                            text: "Update",
                            primary: true,
                          },
                        ],
                        initialData: {
                          source: currentContent,
                        },
                        onAction: (api, details) => {
                          if (details.name === "copy") {
                            const data = api.getData();
                            navigator.clipboard
                              .writeText(data.source)
                              .then(() => {
                                toast.success(
                                  "Source code copied to clipboard!"
                                );
                              })
                              .catch(() => {
                                toast.error("Failed to copy to clipboard");
                              });
                          }
                        },
                        onSubmit: (api) => {
                          const data = api.getData();
                          // Update editor content with modified source
                          editor.setContent(data.source);
                          api.close();
                          toast.success("Source code updated successfully!");
                        },
                        onCancel: () => {
                          // Optional: Add any cleanup when dialog is cancelled
                        },
                      });
                    }
                  );

                  // Custom paste handler để xử lý table paste tốt hơn
                  editor.on("paste", (e: ClipboardEvent) => {
                    const clipboardData =
                      e.clipboardData ||
                      (window as unknown as { clipboardData: DataTransfer })
                        .clipboardData;
                    if (!clipboardData) return;

                    const htmlData = clipboardData.getData("text/html");
                    const textData = clipboardData.getData("text/plain");

                    // Kiểm tra nếu paste data có chứa table
                    if (htmlData && htmlData.includes("<table")) {
                      console.log("Pasting table data...");
                      // Để TinyMCE xử lý paste table tự nhiên
                      return;
                    }

                    // Kiểm tra nếu paste từ Excel (tab-separated values)
                    if (
                      textData &&
                      textData.includes("\t") &&
                      textData.includes("\n")
                    ) {
                      e.preventDefault();

                      // Convert tab-separated data thành HTML table
                      const rows = textData.trim().split("\n");
                      let tableHtml =
                        '<table border="1" style="border-collapse: collapse; width: 100%;">';

                      rows.forEach((row: string, index: number) => {
                        const cells = row.split("\t");
                        const tag = index === 0 ? "th" : "td"; // First row as header
                        tableHtml += "<tr>";
                        cells.forEach((cell: string) => {
                          tableHtml += `<${tag} style="padding: 5px; border: 1px solid #ccc;">${cell.trim()}</${tag}>`;
                        });
                        tableHtml += "</tr>";
                      });

                      tableHtml += "</table>";

                      // Insert table vào editor
                      editor.insertContent(tableHtml);
                      console.log("Converted tab-separated data to table");
                    }
                  });

                  // Also listen for keydown events (Delete, Backspace)
                  editor.on("keydown", (e) => {
                    if (e.key === "Delete" || e.key === "Backspace") {
                      // Small delay to let the deletion happen first
                      setTimeout(() => {
                        const currentImages = new Set<string>();
                        const imgElements = editor
                          .getBody()
                          .querySelectorAll("img");

                        imgElements.forEach((img) => {
                          const src = img.getAttribute("src");
                          if (src && uploadedImages.has(src)) {
                            currentImages.add(src);
                          }
                        });

                        // Find deleted images
                        previousImages.forEach((imageUrl) => {
                          if (!currentImages.has(imageUrl)) {
                            console.log(
                              "Image deleted via keyboard:",
                              imageUrl
                            );
                            deleteImageFromEditor(imageUrl);
                          }
                        });

                        previousImages = new Set(currentImages);
                      }, 100);
                    }
                  });
                },
                // Drag and drop image upload support
                images_upload_url: "", // Use custom handler instead of URL
                images_reuse_filename: true,
                images_file_types: "jpg,jpeg,png,gif,webp",
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

                    // Create File object from blob
                    const blob = blobInfo.blob();
                    const fileName = blobInfo.filename() || "image.png";
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const file = new (window as any).File([blob], fileName, {
                      type: blob.type,
                    });

                    // Upload image to Azure
                    uploadImageToAzure(file)
                      .then((uploadResponse) => {
                        console.log(
                          "Drag & drop upload response:",
                          uploadResponse
                        );
                        // Get full image URL
                        return getImageUrlFromAzure(uploadResponse.url);
                      })
                      .then((imageUrl) => {
                        console.log("Drag & drop image URL:", imageUrl);

                        // Track this image for potential deletion
                        uploadedImagesRef.current.add(imageUrl);

                        // Return image URL to TinyMCE
                        resolve(imageUrl);
                        toast.success("Image uploaded successfully!");
                      })
                      .catch((error) => {
                        console.error(
                          "Error uploading image via drag & drop:",
                          error
                        );
                        reject("Error uploading image. Please try again.");
                        toast.error("Error uploading image. Please try again.");
                      });
                  });
                },
                content_style: formStyles,
                // Cấu hình table để có context menu và các tùy chọn nhanh
                table_default_attributes: {
                  border: "1",
                  cellpadding: "5",
                  cellspacing: "0",
                  style: "border-collapse: collapse; width: 100%;",
                },
                table_default_styles: {
                  width: "100%",
                  "border-collapse": "collapse",
                },
                table_responsive_width: true,
                table_grid: true, // Hiển thị grid khi hover
                table_tab_navigation: true, // Cho phép dùng Tab để di chuyển giữa các cell
                // Context menu cho table
                contextmenu: "link image table",
                table_contextmenu: true,
                // Cấu hình paste để xử lý table tốt hơn
                paste_data_images: true,
                paste_as_text: false,
                paste_merge_formats: true,
                paste_auto_cleanup_on_paste: true,
                paste_remove_styles: false,
                paste_remove_styles_if_webkit: false,
                paste_strip_class_attributes: "none",
                paste_retain_style_properties: "all",

                // Cấu hình table selection và copy
                table_clone_elements: "strong em b i u strike sub sup a",
                table_use_colgroups: true,
                table_header_type: "sectionCells",
              }}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          onClick={handleSave}
          size="lg"
          className="px-8 mr-4"
          disabled={
            isLoading || updateDocumentMutation.isPending || !bm1Document
          }
        >
          <File className="w-4 h-4 mr-2" />
          {updateDocumentMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button onClick={handleNext} size="lg" disabled={isLoading}>
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onComplete={handleSignatureComplete}
          onClose={() => setShowSignaturePad(false)}
        />
      )}
    </div>
  );
};
