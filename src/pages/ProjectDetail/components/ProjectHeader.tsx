import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";
import { ArrowLeft } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  status: string;
  pi: string;
  showAllTabs: boolean;
  onToggleAllTabs: (value: boolean) => void;
  memberRole?: "Member" | "Leader" | "Secretary";
  onMemberRoleChange?: (role: "Member" | "Leader" | "Secretary") => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  status,
  pi,
  showAllTabs,
  onToggleAllTabs,
  memberRole = "Member",
  onMemberRoleChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return "/pi/projects";
      case UserRole.HOST_INSTITUTION:
        return "/host/my-projects";
      case UserRole.MEMBER:
        return "/member/projects";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/projects";
      default:
        return "/home";
    }
  };

  const shouldShowSwitch =
    user?.role === UserRole.MEMBER ||
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR;
  const shouldShowMemberRoleSelect =
    user?.role === UserRole.MEMBER && showAllTabs;

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row items-start md:items-center gap-4">
        <Button variant="outline" onClick={() => navigate(getBackPath())}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(status)}>
              {getStatusIcon(status)}
              {status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Principal Investigator: {pi}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      {shouldShowSwitch && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-all-tabs"
              checked={showAllTabs}
              onCheckedChange={onToggleAllTabs}
            />
            <Label htmlFor="show-all-tabs" className="text-sm font-medium">
              Show all tabs
            </Label>
          </div>

          {shouldShowMemberRoleSelect && onMemberRoleChange && (
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="member-role"
                className="text-sm font-medium whitespace-nowrap"
              >
                My Role:
              </Label>
              <Select value={memberRole} onValueChange={onMemberRoleChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Leader">Leader</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
