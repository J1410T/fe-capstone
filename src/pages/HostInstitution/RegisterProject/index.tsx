import React, { useState } from "react";
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
import {
  ProgressSteps,
  ProjectInfoForm,
  ResearchDetailsForm,
  ReviewForm,
} from "./components";

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

// No mock data needed for projects list

const RegisterProject: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    field: "",
    startDate: "",
    endDate: "",
    budget: "",
    manager: "",
    institution: "",
    department: "",
    description: "",
    objectives: "",
    methodology: "",
    expectedOutcomes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleRegisterProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to my projects page after successful registration
      navigate("/host/my-projects");
      // Show success message
    }, 1500);
  };

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
          {/* Step 1: Project Information */}
          {currentStep === 1 && (
            <ProjectInfoForm
              formData={formData}
              researchFields={researchFields}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNextStep={handleNextStep}
            />
          )}

          {/* Step 2: Research Details */}
          {currentStep === 2 && (
            <ResearchDetailsForm
              formData={formData}
              onInputChange={handleInputChange}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
            />
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
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
