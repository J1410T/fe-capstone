import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  Crown,
  User,
  Shield,
} from "lucide-react";
import { PIUser } from "../shared/types";

import { validateEmail } from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ResearchGroup: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<PIUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<
    "Leader" | "Secretary" | "Normal"
  >("Normal");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockMembers: PIUser[] = [
          {
            id: "1",
            name: user?.name || "Principal Investigator",
            email: user?.email || "pi@example.com",
            avatar: user?.avatar,
            role: "Leader",
            department: "Computer Science",
            position: "Principal Investigator",
            joinedAt: "2023-01-15",
          },
          {
            id: "2",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "Secretary",
            department: "Computer Science",
            position: "Research Associate",
            joinedAt: "2023-02-01",
          },
          {
            id: "3",
            name: "John Smith",
            email: "john.smith@example.com",
            role: "Normal",
            department: "Computer Science",
            position: "Graduate Student",
            joinedAt: "2023-03-15",
          },
          {
            id: "4",
            name: "Emily Chen",
            email: "emily.chen@example.com",
            role: "Normal",
            department: "Computer Science",
            position: "Research Assistant",
            joinedAt: "2023-04-01",
          },
        ];
        setMembers(mockMembers);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading team members:", error);
      setIsLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Check if email already exists
    if (
      members.some(
        (member) => member.email.toLowerCase() === inviteEmail.toLowerCase()
      )
    ) {
      setEmailError("This email is already in the team");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send invitation
      setTimeout(() => {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setShowInviteDialog(false);
        setInviteEmail("");
        setInviteRole("Normal");
        setEmailError("");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (
    memberId: string,
    newRole: "Leader" | "Secretary" | "Normal"
  ) => {
    // Prevent changing own role if you're the only leader
    const currentMember = members.find((m) => m.id === memberId);
    const leaders = members.filter((m) => m.role === "Leader");

    if (
      currentMember?.email === user?.email &&
      currentMember?.role === "Leader" &&
      leaders.length === 1
    ) {
      toast.error("Cannot change role: You are the only leader in the group");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMembers((prev) =>
          prev.map((member) =>
            member.id === memberId ? { ...member, role: newRole } : member
          )
        );
        toast.success("Member role updated successfully");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update member role");
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const memberToRemove = members.find((m) => m.id === memberId);

    // Prevent removing yourself if you're the only leader
    if (memberToRemove?.email === user?.email) {
      const leaders = members.filter((m) => m.role === "Leader");
      if (leaders.length === 1) {
        toast.error(
          "Cannot remove yourself: You are the only leader in the group"
        );
        return;
      }
    }

    if (
      !confirm(
        `Are you sure you want to remove ${memberToRemove?.name} from the team?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMembers((prev) => prev.filter((member) => member.id !== memberId));
        toast.success("Member removed from team");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Leader":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "Secretary":
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Leader":
        return "bg-yellow-100 text-yellow-800";
      case "Secretary":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCurrentUserLeader = members.some(
    (m) => m.email === user?.email && m.role === "Leader"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Research Group
            </h1>
            <p className="text-muted-foreground">
              Manage your research team members and roles
            </p>
          </div>
        </div>
        {isCurrentUserLeader && (
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your research group
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter email address"
                    className={emailError ? "border-red-300" : ""}
                  />
                  {emailError && (
                    <p className="text-sm text-red-600">{emailError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value: any) => setInviteRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal Member</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="Leader">Leader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInviteMember} disabled={isLoading}>
                  <Mail className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.role === "Leader").length}
                </p>
                <p className="text-sm text-muted-foreground">Leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.role === "Secretary").length}
                </p>
                <p className="text-sm text-muted-foreground">Secretaries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage roles and permissions for your research team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Joined</TableHead>
                {isCurrentUserLeader && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                  {isCurrentUserLeader && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Select
                          value={member.role}
                          onValueChange={(value: any) =>
                            handleRoleChange(member.id, value)
                          }
                          disabled={
                            member.email === user?.email &&
                            member.role === "Leader" &&
                            members.filter((m) => m.role === "Leader")
                              .length === 1
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Secretary">Secretary</SelectItem>
                            <SelectItem value="Leader">Leader</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={
                            member.email === user?.email &&
                            member.role === "Leader" &&
                            members.filter((m) => m.role === "Leader")
                              .length === 1
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchGroup;
