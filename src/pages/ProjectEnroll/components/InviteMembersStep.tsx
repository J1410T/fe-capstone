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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useCreateUserRole,
  useDeleteUserRole,
  useUserRolesByProjectId,
} from "@/hooks/queries/useAuth";
import { GroupMember, UserRole } from "@/types/auth";
import { NotificationRequest, UserRoleStatus } from "@/types/notification";
// import { useInviteMember } from "@/hooks/queries/notification";
import {
  useScientificCVByEmail,
  useCreateDocument,
  useUpdateDocument,
  useDocumentByProjectIdWithUserRole,
  useDeleteDocumentById,
} from "@/hooks/queries/document";
import { getAuthResponse } from "@/utils/cookie-manager";
import { getUserRoleByFilter } from "@/services/resources/auth";
import { toast } from "sonner";
import { useSendNotification } from "@/hooks/queries/notification";
import { Loading } from "@/components";

interface InviteMembersStepProps {
  collaborators: SimpleInvitedUser[];
  onCollaboratorsChange: (collaborators: SimpleInvitedUser[]) => void;
  groupMembers?: GroupMember[];
  onGroupMembersChange?: (groupMembers: GroupMember[]) => void;
  maximumMembers?: number;
  onNext: () => void;
  onPrevious: () => void;
  mode?: "detailed" | "simple";
  projectName: string;
}

interface CVStatus {
  [accountId: string]: "submitted" | "not-submitted";
}

