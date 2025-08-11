import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormPIRegister } from "@/types/form";

// Import step components directly
import { ProjectInfoForm } from "@/pages/HostInstitution/RegisterProject/components/ProjectInfoForm";
import { InviteMembersStep } from "@/pages/ProjectEnroll/components/InviteMembersStep";
import { ProgressSteps } from "./components";
import { ReviewStep } from "./components/ReviewStep";
import { SimpleInvitedUser } from "@/components/common";
import { ProjectSummaryStepWrapper } from "./components/ProjectSummaryStepWrapper";

const RegisterProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state - simplified
  const [formData, setFormData] = useState<FormPIRegister>({
    // Step 1: Project Registration
    englishTitle: "",
    vietnameseTitle: "",
    abbreviations: "",
    duration: "",
    language: "",
    category: "",
    type: "",
    field: [],
    major: [],
    tags: [],
    maximumMember: "",
    requirementNote: "", // Add requirement note field

    // Step 2: Project Summary
    description: "",
    objective: "",
    methodology: "",
    expectedOutcome: "",
  });

  // State for project creation and team members
  const [projectId, setProjectId] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<SimpleInvitedUser[]>([]);
  const [projectSummaryContent, setProjectSummaryContent] =
    useState<string>("");

  // Form input handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleMultiSelectChange = useCallback(
    (name: string, values: string[]) => {
      setFormData((prev) => ({ ...prev, [name]: values }));
    },
    []
  );

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  }, []);

  // Step navigation functions
  const handleNextStep = useCallback(() => {
    // Set a mock project ID when moving from step 1 to step 2
    if (currentStep === 1) {
      setProjectId("mock-project-id");
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  // Final submission - simple alert (no API calls)
  const handleFinalSubmission = useCallback(() => {
    alert("Project registration completed! (This is a UI demo)");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Register New Research Project
          </h1>
          <p className="text-muted-foreground">
            Create and submit your research project proposal for review
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ProgressSteps currentStep={currentStep} />

        {currentStep === 1 && (
          <ProjectInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onMultiSelectChange={handleMultiSelectChange}
            onTagsChange={handleTagsChange}
            onNextStep={handleNextStep}
          />
        )}

        {currentStep === 2 && projectId && (
          <div className="space-y-6">
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                size="lg"
                className="px-8"
              >
                Previous
              </Button>
            </div>
            <ProjectSummaryStepWrapper
              projectId={projectId}
              onContentChange={setProjectSummaryContent}
              onNext={handleNextStep}
              onDocumentCreated={() => {
                console.log("Document created successfully");
              }}
            />
          </div>
        )}

        {currentStep === 3 && projectId && (
          <InviteMembersStep
            collaborators={collaborators}
            onCollaboratorsChange={setCollaborators}
            onNext={handleNextStep}
            onPrevious={handlePrevStep}
            mode="detailed"
          />
        )}

        {currentStep === 4 && (
          <ReviewStep
            formData={{
              ...formData,
              description: projectSummaryContent || formData.description,
            }}
            teamMembers={collaborators}
            projectId={projectId}
            onPrevStep={handlePrevStep}
            onSubmit={handleFinalSubmission}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterProject;
