import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  RegisterHeader,
  ProgressSteps,
  ProjectInfoForm,
  ResearchDetailsForm,
  ReviewForm,
  ProjectsListTab,
} from "./components";
import { getStatusColor, getStatusIcon } from "./utils/statusHelpers";

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

// Mock data for registered projects
const registeredProjects = [
  {
    id: 1,
    title: "Machine Learning for Medical Diagnosis",
    field: "Computer Science",
    status: "Pending Approval",
    createdAt: "2023-05-15",
    manager: "Dr. Jane Smith",
    budget: "$120,000",
    duration: "18 months",
  },
  {
    id: 2,
    title: "Renewable Energy Storage Solutions",
    field: "Engineering",
    status: "Approved",
    createdAt: "2023-06-02",
    manager: "Dr. Michael Johnson",
    budget: "$85,000",
    duration: "12 months",
  },
  {
    id: 3,
    title: "Blockchain in Supply Chain Management",
    field: "Business & Economics",
    status: "Pending Approval",
    createdAt: "2023-06-10",
    manager: "Dr. Sarah Williams",
    budget: "$75,000",
    duration: "24 months",
  },
  {
    id: 4,
    title: "Sustainable Urban Planning",
    field: "Social Sciences",
    status: "Pending Approval",
    createdAt: "2023-06-15",
    manager: "Dr. Robert Chen",
    budget: "$90,000",
    duration: "36 months",
  },
];

const RegisterProject: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

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
      setActiveTab("projects");
      // Show success message
    }, 1500);
  };

  const navigate = useNavigate();

  const handleViewProjectDetails = (projectId: number) => {
    // Navigate to project details page
    navigate(`/host/project/${projectId}`);
  };

  const filteredProjects = registeredProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <RegisterHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        projectsCount={registeredProjects.length}
      />

      <Tabs value={activeTab}>
        {/* Register Project Tab */}
        <TabsContent value="register" className="space-y-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Register New Research Project
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below to register your scientific research
              project
            </p>
          </div>

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
        </TabsContent>

        {/* My Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <ProjectsListTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewDetails={handleViewProjectDetails}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterProject;
