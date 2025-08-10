import React from "react";
import { TinyMCEViewer } from "@/components/ui/tinymce-viewer";
import { StatusBadge } from "./StatusBadge";

interface SelectedPIRequest {
  id: string;
  status: string;
  submittedAt: string;
  projectRegistrationDetails: {
    projectTitle: string;
    principalInvestigator: {
      name: string;
      email: string;
      department: string;
      position: string;
      cv: {
        content: string;
      };
    };
    projectDocuments?: Array<{
      content: string;
    }>;
    teamMembers?: Array<{
      name: string;
      email: string;
      role: string;
      department: string;
      cv: {
        content: string;
      };
    }>;
  };
}

interface PIRequestDetailViewProps {
  selectedPIRequest: SelectedPIRequest | null;
}

export const PIRequestDetailView: React.FC<PIRequestDetailViewProps> = ({
  selectedPIRequest,
}) => {
  if (!selectedPIRequest) return null;

  const request = selectedPIRequest;
  const registrationDetails = request.projectRegistrationDetails;

  return (
    <div className="space-y-8 p-8">
      {/* PI Request Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              PI Request Details
            </h1>
            <p className="text-gray-600 mt-1">
              {registrationDetails.projectTitle}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={request.status} size="md" />
            <span className="text-sm text-gray-500">{request.submittedAt}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Request Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Request ID:</span> {request.id}
              </div>
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {request.submittedAt}
              </div>
              <div>
                <span className="font-medium">Status:</span> {request.status}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Principal Investigator
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {registrationDetails.principalInvestigator.name}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                {registrationDetails.principalInvestigator.email}
              </div>
              <div>
                <span className="font-medium">Department:</span>{" "}
                {registrationDetails.principalInvestigator.department}
              </div>
              <div>
                <span className="font-medium">Position:</span>{" "}
                {registrationDetails.principalInvestigator.position}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Registration Document */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Project Registration Document
        </h3>
        {registrationDetails.projectDocuments &&
          registrationDetails.projectDocuments.length > 0 && (
            <TinyMCEViewer
              content={registrationDetails.projectDocuments[0].content}
              height={400}
            />
          )}
      </div>

      {/* Principal Investigator CV */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Principal Investigator - Scientific CV
        </h3>
        <TinyMCEViewer
          content={registrationDetails.principalInvestigator.cv.content}
          height={500}
        />
      </div>

      {/* Team Members CVs */}
      {registrationDetails.teamMembers &&
        registrationDetails.teamMembers.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Team Members</h3>
            {registrationDetails.teamMembers.map((member, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {member.name}
                    </h4>
                    <p className="text-gray-600">
                      {member.role} - {member.department}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{member.email}</span>
                </div>
                <TinyMCEViewer content={member.cv.content} height={400} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default PIRequestDetailView;
