import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SimpleInvitedUser,
  UserSearchInput,
  InvitedUser,
  UserSearchResult,
  SimpleCollaboratorManager,
} from "@/components/common";
import {
  Users,
  ArrowLeft,
  ArrowRight,
  Crown,
  User,
  AlertCircle,
  X,
  Plus,
} from "lucide-react";

interface InviteMembersStepProps {
  collaborators: SimpleInvitedUser[];
  onCollaboratorsChange: (collaborators: SimpleInvitedUser[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  mode?: "detailed" | "simple";
}

export const InviteMembersStep: React.FC<InviteMembersStepProps> = ({
  collaborators,
  onCollaboratorsChange,
  onNext,
  onPrevious,
  mode = "detailed",
}) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteSlots, setInviteSlots] = useState(5);

  const handleUserSelect = (user: UserSearchResult) => {
    if (collaborators.some((u) => u.email === user.email)) return;

    const hasLeader = collaborators.some((u) => u.role === "Leader");
    const role = !hasLeader ? "Leader" : "Member";

    const newUser: InvitedUser = {
      ...user,
      role,
      isInvitation: !user.id || user.id.startsWith("invite-"),
    };

    onCollaboratorsChange([...collaborators, newUser]);
    setShowAddMember(false);
  };

  const handleRoleChange = (userId: string, newRole: "Leader" | "Member") => {
    const updatedUsers = collaborators.map((user) => {
      if (
        newRole === "Leader" &&
        user.role === "Leader" &&
        user.id !== userId
      ) {
        return { ...user, role: "Member" as const };
      }
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });

    onCollaboratorsChange(updatedUsers);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = collaborators.filter((user) => user.id !== userId);
    onCollaboratorsChange(updatedUsers);
  };

  const addMoreSlots = () => {
    setInviteSlots((prev) => prev + 5);
  };

  const canProceed = () => {
    const hasLeader = collaborators.some((u) => u.role === "Leader");
    return collaborators.length > 0 && hasLeader;
  };

  const getRoleIcon = (role: "Leader" | "Member") => {
    return role === "Leader" ? (
      <Crown className="w-4 h-4 text-amber-600" />
    ) : (
      <User className="w-4 h-4 text-blue-600" />
    );
  };

  const leaderCount = collaborators.filter((u) => u.role === "Leader").length;
  const availableSlots = inviteSlots - collaborators.length;

  // --- SIMPLE MODE: Show SimpleCollaboratorManager only ---
  if (mode === "simple") {
    return (
      <div className="space-y-6">
        <SimpleCollaboratorManager
          invitedUsers={collaborators}
          onUsersChange={onCollaboratorsChange}
          maxMembers={10}
        />
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
  }

  // --- DETAILED MODE ---
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite Collaborators
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add team members to your project. You need at least one Leader and can
          invite multiple Members.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Team Members
            </div>
            <Badge variant="outline" className="bg-white">
              {collaborators.length}/{inviteSlots} slots used
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least one Leader is required</li>
                  <li>You can invite up to {inviteSlots} collaborators</li>
                  <li>Members can be promoted to Leader</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Collaborators List */}
          {collaborators.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Invited Collaborators ({collaborators.length})
              </h4>
              <div className="space-y-3">
                {collaborators.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          {user.isInvitation && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300"
                            >
                              Invitation
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.department && !user.isInvitation && (
                          <p className="text-xs text-gray-500 mt-1">
                            {user.department} • {user.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Select
                        value={user.role}
                        onValueChange={(value: "Leader" | "Member") =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leader">Leader</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Member */}
          {showAddMember ? (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  Add Collaborator
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddMember(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <UserSearchInput
                placeholder="Search by name or email..."
                onUserSelect={handleUserSelect}
                excludeUserIds={collaborators.map((u) => u.id)}
              />
            </div>
          ) : (
            availableSlots > 0 && (
              <div className="space-y-4 mb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddMember(true)}
                  className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-8"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Member ({availableSlots} slots available)
                </Button>

                {availableSlots <= 2 && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={addMoreSlots}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Slots
                    </Button>
                  </div>
                )}
              </div>
            )
          )}

          {/* Warnings */}
          {leaderCount === 0 && collaborators.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Action Required:</strong> Please assign at least one
                  collaborator as Leader to proceed.
                </p>
              </div>
            </div>
          )}

          {availableSlots === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 text-center">
                All invitation slots are used. You can add more slots if needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
