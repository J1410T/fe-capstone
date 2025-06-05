import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ApplicantData, ProfileData, EvaluationData } from "../types";
import ProfileTab from "./ProfileTab";
import EvaluationTab from "./EvaluationTab";

interface ApplicantProfileProps {
  applicant: ApplicantData | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (applicantId: number) => void;
  onReject: (applicantId: number) => void;
  onRequestRevision: (applicantId: number) => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
  applicant,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
}) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(
    null
  );

  // Confirmation dialog states
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    action: "approve" | "reject" | "revision" | null;
    title: string;
    description: string;
    confirmText: string;
    confirmVariant: "default" | "destructive";
  }>({
    isOpen: false,
    action: null,
    title: "",
    description: "",
    confirmText: "",
    confirmVariant: "default",
  });

  // Initialize data when applicant changes
  React.useEffect(() => {
    if (applicant) {
      setProfileData(applicant.profileData);
      setEvaluationData(applicant.evaluationData);
    }
  }, [applicant]);

  if (!applicant || !profileData || !evaluationData) return null;

  const handleProfileDataChange = (data: ProfileData) => {
    setProfileData(data);
  };

  const handleEvaluationDataChange = (data: EvaluationData) => {
    setEvaluationData(data);
  };

  // Helper function to open confirmation dialog
  const openConfirmationDialog = (
    action: "approve" | "reject" | "revision",
    title: string,
    description: string,
    confirmText: string,
    confirmVariant: "default" | "destructive" = "default"
  ) => {
    setConfirmationDialog({
      isOpen: true,
      action,
      title,
      description,
      confirmText,
      confirmVariant,
    });
  };

  // Helper function to close confirmation dialog
  const closeConfirmationDialog = () => {
    setConfirmationDialog({
      isOpen: false,
      action: null,
      title: "",
      description: "",
      confirmText: "",
      confirmVariant: "default",
    });
  };

  // Handle confirmation dialog actions
  const handleConfirmAction = () => {
    if (!applicant || !confirmationDialog.action) return;

    const applicantId = applicant.id;
    const action = confirmationDialog.action;

    // Close dialog first
    closeConfirmationDialog();

    // Execute the action
    switch (action) {
      case "approve":
        onApprove(applicantId);
        toast.success("Principal Investigator Approved", {
          description: `${applicant.name} has been successfully approved as Principal Investigator.`,
        });
        break;
      case "reject":
        onReject(applicantId);
        toast.success("Principal Investigator Rejected", {
          description: `${applicant.name}'s application has been rejected.`,
        });
        break;
      case "revision":
        onRequestRevision(applicantId);
        toast.success("Revision Requested", {
          description: `Revision request has been sent to ${applicant.name}.`,
        });
        break;
    }
  };

  // Button click handlers
  const handleApproveClick = () => {
    if (!applicant) return;
    openConfirmationDialog(
      "approve",
      "Approve Principal Investigator",
      `Are you sure you want to approve ${applicant.name} as the Principal Investigator? This action cannot be undone.`,
      "Approve",
      "default"
    );
  };

  const handleRejectClick = () => {
    if (!applicant) return;
    openConfirmationDialog(
      "reject",
      "Reject Principal Investigator",
      `Are you sure you want to reject ${applicant.name}'s application? This action cannot be undone.`,
      "Reject",
      "destructive"
    );
  };

  const handleRequestRevisionClick = () => {
    if (!applicant) return;
    openConfirmationDialog(
      "revision",
      "Request Revision",
      `Are you sure you want to request a revision from ${applicant.name}? They will be notified to update their application.`,
      "Request Revision",
      "default"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      // In ApplicantProfile.tsx, replace the DialogContent section with:
      <DialogContent
        className="" // Remove max-h-[90vh] overflow-y-auto
        style={{
          maxWidth: "90vw",
          width: "60vw",
          maxHeight: "90vh", // Add maxHeight to the dialog itself
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            Applicant Profile - {applicant.name}
          </DialogTitle>
          <DialogDescription>
            Review and edit the applicant's profile and evaluation data
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="profile"
          className="w-full flex flex-col flex-1 min-h-0"
        >
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent
            value="profile"
            className="space-y-4 flex-1 overflow-y-auto min-h-0"
          >
            <ProfileTab
              profileData={profileData}
              onDataChange={handleProfileDataChange}
              isEditable={false}
            />
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent
            value="evaluation"
            className="space-y-4 flex-1 overflow-y-auto min-h-0"
          >
            <EvaluationTab
              evaluationData={evaluationData}
              onDataChange={handleEvaluationDataChange}
              isEditable={false}
            />

            {/* Action Buttons */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Council Decision</CardTitle>
                <CardDescription className="text-sm">
                  Make a decision on this Principal Investigator applicant
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Current Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                  >
                    {applicant.status}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end pt-3">
                <Button variant="outline" onClick={handleRequestRevisionClick}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Request Revision
                </Button>
                <Button variant="destructive" onClick={handleRejectClick}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApproveClick}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.isOpen}
        onOpenChange={closeConfirmationDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                {confirmationDialog.action === "approve" && (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                )}
                {confirmationDialog.action === "reject" && (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
                {confirmationDialog.action === "revision" && (
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">
                  {confirmationDialog.title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm">
                  {confirmationDialog.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeConfirmationDialog}
              className="sm:mr-2"
            >
              Cancel
            </Button>
            <Button
              variant={confirmationDialog.confirmVariant}
              onClick={handleConfirmAction}
            >
              {confirmationDialog.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ApplicantProfile;
