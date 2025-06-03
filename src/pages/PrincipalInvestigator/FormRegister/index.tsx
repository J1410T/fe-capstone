import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelector } from "./components/FormSelector";
import { useNavigate } from "react-router-dom";
import { FormContent } from "./components/FormContent";
import { ConfirmationModal } from "./components/ConfirmationModal";

// Form types and their role-based visibility
export const FORM_TYPES: Record<
  string,
  { id: string; title: string; roles: UserRole[] }
> = {
  BM1: {
    id: "BM1",
    title: "Evaluation and appraisal of the outline",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
  },
  BM2: {
    id: "BM2",
    title:
      "Minutes of the meeting of the council to review the outline of the scientific research topic",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
  },
  BM3: {
    id: "BM3",
    title: "Project summary report",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR, UserRole.MEMBER],
  },
  BM4: {
    id: "BM4",
    title: "Report on the progress of the scientific research topic",
    roles: [UserRole.MEMBER],
  },
  BM5: {
    id: "BM5",
    title:
      "Proposed changes during the implementation of the scientific research topic",
    roles: [UserRole.MEMBER],
  },
};

export type FormType = keyof typeof FORM_TYPES;

interface FormData {
  [key: string]: string | number | boolean;
}

const FormRegister: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedForm, setSelectedForm] = useState<FormType>("BM1");
  const [formData, setFormData] = useState<FormData>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize available forms based on user role
  const availableForms = useMemo((): FormType[] => {
    if (!user?.role) return [];

    return Object.entries(FORM_TYPES)
      .filter(([, form]) => form.roles.includes(user.role))
      .map(([key]) => key as FormType);
  }, [user?.role]);

  // Set default form based on user role
  useEffect(() => {
    if (availableForms.length > 0) {
      // Default to BM1 for PI, BM4 for Member
      const defaultForm =
        user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "BM1" : "BM4";
      if (availableForms.includes(defaultForm)) {
        setSelectedForm(defaultForm);
      } else {
        setSelectedForm(availableForms[0]);
      }
    }
  }, [availableForms, user?.role]);

  // Handle form data changes
  const handleFormDataChange = useCallback((data: FormData) => {
    setFormData(data);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  // Handle confirmed submission
  const handleConfirmSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      toast.success("Form submitted successfully!", {
        description: `${FORM_TYPES[selectedForm].title} has been submitted for review.`,
      });

      navigate("/");

      // Reset form
      setFormData({});
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedForm, navigate]);

  // Handle submission cancellation
  const handleCancelSubmit = useCallback(() => {
    setIsConfirmModalOpen(false);
    toast.info("Form submission cancelled");
  }, []);

  if (availableForms.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No forms available for your role.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="border-none shadow-none pt-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Form Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormSelector
            selectedForm={selectedForm}
            onFormChange={setSelectedForm}
            availableForms={availableForms}
          />

          <FormContent
            formType={selectedForm}
            formData={formData}
            onDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        isLoading={isSubmitting}
        formTitle={FORM_TYPES[selectedForm].title}
      />
    </div>
  );
};

export default FormRegister;
