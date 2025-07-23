import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useScientificCV,
  useUpdateDocument,
} from "@/hooks/queries/useDocuments";
import { toast } from "sonner";

type EditorInstance = { getContent: () => string } | null;

const EditScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  const [formStyles, setFormStyles] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const {
    data: scientificCV,
    isLoading: isLoadingCV,
    error,
  } = useScientificCV(user?.id || "");
  const updateDocument = useUpdateDocument();

  // Load the BM2 template styles when component mounts
  useEffect(() => {
    async function fetchFormStyles() {
      try {
        const response = await fetch(`/src/components/forms/BM2.html`);
        const htmlText = await response.text();

        // Extract <style> content
        const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        setFormStyles(styleMatch ? styleMatch[1] : "");
      } catch (error) {
        console.error("Failed to load BM2 template styles:", error);
        setFormStyles("");
      }
    }

    fetchFormStyles();
  }, []);

  const handleSave = async () => {
    if (!scientificCV?.id) {
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
        id: scientificCV.id,
        data: {
          contentHtml: content,
        },
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

  const handleCancel = () => {
    // Go back to the view page, or fallback to view if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile/scientific-cv/view");
    }
  };

  if (isLoadingCV) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Scientific CV...</p>
        </div>
      </div>
    );
  }

  if (error || !scientificCV) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Scientific CV Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Your Scientific CV could not be found or may have been deleted.
          </p>
          <Button
            onClick={() => navigate("/profile")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to View
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Edit Scientific CV
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-800">
              Edit Scientific Curriculum Vitae
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Update your scientific curriculum vitae content.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {/* TinyMCE Editor */}
            <div className="min-h-[800px]">
              <Editor
                key={scientificCV.id + formStyles}
                apiKey={apiKey}
                onInit={(_, editor) => (editorRef.current = editor)}
                initialValue={
                  scientificCV.contentHtml || scientificCV["content-html"] || ""
                }
                init={{
                  height: 800,
                  width: "100%",
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
                    "paste",
                    "print",
                  ],
                  toolbar: [
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough",
                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                    "removeformat | table | link image | preview code fullscreen print | help",
                  ].join(" | "),
                  content_style: `
                    html, body {
                      width: 100% !important;
                      background: #fff !important;
                      margin: 0 auto !important;
                      font-family: "Times New Roman", Times, serif;
                      font-size: 13px;
                      line-height: 1.4;
                      color: #333;
                      padding: 32px 36px;
                      box-sizing: border-box !important;
                    }
                    ${formStyles}
                    * {
                      max-width: 100% !important;
                      box-sizing: border-box !important;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 1em 0;
                    }
                    table td, table th {
                      border: 1px solid #222;
                      padding: 6px 8px;
                      text-align: left;
                      vertical-align: top;
                    }
                    table th {
                      background-color: #f0f0f0;
                      text-align: center;
                      font-weight: bold;
                    }
                    .dotted-line {
                      border-bottom: 1px dotted #222;
                      display: inline-block;
                      min-width: 120px;
                      height: 1em;
                      vertical-align: middle;
                    }
                    .dotted-line.short {
                      min-width: 40px;
                    }
                    .center {
                      text-align: center;
                    }
                    .upper {
                      text-transform: uppercase;
                    }
                    .italic {
                      font-style: italic;
                    }
                    .small {
                      font-size: 12px;
                    }
                    .photo {
                      width: 90px;
                      height: 120px;
                      border: 1px solid #222;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      font-size: 14px;
                      margin: 0 auto;
                    }
                    .signature-section {
                      display: flex;
                      justify-content: space-between;
                      margin-top: 32px;
                      padding-bottom: 80px;
                    }
                    .signature-box {
                      width: 45%;
                      text-align: center;
                      font-weight: bold;
                    }
                    h1, h2, h3, h4, h5, h6 {
                      margin: 1em 0 0.5em 0;
                      line-height: 1.3;
                    }
                    p {
                      margin: 0.5em 0;
                    }
                    ul, ol {
                      margin: 0.5em 0;
                      padding-left: 2em;
                    }
                  `,
                  paste_data_images: true,
                  paste_as_text: false,
                  paste_webkit_styles:
                    "font-weight font-style color text-decoration",
                  paste_retain_style_properties:
                    "color font-size font-family font-weight font-style text-decoration",
                  branding: false,
                  promotion: false,
                  resize: false,
                  statusbar: true,
                  elementpath: false,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditScientificCV;
