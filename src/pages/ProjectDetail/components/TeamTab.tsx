import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Mail, UserPlus, Edit, UserMinus } from "lucide-react";
import { MemberRole } from "../shared/types";
import { toast } from "sonner";

interface TeamMember {
  id?: string;
  name: string;
  role: "Member" | "Leader" | "Secretary" | "Principal Investigator";
  department: string;
  email: string;
}

interface TeamTabProps {
  team: TeamMember[];
  showEditingButtons?: boolean;
}

export const TeamTab: React.FC<TeamTabProps> = ({
  team,
  showEditingButtons = false,
}) => {
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<MemberRole>("Member");
  const [editingRole, setEditingRole] = useState<MemberRole>("Member");

  // Role-based logic is now handled by showEditingButtons prop

  // Handler functions
  const handleAddMember = () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Check for existing roles if Leader or Secretary
    if (newMemberRole === "Leader" || newMemberRole === "Secretary") {
      const existingMember = team.find(
        (member) => member.role === newMemberRole
      );
      if (existingMember) {
        setSelectedMember(existingMember);
        setShowConfirmDialog(true);
        return;
      }
    }

    // Add member logic here
    toast.success(`Member invited with role: ${newMemberRole}`);
    setNewMemberEmail("");
    setNewMemberRole("Member");
    setShowAddMemberDialog(false);
  };

  const handleEditRole = (member: TeamMember, newRole: MemberRole) => {
    if (newRole === "Leader" || newRole === "Secretary") {
      const existingMember = team.find(
        (m) => m.role === newRole && m.email !== member.email
      );
      if (existingMember) {
        setSelectedMember(existingMember);
        setEditingRole(newRole);
        setShowConfirmDialog(true);
        return;
      }
    }

    // Edit role logic here
    toast.success(`Role updated to: ${newRole}`);
    setShowEditRoleDialog(false);
  };

  const handleRemoveMember = (member: TeamMember) => {
    // Remove member logic here
    toast.success(`${member.name} removed from project`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal Investigator":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Leader":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Secretary":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Member":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Principal Investigator":
        return "👑";
      case "Leader":
        return "⭐";
      case "Secretary":
        return "📋";
      case "Member":
        return "👤";
      default:
        return "👤";
    }
  };

  const canEditRole = (role: string) => {
    return role !== "Principal Investigator";
  };

  const canRemoveMember = (role: string) => {
    return role !== "Principal Investigator";
  };

  return (
    <div className="space-y-4">
      {/* Add Member Button for PIs */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Research Team</CardTitle>
              <CardDescription>
                Team members involved in the research project
              </CardDescription>
            </div>
            {showEditingButtons && (
              <Dialog
                open={showAddMemberDialog}
                onOpenChange={setShowAddMemberDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to the research team
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMemberRole}
                        onValueChange={(value) =>
                          setNewMemberRole(value as MemberRole)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Leader">Leader</SelectItem>
                          <SelectItem value="Secretary">Secretary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddMemberDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>Invite Member</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                {/* Action buttons for PI */}
                {showEditingButtons && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {canEditRole(member.role) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-blue-50"
                        onClick={() => {
                          setSelectedMember(member);
                          setEditingRole(member.role as MemberRole);
                          setShowEditRoleDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3 text-blue-600" />
                      </Button>
                    )}
                    {canRemoveMember(member.role) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-red-50"
                        onClick={() => handleRemoveMember(member)}
                      >
                        <UserMinus className="h-3 w-3 text-red-600" />
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{getRoleIcon(member.role)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <Badge
                      className={`${getRoleColor(member.role)} mt-1`}
                      variant="outline"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{member.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                {/* Special indicator for Principal Investigator */}
                {member.role === "Principal Investigator" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800  to-emerald-600 rounded-t-lg"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRoleDialog} onOpenChange={setShowEditRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
            <DialogDescription>
              Change the role of {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">New Role</Label>
              <Select
                value={editingRole}
                onValueChange={(value) => setEditingRole(value as MemberRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Leader">Leader</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditRoleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedMember && handleEditRole(selectedMember, editingRole)
              }
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Role Conflict</DialogTitle>
            <DialogDescription>
              There is already a {editingRole || newMemberRole} in this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>{selectedMember?.name}</strong> is currently the{" "}
                {selectedMember?.role}. If you proceed, they will be changed to
                a Member role.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle role change with confirmation
                toast.success(`Role updated successfully`);
                setShowConfirmDialog(false);
                setShowEditRoleDialog(false);
                setShowAddMemberDialog(false);
              }}
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
