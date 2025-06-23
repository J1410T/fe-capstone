import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import {
  Brain,
  Rocket,
  Dna,
  Leaf,
  Beaker,
  Atom,
  Users,
  BookOpen,
  Landmark,
  Microscope,
} from "lucide-react";
import { ProgressSteps, ProjectInfoForm, ReviewForm } from "./components";
import { toast } from "sonner";

// Research fields with icons
const researchFields = [
  { id: "computer-science", name: "Computer Science", icon: Brain },
  { id: "engineering", name: "Engineering", icon: Rocket },
  { id: "medicine", name: "Medicine & Health Sciences", icon: Dna },
  { id: "biology", name: "Biology", icon: Leaf },
  { id: "chemistry", name: "Chemistry", icon: Beaker },
  { id: "physics", name: "Physics", icon: Atom },
  { id: "social-sciences", name: "Social Sciences", icon: Users },
  { id: "humanities", name: "Humanities", icon: BookOpen },
  { id: "business", name: "Business & Economics", icon: Landmark },
  { id: "other", name: "Other", icon: Microscope },
];

export interface ProjectFormData {
  title: string;
  field: string;
  type: string;
  target: string;
  overview: string;
}

const RegisterProject: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    field: "",
    type: "",
    target: "",
    overview: "",
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
      if (!formData.title.trim()) {
        toast.error("Project title is required");
        return;
      }
      if (!formData.field) {
        toast.error("Research field is required");
        return;
      }
      if (!formData.type) {
        toast.error("Project type is required");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, formData]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleRegisterProject = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Final validation
      if (!formData.title.trim() || !formData.field || !formData.type) {
        toast.error("Please fill all required fields");
        return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Project registered successfully");
        navigate("/host/history");
      }, 1500);
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
              researchFields={researchFields}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <ReviewForm
              formData={formData}
              researchFields={researchFields}
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
