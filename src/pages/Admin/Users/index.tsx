import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";
import { UserTable, UserFilters, AddUserDialog } from "./components";

// Sample user data
const sampleUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: UserRole.PRINCIPAL_INVESTIGATOR,
    status: "Active",
    lastActive: "2023-06-15T10:30:00",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: UserRole.MEMBER,
    status: "Active",
    lastActive: "2023-06-14T14:45:00",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: UserRole.APPRAISAL_COUNCIL,
    status: "Active",
    lastActive: "2023-06-13T09:15:00",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: UserRole.HOST_INSTITUTION,
    status: "Inactive",
    lastActive: "2023-05-20T11:30:00",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: UserRole.STAFF,
    status: "Active",
    lastActive: "2023-06-15T08:00:00",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    role: UserRole.MEMBER,
    status: "Pending",
    lastActive: "2023-06-10T16:20:00",
  },
  {
    id: "7",
    name: "David Miller",
    email: "david.miller@example.com",
    role: UserRole.PRINCIPAL_INVESTIGATOR,
    status: "Active",
    lastActive: "2023-06-12T13:10:00",
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    role: UserRole.APPRAISAL_COUNCIL,
    status: "Active",
    lastActive: "2023-06-11T10:45:00",
  },
];

/**
 * User Management page for admin
 */
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
<<<<<<< HEAD
    role: "" as UserRole | "",
=======
    role: "",
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
    status: "Active",
  });

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
<<<<<<< HEAD

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

=======
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle adding a new user
  const handleAddUser = () => {
<<<<<<< HEAD
    if (!newUser.role) return; // Don't add user without role

=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
    const newUserWithId = {
      ...newUser,
      id: (users.length + 1).toString(),
      lastActive: new Date().toISOString(),
<<<<<<< HEAD
      role: newUser.role as UserRole,
    };

=======
    };
    
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
    setUsers([...users, newUserWithId]);
    setNewUser({
      name: "",
      email: "",
<<<<<<< HEAD
      role: "" as UserRole | "",
=======
      role: "",
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
      status: "Active",
    });
    setIsAddUserDialogOpen(false);
  };

  // Handle new user form changes
  const handleNewUserChange = (field: keyof typeof newUser, value: string) => {
    setNewUser({
      ...newUser,
      [field]: value,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Placeholder handlers for user actions
  const handleEditUser = (user: any) => {
    console.log("Edit user:", user);
    // Implement edit user functionality
  };

  const handleChangeRole = (user: any) => {
    console.log("Change role for user:", user);
    // Implement change role functionality
  };

  const handleResetPassword = (user: any) => {
    console.log("Reset password for user:", user);
    // Implement reset password functionality
  };

  const handleToggleStatus = (user: any) => {
    console.log("Toggle status for user:", user);
    // Implement toggle status functionality
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: u.status === "Active" ? "Inactive" : "Active",
        };
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Search and filters */}
            <UserFilters
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onRoleFilterChange={setRoleFilter}
              onStatusFilterChange={setStatusFilter}
              onResetFilters={handleResetFilters}
            />

            {/* Users table */}
            <UserTable
              users={filteredUsers}
              onEditUser={handleEditUser}
              onChangeRole={handleChangeRole}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        newUser={newUser}
        onNewUserChange={handleNewUserChange}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;