export const InviteMembersStep: React.FC<InviteMembersStepProps> = ({
  collaborators,
  onCollaboratorsChange,
  groupMembers: initialGroupMembers = [],
  onGroupMembersChange,
  maximumMembers,
  onNext,
  onPrevious,
  mode = "detailed",
  projectName,
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
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [cvStatus, setCvStatus] = useState<CVStatus>({});
  const [principalInvestigator, setPrincipalInvestigator] =
    useState<UserRole | null>(null);
  const [showUploadConfirmDialog, setShowUploadConfirmDialog] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [lastStatusCheck, setLastStatusCheck] = useState<number>(0);

  // API hooks - search only when input length >= 2
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchAccounts({
      input: searchValue.trim().length > 0 ? searchValue.trim() : "",
      roleUser: "Researcher",
    });
  const { data: allRoles = [], isLoading: isLoadingRoles } = useAllRoles();
  const { data: myAccountInfo } = useMyAccountInfo();

  // Fetch user roles by project ID with user role information - optimized to 2 minutes
  const { data: userRolesResponse } = useUserRolesByProjectId(
    projectId || "",
    1,
    100
  );

  // Invitation hooks
  const inviteMemberMutation = useSendNotification();
  const createUserRoleMutation = useCreateUserRole();
  const deleteUserRoleMutation = useDeleteUserRole();

  // Document hooks
  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();
  const deleteDocumentMutation = useDeleteDocumentById();

  // Get email from auth response cookie for CV upload
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  // Fetch user's Scientific CV by email
  const { data: scientificCV } = useScientificCVByEmail(userEmail, !!userEmail);

  // Fetch documents with user role information for CV status checking
  const { data: documentsWithUserRole } = useDocumentByProjectIdWithUserRole(
    {
      "is-template": false,
      status: "draft",
      "page-index": 1,
      "page-size": 100,
      "project-id": projectId || "",
    },
    !!projectId
  );

  const canAddMember = () => {
    const max = maximumMembers ?? Infinity;
    return groupMembers.length < max - 1;
  };

  // Initialize group members from UserRole data, excluding current user
  useEffect(() => {
    if (
      userRolesResponse?.["data-list"] &&
      myAccountInfo?.id &&
      allRoles.length > 0
    ) {
      const currentUserId = myAccountInfo.id;

      // Filter out current user based on account-id in UserRole and show approved/pending members
      const filteredUserRoles = userRolesResponse["data-list"].filter(
        (userRole: UserRole) =>
          userRole["account-id"] !== currentUserId &&
          (userRole.status === "approved" || userRole.status === "pending")
      );

      // Convert UserRole data to GroupMember format
      const allMembersFromUserRoles: GroupMember[] = filteredUserRoles.map(
        (userRole: UserRole) => {
          // Find the role name from role-id
          const memberRole = allRoles.find(
            (role) => role.id === userRole["role-id"]
          );
          const roleName = memberRole?.name || "Researcher";

          return {
            id: userRole["account-id"],
            name: userRole["full-name"] || "",
            email: userRole.email || "",
            avatar: userRole["avatar-url"] || undefined,
            role: roleName as "Researcher" | "Secretary" | "Leader",
            roleId: userRole["role-id"],
            isInvitation: false, // These are existing UserRole members
            // Required fields from Member interface
            code: userRole.code,
            groupName: userRole["group-name"],
            isOfficial: userRole["is-official"],
            expireDate: userRole["expire-date"],
            createdAt: userRole["created-at"],
            status: userRole.status,
            accountId: userRole["account-id"],
            "full-name": userRole["full-name"],
            phoneNumber: null,
            address: null,
            companyName: null,
            "avatar-url": userRole["avatar-url"],
            projectId: userRole["project-id"],
            appraisalCouncilId: userRole["appraisal-council-id"],
          };
        }
      );

      const accountGroups = allMembersFromUserRoles.reduce((acc, member) => {
        if (!acc[member.id]) {
          acc[member.id] = [];
        }
        acc[member.id].push(member);
        return acc;
      }, {} as Record<string, GroupMember[]>);

      // Define role priority (higher number = higher priority)
      // Prioritize other roles over Researcher (Secretary & Researcher → select Secretary)
      const rolePriority: Record<string, number> = {
        Researcher: 1,
        Secretary: 2,
        Leader: 3,
        "Principal Investigator": 4,
      };

      const membersFromUserRoles: GroupMember[] = Object.values(
        accountGroups
      ).map((members) => {
        if (members.length === 1) {
          return members[0];
        } else {
          // Prioritize role cao nhất
          return members.reduce((highest, current) => {
            const currentPriority = rolePriority[current.role] || 0;
            const highestPriority = rolePriority[highest.role] || 0;
            return currentPriority > highestPriority ? current : highest;
          });
        }
      });

      Object.values(accountGroups).forEach((members) => {
        if (members.length === 1) {
          membersFromUserRoles.push(members[0]);
        } else {
          const prioritizedMember = members.reduce((highest, current) => {
            const currentPriority = rolePriority[current.role] || 0;
            const highestPriority = rolePriority[highest.role] || 0;
            return currentPriority > highestPriority ? current : highest;
          });
          membersFromUserRoles.push(prioritizedMember);
        }
      });

      console.log(
        "membersFromUserRoles after processing:",
        membersFromUserRoles
      );

      setGroupMembers((prev) => {
        const manualMembers = prev.filter(
          (m) =>
            m.isInvitation && !membersFromUserRoles.some((ur) => ur.id === m.id)
        );

        // Sửa logic combine: ưu tiên membersFromUserRoles và không duplicate
        const memberMap = new Map<string, GroupMember>();

        // Add members from UserRoles first (higher priority)
        membersFromUserRoles.forEach((member) => {
          memberMap.set(member.id, member);
        });

        // Add manual members if not already exists
        manualMembers.forEach((member) => {
          if (!memberMap.has(member.id)) {
            memberMap.set(member.id, member);
          }
        });

        return Array.from(memberMap.values());
      });

      // Set the member status from UserRole data
      const statusMap: Record<string, UserRoleStatus> = {};
      membersFromUserRoles.forEach((member) => {
        if (member.status) {
          statusMap[member.id] = member.status as UserRoleStatus;
        }
      });
      setMemberInvitationStatus((prev) => ({ ...prev, ...statusMap }));
    }
  }, [userRolesResponse, myAccountInfo, allRoles]);

  // Optimized status checking - only every 2 minutes and with debouncing
  useEffect(() => {
    if (!projectId || groupMembers.length === 0) return;

    const checkUserRoleStatus = async () => {
      const now = Date.now();
      // Only check if 2 minutes have passed since last check
      if (now - lastStatusCheck < 2 * 60 * 1000) return;

      setLastStatusCheck(now);

      try {
        // Batch process all members at once to reduce API calls
        const memberStatusPromises = groupMembers
          .filter((member) => !member.isInvitation) // Only check real members
          .map(async (member) => {
            try {
              const userRoleResponse = await getUserRoleByFilter({
                "account-id": member.id,
                "project-id": projectId,
                "page-index": 1,
                "page-size": 10,
              });

              if (userRoleResponse["data-list"].length > 0) {
                const userRole = userRoleResponse["data-list"][0];
                const apiStatus = userRole.status as UserRoleStatus;
                return { memberId: member.id, status: apiStatus, userRole };
              }
              return {
                memberId: member.id,
                status: "none" as UserRoleStatus,
                userRole: null,
              };
            } catch (error) {
              console.error(
                `Failed to check status for member ${member.id}:`,
                error
              );
              return {
                memberId: member.id,
                status: "none" as UserRoleStatus,
                userRole: null,
              };
            }
          });

        const statusResults = await Promise.all(memberStatusPromises);

        // Batch update all statuses at once
        const statusUpdates: Record<string, UserRoleStatus> = {};
        // const membersToUpdate: GroupMember[] = [];
        const notificationsToSend: {
          memberId: string;
          currentStatus: UserRoleStatus;
          newStatus: UserRoleStatus;
        }[] = [];

        statusResults.forEach(({ memberId, status }) => {
          const currentStatus = memberInvitationStatus[memberId];

          if (currentStatus !== status) {
            statusUpdates[memberId] = status;

            // Track status changes for notifications
            if (currentStatus && status === "approved") {
              notificationsToSend.push({
                memberId,
                currentStatus,
                newStatus: status,
              });
            }
          }

          // Update member role information if available
          // if (
          //   userRole &&
          //   !groupMembers.find((m) => m.id === memberId)?.isInvitation
          // ) {
          //   const memberRole = allRoles.find(
          //     (role) => role.id === userRole["role-id"]
          //   );
          //   if (memberRole) {
          //     membersToUpdate.push({
          //       ...groupMembers.find((m) => m.id === memberId)!,
          //       roleId: userRole["role-id"],
          //       role: memberRole.name as "Researcher" | "Secretary" | "Leader",
          //     });
          //   }
          // }
        });

        // Batch update statuses
        if (Object.keys(statusUpdates).length > 0) {
          setMemberInvitationStatus((prev) => ({ ...prev, ...statusUpdates }));
        }
      } catch (error) {
        console.error("Failed to batch check user role status:", error);
      }
    };

    // Check immediately on mount, then set up interval for every 2 minutes
    checkUserRoleStatus();
    const interval = setInterval(checkUserRoleStatus, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [
    projectId,
    groupMembers,
    memberInvitationStatus,
    allRoles,
    lastStatusCheck,
  ]);

  // Check CV status specifically for Principal Investigator
  useEffect(() => {
    const checkPICVStatus = () => {
      if (!documentsWithUserRole?.["data-list"] || !principalInvestigator)
        return;

      // Filter ScienceCV documents and get account IDs
      const scienceCVDocs = documentsWithUserRole["data-list"].filter(
        (doc) => doc.type === "BM2"
      );

      const cvSubmittedAccountIds = new Set<string>();
      scienceCVDocs.forEach((doc) => {
        if (doc["account-id"]) {
          cvSubmittedAccountIds.add(doc["account-id"]);
        }
      });

      // Update CV status for Principal Investigator
      const piAccountId = principalInvestigator["account-id"];
      setCvStatus((prev) => ({
        ...prev,
        [piAccountId]: cvSubmittedAccountIds.has(piAccountId)
          ? "submitted"
          : "not-submitted",
      }));

      // Set Principal Investigator as approved by default để hiển thị CV status
      setMemberInvitationStatus((prev) => ({
        ...prev,
        [piAccountId]: "approved",
      }));
    };

    checkPICVStatus();
  }, [documentsWithUserRole, principalInvestigator]);

  // Check CV status for approved members using useDocumentByProjectIdWithUserRole
  useEffect(() => {
    const checkCVStatus = () => {
      if (!documentsWithUserRole?.["data-list"] || !groupMembers.length) return;

      // Filter ScienceCV documents and get account IDs
      const scienceCVDocs = documentsWithUserRole["data-list"].filter(
        (doc) => doc.type === "BM2"
      );

      const cvSubmittedAccountIds = new Set<string>();
      scienceCVDocs.forEach((doc) => {
        if (doc["account-id"]) {
          cvSubmittedAccountIds.add(doc["account-id"]);
        }
      });

      // Update CV status for all approved members (excluding PI to avoid overwriting)
      setCvStatus((prev) => {
        const newCvStatus: CVStatus = { ...prev };
        for (const member of groupMembers) {
          const memberStatus = memberInvitationStatus[member.id];
          if (memberStatus === "approved") {
            newCvStatus[member.id] = cvSubmittedAccountIds.has(member.id)
              ? "submitted"
              : "not-submitted";
          }
        }
        return newCvStatus;
      });
    };

    checkCVStatus();
  }, [documentsWithUserRole, groupMembers, memberInvitationStatus]);

  // Fetch Principal Investigator data from userRolesResponse
  useEffect(() => {
    if (userRolesResponse?.["data-list"] && allRoles.length > 0) {
      const piRole = allRoles.find(
        (role) => role.name === "Principal Investigator"
      );
      if (piRole) {
        const piUserRole = userRolesResponse["data-list"].find(
          (userRole: UserRole) => userRole["role-id"] === piRole.id
        );
        if (piUserRole) {
          setPrincipalInvestigator(piUserRole);
        }
      }
    }
  }, [userRolesResponse, allRoles]);

  // Handle upload Scientific CV with confirmation and duplicate checking
  const handleUploadScientificCV = () => {
    setShowUploadConfirmDialog(true);
  };

  const handleConfirmUploadScientificCV = async () => {
    if (
      !scientificCV?.data ||
      !projectId ||
      !principalInvestigator?.["account-id"]
    ) {
      console.error(
        "Scientific CV not found, project ID missing, or Principal Investigator account-id missing"
      );
      return;
    }

    setIsUploadingCV(true);
    setShowUploadConfirmDialog(false);

    try {
      // Get Principal Investigator account-id
      const piAccountId = principalInvestigator["account-id"];

      // Check for existing ScienceCV document with matching account-id using documentsWithUserRole
      const existingScienceCVDoc = documentsWithUserRole?.["data-list"]?.find(
        (doc) => doc.type === "BM2" && doc["account-id"] === piAccountId
      );

      if (existingScienceCVDoc) {
        // Update existing document
        await updateDocumentMutation.mutateAsync({
          id: existingScienceCVDoc.id,
          name: "Scientific CV",
          type: "BM2",
          "is-template": scientificCV.data["is-template"],
          "content-html": scientificCV.data["content-html"],
          "project-id": projectId,
          status: "draft",
        });

        console.log("Scientific CV updated successfully!");
      } else {
        // Create new document
        await createDocumentMutation.mutateAsync({
          name: "Scientific CV",
          type: "BM2",
          "is-template": scientificCV.data["is-template"],
          "content-html": scientificCV.data["content-html"],
          "project-id": projectId,
          status: "draft",
        });

        console.log("Scientific CV uploaded successfully!");
      }

      // Update CV status for Principal Investigator
      setCvStatus((prev) => ({
        ...prev,
        [piAccountId]: "submitted",
      }));
    } catch (error) {
      console.error("Failed to upload/update Scientific CV:", error);
    } finally {
      setIsUploadingCV(false);
    }
  };

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
    // Kiểm tra xem user đã tồn tại chưa
    if (groupMembers.some((u) => u.email === user.email)) return;

    // Kiểm tra giới hạn số lượng thành viên
    if (!canAddMember()) {
      toast.error(
        `Cannot add members because there are already ${maximumMembers} members`
      );
      return;
    }

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
    setMemberToRemove(userId);
  };

  const confirmRemoveUser = async () => {
    if (!memberToRemove) return;

    const memberToDelete = groupMembers.find((m) => m.id === memberToRemove);
    if (!memberToDelete) return;

    setIsRemovingMember(true);

    try {
      // If this is an existing member (not an invitation), delete ALL their UserRoles
      if (!memberToDelete.isInvitation && projectId) {
        // First, get ALL UserRoles for this member in the project
        const userRoleResponse = await getUserRoleByFilter({
          "account-id": memberToDelete.id,
          "project-id": projectId,
          "page-index": 1,
          "page-size": 100, // Increased to ensure we get all roles
        });

        // Delete all UserRoles with matching account-id
        if (userRoleResponse["data-list"].length > 0) {
          const deletePromises = userRoleResponse["data-list"].map((userRole) =>
            deleteUserRoleMutation.mutateAsync(userRole.id)
          );
          await Promise.all(deletePromises);
        }

        // Also delete ScienceCV documents with matching account-id
        if (documentsWithUserRole?.["data-list"]) {
          const scienceCVDocs = documentsWithUserRole["data-list"].filter(
            (doc) =>
              doc.type === "BM2" && doc["account-id"] === memberToDelete.id
          );

          if (scienceCVDocs.length > 0) {
            const deleteDocPromises = scienceCVDocs.map((doc) =>
              deleteDocumentMutation.mutateAsync(doc.id)
            );
            await Promise.all(deleteDocPromises);
          }
        }
      }

      // Remove from local state
      const updatedMembers = groupMembers.filter(
        (member) => member.id !== memberToRemove
      );
      setGroupMembers(updatedMembers);

      // Call parent callback if provided
      if (onGroupMembersChange) {
        onGroupMembersChange(updatedMembers);
      }

      // Update collaborators for backward compatibility
      const updatedCollaborators = collaborators.filter(
        (user) => user.id !== memberToRemove
      );
      onCollaboratorsChange(updatedCollaborators);

      // Clear invitation status
      setMemberInvitationStatus((prev) => {
        const updated = { ...prev };
        delete updated[memberToRemove];
        return updated;
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsRemovingMember(false);
      setMemberToRemove(null);
    }
  };

  const cancelRemoveUser = () => {
    setMemberToRemove(null);
  };

  // Handle member invitation
  const handleInviteMember = async (memberId: string) => {
    if (!projectId || !myAccountInfo) return;

    // Find the member to get their role information
    const member = groupMembers.find((m) => m.id === memberId);
    if (!member || !member.roleId) return;

    const currentStatus = memberInvitationStatus[memberId];

    // Don't call update API if status is rejected
    if (currentStatus === "rejected") {
      console.log("Cannot invite member with rejected status");
      return;
    }

    setInvitingMembers((prev) => new Set(prev).add(memberId));
    setMemberInvitationStatus((prev) => ({
      ...prev,
      [memberId]: "pending",
    }));

    try {
      // For new invitations or members without existing UserRole
      // Step 1: Send notification
      const notificationRequest: NotificationRequest = {
        title: `Invite Enroll to project: ${projectName}`,
        type: "project",
        status: "pending",
        "objec-notification-id": projectId,
        "list-account-id": [memberId],
      };
      const notificationResult = await inviteMemberMutation.mutateAsync(
        notificationRequest
      );

      if (notificationResult.success) {
        // Step 2: Create UserRole for the selected role
        await createUserRoleMutation.mutateAsync({
          "account-id": memberId,
          "role-id": member.roleId,
          "project-id": projectId,
        });

        // Step 3: If selected role is not Researcher, also create Researcher role
        if (member.role !== "Researcher") {
          const researcherRole = allRoles.find(
            (role) => role.name === "Researcher"
          );
          if (researcherRole) {
            await createUserRoleMutation.mutateAsync({
              "account-id": memberId,
              "role-id": researcherRole.id,
              "project-id": projectId,
            });
          }
        }

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
            className="bg-yellow-50 text-yellow-700 border-yellow-300 font-medium"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300 font-medium"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-300 font-medium"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        // Return null for members without valid UserRole status
        return null;
    }
  };

  const getCVStatusBadge = (accountId: string) => {
    const status = cvStatus[accountId];
    if (!status) return null;

    switch (status) {
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300 font-medium"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            CV Submitted
          </Badge>
        );
      case "not-submitted":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-300 font-medium"
          >
            <XCircle className="w-3 h-3 mr-1" />
            CV Not Submitted
          </Badge>
        );
      default:
        return null;
    }
  };

  // CV Status Badge specifically for Principal Investigator (always show)
  const getCVStatusBadgeForPI = (accountId: string) => {
    const status = cvStatus[accountId];
    if (!status) return null;

    switch (status) {
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300 font-medium"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            CV Submitted
          </Badge>
        );
      case "not-submitted":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-300 font-medium"
          >
            <XCircle className="w-3 h-3 mr-1" />
            CV Not Submitted
          </Badge>
        );
      default:
        return null;
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

          {/* Principal Investigator Card */}
          {principalInvestigator && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Principal Investigator
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={principalInvestigator["avatar-url"] || undefined}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {(principalInvestigator["full-name"] || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {principalInvestigator["full-name"]}
                    </p>
                    <p className="text-sm text-gray-600">
                      {principalInvestigator.email}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Principal Investigator
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* CV Status for PI - Always show */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium">
                      CV Status
                    </span>
                    {getCVStatusBadgeForPI(principalInvestigator["account-id"])}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadScientificCV}
                    disabled={!scientificCV?.data || isUploadingCV}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {isUploadingCV ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Science CV"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                    <Loading />
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
                  console.log(
                    "Rendering member:",
                    member.id,
                    "role:",
                    member.role
                  );
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
                        {/* UserRole Status */}
                        {memberInvitationStatus[member.id] &&
                          memberInvitationStatus[member.id] !== "none" && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-500 font-medium">
                                Status
                              </span>
                              {getInvitationStatusBadge(
                                memberInvitationStatus[member.id]
                              )}
                            </div>
                          )}

                        {/* CV Status - only show for approved members */}
                        {memberInvitationStatus[member.id] === "approved" && (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500 font-medium">
                              CV Status
                            </span>
                            {getCVStatusBadge(member.id)}
                          </div>
                        )}

                        {/* Invite Button */}
                        {!member.isInvitation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInviteMember(member.id)}
                            disabled={
                              invitingMembers.has(member.id) ||
                              memberInvitationStatus[member.id] === "pending" ||
                              memberInvitationStatus[member.id] ===
                                "approved" ||
                              memberInvitationStatus[member.id] === "rejected"
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
                          disabled={
                            isLoadingRoles ||
                            memberInvitationStatus[member.id] === "pending" ||
                            memberInvitationStatus[member.id] === "approved" ||
                            memberInvitationStatus[member.id] === "rejected"
                          }
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

      {/* Confirmation Modal */}
      <Dialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && cancelRemoveUser()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the project? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={cancelRemoveUser}
              disabled={isRemovingMember}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveUser}
              disabled={isRemovingMember}
            >
              {isRemovingMember ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Scientific CV Confirmation Dialog */}
      <Dialog
        open={showUploadConfirmDialog}
        onOpenChange={setShowUploadConfirmDialog}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Scientific CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to upload your Scientific CV to this
              project? If you already have a Scientific CV uploaded, it will be
              replaced with the new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadConfirmDialog(false)}
              disabled={isUploadingCV}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUploadScientificCV}
              disabled={isUploadingCV}
            >
              {isUploadingCV ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Confirm Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
