import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import {
  useCreateDocument,
  useDocumentsByFilter,
} from "@/hooks/queries/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";

const CreateScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef<ScientificCVEditorRef>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const handleBack = () => navigate(-1);

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
    refetch: refetchTemplate,
  } = useDocumentsByFilter("BM2", true, 1, 1, false); // Initially disabled

  const createDocument = useCreateDocument();

  // Fetch template on component mount
  useEffect(() => {
    refetchTemplate();
  }, [refetchTemplate]);

  useEffect(() => {
    if (
      !isTemplateLoading &&
      templateData?.data?.["data-list"]?.[0]?.["content-html"]
    ) {
      const templateContent = templateData.data["data-list"][0]["content-html"];

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
      setFormContent(frame + templateContent);
    }
  }, [templateData, isTemplateLoading]);

  const handleEditorChange = () => {
    // Optional: You can add any additional logic here
    // For now, we'll just let the editor handle the content
  };

  const getProfileRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) return `/pi/profile`;
    if (user?.role === UserRole.HOST_INSTITUTION) return `/host/profile`;
    if (user?.role === UserRole.APPRAISAL_COUNCIL) return `/council/profile`;
    return `/researcher/profile`;
  };

  const handleCreateFromTemplate = async () => {
    setIsLoading(true);

    try {
      // Fetch the BM2 template
      const templateResponse = await refetchTemplate();

      if (!templateResponse.data?.data?.["data-list"]?.[0]?.["content-html"]) {
        toast.error("Template not found");
        setIsLoading(false);
        return;
      }

      const templateContent =
        templateResponse.data.data["data-list"][0]["content-html"];

      // Add frame if not present
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
      const finalContent = hasFrame ? templateContent : frame + templateContent;

      createDocument.mutate(
        {
          name: "CV",
          type: "ScienceCV",
          status: "created",
          "is-template": false,
          "content-html": finalContent,
          "project-id": null,
        },
        {
          onSuccess: () => {
            toast.success("Scientific CV created successfully!");
            navigate(getProfileRoute());
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
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast.error("Failed to fetch template");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const content = editorRef.current?.getContent() ?? "";
    if (!content.trim()) {
      toast.error("Please add content to your Scientific CV");
      return;
    }

    setIsLoading(true);

    createDocument.mutate(
      {
        name: "CV",
        type: "ScienceCV",
        status: "created",
        "is-template": false,
        "content-html": content,
        "project-id": null,
      },
      {
        onSuccess: () => {
          toast.success("Scientific CV created successfully!");
          navigate(getProfileRoute());
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
        {isTemplateLoading ? (
          <div className="flex items-center justify-center h-[600px] bg-white rounded-xl shadow-inner">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading BM2 template...</p>
            </div>
          </div>
        ) : templateError ? (
          <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow">
            <div className="mb-4">
              ⚠️ Template Error: {(templateError as Error).message}
            </div>
            <Button
              onClick={handleCreateFromTemplate}
              size="lg"
              disabled={isLoading}
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
                  Create Scientific CV from Template
                </>
              )}
            </Button>
          </div>
        ) : (
          <ScientificCVEditor
            ref={editorRef}
            value={formContent}
            onChange={handleEditorChange}
            height={800}
            preset="scientific-cv"
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between mt-8 max-w-5xl mx-auto">
        <Button
          onClick={templateError ? handleCreateFromTemplate : handleSave}
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
