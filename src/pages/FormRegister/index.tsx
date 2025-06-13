import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelector } from "./components/FormSelector";
import { useLocation, useNavigate } from "react-router-dom";
import { FormContent } from "./components/FormContent";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { FORM_TYPES, FormType, FormData } from "./constants";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const FormRegister: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedForm, setSelectedForm] = useState<FormType>("BM1");
  const [formData, setFormData] = useState<FormData>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previousPage = location.state?.from || "/pi/projects";

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    // If we have a specific previous page from navigation state, use it
    if (location.state?.from) {
      navigate(previousPage);
    } else {
      // Otherwise, use browser history to go back
      navigate(-1);
    }
  }, [navigate, previousPage, location.state?.from]);

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

      // Navigate back to the previous page instead of hardcoded "/"
      navigate(previousPage);

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
  }, [selectedForm, navigate, previousPage]); // Added previousPage to dependencies

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
        <CardHeader className="  flex items-center ">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
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
