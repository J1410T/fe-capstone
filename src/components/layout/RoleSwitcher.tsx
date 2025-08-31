import React, { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import { useAuthResponse, useSetMyRole } from "@/hooks/queries";
import { useLoading } from "@/contexts/loading-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft,
  User,
  Building,
  GraduationCap,
  UserCheck,
  Shield,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ButtonLoading } from "@/components/ui/loaders";

// Role configurations with icons and routes
type RoleConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultRoute: string;
  color: string;
};

const roleConfig: Record<UserRole, RoleConfig> = {
  [UserRole.RESEARCHER]: {
    label: "Researcher",
    icon: User,
    description: "General RESEARCHER access",
    defaultRoute: "/home",
    color: "bg-blue-100 text-blue-800",
  },
  [UserRole.PRINCIPAL_INVESTIGATOR]: {
    label: "Principal Investigator",
    icon: GraduationCap,
    description: "Research project leadership",
    defaultRoute: "/home",
    color: "bg-purple-100 text-purple-800",
  },
  [UserRole.HOST_INSTITUTION]: {
    label: "Host Institution",
    icon: Building,
    description: "Institution management",
    defaultRoute: "/home",
    color: "bg-green-100 text-green-800",
  },
  [UserRole.APPRAISAL_COUNCIL]: {
    label: "Appraisal Council",
    icon: UserCheck,
    description: "Project evaluation & approval",
    defaultRoute: "/home",
    color: "bg-orange-100 text-orange-800",
  },
  [UserRole.STAFF]: {
    label: "Staff",
    icon: Shield,
    description: "Administrative access",
    defaultRoute: "/staff/dashboard",
    color: "bg-red-100 text-red-800",
  },
  [UserRole.ADMIN]: {
    label: "Admin",
    icon: Shield,
    description: "Full administrative access",
    defaultRoute: "/staff/dashboard",
    color: "bg-red-100 text-red-800",
  },
};

// Note: availableRoles is now dynamically generated from auth-response data

interface RoleSwitcherProps {
  variant?: "dropdown" | "button" | "mobile";
  className?: string;
  onRoleChange?: () => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  variant = "dropdown",
  className = "",
  onRoleChange,
}) => {
  const { user, switchRole } = useAuth();
  // const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: authData } = useAuthResponse();
  const { startLoading } = useLoading();

  // Always call hooks at the top level
  const setMyRoleMutation = useSetMyRole();

  if (!user) return null;

  // Staff users cannot switch roles
  if (user.role === UserRole.STAFF) return null;

  // Only display Switch Role section if there are 2 or more roles
  if (!authData?.roles || authData.roles.length < 2) return null;

  // Get available roles from auth-response data instead of hardcoded list
  const availableRoles = authData.roles
    .filter((role: string): role is UserRole =>
      Object.values(UserRole).includes(role as UserRole)
    )
    .filter((role: UserRole) => role !== UserRole.STAFF); // Staff users cannot switch roles

  const currentRoleConfig = roleConfig[user.role];

  // Handle role switch with API call and auth-response update
  const handleRoleSwitch = (newRole: UserRole) => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }

    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);

    // Call the API to switch role and update auth-response
    setMyRoleMutation.mutate(newRole, {
      onSuccess: async () => {
        // Update local auth context after successful API call
        const success = await switchRole(newRole);

        if (success) {
          setIsOpen(false);
          onRoleChange?.();

          // Start the loading overlay immediately
          startLoading();

          // Show success toast
          toast.success(`Switched to ${newRole} role`);

          // Wait a moment for the toast to show, then reload the page
          setTimeout(() => {
            // Get the default route for the new role
            const defaultRoute = roleConfig[newRole].defaultRoute;
            // Force a full page reload to ensure clean state
            window.location.href = defaultRoute;
          }, 500);
        } else {
          toast.error("Failed to update local role state");
          setIsLoading(false);
        }
      },
      onError: (error) => {
        console.error("Failed to switch role:", error);
        toast.error(
          `Failed to switch role: ${error.message || "Unknown error"}`
        );
        setIsLoading(false);
      },
    });
  };

  // Mobile variant - simpler button with text
  if (variant === "mobile") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${className}`}
          >
            <ArrowRightLeft className="h-4 w-4 ml-1" />
            <span>Switch Role</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Switch to another role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableRoles.map((role: UserRole) => {
            const config = roleConfig[role];
            const isCurrentRole = role === user.role;
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`cursor-pointer p-3 ${
                  isCurrentRole ? "bg-muted" : ""
                }`}
                disabled={isCurrentRole || isLoading}
              >
                <div className="flex items-center gap-3 w-full">
                  {isLoading && !isCurrentRole ? (
                    <ButtonLoading />
                  ) : (
                    <config.icon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                  {isCurrentRole && (
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                    >
                      Current
                    </Badge>
                  )}
                  {isLoading && !isCurrentRole && (
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      Switching...
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Button variant - compact role switcher
  if (variant === "button") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`gap-2 ${className}`}>
            <currentRoleConfig.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{currentRoleConfig.label}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="center">
          <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableRoles.map((role: UserRole) => {
            const config = roleConfig[role];
            const isCurrentRole = role === user.role;
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`cursor-pointer ${isCurrentRole ? "bg-muted" : ""}`}
                disabled={isCurrentRole || isLoading}
              >
                <div className="items-center gap-3 w-full">
                  <config.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{config.label}</div>
                  </div>
                  {isCurrentRole && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default dropdown variant - for use in user dropdown menu
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <DropdownMenuItem className="cursor-pointer">
          <ArrowRightLeft className="ml-1 mr-2 h-4 w-4" />
          <span>Switch Role</span>
        </DropdownMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" side="right">
        <DropdownMenuLabel>Switch to another role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((role: UserRole) => {
          const config = roleConfig[role];
          const isCurrentRole = role === user.role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`cursor-pointer ${isCurrentRole ? "bg-muted" : ""}`}
              disabled={isCurrentRole || isLoading}
            >
              <div className="flex items-center gap-3 w-full">
                <config.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm break-words">
                    {config.label}
                  </div>
                  <div className="text-xs text-muted-foreground break-words">
                    {config.description}
                  </div>
                </div>
                {isCurrentRole && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    Current
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
