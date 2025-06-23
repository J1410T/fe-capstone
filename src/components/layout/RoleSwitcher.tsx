import React, { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

// Role configurations with icons and routes
const roleConfig = {
  [UserRole.MEMBER]: {
    label: "Member",
    icon: User,
    description: "General member access",
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
};

// Available roles for switching (excluding Staff - staff cannot switch roles)
const availableRoles = [
  UserRole.MEMBER,
  UserRole.PRINCIPAL_INVESTIGATOR,
  UserRole.HOST_INSTITUTION,
  UserRole.APPRAISAL_COUNCIL,
];

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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  // Staff users cannot switch roles
  if (user.role === UserRole.STAFF) return null;

  const currentRoleConfig = roleConfig[user.role];

  // Handle role switch with proper auth context integration
  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }

    try {
      // Use the auth context's switchRole function
      const success = await switchRole(newRole);

      if (success) {
        // Close the dropdown first
        setIsOpen(false);
        onRoleChange?.();

        // Navigate immediately without loading delay
        const newRoleConfig = roleConfig[newRole];
        navigate(newRoleConfig.defaultRoute, { replace: true });
      } else {
        toast.error("Failed to switch role");
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast.error("Failed to switch role");
    }
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
            <ArrowRightLeft className="h-4 w-4" />
            <span>Switch Role</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Switch to another role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableRoles.map((role) => {
            const config = roleConfig[role];
            const isCurrentRole = role === user.role;
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`cursor-pointer p-3 ${
                  isCurrentRole ? "bg-muted" : ""
                }`}
                disabled={isCurrentRole}
              >
                <div className="flex items-center gap-3 w-full">
                  <config.icon className="h-4 w-4 text-muted-foreground" />
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
          {availableRoles.map((role) => {
            const config = roleConfig[role];
            const isCurrentRole = role === user.role;
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`cursor-pointer ${isCurrentRole ? "bg-muted" : ""}`}
                disabled={isCurrentRole}
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
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          <span>Switch Role</span>
        </DropdownMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" side="right">
        <DropdownMenuLabel>Switch to another role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((role) => {
          const config = roleConfig[role];
          const isCurrentRole = role === user.role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`cursor-pointer ${isCurrentRole ? "bg-muted" : ""}`}
              disabled={isCurrentRole}
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
