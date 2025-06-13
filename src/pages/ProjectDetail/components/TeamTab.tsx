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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Mail,
  UserPlus,
  Edit,
  UserMinus,
  MoreVertical,
} from "lucide-react";
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
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
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

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setEditingRole(member.role as MemberRole);
    setShowEditRoleDialog(true); // Directly open edit dialog
  };

  const handleDeleteClick = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteConfirmDialog(true);
  };

  const handleSaveEdit = () => {
    // Show confirmation dialog when Save is clicked
    setShowEditRoleDialog(false);
    setShowEditConfirmDialog(true);
  };

  const handleConfirmEdit = () => {
    if (selectedMember) {
      // Check for role conflicts first
      if (editingRole === "Leader" || editingRole === "Secretary") {
        const existingMember = team.find(
          (m) => m.role === editingRole && m.email !== selectedMember.email
        );
        if (existingMember) {
          setShowEditConfirmDialog(false);
          setShowConfirmDialog(true);
          return;
        }
      }

      // Apply role change
      toast.success(`${selectedMember.name}'s role updated to ${editingRole}`);
      setShowEditConfirmDialog(false);
      setSelectedMember(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedMember) {
      // Remove member logic here
      toast.success(`${selectedMember.name} removed from project`);
      setShowDeleteConfirmDialog(false);
      setSelectedMember(null);
    }
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
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Project Team
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Team members involved in the research project
              </CardDescription>
            </div>
            {showEditingButtons && (
              <Dialog
                open={showAddMemberDialog}
                onOpenChange={setShowAddMemberDialog}
              >
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto text-sm sm:text-base">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Invite Member</span>
                    <span className="sm:hidden">Invite</span>
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
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                {/* Action dropdown for PI */}
                {showEditingButtons &&
                  (canEditRole(member.role) ||
                    canRemoveMember(member.role)) && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-3 w-3 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {canEditRole(member.role) && (
                            <DropdownMenuItem
                              onClick={() => handleEditClick(member)}
                            >
                              <Edit className="h-3 w-3 mr-2 text-blue-600" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canRemoveMember(member.role) && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(member)}
                            >
                              <UserMinus className="h-3 w-3 mr-2 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                <div className="flex items-start gap-2 sm:gap-3 mb-3 ">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">
                      {getRoleIcon(member.role)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <Badge
                      className={`${getRoleColor(member.role)} mt-1 text-xs`}
                      variant="outline"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{member.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Special indicator for Principal Investigator */}
                {member.role === "Principal Investigator" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-t-lg"></div>
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
            <Button onClick={handleSaveEdit}>Save</Button>
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

      {/* Edit Confirmation Dialog */}
      <Dialog
        open={showEditConfirmDialog}
        onOpenChange={setShowEditConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Edit</DialogTitle>
            <DialogDescription>
              Are you sure you want to edit {selectedMember?.name}'s role?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit}>Confirm Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the
              project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
