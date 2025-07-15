import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import { ProgressSteps, ProjectInfoForm, ReviewForm } from "./components";
import { toast } from "sonner";
import { createProject } from "@/services/resources/project";
import { FormHostRegister } from "@/types/form";
import { createProjectMajor } from "@/services/resources/major";

const RegisterProject: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

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
    field: "",
    major: "",
  });

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

  const handleNextStep = useCallback(() => {
    // Validate form before proceeding
    if (currentStep === 1) {
      if (!formData.englishTitle.trim()) {
        toast.error("English title is required");
        return;
      }
      if (!formData.vietnameseTitle.trim()) {
        toast.error("Vietnamese title is required");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Description is required");
        return;
      }
      if (!formData.duration || parseInt(formData.duration) <= 0) {
        toast.error("Valid duration is required");
        return;
      }
      if (!formData.maximumMember || parseInt(formData.maximumMember) <= 0) {
        toast.error("Valid maximum member count is required");
        return;
      }
      if (!formData.language) {
        toast.error("Language is required");
        return;
      }
      if (!formData.category) {
        toast.error("Category is required");
        return;
      }
      if (!formData.type) {
        toast.error("Type is required");
        return;
      }
      if (!formData.field) {
        toast.error("Field is required");
        return;
      }
      if (!formData.major) {
        toast.error("Major is required");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, formData]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleRegisterProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Final validation
      if (
        !formData.englishTitle.trim() ||
        !formData.vietnameseTitle.trim() ||
        !formData.description.trim() ||
        !formData.duration ||
        !formData.maximumMember ||
        !formData.language ||
        !formData.category ||
        !formData.type ||
        !formData.field ||
        !formData.major
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      setIsLoading(true);

      try {
        // Create project
        const projectData = {
          "english-title": formData.englishTitle,
          "vietnamese-title": formData.vietnameseTitle,
          abbreviations: formData.abbreviations,
          duration: parseInt(formData.duration),
          description: formData.description,
          "requirement-note": formData.requirementNote,
          "maximum-member": parseInt(formData.maximumMember),
          language: formData.language,
          category: formData.category,
          type: formData.type,
        };

        const projectResponse = await createProject(projectData);

        if (projectResponse && projectResponse.id) {
          // Create project-major association
          const projectMajorData = {
            "project-id": projectResponse.id,
            "major-id": formData.major,
          };

          await createProjectMajor(projectMajorData);

          toast.success("Project registered successfully");
          navigate("/host/history");
        } else {
          throw new Error("Failed to create project");
        }
      } catch (error) {
        console.error("Error creating project:", error);
        toast.error("Failed to register project. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate]
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
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <ReviewForm
              formData={formData}
              onPrevStep={handlePrevStep}
              onSubmit={handleRegisterProject}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterProject;
