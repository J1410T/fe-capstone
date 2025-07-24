import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useProject } from "@/hooks/queries/project";
import { Loading } from "@/components/ui";
import { StepperHeader } from "./components/StepperHeader";
import { ProjectSummaryStep } from "./components/ProjectSummaryStep";
import { SimpleInviteMembersStep } from "./components/SimpleInviteMembersStep";
import { ReviewSubmitStep } from "./components/ReviewSubmitStep";
import { SimpleInvitedUser } from "@/components/common";

export interface EnrollmentData {
  bm1Content: string;
  collaborators: SimpleInvitedUser[];
}

const ProjectEnroll: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    bm1Content: "",
    collaborators: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project data
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useProject(projectId || "");

  const project = projectResponse?.data;

  // Redirect if user is already a member or project doesn't exist
  useEffect(() => {
    if (project && project["is-member"]) {
      navigate(getProjectDetailRoute(), { replace: true });
    }
  }, [project, navigate]);

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return "/pi/projects";
      case UserRole.HOST_INSTITUTION:
        return "/host/projects";
      case UserRole.RESEARCHER:
        return "/researcher/projects";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/projects";
      default:
        return "/home";
    }
  };

  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR)
      return `/pi/project/${projectId}`;
    if (user?.role === UserRole.HOST_INSTITUTION)
      return `/host/project/${projectId}`;
    if (user?.role === UserRole.APPRAISAL_COUNCIL)
      return `/council/project/${projectId}`;
    return `/researcher/project/${projectId}`;
  };

  const handleBack = () => {
    navigate(getBackPath());
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call to submit enrollment
      console.log("Submitting enrollment:", {
        projectId,
        bm1Content: enrollmentData.bm1Content,
        collaborators: enrollmentData.collaborators,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to project detail page after successful enrollment
      navigate(getProjectDetailRoute());
    } catch (error) {
      console.error("Failed to submit enrollment:", error);
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gray-50">
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
                  {project["english-title"]}
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
            projectId={projectId!}
            bm1Content={enrollmentData.bm1Content}
            onContentChange={(content) =>
              updateEnrollmentData({ bm1Content: content })
            }
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <SimpleInviteMembersStep
            collaborators={enrollmentData.collaborators}
            onCollaboratorsChange={(collaborators) =>
              updateEnrollmentData({ collaborators })
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 3 && (
          <ReviewSubmitStep
            enrollmentData={enrollmentData}
            projectTitle={project["english-title"]}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectEnroll;
