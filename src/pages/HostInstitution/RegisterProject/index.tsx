import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import { ProgressSteps, ProjectInfoForm, ReviewForm } from "./components";
import { toast } from "sonner";
import { FormHostRegister } from "@/types/form";
import {
  useCreateProject,
  useCreateProjectMajor,
  useCreateProjectTag,
} from "@/hooks/queries/project";
import { CreateProjectRequest } from "@/types/project";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";

const RegisterProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mutations
  const createProjectMutation = useCreateProject();
  const createProjectMajorMutation = useCreateProjectMajor();
  const createProjectTagMutation = useCreateProjectTag();

  // Form state
  const [formData, setFormData] = useState<FormHostRegister>({
    englishTitle: "",
    vietnameseTitle: "",
    abbreviations: "",
    duration: "",
    description: "",
    requirementNote: "",
    maximumMember: "",
    language: "",
    category: "",
    type: "",
    field: [],
    major: [],
    tags: [],
    logoUrl: "",
  });

  const isLoading =
    createProjectMutation.isPending ||
    createProjectMajorMutation.isPending ||
    createProjectTagMutation.isPending;

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
    (name: string, value: string[]) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  }, []);

  const validateStep1 = useCallback(() => {
    const requiredFields = [
      {
        field: formData.englishTitle.trim(),
        message: "English title is required",
      },
      {
        field: formData.vietnameseTitle.trim(),
        message: "Vietnamese title is required",
      },
      {
        field: formData.description.trim(),
        message: "Description is required",
      },
      {
        field: formData.duration && parseInt(formData.duration) > 0,
        message: "Valid duration is required",
      },
      {
        field: formData.maximumMember && parseInt(formData.maximumMember) > 0,
        message: "Valid maximum member count is required",
      },
      { field: formData.language, message: "Language is required" },
      { field: formData.category, message: "Category is required" },
      { field: formData.type, message: "Type is required" },
      {
        field: formData.field.length > 0,
        message: "At least one field is required",
      },
      {
        field: formData.major.length > 0,
        message: "At least one major is required",
      },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        toast.error(message);
        return false;
      }
    }
    return true;
  }, [formData]);

  const handleNextStep = useCallback(() => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, validateStep1]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleRegisterProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateStep1()) {
        return;
      }

      try {
        // Step 1: Create project
        const projectData: CreateProjectRequest = {
          "english-title": formData.englishTitle,
          "vietnamese-title": formData.vietnameseTitle,
          abbreviations: formData.abbreviations || undefined,
          duration: parseInt(formData.duration),
          description: formData.description,
          "requirement-note": formData.requirementNote || undefined,
          "maximum-member": parseInt(formData.maximumMember),
          language: formData.language,
          category: formData.category,
          type: formData.type,
          "logo-url": formData.logoUrl || undefined,
        };

        const projectId = await createProjectMutation.mutateAsync(projectData);

        // Step 2: Create project-major associations for each selected major
        for (const majorId of formData.major) {
          const projectMajorData = {
            "project-id": projectId,
            "major-id": majorId,
          };
          await createProjectMajorMutation.mutateAsync(projectMajorData);
        }

        // Step 3: Create project tags if any
        if (formData.tags.length > 0) {
          const projectTagData = {
            names: formData.tags,
            "project-id": projectId,
          };

          await createProjectTagMutation.mutateAsync(projectTagData);
        }

        toast.success("Project registered successfully");
        if (user?.role === UserRole.HOST_INSTITUTION) {
          navigate("/host/history");
        } else {
          navigate("/staff");
        }
      } catch (error) {
        console.error("Error creating project:", error);
        toast.error("Failed to register project. Please try again.");
      }
    },
    [
      formData,
      navigate,
      validateStep1,
      createProjectMutation,
      createProjectMajorMutation,
      createProjectTagMutation,
      user?.role,
    ]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Register New Research Project
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to register your scientific research project
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ProgressSteps currentStep={currentStep} />

        <form onSubmit={handleRegisterProject}>
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

          {currentStep === 2 && (
            <ReviewForm
              formData={formData}
              onPrevStep={handlePrevStep}
              onSubmit={handleRegisterProject}
              isLoading={isLoading}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterProject;
