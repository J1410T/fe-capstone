import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useDocumentsByFilter } from "@/hooks/queries/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDocument } from "@/hooks/queries/useDocuments";
import { toast } from "sonner";
import { DocumentForm } from "@/types/document";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const CreateScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const handleBack = () => navigate(-1);

  const {
    data,
    isLoading: isTemplateLoading,
    error,
  } = useDocumentsByFilter("BM2", true, 1, 1);
  const createDocument = useCreateDocument();

  useEffect(() => {
    const documentList: DocumentForm[] = data?.data?.["data-list"] ?? [];
    const firstDoc: DocumentForm | undefined = documentList[0];
    if (firstDoc?.["content-html"]) {
      // Add frame to the top-right
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
     </div>
      `;
      setFormContent(frame + firstDoc["content-html"]);
    }
  }, [data]);

  const handleEditorChange = () => {
    // Optional: You can add any additional logic here
    // For now, we'll just let the editor handle the content
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    setIsLoading(true);

    createDocument.mutate(
      {
        name: "Scientific CV",
        type: "BM2",
        contentHtml: content,
        isTemplate: false,
      },
      {
        onSuccess: () => {
          toast.success("Scientific CV created successfully!");
          navigate("/profile");
        },
        onError: (error) => {
          console.error("Failed to create Scientific CV:", error);
          toast.error("Failed to create Scientific CV");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
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
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-blue-100 transition-colors rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Scientific CV Document
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Stay updated with your latest activities
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
              {/* <li>
                When the Insert Image dialog opens,{" "}
                <strong>unlock the aspect ratio</strong> (unlink width and
                height), then manually set:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Width: <strong>113</strong>
                  </li>
                  <li>
                    Height: <strong>151</strong>
                  </li>
                </ul>
                This ensures the image fits the standard 3x4 cm (passport photo)
                dimensions.
              </li>
              <li>
                After inserting, the image will appear in the correct format in
                the editor.
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Editor or Loading/Error */}
      <div className="max-w-5xl mx-auto w-full">
        {isTemplateLoading ? (
          <div className="flex items-center justify-center h-[600px] bg-white rounded-xl shadow-inner">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading BM2 template...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow">
            ⚠️ API Error: {(error as Error).message}
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
                // Khi chèn hình xong, resize nếu không phải ảnh khung
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

      {/* Action buttons */}
      <div className="flex justify-between mt-8 max-w-5xl mx-auto">
        <Button
          onClick={handleSave}
          size="lg"
          disabled={isLoading || isTemplateLoading}
          className="px-6"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Scientific CV
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateScientificCV;
