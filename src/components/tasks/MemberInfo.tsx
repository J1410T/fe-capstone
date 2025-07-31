import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useUserRoleById,
  useUserRolesByProjectId,
} from "@/hooks/queries/useAuth";
import { UserRole } from "@/types/auth";

interface MemberInfoProps {
  memberId: string;
  showRole?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MemberInfo: React.FC<MemberInfoProps> = ({
  memberId,
  showRole = true,
  size = "md",
  className = "",
}) => {
  const { data: userRole, isLoading, error } = useUserRoleById(memberId);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`rounded-full bg-slate-200 animate-pulse ${
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
          }`}
        />
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-20" />
          {showRole && (
            <div className="h-2 bg-slate-200 rounded animate-pulse w-16" />
          )}
        </div>
      </div>
    );
  }

  if (error || !userRole) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Avatar
          className={
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
          }
        >
          <AvatarFallback className="bg-slate-200 text-slate-600">
            ?
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm text-slate-600">Unknown Member</p>
          {showRole && (
            <Badge variant="secondary" className="text-xs">
              Unknown Role
            </Badge>
          )}
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Avatar
        className={
          size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
        }
      >
        <AvatarImage
          src={userRole["avatar-url"] || undefined}
          alt={userRole["full-name"]}
        />
        <AvatarFallback className="bg-blue-100 text-blue-700">
          {getInitials(userRole["full-name"])}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p
          className={`font-medium text-slate-900 ${
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          }`}
        >
          {userRole["full-name"]}
        </p>
        {showRole && (
          <Badge variant="secondary" className="text-xs">
            {userRole.name}
          </Badge>
        )}
      </div>
    </div>
  );
};

// New component for displaying member info using account ID and project context
interface MemberInfoByAccountProps {
  accountId: string;
  projectId: string;
  showRole?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MemberInfoByAccount: React.FC<MemberInfoByAccountProps> = ({
  accountId,
  projectId,
  showRole = true,
  size = "md",
  className = "",
}) => {
  const {
    data: userRolesData,
    isLoading,
    error,
  } = useUserRolesByProjectId(projectId);

  // Find the user role for this account ID
  const userRole = React.useMemo(() => {
    if (!userRolesData?.["data-list"]) return null;

    // Find the user role for this account ID, prioritizing non-Researcher roles
    const roles = userRolesData["data-list"].filter(
      (role: UserRole) => role["account-id"] === accountId
    );

    if (roles.length === 0) return null;
    if (roles.length === 1) return roles[0];

    // If multiple roles, prioritize non-Researcher roles
    const nonResearcherRole = roles.find(
      (role: UserRole) => role.name !== "Researcher"
    );
    return nonResearcherRole || roles[0];
  }, [userRolesData, accountId]);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`rounded-full bg-slate-200 animate-pulse ${
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
          }`}
        />
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-20" />
          {showRole && (
            <div className="h-2 bg-slate-200 rounded animate-pulse w-16" />
          )}
        </div>
      </div>
    );
  }

  if (error || !userRole) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Avatar
          className={
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
          }
        >
          <AvatarFallback className="bg-slate-200 text-slate-600">
            ?
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm text-slate-600">Unknown Member</p>
          {showRole && (
            <Badge variant="secondary" className="text-xs">
              Unknown Role
            </Badge>
          )}
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Avatar
        className={
          size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
        }
      >
        <AvatarImage
          src={userRole["avatar-url"] || undefined}
          alt={userRole["full-name"]}
        />
        <AvatarFallback className="bg-blue-100 text-blue-700">
          {getInitials(userRole["full-name"])}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p
          className={`font-medium text-slate-900 ${
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          }`}
        >
          {userRole["full-name"]}
        </p>
        {showRole && (
          <Badge variant="secondary" className="text-xs">
            {userRole.name}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Component for displaying multiple members
interface MemberListProps {
  memberIds: string[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MemberList: React.FC<MemberListProps> = ({
  memberIds,
  maxDisplay = 3,
  size = "sm",
  className = "",
}) => {
  const displayIds = memberIds.slice(0, maxDisplay);
  const remainingCount = memberIds.length - maxDisplay;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {displayIds.map((memberId) => (
        <MemberInfo
          key={memberId}
          memberId={memberId}
          showRole={false}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium ${
            size === "sm"
              ? "w-6 h-6 text-xs"
              : size === "lg"
              ? "w-10 h-10 text-sm"
              : "w-8 h-8 text-xs"
          }`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Component for displaying multiple members using account IDs with project context
interface MemberListByAccountProps {
  accountIds: string[];
  projectId: string;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MemberListByAccount: React.FC<MemberListByAccountProps> = ({
  accountIds,
  projectId,
  maxDisplay = 3,
  size = "sm",
  className = "",
}) => {
  const displayIds = accountIds.slice(0, maxDisplay);
  const remainingCount = accountIds.length - maxDisplay;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {displayIds.map((accountId) => (
        <MemberInfoByAccount
          key={accountId}
          accountId={accountId}
          projectId={projectId}
          showRole={false}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium ${
            size === "sm"
              ? "w-6 h-6 text-xs"
              : size === "lg"
              ? "w-10 h-10 text-sm"
              : "w-8 h-8 text-xs"
          }`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
