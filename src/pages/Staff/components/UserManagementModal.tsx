import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Settings } from "lucide-react";
import { toast } from "sonner";
import { UserAccountWithRoles } from "@/types/auth";
import {
  useCreateUser,
  useCreateUserRole,
  useUpdateUserStatus,
  useAllRoles,
} from "@/hooks/queries/useAuth";
import { ConfirmDialog } from "../shared";

interface UserManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  user?: UserAccountWithRoles | null;
  onSuccess?: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  open,
  onOpenChange,
  mode,
  user,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("role");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: "",
    status: "created" as "created" | "deleted",
  });
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Query hooks
  const { data: allRoles } = useAllRoles();
  const createUserMutation = useCreateUser();
  const createUserRoleMutation = useCreateUserRole();
  const updateUserStatusMutation = useUpdateUserStatus();

  // Valid role names
  const validRoleNames = React.useMemo(
    () => [
      "Researcher",
      "Principal Investigator",
      "Staff",
      "Appraisal Council",
      "Host Institution",
    ],
    []
  );

  // Filter roles to only show valid ones
  const validRoles = React.useMemo(
    () => allRoles?.filter((role) => validRoleNames.includes(role.name)) || [],
    [allRoles, validRoleNames]
  );

  // For update mode, filter out roles that user already has
  const availableRoles =
    mode === "update" && user
      ? validRoles.filter(
          (role) =>
            !user.UserRole?.some((userRole) => userRole["role-id"] === role.id)
        )
      : validRoles;

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (open) {
      if (mode === "create") {
        setFormData({
          fullName: "",
          email: "",
          password: "12345", // Set default password to 12345
          roleId: validRoles.find((r) => r.name === "Researcher")?.id || "",
          status: "created",
        });
      } else if (mode === "update" && user) {
        setFormData({
          fullName: user["full-name"],
          email: user.email,
          password: "",
          roleId: "",
          status: user.status === "pending" ? "created" : user.status,
        });
        setActiveTab("role");
      }
    }
  }, [open, mode, user, validRoles]);

  const handleCreate = async () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.roleId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // First create the user account
      const userResponse = await createUserMutation.mutateAsync({
        "full-name": formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Then create the user role if user creation was successful
      if (
        userResponse &&
        typeof userResponse === "object" &&
        "id" in userResponse
      ) {
        await createUserRoleMutation.mutateAsync({
          "account-id": (userResponse as { id: string }).id,
          "role-id": formData.roleId,
          status: "Approved",
        });
      }

      toast.success("User created successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Create user error:", error);
    }
  };

  const handleAddRole = async () => {
    if (!selectedRoleId || !user) {
      toast.error("Please select a role");
      return;
    }

    try {
      await createUserRoleMutation.mutateAsync({
        "account-id": user.id,
        "role-id": selectedRoleId,
        status: "Approved",
      });

      toast.success("Role added successfully");
      setShowRoleConfirm(false);
      setSelectedRoleId("");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add role");
      console.error("Add role error:", error);
    }
  };

  const handleChangeStatus = async () => {
    if (!user) return;

    try {
      await updateUserStatusMutation.mutateAsync(user.id);

      toast.success(`User status toggled successfully`);
      setShowStatusConfirm(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to change user status");
      console.error("Change status error:", error);
    }
  };

  const isLoading =
    createUserMutation.isPending ||
    createUserRoleMutation.isPending ||
    updateUserStatusMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {mode === "create" ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create User</span>
                </>
              ) : (
                <>
                  <Settings className="w-5 h-5" />
                  <span>Update User</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Create a new user account with a role"
                : "Update user roles and status"}
            </DialogDescription>
          </DialogHeader>

          {mode === "create" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, roleId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {validRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="role">Role</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              <TabsContent value="role" className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Role</Label>
                  <Select
                    value={selectedRoleId}
                    onValueChange={setSelectedRoleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => setShowRoleConfirm(true)}
                  disabled={!selectedRoleId || isLoading}
                  className="w-full"
                >
                  Add Role
                </Button>
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                <Button
                  onClick={() => setShowStatusConfirm(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  Change Status
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {mode === "create" && (
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Role Confirmation Dialog */}
      <ConfirmDialog
        open={showRoleConfirm}
        onOpenChange={setShowRoleConfirm}
        title="Add Role"
        description={`Are you sure you want to add the role "${
          availableRoles.find((r) => r.id === selectedRoleId)?.name
        }" to this user?`}
        confirmLabel="Add Role"
        cancelLabel="Cancel"
        loading={isLoading}
        onConfirm={handleAddRole}
        onCancel={() => setShowRoleConfirm(false)}
      />

      {/* Status Confirmation Dialog */}
      <ConfirmDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        title="Change Status"
        description={`Are you sure you want to change this user's status?`}
        confirmLabel="Change Status"
        cancelLabel="Cancel"
        loading={isLoading}
        onConfirm={handleChangeStatus}
        onCancel={() => setShowStatusConfirm(false)}
      />
    </>
  );
};

export default UserManagementModal;
