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
        className="max-h-[90vh] overflow-y-auto"
        style={{
          maxWidth: "90vw",
          width: "60vw",
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileTab
              profileData={profileData}
              onDataChange={handleProfileDataChange}
              isEditable={false}
            />
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-4">
            <EvaluationTab
              evaluationData={evaluationData}
              onDataChange={handleEvaluationDataChange}
              isEditable={false}
            />

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Council Decision</CardTitle>
                <CardDescription>
                  Make a decision on this Principal Investigator applicant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">Current Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {applicant.status}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => onRequestRevision(applicant.id)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Request Revision
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReject(applicant.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => onApprove(applicant.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantProfile;
