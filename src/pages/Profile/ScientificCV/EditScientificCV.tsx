import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  FileText,
  AlertCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { getAuthResponse } from "@/utils/cookie-manager";
import {
  useScientificCVByEmail,
  useUpdateDocument,
  useDeleteDocumentById,
} from "@/hooks/queries/document";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loading,
} from "@/components";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import {
  uploadImageToAzure,
  getImageUrlFromAzure,
  deleteImageFromAzure,
} from "@/services/resources/azure-image";
import SignaturePad from "@/components/common/SignaturePad";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
  insertContent: (content: string) => void;
} | null;

const EditScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const [formContent, setFormContent] = useState<string>("");
  const editorRef = useRef<EditorInstance>(null);
  // const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // Shared set to track uploaded images for deletion
  const uploadedImagesRef = useRef(new Set<string>());

  // Get email from auth response cookie
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  const {
    data: scientificCV,
    isLoading: isCVLoading,
    error,
    refetch: refetchScientificCV,
  } = useScientificCVByEmail(userEmail, !!userEmail);

  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocumentById();

  const getProfileRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) return `/pi/profile`;
    if (user?.role === UserRole.HOST_INSTITUTION) return `/host/profile`;
    if (user?.role === UserRole.APPRAISAL_COUNCIL) return `/council/profile`;
    return `/researcher/profile`;
  };

  useEffect(() => {
    if (!isCVLoading && scientificCV?.data?.["content-html"]) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        scientificCV.data["content-html"],
        "text/html"
      );
      const hasImage = doc.querySelector("img") !== null;

      const frame = `
      <div style="display: flex; justify-content: flex-end;">
        <div class="image-frame" contenteditable="false">
          <div contenteditable="true">
            <img
              src="https://via.placeholder.com/150"
              class="frame-image"
              style="max-width: 100%; max-height: 100%; object-fit: cover;"
            />
          </div>
        </div>
      </div>`;

      const initial = hasImage
        ? scientificCV.data["content-html"]
        : frame + scientificCV.data["content-html"];

      setFormContent(initial);
    }
  }, [scientificCV, isCVLoading]);

  const handleEditorChange = () => {
    // Optional: You can add any additional logic here
    // For now, we'll just let the editor handle the content
  };

  const handleSaveConfirm = async () => {
    if (!scientificCV?.data?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    const rawContent = editorRef.current?.getContent() ?? "";
    if (!rawContent.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    // Parse và chỉnh sửa ảnh - chỉ resize ảnh frame-image (placeholder 3x4)
    const doc = new DOMParser().parseFromString(rawContent, "text/html");
    doc.querySelectorAll("img").forEach((img) => {
      const isFrame = img.classList.contains("frame-image");
      if (isFrame) {
        // Chỉ resize ảnh frame-image (placeholder 3x4)
        img.setAttribute("width", "113");
        img.setAttribute("height", "151");
        img.style.width = "113px";
        img.style.height = "151px";
        img.style.objectFit = "cover";
      }
      // Các ảnh khác giữ nguyên kích thước tự nhiên
    });

    const content = doc.body.innerHTML;

    setIsLoading(true);
    setSaveDialogOpen(false);

    updateDocument.mutate(
      {
        id: scientificCV.data.id,
        name: "CV",
        type: "ScienceCV",
        "is-template": false,
        "content-html": content,
        "project-id": null,
      },
      {
        onSuccess: () => {
          toast.success("Scientific CV updated successfully!");
          navigate("/profile/scientific-cv/view");
        },
        onError: (error) => {
          console.error("Failed to update Scientific CV:", error);
          toast.error("Failed to update Scientific CV");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleDeleteConfirm = async () => {
    if (!scientificCV?.data?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    setIsDeleting(true);
    setDeleteDialogOpen(false);

    deleteDocument.mutate(scientificCV.data.id, {
      onSuccess: () => {
        toast.success("Scientific CV deleted successfully!");
        // Force invalidate and remove cache before navigating
        queryClient.invalidateQueries({
          queryKey: ["scientificCV"],
        });
        queryClient.removeQueries({
          queryKey: ["scientificCV"],
        });
        // Navigate after cache cleanup
        setTimeout(() => {
          navigate(getProfileRoute());
        }, 100);
      },
      onError: (error) => {
        console.error("Failed to delete Scientific CV:", error);
        toast.error("Failed to delete Scientific CV");
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    setResetDialogOpen(false);

    try {
      // Refetch the original data
      const result = await refetchScientificCV();

      if (result.data?.data?.["content-html"]) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          result.data.data["content-html"],
          "text/html"
        );
        const hasImage = doc.querySelector("img") !== null;

        const frame = `
        <div style="display: flex; justify-content: flex-end;">
          <div class="image-frame" contenteditable="false">
            <div contenteditable="true">
              <img
                src="https://via.placeholder.com/150"
                class="frame-image"
                style="max-width: 100%; max-height: 100%; object-fit: cover;"
              />
            </div>
          </div>
        </div>`;

        const resetContent = hasImage
          ? result.data.data["content-html"]
          : frame + result.data.data["content-html"];

        // Update both state and TinyMCE editor content
        setFormContent(resetContent);
        if (editorRef.current) {
          editorRef.current.setContent(resetContent);
        }
      }

      toast.success("Scientific CV reset successfully!");
    } catch (error) {
      console.error("Failed to reset Scientific CV:", error);
      toast.error("Failed to reset Scientific CV");
    } finally {
      setIsResetting(false);
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
  .image-frame {
    width: 150px;
    height: 180px;
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
`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-4">
      {/* Header */}
      <div className="bg-white/90 shadow-sm rounded-xl px-6 py-4 border mb-6 flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile/scientific-cv/view")}
            className="flex items-center gap-2 hover:bg-blue-100 transition-colors rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Edit Scientific CV
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Update your personal academic profile
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                To upload your profile photo, click on the image frame at the
                top-right, then use the <strong>Upload Image</strong> button
                from the toolbar or drag & drop images directly into the editor.
              </li>
              <li>
                <strong>Direct file upload is now supported!</strong> You can
                upload images directly from your computer. Images are
                automatically uploaded to secure cloud storage.
              </li>
              <li>
                To download your CV, go to <strong>File → Print</strong>, then
                choose <strong>"Save"</strong> in the print dialog.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Editor or Loading/Error */}
      <div className="max-w-5xl mx-auto w-full">
        {isCVLoading ? (
          <div className="flex items-center justify-center h-[600px] bg-white rounded-xl shadow-inner">
            <div className="text-center">
              <Loading className="w-full max-w-md" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow">
            ⚠️ Error: {(error as Error).message}
          </div>
        ) : (
          <Editor
            // apiKey={apiKey}
            onInit={(_, editor) => (editorRef.current = editor)}
            initialValue={formContent}
            onEditorChange={handleEditorChange}
            init={{
              licenseKey: "gpl",
              height: 800,
              menubar: true,
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
              toolbar:
                "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image uploadImage signaturePad | preview code fullscreen",
              content_style: formStyles,

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
                        toast.error("Error uploading image. Please try again.");
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
                    console.error("Error extracting filename from URL:", error);
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

                editor.on("NodeChange", (e) => {
                  // Get all current images in the editor
                  const currentImages = new Set<string>();
                  const imgElements = editor.getBody().querySelectorAll("img");

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

                  const imgs =
                    e.element?.tagName === "IMG"
                      ? [e.element as HTMLImageElement]
                      : Array.from(editor.getBody().querySelectorAll("img"));

                  imgs.forEach((img) => {
                    const isFrameImg = img.classList.contains("frame-image");

                    // Chỉ resize ảnh frame-image (placeholder 3x4)
                    if (isFrameImg) {
                      const alreadySized =
                        img.style.width === "113px" &&
                        img.style.height === "151px";

                      if (!alreadySized) {
                        img.setAttribute("width", "113");
                        img.setAttribute("height", "151");
                        img.style.width = "113px";
                        img.style.height = "151px";
                        img.style.objectFit = "cover";
                      }
                    }
                  });
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
                          console.log("Image deleted via keyboard:", imageUrl);
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
            }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 max-w-5xl mx-auto">
        <div className="flex gap-3">
          {/* Reset Dialog */}
          <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                disabled={isResetting || isCVLoading}
                className="px-8 text-red-600 border-red-300 hover:bg-red-50"
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset CV
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Reset Scientific CV</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reset your CV to the original
                  content? This action will restore the CV to its initial state
                  and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setResetDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleResetConfirm}
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset CV"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                disabled={isDeleting || isCVLoading}
                className="px-8 text-red-600 border-red-300 hover:bg-red-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete CV
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Scientific CV</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your Scientific CV? This
                  action is permanent and cannot be undone. All your CV data
                  will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete CV"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              disabled={isLoading || isCVLoading}
              className="px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Save Scientific CV</DialogTitle>
              <DialogDescription>
                Are you sure you want to save the changes to your Scientific CV?
                This will update your profile permanently.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveConfirm} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Signature Pad Modal */}
        {showSignaturePad && (
          <SignaturePad
            onComplete={handleSignatureComplete}
            onClose={() => setShowSignaturePad(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditScientificCV;
