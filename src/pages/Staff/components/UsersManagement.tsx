import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";

// Mock data
const users = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "Stanford, CA",
    role: "PRINCIPAL_INVESTIGATOR",
    status: "active",
    lastLogin: "2024-01-15",
    joinDate: "2023-06-15",
    projects: 3,
    avatar: "/avatars/sarah.jpg",
    permissions: ["project_create", "team_manage", "budget_view"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@mit.edu",
    phone: "+1 (555) 234-5678",
    location: "Cambridge, MA",
    role: "RESEARCHER",
    status: "active",
    lastLogin: "2024-01-14",
    joinDate: "2023-08-20",
    projects: 2,
    avatar: "/avatars/michael.jpg",
    permissions: ["project_view", "task_manage"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@ucsd.edu",
    phone: "+1 (555) 345-6789",
    location: "San Diego, CA",
    role: "HOST_INSTITUTION",
    status: "pending",
    lastLogin: "Never",
    joinDate: "2024-01-10",
    projects: 0,
    avatar: "/avatars/emily.jpg",
    permissions: ["project_register", "institution_manage"],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "james.wilson@research.org",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    role: "COUNCIL_MEMBER",
    status: "inactive",
    lastLogin: "2023-12-20",
    joinDate: "2023-03-10",
    projects: 1,
    avatar: "/avatars/james.jpg",
    permissions: ["project_approve", "evaluation_manage", "meeting_schedule"],
  },
];

const roles = [
  { value: "STAFF", label: "Staff", description: "System administrators" },
  {
    value: "PRINCIPAL_INVESTIGATOR",
    label: "Principal Investigator",
    description: "Project leaders",
  },
  {
    value: "RESEARCHER",
    label: "Researcher",
    description: "Research team members",
  },
  {
    value: "HOST_INSTITUTION",
    label: "Host Institution",
    description: "Institution representatives",
  },
  {
    value: "COUNCIL_MEMBER",
    label: "Council Member",
    description: "Review board members",
  },
];

const permissions = [
  { id: "project_create", label: "Create Projects", category: "Projects" },
  { id: "project_view", label: "View Projects", category: "Projects" },
  { id: "project_approve", label: "Approve Projects", category: "Projects" },
  { id: "project_register", label: "Register Projects", category: "Projects" },
  { id: "team_manage", label: "Manage Teams", category: "Teams" },
  { id: "budget_view", label: "View Budget", category: "Finance" },
  { id: "budget_approve", label: "Approve Budget", category: "Finance" },
  { id: "task_manage", label: "Manage Tasks", category: "Tasks" },
  {
    id: "evaluation_manage",
    label: "Manage Evaluations",
    category: "Evaluations",
  },
  { id: "meeting_schedule", label: "Schedule Meetings", category: "Meetings" },
  {
    id: "institution_manage",
    label: "Manage Institution",
    category: "Institution",
  },
];

const UserAccessControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STAFF":
        return "bg-purple-100 text-purple-800";
      case "PRINCIPAL_INVESTIGATOR":
        return "bg-blue-100 text-blue-800";
      case "RESEARCHER":
        return "bg-green-100 text-green-800";
      case "HOST_INSTITUTION":
        return "bg-orange-100 text-orange-800";
      case "COUNCIL_MEMBER":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const UserCard = ({ user }: { user: (typeof users)[0] }) => (
    <Card
      className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {user.name}
              </CardTitle>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className={getRoleColor(user.role)} variant="outline">
              {roles.find((r) => r.value === user.role)?.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Joined {user.joinDate}</span>
            </div>
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{user.projects} projects</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Last Login:</Label>
            <span className="ml-2 text-sm">{user.lastLogin}</span>
          </div>

          <div>
            <Label className="text-sm font-medium">Permissions:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.permissions.slice(0, 3).map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permissions.find((p) => p.id === permission)?.label}
                </Badge>
              ))}
              {user.permissions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{user.permissions.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedUser(user);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EditUserDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify user details and permissions for: {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={selectedUser?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={selectedUser?.email} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={selectedUser?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={selectedUser?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <Switch
                    id={permission.id}
                    defaultChecked={selectedUser?.permissions.includes(
                      permission.id
                    )}
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("User updated");
              setIsEditDialogOpen(false);
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const CreateUserDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the system</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input id="new-name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input id="new-email" placeholder="Enter email address" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-role">Role</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {role.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-phone">Phone</Label>
              <Input id="new-phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-location">Location</Label>
              <Input id="new-location" placeholder="Enter location" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("User created");
              setIsCreateDialogOpen(false);
            }}
          >
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Access Control
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            {users.filter((u) => u.status === "active").length} Active
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            {users.filter((u) => u.status === "pending").length} Pending
          </Badge>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No users found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Role management features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Permission management features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditUserDialog />
      <CreateUserDialog />
    </div>
  );
};

export default UserAccessControl;
