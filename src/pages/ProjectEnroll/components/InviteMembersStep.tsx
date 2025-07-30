import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleInvitedUser } from "@/components/common";
import {
  Users,
  ArrowLeft,
  ArrowRight,
  Crown,
  User,
  AlertCircle,
  X,
  Plus,
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserCheck,
} from "lucide-react";
import {
  useSearchAccounts,
  useAllRoles,
  useMyAccountInfo,
} from "@/hooks/queries/useAuth";
import { GroupMember } from "@/types/auth";
import { UserRoleStatus } from "@/types/notification";
import {
  useCreateUserRole,
  useInviteMember,
} from "@/hooks/queries/notification";

interface InviteMembersStepProps {
  collaborators: SimpleInvitedUser[];
  onCollaboratorsChange: (collaborators: SimpleInvitedUser[]) => void;
  groupMembers?: GroupMember[];
  onGroupMembersChange?: (groupMembers: GroupMember[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  mode?: "detailed" | "simple";
}

export const InviteMembersStep: React.FC<InviteMembersStepProps> = ({
  collaborators,
  onCollaboratorsChange,
  groupMembers: initialGroupMembers = [],
  onGroupMembersChange,
  onNext,
  onPrevious,
  mode = "detailed",
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [groupMembers, setGroupMembers] =
    useState<GroupMember[]>(initialGroupMembers);
  const [memberInvitationStatus, setMemberInvitationStatus] = useState<
    Record<string, UserRoleStatus>
  >({});
  const [invitingMembers, setInvitingMembers] = useState<Set<string>>(
    new Set()
  );

  // API hooks - search only when input length >= 2
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchAccounts(searchValue.trim().length > 0 ? searchValue.trim() : "");
  const { data: allRoles = [], isLoading: isLoadingRoles } = useAllRoles();
  const { data: myAccountInfo } = useMyAccountInfo();

  // Invitation hooks
  const inviteMemberMutation = useInviteMember();
  const createUserRoleMutation = useCreateUserRole();

  // Track UserRole status for each member
  useEffect(() => {
    if (!projectId) return;

    const interval = setInterval(() => {
      groupMembers.forEach((member) => {
        if (
          !member.isInvitation &&
          memberInvitationStatus[member.id] === "pending"
        ) {
          // Check UserRole status for this member
          // This would be implemented with useUserRoleByAccountAndProject hook
          // For now, we'll simulate status updates
          const randomUpdate = Math.random();
          if (randomUpdate > 0.95) {
            // 5% chance of status change
            const newStatus = Math.random() > 0.7 ? "approved" : "rejected";
            setMemberInvitationStatus((prev) => ({
              ...prev,
              [member.id]: newStatus,
            }));
          }
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [projectId, groupMembers, memberInvitationStatus]);

  // Filter roles to only show Researcher, Secretary, Leader
  const allowedRoles = useMemo(() => {
    return allRoles.filter((role) =>
      ["Researcher", "Secretary", "Leader"].includes(role.name)
    );
  }, [allRoles]);

  // Get available roles for a user (excluding single-person roles already taken)
  const getAvailableRoles = (currentUserId: string) => {
    const currentUserRole = groupMembers.find(
      (m) => m.id === currentUserId
    )?.role;

    return allowedRoles.filter((role) => {
      if (role.name === "Researcher") return true; // Multiple researchers allowed

      // For Secretary and Leader, check if already taken by someone else
      const isRoleTaken = groupMembers.some(
        (member) => member.role === role.name && member.id !== currentUserId
      );

      return !isRoleTaken || currentUserRole === role.name;
    });
  };

  // Convert search results to filtered format with default avatar
  const filteredUsers = useMemo(() => {
    if (!searchValue.trim() || searchValue.trim().length < 1 || !searchResults)
      return [];

    return searchResults
      .filter((user) => !groupMembers.some((m) => m.email === user.email))
      .map((user) => ({
        id: user.id,
        name: user["full-name"],
        email: user.email,
        avatar:
          user["avatar-url"] ||
          "https://regionalneurological.com/wp-content/uploads/2020/03/Regional-Neurological_Brain-Science.jpeg",
      }));
  }, [searchResults, searchValue, groupMembers]);

  // Show search results when there are results or when loading
  useEffect(() => {
    const shouldShow =
      searchValue.trim().length >= 2 &&
      (filteredUsers.length > 0 || isSearching);
    setShowResults(shouldShow);
  }, [searchValue, filteredUsers.length, isSearching]);

  const handleUserSelect = (user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }) => {
    if (groupMembers.some((u) => u.email === user.email)) return;

    // Determine default role - Leader if none exists, otherwise Researcher
    const hasLeader = groupMembers.some((u) => u.role === "Leader");
    const defaultRole: "Researcher" | "Secretary" | "Leader" = !hasLeader
      ? "Leader"
      : "Researcher";
    const defaultRoleId =
      allowedRoles.find((r) => r.name === defaultRole)?.id || "";

    const newMember: GroupMember = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: defaultRole,
      roleId: defaultRoleId,
      isInvitation: !user.id || user.id.startsWith("invite-"),
      // Add required fields from Member interface
      code: "",
      groupName: "",
      isOfficial: null,
      expireDate: null,
      createdAt: null,
      status: null,
      accountId: user.id,
      "full-name": user.name,
      phoneNumber: null,
      address: null,
      companyName: null,
      "avatar-url": user.avatar || null,
      projectId: null,
      appraisalCouncilId: null,
    };

    setGroupMembers([...groupMembers, newMember]);

    // Update collaborators for backward compatibility
    const newCollaborator: SimpleInvitedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: defaultRole,
      isInvitation: newMember.isInvitation,
    };

    onCollaboratorsChange([...collaborators, newCollaborator]);
    setSearchValue("");
    setShowResults(false);
  };

  const handleEmailInvitation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchValue)) return;

    const invitationUser = {
      id: `invitation-${Date.now()}`,
      name: searchValue.split("@")[0],
      email: searchValue,
      avatar:
        "https://regionalneurological.com/wp-content/uploads/2020/03/Regional-Neurological_Brain-Science.jpeg",
    };

    handleUserSelect(invitationUser);
  };

  const handleRoleChange = (userId: string, newRoleName: string) => {
    const newRole = allowedRoles.find((r) => r.name === newRoleName);
    if (!newRole) return;

    const updatedMembers = groupMembers.map((member) => {
      // If assigning a single-person role, remove it from others
      if (
        (newRoleName === "Leader" || newRoleName === "Secretary") &&
        member.role === newRoleName &&
        member.id !== userId
      ) {
        // Assign them to Researcher role
        const researcherRole = allowedRoles.find(
          (r) => r.name === "Researcher"
        );
        return {
          ...member,
          role: "Researcher" as const,
          roleId: researcherRole?.id || "",
        };
      }

      if (member.id === userId) {
        return {
          ...member,
          role: newRoleName as "Researcher" | "Secretary" | "Leader",
          roleId: newRole.id,
        };
      }
      return member;
    });

    setGroupMembers(updatedMembers);

    // Call parent callback if provided
    if (onGroupMembersChange) {
      onGroupMembersChange(updatedMembers);
    }

    // Update collaborators for backward compatibility
    const updatedCollaborators = updatedMembers.map((member) => ({
      id: member.id,
      name: member.name || "",
      email: member.email || "",
      avatar: member.avatar,
      role: member.role as "Researcher" | "Secretary" | "Leader",
      isInvitation: member.isInvitation,
    }));

    onCollaboratorsChange(updatedCollaborators);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedMembers = groupMembers.filter(
      (member) => member.id !== userId
    );
    setGroupMembers(updatedMembers);

    // Call parent callback if provided
    if (onGroupMembersChange) {
      onGroupMembersChange(updatedMembers);
    }

    // Update collaborators for backward compatibility
    const updatedCollaborators = collaborators.filter(
      (user) => user.id !== userId
    );
    onCollaboratorsChange(updatedCollaborators);
  };

  // Handle member invitation
  const handleInviteMember = async (memberId: string) => {
    if (!projectId || !myAccountInfo) return;

    // Find the member to get their role information
    const member = groupMembers.find((m) => m.id === memberId);
    if (!member || !member.roleId) return;

    setInvitingMembers((prev) => new Set(prev).add(memberId));
    setMemberInvitationStatus((prev) => ({
      ...prev,
      [memberId]: "pending",
    }));

    try {
      // Step 1: Send notification
      const notificationResult = await inviteMemberMutation.mutateAsync({
        projectId,
        accountId: memberId,
      });

      if (notificationResult.success) {
        // Step 2: Create UserRole
        await createUserRoleMutation.mutateAsync({
          "account-id": memberId,
          "role-id": member.roleId,
          "project-id": projectId,
        });

        setMemberInvitationStatus((prev) => ({
          ...prev,
          [memberId]: "pending",
        }));
      }
    } catch (error) {
      console.error("Failed to invite member:", error);
      setMemberInvitationStatus((prev) => ({
        ...prev,
        [memberId]: "none",
      }));
    } finally {
      setInvitingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const canProceed = () => {
    const hasLeader = groupMembers.some((u) => u.role === "Leader");
    const allMembersApproved = groupMembers.every((member) => {
      const status = memberInvitationStatus[member.id];
      return status === "approved" || member.isInvitation; // Allow invitations to proceed
    });
    return groupMembers.length > 0 && hasLeader && allMembersApproved;
  };

  const getRoleIcon = (
    role: "Leader" | "Member" | "Researcher" | "Secretary"
  ) => {
    if (role === "Leader") {
      return <Crown className="w-4 h-4 text-amber-600" />;
    } else if (role === "Secretary") {
      return <UserCheck className="w-4 h-4 text-green-600" />;
    } else {
      return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getInvitationStatusBadge = (status: UserRoleStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-300"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-300"
          >
            <Mail className="w-3 h-3 mr-1" />
            Not Invited
          </Badge>
        );
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showEmailInvitation =
    searchValue.trim().length >= 2 &&
    isValidEmail(searchValue) &&
    filteredUsers.length === 0 &&
    !isSearching;

  if (mode === "simple") {
    return (
      <div className="space-y-6">
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
          Add team members to your project. The system will automatically
          request their Scientific CV when selected.
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
              {groupMembers.length} members
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
                  <li>Only one Secretary and one Leader allowed</li>
                  <li>Multiple Researchers are allowed</li>
                  <li>
                    Scientific CV will be automatically requested for each
                    member
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name or email to add members (minimum 2 characters)..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="py-4 px-4 text-center text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="py-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : showEmailInvitation ? (
                  <div className="py-2">
                    <div
                      onClick={handleEmailInvitation}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-full">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Invite "{searchValue}"
                        </p>
                        <p className="text-xs text-gray-600">
                          Send invitation to this email
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-4 text-center text-gray-500 text-sm">
                    No users found matching "{searchValue}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Members List */}
          {groupMembers.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Selected Members ({groupMembers.length})
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-300"
                >
                  CV Requests Active
                </Badge>
              </h4>
              <div className="space-y-3">
                {groupMembers.map((member) => {
                  const availableRoles = getAvailableRoles(member.id);

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {(member.name || "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {member.name}
                            </p>
                            {member.isInvitation && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300 flex-shrink-0"
                              >
                                Invitation
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {/* Invitation Status */}
                        <div className="flex flex-col items-center gap-1">
                          {getInvitationStatusBadge(
                            memberInvitationStatus[member.id] || "none"
                          )}
                        </div>

                        {/* Invite Button */}
                        {!member.isInvitation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInviteMember(member.id)}
                            disabled={
                              invitingMembers.has(member.id) ||
                              memberInvitationStatus[member.id] === "pending" ||
                              memberInvitationStatus[member.id] === "approved"
                            }
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            {invitingMembers.has(member.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                            {invitingMembers.has(member.id)
                              ? "Inviting..."
                              : "Invite"}
                          </Button>
                        )}

                        {/* Role Selection */}
                        <Select
                          value={member.role}
                          onValueChange={(value: string) =>
                            handleRoleChange(member.id, value)
                          }
                          disabled={isLoadingRoles}
                        >
                          <SelectTrigger className="w-38">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(member.role)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                <div className="flex items-center gap-2">
                                  {role.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Warnings */}
          {groupMembers.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Get Started:</strong> Use the search field above to
                  find and add team members to your project. Enter at least 2
                  characters to start searching.
                </p>
              </div>
            </div>
          )}

          {!groupMembers.some((u) => u.role === "Leader") &&
            groupMembers.length > 0 && (
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
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
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
