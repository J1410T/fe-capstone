import React, { useEffect, useState } from "react";
import { FormTinyMCE } from "@/components/ui/TinyMCE";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, X, FileText, Clock, User, Calendar } from "lucide-react";
import {
  FormMetadata,
  FormStatus,
  FORM_TYPES,
} from "@/pages/FormRegister/constants";
import { getStatusColor } from "@/utils/status";

interface FormEditorProps {
  form: FormMetadata;
  onSave: (content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  readOnly?: boolean;
  showMetadata?: boolean;
}

export const FormEditor: React.FC<FormEditorProps> = ({
  form,
  onSave,
  onCancel,
  isLoading = false,
  readOnly = false,
  showMetadata = true,
}) => {
  const [formContent, setFormContent] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");

  // Load form template and content
  useEffect(() => {
    async function loadFormTemplate() {
      try {
        // Try to load form template
        const templateResponse = await fetch(
          `/src/components/forms/${form.formType}.html`
        );
        if (templateResponse.ok) {
          const templateHtml = await templateResponse.text();

          // Extract styles
          const styleMatch = templateHtml.match(
            /<style[^>]*>([\s\S]*?)<\/style>/i
          );

          const styles = styleMatch ? styleMatch[1] : "";
          setFormStyles(styles);
        }

        // Use existing form content if available, otherwise use template
        setFormContent(form.content || "");
      } catch (error) {
        console.error("Failed to load form template:", error);
        // Fallback to existing content or empty
        setFormContent(form.content || "");
        setFormStyles("");
      }
    }

    loadFormTemplate();
  }, [form.formType, form.content]);

  const handleSave = () => {
    onSave(editorContent);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status icon
  const getStatusIcon = (status: FormStatus) => {
    switch (status) {
      case FormStatus.DRAFT:
        return <FileText className="w-4 h-4" />;
      case FormStatus.SUBMITTED:
        return <FileText className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_PI:
        return <Clock className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_STAFF:
        return <Clock className="w-4 h-4" />;
      case FormStatus.FINALIZED:
        return <FileText className="w-4 h-4" />;
      case FormStatus.VIEW_ONLY:
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formTypeConfig = FORM_TYPES[form.formType];

  return (
    <div className="space-y-6">
      {/* Form Metadata */}
      {showMetadata && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {form.title}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{form.formType}</Badge>
                    <span>•</span>
                    <span>{formTypeConfig.title}</span>
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`${getStatusColor(
                  form.status
                )} flex items-center gap-1`}
              >
                {getStatusIcon(form.status)}
                {form.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Last Updated By</div>
                  <div className="text-gray-600">{form.lastUpdatedByName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-gray-600">
                    {formatDate(form.lastUpdated)}
                  </div>
                </div>
              </div>
              {form.submissionDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">Submitted</div>
                    <div className="text-gray-600">
                      {formatDate(form.submissionDate)}
                    </div>
                  </div>
                </div>
              )}
              {form.projectTitle && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">Project</div>
                    <div className="text-gray-600">{form.projectTitle}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <Card>
        <CardContent className="p-0">
          <div className="min-h-[600px]">
            <FormTinyMCE
              value={formContent}
              onChange={handleEditorChange}
              height={600}
              disabled={readOnly}
              formStyles={formStyles}
              readOnly={readOnly}
              preset="form"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};
