import React, { useState, useEffect } from "react";
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
import { SimpleInvitedUser, UserSearchResult } from "@/components/common";
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
  FileText,
} from "lucide-react";
import {
  CVRequestStatus,
  mockCreateCVRequest,
} from "@/hooks/queries/useCVRequests";

// Extended user interface with CV request status
export interface InvitedUserWithCV extends SimpleInvitedUser {
  cvRequestStatus: CVRequestStatus;
  cvRequestId?: string;
  hasCV?: boolean;
}

interface InviteMembersStepProps {
  collaborators: SimpleInvitedUser[];
  onCollaboratorsChange: (collaborators: SimpleInvitedUser[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  mode?: "detailed" | "simple";
}

// Mock user data - in real app, this would come from an API
const mockUsers: UserSearchResult[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@university.edu",
    avatar: "/avatars/john.jpg",
    department: "Computer Science",
    role: "Professor",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@university.edu",
    avatar: "/avatars/john-doe.jpg",
    department: "Mathematics",
    role: "Associate Professor",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    avatar: "/avatars/jane.jpg",
    department: "Physics",
    role: "Researcher",
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    department: "Chemistry",
    role: "PhD Student",
  },
];

export const InviteMembersStep: React.FC<InviteMembersStepProps> = ({
  collaborators,
  onCollaboratorsChange,
  onNext,
  onPrevious,
  mode = "detailed",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [collaboratorsWithCV, setCollaboratorsWithCV] = useState<
    InvitedUserWithCV[]
  >([]);

  // Convert collaborators to collaborators with CV status
  useEffect(() => {
    const updatedCollaborators = collaborators.map((collaborator) => ({
      ...collaborator,
      cvRequestStatus: "none" as CVRequestStatus,
      hasCV: false,
    }));
    setCollaboratorsWithCV(updatedCollaborators);
  }, [collaborators]);

  // Filter users based on search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredUsers([]);
      setShowResults(false);
      return;
    }

    const filtered = mockUsers.filter((user) => {
      if (collaborators.some((c) => c.email === user.email)) return false;

      const searchLower = searchValue.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
    setShowResults(true);
  }, [searchValue, collaborators]);

  // CV request function using mock API
  const requestCV = async (userId: string): Promise<void> => {
    try {
      // Set status to pending immediately for UI feedback
      setCollaboratorsWithCV((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, cvRequestStatus: "pending" as CVRequestStatus }
            : user
        )
      );

      // Make the mock API call
      const cvRequest = await mockCreateCVRequest(userId);

      // Update with the actual request ID
      setCollaboratorsWithCV((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                cvRequestStatus: cvRequest.status,
                cvRequestId: cvRequest.id,
              }
            : user
        )
      );

      // Simulate random status changes after some time (for demo purposes)
      setTimeout(() => {
        const randomStatus: CVRequestStatus =
          Math.random() > 0.7
            ? "approved"
            : Math.random() > 0.5
            ? "rejected"
            : "pending";

        setCollaboratorsWithCV((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, cvRequestStatus: randomStatus }
              : user
          )
        );
      }, 3000 + Math.random() * 5000); // Random delay between 3-8 seconds
    } catch (error) {
      console.error("Failed to request CV:", error);
      // Reset status on error
      setCollaboratorsWithCV((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, cvRequestStatus: "none" as CVRequestStatus }
            : user
        )
      );
    }
  };

  const handleUserSelect = (user: UserSearchResult) => {
    if (collaborators.some((u) => u.email === user.email)) return;

    const hasLeader = collaborators.some((u) => u.role === "Leader");
    const role = !hasLeader ? "Leader" : "Member";

    const newUser: SimpleInvitedUser = {
      ...user,
      role,
      isInvitation: !user.id || user.id.startsWith("invite-"),
    };

    onCollaboratorsChange([...collaborators, newUser]);
    setSearchValue("");
    setShowResults(false);

    // Automatically request CV for the new user
    if (user.id && !user.id.startsWith("invitation-")) {
      setTimeout(() => requestCV(user.id), 100);
    }
  };

  const handleEmailInvitation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchValue)) return;

    const invitationUser: UserSearchResult = {
      id: `invitation-${Date.now()}`,
      name: searchValue.split("@")[0],
      email: searchValue,
      role: "Invited",
    };

    handleUserSelect(invitationUser);
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

  const getCVStatusBadge = (status: CVRequestStatus) => {
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
            <FileText className="w-3 h-3 mr-1" />
            No Request
          </Badge>
        );
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showEmailInvitation =
    searchValue.trim() &&
    isValidEmail(searchValue) &&
    filteredUsers.length === 0;

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
              {collaborators.length} members
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
                  <li>
                    Scientific CV will be automatically requested for each
                    member
                  </li>
                  <li>Members can be promoted to Leader</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name or email to add members..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
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
                          {user.department && (
                            <p className="text-xs text-gray-500">
                              {user.department} • {user.role}
                            </p>
                          )}
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
          {collaboratorsWithCV.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Selected Members ({collaboratorsWithCV.length})
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-300"
                >
                  CV Requests Active
                </Badge>
              </h4>
              <div className="space-y-3">
                {collaboratorsWithCV.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          {user.isInvitation && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300 flex-shrink-0"
                            >
                              Invitation
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        {user.department && !user.isInvitation && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {user.department} • {user.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      {/* CV Status */}
                      <div className="flex flex-col items-center gap-1">
                        {getCVStatusBadge(user.cvRequestStatus)}
                        {user.cvRequestStatus === "pending" && (
                          <Loader2 className="w-3 h-3 text-yellow-600 animate-spin" />
                        )}
                      </div>

                      {/* Role Selection */}
                      <Select
                        value={user.role}
                        onValueChange={(value: "Leader" | "Member") =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
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
            </div>
          )}

          {/* Warnings */}
          {collaborators.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Get Started:</strong> Use the search field above to
                  find and add team members to your project.
                </p>
              </div>
            </div>
          )}

          {!collaborators.some((u) => u.role === "Leader") &&
            collaborators.length > 0 && (
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

          {/* CV Request Status Summary */}
          {collaboratorsWithCV.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    CV Request Status
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-yellow-600" />
                    <span className="text-yellow-700">
                      {
                        collaboratorsWithCV.filter(
                          (u) => u.cvRequestStatus === "pending"
                        ).length
                      }{" "}
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-green-700">
                      {
                        collaboratorsWithCV.filter(
                          (u) => u.cvRequestStatus === "approved"
                        ).length
                      }{" "}
                      Approved
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span className="text-red-700">
                      {
                        collaboratorsWithCV.filter(
                          (u) => u.cvRequestStatus === "rejected"
                        ).length
                      }{" "}
                      Rejected
                    </span>
                  </div>
                </div>
              </div>
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
