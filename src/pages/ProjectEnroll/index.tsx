import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useProject } from "@/hooks/queries/project";
import { Loading } from "@/components/ui";
import { StepperHeader } from "./components/StepperHeader";
import { ProjectSummaryStep } from "./components/ProjectSummaryStep";
import { ReviewSubmitStep } from "./components/ReviewSubmitStep";
import { SimpleInvitedUser } from "@/components/common";
import { InviteMembersStep } from "./components/InviteMembersStep";
import { GroupMember } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";

export interface EnrollmentData {
  bm1Content: string;
  collaborators: SimpleInvitedUser[];
  groupMembers: GroupMember[];
}

const ProjectEnroll: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Get step from URL params, default to 1
  const stepFromUrl = parseInt(searchParams.get("step") || "1");
  const [currentStep, setCurrentStep] = useState(
    stepFromUrl >= 1 && stepFromUrl <= 3 ? stepFromUrl : 1
  );
  const [collaborators, setCollaborators] = useState<SimpleInvitedUser[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const queryClient = useQueryClient();

  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    bm1Content: "",
    collaborators: [],
    groupMembers: [],
  });

  // Fetch project data
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useProject(projectId || "");

  const handleDocumentCreated = () => {
    // Refetch project data to get the newly created document
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  };

  const project = projectResponse?.data;

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return "/pi/projects";
      case UserRole.RESEARCHER:
        return "/researcher/projects";
      default:
        return "/home";
    }
  };

  // Sync currentStep with URL params
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get("step") || "1");
    const validStep = stepFromUrl >= 1 && stepFromUrl <= 3 ? stepFromUrl : 1;
    if (currentStep !== validStep) {
      setCurrentStep(validStep);
    }
  }, [searchParams, currentStep]);

  // Initialize URL with step=1 if no step param exists
  useEffect(() => {
    if (!searchParams.has("step")) {
      setSearchParams({ step: "1" });
    }
  }, [searchParams, setSearchParams]);

  const handleBack = () => {
    navigate(getBackPath());
  };

  const handleNext = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSearchParams({ step: nextStep.toString() });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setSearchParams({ step: prevStep.toString() });
    }
  };

  const updateEnrollmentData = (updates: Partial<EnrollmentData>) => {
    setEnrollmentData((prev) => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The project you're trying to enroll in doesn't exist or you don't
              have permission to view it.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Enroll in Project
                </h1>
                <p className="text-sm text-gray-600">
                  {project["project-detail"]["english-title"]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <StepperHeader currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <ProjectSummaryStep
            onContentChange={(content) =>
              updateEnrollmentData({ bm1Content: content })
            }
            onNext={handleNext}
            projectDocuments={project?.["project-detail"]?.documents}
            onDocumentCreated={handleDocumentCreated}
          />
        )}

        {currentStep === 2 && (
          <InviteMembersStep
            projectName={project["project-detail"]["english-title"]}
            collaborators={collaborators}
            onCollaboratorsChange={setCollaborators}
            groupMembers={groupMembers}
            onGroupMembersChange={setGroupMembers}
            maximumMembers={project["project-detail"]["maximum-member"] ?? 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
            mode="detailed"
          />
        )}

        {currentStep === 3 && (
          <ReviewSubmitStep
            enrollmentData={enrollmentData}
            projectTitle={project["project-detail"]["english-title"]}
            onPrevious={handlePrevious}
            isSubmitting={false}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectEnroll;
