import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  PageHeader,
  FormDialog,
  ConfirmDialog,
  FilterBar,
  createCommonActions,
  type StaffUser,
  type FormConfig,
  type FilterConfig,
  USER_STATUSES,
  USER_ROLES,
  DEPARTMENTS,
  formatDate,
  generateId,
} from "../shared";

// Mock data
const mockUsers: StaffUser[] = [
  {
    id: "user-1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "Admin",
    department: "Research",
    status: "Active",
    lastLogin: "2024-01-15T10:30:00Z",
    permissions: ["users:create", "users:edit", "users:delete"],
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    name: "Dr. Michael Chen",
    email: "michael.chen@university.edu",
    role: "Staff",
    department: "Academic Affairs",
    status: "Active",
    lastLogin: "2024-01-14T15:45:00Z",
    permissions: ["fields:view", "majors:view"],
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "user-3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    role: "Staff",
    department: "Finance",
    status: "Inactive",
    lastLogin: "2023-12-20T09:15:00Z",
    permissions: ["transactions:view"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "user-4",
    name: "Dr. James Wilson",
    email: "james.wilson@university.edu",
    role: "Super Admin",
    department: "Administration",
    status: "Active",
    lastLogin: "2024-01-16T08:00:00Z",
    permissions: ["*"],
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2024-01-16T08:00:00Z",
  },
  {
    id: "user-5",
    name: "Dr. Lisa Park",
    email: "lisa.park@university.edu",
    role: "Staff",
    department: "IT",
    status: "Suspended",
    lastLogin: "2023-11-30T14:20:00Z",
    permissions: [],
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2023-12-01T00:00:00Z",
  },
];

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<StaffUser[]>(mockUsers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    role: "all",
    department: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<StaffUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/avatars/${user.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.jpg`}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("role")} variant="type" size="sm" />
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("department")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} size="sm" />
        ),
      },
      {
        accessorKey: "lastLogin",
        header: "Last Login",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("lastLogin")
              ? formatDate(row.getValue("lastLogin"))
              : "Never"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <ActionButtons
              actions={[
                createCommonActions.view(() => handleView(user)),
                createCommonActions.edit(() => handleEdit(user)),
                user.status === "Active"
                  ? createCommonActions.suspend(() => handleSuspend(user))
                  : createCommonActions.activate(() => handleActivate(user)),
                createCommonActions.delete(() => handleDelete(user)),
              ]}
            />
          );
        },
      },
    ],
    []
  );

  // Handler functions
  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "", department: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleView = (user: StaffUser) => {
    setSelectedUser(user);
    toast.info(`Viewing ${user.name}`);
  };

  const handleEdit = (user: StaffUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: StaffUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleActivate = (user: StaffUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: "Active" as const } : u
      )
    );
    toast.success(`${user.name} has been activated`);
  };

  const handleSuspend = (user: StaffUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: "Suspended" as const } : u
      )
    );
    toast.success(`${user.name} has been suspended`);
  };

  // Form configuration
  const formConfig: FormConfig = {
    title: selectedUser ? "Edit User" : "Create User",
    description: selectedUser
      ? "Update user information"
      : "Add a new user to the system",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter full name",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "Enter email address",
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        placeholder: "Select a role",
        options: USER_ROLES.map((role) => ({
          value: role.value,
          label: role.label,
        })),
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        required: true,
        placeholder: "Select a department",
        options: DEPARTMENTS.map((dept) => ({
          value: dept.value,
          label: dept.label,
        })),
      },
    ],
  };

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: USER_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: USER_ROLES.map((role) => ({
        value: role.value,
        label: role.label,
      })),
    },
    {
      key: "department",
      label: "Department",
      type: "select",
      options: DEPARTMENTS.map((dept) => ({
        value: dept.value,
        label: dept.label,
      })),
    },
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      errors.role = "Role selection is required";
    }

    if (!formData.department) {
      errors.department = "Department selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedUser) {
        // Update existing user
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  name: formData.name,
                  email: formData.email,
                  role: formData.role as StaffUser["role"],
                  department: formData.department,
                  updatedAt: new Date().toISOString(),
                }
              : user
          )
        );
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new user
        const newUser: StaffUser = {
          id: generateId(),
          name: formData.name,
          email: formData.email,
          role: formData.role as StaffUser["role"],
          department: formData.department,
          status: "Active",
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newUser]);
        toast.success("User created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedUser(null);
      setFormData({ name: "", email: "", role: "", department: "" });
      setFormErrors({});
    } catch {
      toast.error("An error occurred while saving the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("An error occurred while deleting the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value as string }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({ status: "all", role: "all", department: "all" });
  };

  // Filter users based on current filter values
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const statusMatch =
        filterValues.status === "all" || user.status === filterValues.status;
      const roleMatch =
        filterValues.role === "all" || user.role === filterValues.role;
      const departmentMatch =
        filterValues.department === "all" ||
        user.department === filterValues.department;
      return statusMatch && roleMatch && departmentMatch;
    });
  }, [users, filterValues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Users Management"
        description="Manage user accounts, roles, and permissions"
        badge={{ text: `${users.length} users`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <FilterBar
            filters={filterConfig}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search users..."
        searchFields={["name", "email", "role", "department"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No users found. Get started by adding your first user."
      />

      {/* Form Dialog */}
      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedUser(null);
            setFormData({ name: "", email: "", role: "", department: "" });
            setFormErrors({});
          }
        }}
        config={formConfig}
        data={formData}
        errors={formErrors}
        loading={isSubmitting}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedUser(null);
          setFormData({ name: "", email: "", role: "", department: "" });
          setFormErrors({});
        }}
        onChange={handleFormChange}
        mode={selectedUser ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UsersManagement;
