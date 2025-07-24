import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CollaboratorInvitation, InvitedUser } from "@/components/common";
import {
  UserPlus,
  FileText,
  Users,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type EditorInstance = { getContent: () => string } | null;

interface ProjectEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (data: {
    description: string;
    collaborators: InvitedUser[];
  }) => void;
  projectTitle: string;
  isLoading?: boolean;
}

interface EnrollmentData {
  description: string;
  collaborators: InvitedUser[];
}

export const ProjectEnrollModal: React.FC<ProjectEnrollModalProps> = ({
  isOpen,
  onClose,
  onEnroll,
  projectTitle,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    description: "",
    collaborators: [],
  });

  const editorRef = useRef<EditorInstance>(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const steps = [
    { number: 1, title: "Description", icon: FileText },
    { number: 2, title: "Invite Collaborators", icon: Users },
    { number: 3, title: "Review", icon: CheckCircle },
  ];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setEnrollmentData({
        description: "",
        collaborators: [],
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Save description from editor
      const content = editorRef.current?.getContent() ?? "";
      if (!content.trim()) {
        return; // Don't proceed if no content
      }
      setEnrollmentData((prev) => ({ ...prev, description: content }));
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onEnroll({
      description: enrollmentData.description,
      collaborators: enrollmentData.collaborators,
    });
  };

  const canProceedFromStep1 = () => {
    const content = editorRef.current?.getContent() ?? "";
    return content.trim().length > 0;
  };

  const canProceedFromStep2 = () => {
    const hasLeader = enrollmentData.collaborators.some(
      (u) => u.role === "Leader"
    );
    return enrollmentData.collaborators.length > 0 && hasLeader;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Project Description (BM1)";
      case 2:
        return "Invite Collaborators";
      case 3:
        return "Review & Submit";
      default:
        return "Enroll in Project";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3: Enroll in "{projectTitle}"
          </DialogDescription>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 ${
                    step.number === currentStep
                      ? "text-blue-600"
                      : step.number < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number === currentStep
                        ? "bg-blue-100 text-blue-600"
                        : step.number < currentStep
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="py-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Project Description (BM1)
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-4">
                  Provide a detailed description of your project proposal. This
                  content will be used for the BM1 document.
                </p>
              </div>

              <div className="min-h-[400px] border rounded-lg">
                <Editor
                  apiKey={apiKey}
                  onInit={(_, editor) => (editorRef.current = editor)}
                  initialValue={enrollmentData.description}
                  init={{
                    height: 400,
                    width: "100%",
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "insertdatetime",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar: [
                      "undo redo | blocks | bold italic underline | alignleft aligncenter alignright",
                      "bullist numlist outdent indent | removeformat | table | help",
                    ].join(" | "),
                    content_style: `
                      body {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #333;
                        padding: 20px;
                      }
                    `,
                    branding: false,
                    promotion: false,
                    resize: false,
                    statusbar: false,
                  }}
                />
              </div>

              {!canProceedFromStep1() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    ⚠️ Please enter some content before proceeding to the next
                    step.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <CollaboratorInvitation
                invitedUsers={enrollmentData.collaborators}
                onUsersChange={(users) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    collaborators: users,
                  }))
                }
                maxMembers={5}
              />

              {!canProceedFromStep2() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    ⚠️ Please invite at least one collaborator and assign a
                    Leader role.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Description Review */}
              <div>
                <h4 className="text-base font-medium mb-3">
                  Project Description
                </h4>
                <div
                  className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: enrollmentData.description,
                  }}
                />
              </div>

              {/* Collaborators Review */}
              <div>
                <h4 className="text-base font-medium mb-3">
                  Invited Collaborators ({enrollmentData.collaborators.length})
                </h4>
                <div className="space-y-2">
                  {enrollmentData.collaborators.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          user.role === "Leader" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Ready to submit:</strong> Your enrollment request will
                  be sent to the project administrators for review.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                isLoading ||
                (currentStep === 1 && !canProceedFromStep1()) ||
                (currentStep === 2 && !canProceedFromStep2())
              }
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Enrolling..." : "Submit Enrollment"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
