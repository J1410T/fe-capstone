import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  DataTable,
  ActionButtons,
  PageHeader,
  createCommonActions,
} from "../shared";
import { UserAccountWithRoles } from "@/types/auth";
import { useUsersWithRoles } from "@/hooks/queries/useAuth";
import UserManagementModal from "./UserManagementModal";

const DEFAULT_IMAGE_URL =
  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";

const UsersManagement: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fullname");
  const [sortDesc, setSortDesc] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserAccountWithRoles | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  // Reset to first page when search term changes
  useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, sortBy, sortDesc]);

  // API query
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useUsersWithRoles({
    "full-name": searchTerm,
    "sort-by": sortBy,
    desc: sortDesc,
    "page-index": pageIndex,
    "page-size": pageSize,
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<UserAccountWithRoles>[]>(
    () => [
      {
        accessorKey: "full-name",
        header: "Full Name",
        cell: ({ row }) => {
          const user = row.original;
          const avatarUrl = user["avatar-url"] || DEFAULT_IMAGE_URL;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={avatarUrl}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGE_URL;
                  }}
                />
                <AvatarFallback>
                  {user["full-name"]
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user["full-name"]}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            {row.getValue("email")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusColor =
            status === "created"
              ? "green"
              : status === "deleted"
              ? "red"
              : "yellow";
          return (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full bg-${statusColor}-500`} />
              <span className="text-sm capitalize">{status}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "UserRole",
        header: "Role Name",
        cell: ({ row }) => {
          const roles = row.getValue("UserRole") as Array<{ name: string }>;
          return (
            <div className="text-sm">
              {roles && roles.length > 0 ? (
                roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md mr-1 mb-1 font-medium"
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No roles</span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <ActionButtons
              actions={[createCommonActions.edit(() => handleUpdate(user))]}
              variant="inline"
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
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleUpdate = (user: UserAccountWithRoles) => {
    setSelectedUser(user);
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    refetch();
    toast.success("Operation completed successfully");
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(1); // Reset to first page when page size changes
  };

  // Get users data - handle different possible API response formats
  const users = usersData?.["data-list"] || [];

  // Try different possible field names for total count
  const totalCount =
    usersData?.["total-count"] ||
    ((usersData as unknown as Record<string, unknown>)?.total as number) ||
    ((usersData as unknown as Record<string, unknown>)?.totalCount as number) ||
    0;

  // Try different possible field names for total pages
  const totalPages =
    usersData?.["total-page"] ||
    ((usersData as unknown as Record<string, unknown>)?.pages as number) ||
    ((usersData as unknown as Record<string, unknown>)?.totalPages as number) ||
    Math.ceil(totalCount / pageSize) ||
    0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Users Management"
        description="Manage user accounts, roles, and permissions"
        badge={{ text: `${totalCount} users`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        }
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by full name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullname">Full Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="create-time">Created Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortDesc(!sortDesc)}
                className="px-3"
              >
                {sortDesc ? "↓" : "↑"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={columns}
        searchable={false}
        pagination={false}
        emptyMessage="No users found. Get started by adding your first user."
        loading={isLoading}
      />

      {/* Server-side Pagination - Always show when there are users */}
      {users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4  rounded-lg bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {(pageIndex - 1) * pageSize + 1} to{" "}
              {Math.min(pageIndex * pageSize, totalCount)} of {totalCount} users
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 1}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pageIndex <= 3) {
                    pageNum = i + 1;
                  } else if (pageIndex >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pageIndex - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageIndex === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      <UserManagementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default UsersManagement;
