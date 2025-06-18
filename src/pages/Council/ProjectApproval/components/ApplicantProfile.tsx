import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                <ConfirmDialog
                  trigger={
                    <Button variant="outline">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Request Revision
                    </Button>
                  }
                  title="Request Revision"
                  description={`Are you sure you want to request a revision from ${applicant.name}? They will be notified to update their application.`}
                  confirmText="Request Revision"
                  onConfirm={() => {
                    onRequestRevision(applicant.id);
                    toast.success("Revision Requested", {
                      description: `Revision request has been sent to ${applicant.name}.`,
                    });
                  }}
                />
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  }
                  title="Reject Principal Investigator"
                  description={`Are you sure you want to reject ${applicant.name}'s application? This action cannot be undone.`}
                  confirmText="Reject"
                  onConfirm={() => {
                    onReject(applicant.id);
                    toast.success("Principal Investigator Rejected", {
                      description: `${applicant.name}'s application has been rejected.`,
                    });
                  }}
                />
                <ConfirmDialog
                  trigger={
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  }
                  title="Approve Principal Investigator"
                  description={`Are you sure you want to approve ${applicant.name} as the Principal Investigator? This action cannot be undone.`}
                  confirmText="Approve"
                  onConfirm={() => {
                    onApprove(applicant.id);
                    toast.success("Principal Investigator Approved", {
                      description: `${applicant.name} has been successfully approved as Principal Investigator.`,
                    });
                  }}
                />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantProfile;
