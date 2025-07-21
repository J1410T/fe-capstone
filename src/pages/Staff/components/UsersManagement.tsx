import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

// Mock data
const users = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
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
  { value: "STAFF", label: "Staff",  },
  {
    value: "PRINCIPAL_INVESTIGATOR",
    label: "Principal Investigator",
  },
  {
    value: "RESEARCHER",
    label: "Researcher",
  },
  {
    value: "HOST_INSTITUTION",
    label: "Host Institution",
  },
  {
    value: "COUNCIL_MEMBER",
    label: "Council Member",
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
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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

  // Filter users based on role, status and search
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesSearch =
        user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase());      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, globalFilter]);

  // Handler functions
  const handleViewDetails = useCallback((user: (typeof users)[0]) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: (typeof users)[0]) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<(typeof users)[0]>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={row.original.avatar} />
              <AvatarFallback>
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{row.getValue("name")}</div>
              <div className="text-sm text-muted-foreground flex items-center min-w-0">
                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{row.original.email}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          const roleInfo = roles.find(r => r.value === role);
          return (
            <Badge className={getRoleColor(role)}>
              {roleInfo?.label || role}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Contact",
        cell: ({ row }) => (
          <div className="flex items-center min-w-0">
            <Phone className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="text-sm truncate">{row.getValue("phone")}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">View</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditUser(row.original)}
              className="h-8 px-2"
            >
              <Edit className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 h-8 px-2"
            >
              <Trash2 className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails, handleEditUser]
  );

  // Create table instance
  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const user = row.original;
      const searchString = `${user.name} ${user.email} ${user.role}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });



  const UserDetailDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about the user
          </DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback className="text-lg">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-muted-foreground">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getRoleColor(selectedUser.role)}>
                    {roles.find(r => r.value === selectedUser.role)?.label || selectedUser.role}
                  </Badge>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{selectedUser.phone}</span>
                </div>
              </div>
              
              <div>
                <Label>Joined Date</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <Label>Last Login</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{new Date(selectedUser.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {selectedUser.permissions.map((permissionId) => {
                  const permission = permissions.find(p => p.id === permissionId);
                  return permission ? (
                    <div key={permissionId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{permission.label}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          <Button onClick={() => {
            setIsViewDialogOpen(false);
            setIsEditDialogOpen(true);
          }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Access Control
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            {users.filter((u) => u.status === "active").length} Active
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            {users.filter((u) => u.status === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            {users.filter((u) => u.status === "inactive").length} Inactive
          </Badge>
          <Button onClick={handleCreateUser}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
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
          </div>
        </CardContent>
      </Card>

      {/* Clean Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`font-semibold text-gray-900 py-3 px-3 text-left bg-gray-50/50 ${
                        index === 0 ? 'w-[35%]' : // User (name + email)
                        index === 1 ? 'w-[15%]' : // Role
                        index === 2 ? 'w-[10%]' : // Status
                        index === 3 ? 'w-[15%]' : // Contact
                        'w-[25%]' // Actions
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-sky-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 px-3 text-gray-900 ${
                        index === 0 ? 'w-[35%]' : // User
                        index === 1 ? 'w-[15%]' : // Role
                        index === 2 ? 'w-[10%]' : // Status
                        index === 3 ? 'w-[15%]' : // Contact
                        'w-[25%]' // Actions
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Users className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "Get started by adding your first user"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>

        {/* Clean Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-gray-50/30 border-t border-gray-200 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
                const pageIndex = Math.max(0, Math.min(
                  table.getState().pagination.pageIndex - 2 + i,
                  table.getPageCount() - 1
                ));
                return (
                  <Button
                    key={pageIndex}
                    variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`h-8 w-8 p-0 ${
                      table.getState().pagination.pageIndex === pageIndex
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pageIndex + 1}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <UserDetailDialog />
      <EditUserDialog />
      <CreateUserDialog />
    </div>
  );
};

export default UserAccessControl;
