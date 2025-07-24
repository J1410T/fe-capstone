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
  SimpleUserSearch,
  UserSearchResult,
  InvitedUser,
} from "./SimpleUserSearch";
import { Crown, User, X, Plus, Users, AlertCircle } from "lucide-react";

interface SimpleCollaboratorManagerProps {
  invitedUsers: InvitedUser[];
  onUsersChange: (users: InvitedUser[]) => void;
  maxMembers?: number;
  className?: string;
}

export const SimpleCollaboratorManager: React.FC<
  SimpleCollaboratorManagerProps
> = ({ invitedUsers, onUsersChange, maxMembers = 10, className }) => {
  const [showAddMember, setShowAddMember] = useState(false);

  const handleUserSelect = (user: UserSearchResult) => {
    // Check if user is already invited
    if (invitedUsers.some((u) => u.email === user.email)) {
      return;
    }

    // Determine role - first user becomes leader if no leader exists
    const hasLeader = invitedUsers.some((u) => u.role === "Leader");
    const role = !hasLeader ? "Leader" : "Member";

    const newUser: InvitedUser = {
      ...user,
      role,
      isInvitation: user.role === "Invited",
    };

    onUsersChange([...invitedUsers, newUser]);
    setShowAddMember(false);
  };

  const handleRoleChange = (userId: string, newRole: "Leader" | "Member") => {
    // If changing to Leader, demote current leader to Member
    const updatedUsers = invitedUsers.map((user) => {
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

    onUsersChange(updatedUsers);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = invitedUsers.filter((user) => user.id !== userId);
    onUsersChange(updatedUsers);
  };

  const getRoleIcon = (role: "Leader" | "Member") => {
    return role === "Leader" ? (
      <Crown className="w-4 h-4 text-amber-600" />
    ) : (
      <User className="w-4 h-4 text-blue-600" />
    );
  };

  const canAddMore = invitedUsers.length < maxMembers;
  const leaderCount = invitedUsers.filter((u) => u.role === "Leader").length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </div>
          <Badge variant="outline">
            {invitedUsers.length}/{maxMembers}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirements Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p>
                <strong>Requirements:</strong> At least one Leader is required.
                You can add up to {maxMembers} members total.
              </p>
            </div>
          </div>
        </div>

        {/* Add Member Section */}
        {showAddMember ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Search and Add Member
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddMember(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SimpleUserSearch
              placeholder="Type name or email to search..."
              onUserSelect={handleUserSelect}
              excludeUserIds={invitedUsers.map((u) => u.id)}
            />
          </div>
        ) : (
          canAddMore && (
            <Button
              variant="outline"
              onClick={() => setShowAddMember(true)}
              className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          )
        )}

        {/* Invited Users List */}
        {invitedUsers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Team Members ({invitedUsers.length})
            </h4>
            {invitedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
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
                      <p className="text-xs text-gray-400">{user.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Role Selector */}
                  <Select
                    value={user.role}
                    onValueChange={(value: "Leader" | "Member") =>
                      handleRoleChange(user.id, value)
                    }
                  >
                    <SelectTrigger className="w-28">
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
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
                      <SelectItem value="Member">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Member
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

        {/* Validation Messages */}
        {leaderCount === 0 && invitedUsers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Action Required:</strong> Please assign at least one
                member as Leader.
              </p>
            </div>
          </div>
        )}

        {!canAddMore && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600 text-center">
              Maximum number of team members reached ({maxMembers}).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
