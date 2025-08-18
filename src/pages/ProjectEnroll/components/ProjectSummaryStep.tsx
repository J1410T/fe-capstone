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

  const handleNext = () => {
    const currentContent = editorRef.current?.getContent() || "";
    onContentChange(currentContent);
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
                  "textcolor colorpicker hr pagebreak spellchecker",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | link image uploadImage | preview code fullscreen | insertSignature | forecolor backcolor | fontsize | hr pagebreak | searchreplace | spellchecker",
                setup: (editor) => {
                  // Use shared ref to track uploaded images for deletion
                  const uploadedImages = uploadedImagesRef.current;

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
    </div>
  );
};
