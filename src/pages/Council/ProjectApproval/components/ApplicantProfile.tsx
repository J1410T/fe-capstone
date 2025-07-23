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

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ApplicantData, ProfileData, EvaluationData } from "../types";

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
            Proposal Details - {applicant.proposalTitle}
          </DialogTitle>
          <DialogDescription>
            Review proposal documents and team member information
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic PI Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Principal Investigator Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Personal Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {evaluationData.principalInvestigator.name}
                    </div>
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      {evaluationData.principalInvestigator.academicTitle}
                    </div>
                    <div>
                      <span className="font-medium">Specialization:</span>{" "}
                      {evaluationData.principalInvestigator.specialization}
                    </div>
                    <div>
                      <span className="font-medium">Scientific Title:</span>{" "}
                      {evaluationData.principalInvestigator.scientificTitle}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Contact & Institution
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {evaluationData.principalInvestigator.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {evaluationData.principalInvestigator.phone}
                    </div>
                    <div>
                      <span className="font-medium">Work Unit:</span>{" "}
                      {evaluationData.principalInvestigator.workUnit}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span>{" "}
                      {evaluationData.principalInvestigator.workAddress}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Proposal Documents
              </CardTitle>
              <CardDescription>
                Documents submitted as part of this proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluationData.proposalDocuments &&
              evaluationData.proposalDocuments.length > 0 ? (
                <div className="space-y-3">
                  {evaluationData.proposalDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {doc.title}
                        </h5>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {doc.type}
                          </span>
                          <span>{doc.fileSize}</span>
                          <span>
                            Uploaded:{" "}
                            {new Date(doc.uploadedDate).toLocaleDateString()}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        <Download className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No proposal documents available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Team Member Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Member Documents
              </CardTitle>
              <CardDescription>
                Registration forms and documents from team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluationData.teamResearchers &&
              evaluationData.teamResearchers.length > 0 ? (
                <div className="space-y-4">
                  {evaluationData.teamResearchers.map((member, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {member.name}
                          </h5>
                          <div className="text-sm text-gray-600">
                            {member.academicTitle} • {member.workUnit} •{" "}
                            {member.contribution}
                          </div>
                        </div>
                      </div>
                      {member.documents && member.documents.length > 0 ? (
                        <div className="space-y-2">
                          {member.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {doc.title}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>{doc.type}</span>
                                  <span>{doc.fileSize}</span>
                                  <span>
                                    Uploaded:{" "}
                                    {new Date(
                                      doc.uploadedDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3 mr-1" />
                                View Document
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No documents submitted
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No team members listed
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Council Decision</CardTitle>
              <CardDescription className="text-sm">
                Make a decision on this proposal
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
                description={`Are you sure you want to request a revision for this proposal? The submitter will be notified to update their submission.`}
                confirmText="Request Revision"
                onConfirm={() => {
                  onRequestRevision(applicant.id);
                  toast.success("Revision Requested", {
                    description: `Revision request has been sent for this proposal.`,
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
                title="Reject Proposal"
                description={`Are you sure you want to reject this proposal? This action cannot be undone.`}
                confirmText="Reject"
                onConfirm={() => {
                  onReject(applicant.id);
                  toast.success("Proposal Rejected", {
                    description: `The proposal has been rejected.`,
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
                title="Approve Proposal"
                description={`Are you sure you want to approve this proposal? This action cannot be undone.`}
                confirmText="Approve"
                onConfirm={() => {
                  onApprove(applicant.id);
                  toast.success("Proposal Approved", {
                    description: `The proposal has been successfully approved.`,
                  });
                }}
              />
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantProfile;
