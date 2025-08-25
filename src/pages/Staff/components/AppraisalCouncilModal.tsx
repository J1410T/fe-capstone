import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useSearchAccounts, useAllRoles } from "@/hooks/queries/useAuth";
import {
  SelectedMember,
  AppraisalCouncilRoleType,
} from "@/types/appraisal-council";
import { SearchAccountResult } from "@/types/auth";
import { getAvailableRoles } from "@/utils/appraisal-council-roles";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_AVATAR =
  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";

interface AppraisalCouncilModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  councilData?: {
    id?: string;
    code: string;
    name: string;
    members: SelectedMember[];
  };
  onSave: (data: {
    code: string;
    name: string;
    members: SelectedMember[];
  }) => void;
  loading?: boolean;
}

export const AppraisalCouncilModal: React.FC<AppraisalCouncilModalProps> = ({
  open,
  onOpenChange,
  mode,
  councilData,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  // API hooks
  const { data: searchResults } = useSearchAccounts({
    input: searchInput,
    roleUser: "Appraisal Council",
  });
  const { data: allRoles } = useAllRoles();
  const { user } = useAuth();

  // Filter roles for Appraisal council, Chairman, and Secretary
  const appraisalCouncilRole = allRoles?.find(
    (role) => role.name === "Appraisal Council"
  );
  const chairmanRole = allRoles?.find((role) => role.name === "Chairman");
  const secretaryRole = allRoles?.find((role) => role.name === "Secretary");

  useEffect(() => {
    if (councilData) {
      setFormData({
        code: councilData.code,
        name: councilData.name,
      });
      setSelectedMembers(councilData.members || []);
    } else {
      setFormData({ code: "", name: "" });
      setSelectedMembers([]);
    }
  }, [councilData, open]);

  const handleAddMember = (account: SearchAccountResult) => {
    if (selectedMembers.find((m) => m["account-id"] === account.id)) {
      toast.error("Member already added");
      return;
    }

    if (!appraisalCouncilRole?.id) {
      toast.error("Appraisal council role not found. Please try again.");
      return;
    }

    // Determine default role based on current user's role and available roles
    const availableRoles = getAvailableRoles(selectedMembers, account.id);
    let defaultRole: AppraisalCouncilRoleType = "Appraisal Council";
    let defaultRoleId = appraisalCouncilRole.id;

    // If current user has Appraisal Council role, set that as default if available
    if (
      user?.role === "Appraisal Council" &&
      availableRoles.includes("Appraisal Council")
    ) {
      defaultRole = "Appraisal Council";
      defaultRoleId = appraisalCouncilRole.id;
    }
    // For other roles, default to Appraisal Council since Chairman/Secretary
    // are specific roles within the appraisal council context

    const newMember: SelectedMember = {
      id: "", // Will be set when creating UserRole
      "account-id": account.id,
      "full-name": account["full-name"],
      email: account.email || "",
      "avatar-url": account["avatar-url"] || null,
      "role-id": defaultRoleId,
      "role-name": defaultRole,
    };

    setSelectedMembers((prev) => [...prev, newMember]);
    setSearchInput(""); // Clear search
  };

  const handleRemoveMember = (accountId: string) => {
    if (mode === "edit") {
      // Show confirmation for edit mode
      setPendingAction(() => () => {
        setSelectedMembers((prev) =>
          prev.filter((m) => m["account-id"] !== accountId)
        );
      });
      setShowConfirmDialog(true);
    } else {
      // Direct removal for create mode
      setSelectedMembers((prev) =>
        prev.filter((m) => m["account-id"] !== accountId)
      );
    }
  };

  const handleRoleChange = (
    accountId: string,
    newRole: AppraisalCouncilRoleType
  ) => {
    const action = () => {
      // Get the appropriate role ID
      let roleId = appraisalCouncilRole?.id || "";
      if (newRole === "Chairman" && chairmanRole?.id) {
        roleId = chairmanRole.id;
      } else if (newRole === "Secretary" && secretaryRole?.id) {
        roleId = secretaryRole.id;
      }

      setSelectedMembers((prev) =>
        prev.map((member) => ({
          ...member,
          "role-id":
            member["account-id"] === accountId ? roleId : member["role-id"],
          "role-name":
            member["account-id"] === accountId ? newRole : member["role-name"],
        }))
      );
    };

    setPendingAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please add at least one member to the council");
      return;
    }

    // Validate that all members have valid role IDs
    const invalidMembers = selectedMembers.filter(
      (member) => !member["role-id"]
    );
    if (invalidMembers.length > 0) {
      toast.error(
        "Some members have invalid role assignments. Please try again."
      );
      return;
    }

    onSave({
      code: formData.code.trim(),
      name: formData.name.trim(),
      members: selectedMembers,
    });
  };

  const isReadOnly = mode === "view";
  const chairman = selectedMembers.find((m) => m["role-name"] === "Chairman");
  const secretary = selectedMembers.find((m) => m["role-name"] === "Secretary");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" && "Create Appraisal Council"}
              {mode === "edit" && "Edit Appraisal Council"}
              {mode === "view" && "View Appraisal Council"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  disabled={isReadOnly}
                  placeholder="Enter council code"
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={isReadOnly}
                  placeholder="Enter council name"
                />
              </div>
            </div>

            {/* Member Search */}
            {!isReadOnly && (
              <div>
                <Label>Add Members</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for members to add..."
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {searchResults && searchResults.length > 0 && searchInput && (
                  <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                    {searchResults.map((account) => (
                      <div
                        key={account.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleAddMember(account)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={account["avatar-url"] || DEFAULT_AVATAR}
                              alt={account["full-name"]}
                            />
                            <AvatarFallback>
                              {account["full-name"]
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {account["full-name"]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {account.email}
                            </p>
                          </div>
                          <UserPlus className="h-4 w-4 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Members */}
            <div>
              <Label>Members ({selectedMembers.length})</Label>
              {chairman && (
                <p className="text-sm text-muted-foreground mb-2">
                  Chairman: {chairman["full-name"]}
                </p>
              )}
              {secretary && (
                <p className="text-sm text-muted-foreground mb-2">
                  Secretary: {secretary["full-name"]}
                </p>
              )}

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedMembers.map((member) => (
                  <div
                    key={member["account-id"]}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={member["avatar-url"] || DEFAULT_AVATAR}
                          alt={member["full-name"]}
                        />
                        <AvatarFallback>
                          {member["full-name"]
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member["full-name"]}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          member["role-name"] === "Chairman"
                            ? "default"
                            : member["role-name"] === "Secretary"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member["role-name"]}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isReadOnly && (
                        <>
                          <Select
                            value={member["role-name"]}
                            onValueChange={(value: AppraisalCouncilRoleType) =>
                              handleRoleChange(member["account-id"], value)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableRoles(
                                selectedMembers,
                                member["account-id"]
                              ).map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveMember(member["account-id"])
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {selectedMembers.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No members added yet
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {!isReadOnly && (
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to proceed with this action?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                pendingAction();
                setShowConfirmDialog(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
