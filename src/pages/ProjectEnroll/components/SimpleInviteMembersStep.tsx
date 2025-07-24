import React from "react";
import { Button } from "@/components/ui/button";
import {
  SimpleCollaboratorManager,
  SimpleInvitedUser,
} from "@/components/common";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SimpleInviteMembersStepProps {
  collaborators: SimpleInvitedUser[];
  onCollaboratorsChange: (collaborators: SimpleInvitedUser[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const SimpleInviteMembersStep: React.FC<
  SimpleInviteMembersStepProps
> = ({ collaborators, onCollaboratorsChange, onNext, onPrevious }) => {
  const canProceed = () => {
    const hasLeader = collaborators.some((u) => u.role === "Leader");
    return collaborators.length > 0 && hasLeader;
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite Team Members
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add collaborators to your project. Search by name or email to find
          existing users, or invite new members by email.
        </p>
      </div>
      {/* Collaborator Manager */}
      <SimpleCollaboratorManager
        invitedUsers={collaborators}
        onUsersChange={onCollaboratorsChange}
        maxMembers={10}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          size="lg"
          className="px-8"
          disabled={!canProceed()}
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
