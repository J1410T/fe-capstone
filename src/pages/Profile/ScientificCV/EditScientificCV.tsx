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
} from "lucide-react";
import { getAuthResponse } from "@/utils/cookie-manager";
import {
  useScientificCVByEmail,
  useUpdateDocument,
  useDocumentsByFilter,
} from "@/hooks/queries/document";
import { toast } from "sonner";
import { Loading } from "@/components";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const EditScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const [formContent, setFormContent] = useState<string>("");
  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Get email from auth response cookie
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  const {
    data: scientificCV,
    isLoading: isCVLoading,
    error,
  } = useScientificCVByEmail(userEmail, !!userEmail);

  // Get BM2 template for reset functionality - only fetch when needed
  const {
    // data: bm2Template,
    // isLoading: isTemplateLoading,
    refetch: refetchTemplate,
  } = useDocumentsByFilter("BM2", true, 1, 1, false);

  const updateDocument = useUpdateDocument();

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

  const handleEditorChange = () => {};

  const handleSave = async () => {
    if (!scientificCV?.data?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    setIsLoading(true);

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

  const handleResetCV = async () => {
    if (!scientificCV?.data?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to reset your CV to the original template? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsResetting(true);

    try {
      // Fetch the BM2 template
      const templateResponse = await refetchTemplate();

      if (!templateResponse.data?.data?.["data-list"]?.[0]?.["content-html"]) {
        toast.error("Template not found");
        setIsResetting(false);
        return;
      }

      const templateContent =
        templateResponse.data.data["data-list"][0]["content-html"];

      updateDocument.mutate(
        {
          id: scientificCV.data.id,
          name: "CV",
          type: "ScienceCV",
          "is-template": false,
          "content-html": templateContent,
          "project-id": null,
        },
        {
          onSuccess: () => {
            toast.success(
              "Scientific CV reset to original template successfully!"
            );
            // Update the editor content
            const hasFrame = templateContent.includes('class="frame-image"');
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
            const newContent = hasFrame
              ? templateContent
              : frame + templateContent;
            setFormContent(newContent);
            if (editorRef.current) {
              editorRef.current.setContent(newContent);
            }
          },
          onError: (error) => {
            console.error("Failed to reset Scientific CV:", error);
            toast.error("Failed to reset Scientific CV");
          },
          onSettled: () => {
            setIsResetting(false);
          },
        }
      );
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast.error("Failed to fetch template");
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
                top-right, then use the <strong>Insert → Image</strong> option
                from the toolbar.
              </li>
              <li>
                <strong>Only image URLs are supported.</strong> You must upload
                your image to a public image hosting service (e.g., Imgur,
                Google Drive with public sharing) and paste the image URL into
                the dialog.
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
            apiKey={apiKey}
            onInit={(_, editor) => (editorRef.current = editor)}
            initialValue={formContent}
            onEditorChange={handleEditorChange}
            init={{
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
                "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | link image | preview code fullscreen",
              content_style: formStyles,
              setup: (editor) => {
                editor.on("NodeChange", (e) => {
                  const imgs =
                    e.element?.tagName === "IMG"
                      ? [e.element as HTMLImageElement]
                      : Array.from(editor.getBody().querySelectorAll("img"));

                  imgs.forEach((img) => {
                    const isFrameImg = img.classList.contains("frame-image");
                    const alreadySized =
                      img.style.width === "113px" &&
                      img.style.height === "151px";

                    if (!alreadySized && !isFrameImg) {
                      img.setAttribute("width", "113");
                      img.setAttribute("height", "151");
                      img.style.width = "113px";
                      img.style.height = "151px";
                      img.style.objectFit = "cover";
                    }
                  });
                });
              },
            }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={handleResetCV}
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
        <Button
          onClick={handleSave}
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
      </div>
    </div>
  );
};

export default EditScientificCV;
