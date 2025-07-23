import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDocument } from "@/hooks/queries/useDocuments";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/profile/PhotoUpload";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const CreateScientificCV: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { user } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string>("");
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const createDocument = useCreateDocument();

  // Load the BM2 template when component mounts
  useEffect(() => {
    async function fetchFormTemplate() {
      try {
        const response = await fetch(`/src/components/forms/BM2.html`);
        const htmlText = await response.text();

        // Extract <style> content
        const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        setFormStyles(styleMatch ? styleMatch[1] : "");

        // Extract <body> content or fallback to full content without styles
        const bodyMatch = htmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const content = bodyMatch
          ? bodyMatch[1]
          : htmlText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

        setFormContent(content);
      } catch (error) {
        console.error("Failed to load BM2 template:", error);
        toast.error("Failed to load Scientific CV template");
        setFormContent("");
        setFormStyles("");
      }
    }

    fetchFormTemplate();
  }, []);

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

  const handleCancel = () => {
    // Go back to the previous page, or fallback to profile if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  const handlePhotoSelect = (photoUrl: string) => {
    setUploadedPhoto(photoUrl);

    // Update the photo in the editor content
    if (editorRef.current) {
      const editor = editorRef.current;
      const content = editor.getContent();

      if (photoUrl) {
        // Replace the photo placeholder with the actual image
        const updatedContent = content.replace(
          /<div class="photo"[^>]*>[\s\S]*?<\/div>/i,
          `<div class="photo"><img src="${photoUrl}" alt="Profile Photo" style="width: 90px; height: 120px; object-fit: cover; border: 1px solid #222;" /></div>`
        );
        editor.setContent(updatedContent);
      } else {
        // Restore the placeholder
        const updatedContent = content.replace(
          /<div class="photo"[^>]*>[\s\S]*?<\/div>/i,
          '<div class="photo">Ảnh 3x4</div>'
        );
        editor.setContent(updatedContent);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Create Scientific CV
                  </h1>
                  <p className="text-sm text-gray-500">BM2 Document Template</p>
                </div>
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Scientific CV"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions Card */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 rounded-full">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Scientific CV Instructions
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Fill out your comprehensive scientific curriculum vitae using
                the BM2 template below.
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>
                  • Click on the photo placeholder to upload your 3x4 photo
                </li>
                <li>• Fill in all required fields marked in the template</li>
                <li>
                  • Use the formatting tools to structure your content properly
                </li>
                <li>• Save your progress regularly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <PhotoUpload
              onPhotoSelect={handlePhotoSelect}
              currentPhoto={uploadedPhoto}
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-600 mb-2">
                Upload your 3x4 profile photo. This will automatically be
                inserted into your CV template.
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF • Maximum size: 5MB
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Scientific Curriculum Vitae (BM2)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Complete the form below with your academic and professional
              information.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {/* TinyMCE Editor */}
            <div className="min-h-[800px]">
              <Editor
                key={formContent + formStyles}
                apiKey={apiKey}
                onInit={(_, editor) => (editorRef.current = editor)}
                initialValue={formContent}
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
                  setup: (editor) => {
                    editor.on("init", () => {
                      // Ensure content is loaded properly
                      if (formContent) {
                        editor.setContent(formContent);
                      }
                    });
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateScientificCV;
