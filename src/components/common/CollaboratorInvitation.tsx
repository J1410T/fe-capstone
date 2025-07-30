import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserSearchInput,
  // UserSearchResult,
  InvitedUser,
} from "./UserSearchInput";
import { Crown, User, X, Plus, Users } from "lucide-react";
import { cn } from "@/utils";
import { UserSearchResult } from "@/types/auth";

interface CollaboratorInvitationProps {
  invitedUsers: InvitedUser[];
  onUsersChange: (users: InvitedUser[]) => void;
  maxMembers?: number;
  className?: string;
}

export const CollaboratorInvitation: React.FC<CollaboratorInvitationProps> = ({
  invitedUsers,
  onUsersChange,
  maxMembers = 10,
  className,
}) => {
  const [showAddMember, setShowAddMember] = useState(false);

  const handleUserSelect = (user: UserSearchResult) => {
    // Check if user is already invited
    if (invitedUsers.some((u) => u.email === user.email)) {
      return;
    }

    // Determine role - first user becomes leader if no leader exists
    const hasLeader = invitedUsers.some((u) => u.role === "Leader");
    const role = !hasLeader ? "Leader" : "Researcher";

    const newUser: InvitedUser = {
      ...user,
      role,
      isInvitation: user.role === "Invited",
    };

    onUsersChange([...invitedUsers, newUser]);
    setShowAddMember(false);
  };

  const handleRoleChange = (
    userId: string,
    newRole: "Leader" | "Researcher"
  ) => {
    // If changing to Leader, demote current leader to Researcher
    const updatedUsers = invitedUsers.map((user) => {
      if (
        newRole === "Leader" &&
        user.role === "Leader" &&
        user.id !== userId
      ) {
        return { ...user, role: "Researcher" as const };
      }
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });

    onUsersChange(updatedUsers);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = invitedUsers.filter((user) => user.id !== userId);
    onUsersChange(updatedUsers);
  };

  const getRoleIcon = (role: "Leader" | "Researcher" | "Secretary") => {
    if (role === "Leader") {
      return <Crown className="w-4 h-4 text-amber-600" />;
    }
    return <User className="w-4 h-4 text-blue-600" />;
  };

  // const getRoleBadgeVariant = (role: "Leader" | "Member") => {
  //   return role === "Leader" ? "default" : "secondary";
  // };

  const canAddMore = invitedUsers.length < maxMembers;
  const leaderCount = invitedUsers.filter((u) => u.role === "Leader").length;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Invite Collaborators
          <Badge variant="outline" className="ml-auto">
            {invitedUsers.length}/{maxMembers}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirements Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Requirements:</strong> One Leader (required) and multiple
            Members. You can invite up to {maxMembers} collaborators total.
          </p>
        </div>

        {/* Invited Users List */}
        {invitedUsers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Invited Collaborators
            </h4>
            {invitedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      {user.isInvitation && (
                        <Badge variant="outline" className="text-xs">
                          Invitation
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.department && !user.isInvitation && (
                      <p className="text-xs text-gray-400">
                        {user.department} • {user.role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Role Selector */}
                  <Select
                    value={user.role === "Secretary" ? "Researcher" : user.role}
                    onValueChange={(value: "Leader" | "Researcher") =>
                      handleRoleChange(user.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(
                          user.role === "Secretary" ? "Researcher" : user.role
                        )}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leader">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-600" />
                          Leader
                        </div>
                      </SelectItem>
                      <SelectItem value="Researcher">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Researcher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Remove Button */}
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
        )}

        {/* Add Member Section */}
        {showAddMember ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
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
              excludeUserIds={invitedUsers.map((u) => u.id)}
            />
          </div>
        ) : (
          canAddMore && (
            <Button
              variant="outline"
              onClick={() => setShowAddMember(true)}
              className="w-full"
              disabled={!canAddMore}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          )
        )}

        {/* Validation Messages */}
        {leaderCount === 0 && invitedUsers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              ⚠️ Please assign at least one collaborator as Leader.
            </p>
          </div>
        )}

        {!canAddMore && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              Maximum number of collaborators reached ({maxMembers}).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
