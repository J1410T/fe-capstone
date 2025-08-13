import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  PageHeader,
  ConfirmDialog,
  createCommonActions,
} from "../shared";
import { AppraisalCouncilModal } from "./AppraisalCouncilModal";
import {
  useCreateUserRole,
  useDeleteUserRole,
  useAllRoles,
} from "@/hooks/queries/useAuth";
import {
  AppraisalCouncilWithMembers,
  SelectedMember,
  AppraisalCouncilListRequest,
  MemberRoleUpdate,
} from "@/types/appraisal-council";
import { UserRole } from "@/types/auth";
import {
  filterMembersForDisplay,
  convertUserRoleToSelectedMember,
  determineRoleActions,
} from "@/utils/appraisal-council-roles";
import {
  useAppraisalCouncilsList,
  useCreateAppraisalCouncil,
  useDeleteAppraisalCouncil,
  useUpdateAppraisalCouncil,
} from "@/hooks/queries/appraisal-council.ts";

const AppraisalCouncilsManagement: React.FC = () => {
  // State management
  const [selectedCouncil, setSelectedCouncil] =
    useState<AppraisalCouncilWithMembers | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterValues] = useState<Record<string, string>>({
    status: "all",
  });

  // API request for councils list
  const listRequest: AppraisalCouncilListRequest = {
    "key-word": searchKeyword,
    "page-index": currentPage,
    "page-size": pageSize,
  };

  // API hooks
  const { data: councilsResponse, isLoading } =
    useAppraisalCouncilsList(listRequest);
  const createCouncilMutation = useCreateAppraisalCouncil();
  const updateCouncilMutation = useUpdateAppraisalCouncil();
  const deleteCouncilMutation = useDeleteAppraisalCouncil();
  const createUserRoleMutation = useCreateUserRole();
  const deleteUserRoleMutation = useDeleteUserRole();

  // Additional hooks for role management
  const { data: allRoles } = useAllRoles();

  // Enhanced councils data with member information
  const enhancedCouncils = useMemo(() => {
    if (!councilsResponse?.["data-list"]) return [];

    return councilsResponse["data-list"].map(
      (council: AppraisalCouncilWithMembers) => {
        // Filter members for display to handle duplicates
        const filteredMembers = council.member
          ? filterMembersForDisplay(council.member)
          : [];

        return {
          ...council,
          memberCount: filteredMembers.length,
          president:
            filteredMembers.find((m: UserRole) => m.name === "Chairman")?.[
              "full-name"
            ] || "Not assigned",
          // Ensure member array is properly typed with filtered members
          member: filteredMembers,
        };
      }
    );
  }, [councilsResponse]);

  // Table columns definition
  const columns = useMemo<ColumnDef<AppraisalCouncilWithMembers>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("code")}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <StatusBadge
              status={status === "created" ? "Active" : "Inactive"}
              size="sm"
            />
          );
        },
      },
      {
        accessorKey: "memberCount",
        header: "Members",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{row.original.memberCount || 0}</span>
          </div>
        ),
      },
      {
        accessorKey: "president",
        header: "Chairman",
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.president || "Not assigned"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const council = row.original;
          const actions = [
            createCommonActions.view(() => handleView(council)),
            createCommonActions.edit(() => handleEdit(council)),
            createCommonActions.delete(() => handleDelete(council)),
          ];

          return <ActionButtons actions={actions} variant="inline" />;
        },
      },
    ],
    []
  );

  // Handler functions
  const handleCreate = () => {
    setSelectedCouncil(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (council: AppraisalCouncilWithMembers) => {
    setSelectedCouncil(council);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (council: AppraisalCouncilWithMembers) => {
    setSelectedCouncil(council);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (council: AppraisalCouncilWithMembers) => {
    setSelectedCouncil(council);
    setIsDeleteDialogOpen(true);
  };

  // Helper function to execute role actions
  const executeRoleActions = async (
    actions: MemberRoleUpdate[],
    appraisalCouncilId: string
  ) => {
    const results = [];

    for (const action of actions) {
      try {
        if (action.action === "create") {
          const result = await createUserRoleMutation.mutateAsync({
            "account-id": action.accountId,
            "role-id": action.roleId,
            "appraisal-council-id": appraisalCouncilId,
            status: "Approved",
          });
          results.push(result);
        } else if (action.action === "delete" && action.userRoleId) {
          await deleteUserRoleMutation.mutateAsync(action.userRoleId);
        }
      } catch (error) {
        console.error(
          `Failed to ${action.action} role ${action.roleName} for account ${action.accountId}:`,
          error
        );
        throw error;
      }
    }

    return results;
  };

  // Modal save handler with complex role management
  const handleModalSave = async (data: {
    code: string;
    name: string;
    members: SelectedMember[];
  }) => {
    try {
      if (modalMode === "create") {
        // Create council
        const newCouncilId = await createCouncilMutation.mutateAsync({
          code: data.code,
          name: data.name,
          status: "created",
        });

        // For create mode, we need to handle role creation based on selected roles
        const roleActions: MemberRoleUpdate[] = [];

        for (const member of data.members) {
          if (!allRoles) {
            throw new Error("Roles not loaded");
          }

          // Always create Appraisal Council role first
          const appraisalCouncilRole = allRoles.find(
            (r) => r.name === "Appraisal Council"
          );
          if (appraisalCouncilRole) {
            roleActions.push({
              action: "create",
              accountId: member["account-id"],
              roleId: appraisalCouncilRole.id,
              roleName: "Appraisal Council",
            });
          }

          // Create additional role if Chairman or Secretary
          if (member["role-name"] === "Chairman") {
            const chairmanRole = allRoles.find((r) => r.name === "Chairman");
            if (chairmanRole) {
              roleActions.push({
                action: "create",
                accountId: member["account-id"],
                roleId: chairmanRole.id,
                roleName: "Chairman",
              });
            }
          } else if (member["role-name"] === "Secretary") {
            const secretaryRole = allRoles.find((r) => r.name === "Secretary");
            if (secretaryRole) {
              roleActions.push({
                action: "create",
                accountId: member["account-id"],
                roleId: secretaryRole.id,
                roleName: "Secretary",
              });
            }
          }
        }

        await executeRoleActions(roleActions, newCouncilId);
        toast.success("Appraisal Council created successfully");
      } else if (modalMode === "edit" && selectedCouncil) {
        // Update council basic information
        await updateCouncilMutation.mutateAsync({
          id: selectedCouncil.id,
          code: data.code,
          name: data.name,
          status: selectedCouncil.status,
        });

        if (!allRoles) {
          throw new Error("Roles not loaded");
        }

        // Complex role management for edit mode
        const existingMembers = selectedCouncil.member || [];
        const existingMemberIds = new Set(
          existingMembers.map((m) => m["account-id"])
        );
        const newMemberIds = new Set(data.members.map((m) => m["account-id"]));

        // Find members to add (new members not in existing)
        const membersToAdd = data.members.filter(
          (member) => !existingMemberIds.has(member["account-id"])
        );

        // Find members to remove (existing members not in new list)
        const membersToRemove = existingMembers.filter(
          (member) => !newMemberIds.has(member["account-id"])
        );

        // Find members whose roles might have changed
        const membersToUpdate = data.members.filter((member) =>
          existingMemberIds.has(member["account-id"])
        );

        const allRoleActions: MemberRoleUpdate[] = [];

        // Handle new members
        for (const member of membersToAdd) {
          // Always create Appraisal Council role first
          const appraisalCouncilRole = allRoles.find(
            (r) => r.name === "Appraisal Council"
          );
          if (appraisalCouncilRole) {
            allRoleActions.push({
              action: "create",
              accountId: member["account-id"],
              roleId: appraisalCouncilRole.id,
              roleName: "Appraisal Council",
            });
          }

          // Create additional role if Chairman or Secretary
          if (member["role-name"] === "Chairman") {
            const chairmanRole = allRoles.find((r) => r.name === "Chairman");
            if (chairmanRole) {
              allRoleActions.push({
                action: "create",
                accountId: member["account-id"],
                roleId: chairmanRole.id,
                roleName: "Chairman",
              });
            }
          } else if (member["role-name"] === "Secretary") {
            const secretaryRole = allRoles.find((r) => r.name === "Secretary");
            if (secretaryRole) {
              allRoleActions.push({
                action: "create",
                accountId: member["account-id"],
                roleId: secretaryRole.id,
                roleName: "Secretary",
              });
            }
          }
        }

        // Handle removed members
        for (const member of membersToRemove) {
          const memberRoles = existingMembers.filter(
            (m) => m["account-id"] === member["account-id"]
          );
          for (const role of memberRoles) {
            allRoleActions.push({
              action: "delete",
              accountId: member["account-id"],
              roleId: role["role-id"],
              roleName: role.name as
                | "Appraisal Council"
                | "Chairman"
                | "Secretary",
              userRoleId: role.id,
            });
          }
        }

        // Handle role updates for existing members
        for (const newMember of membersToUpdate) {
          const existingMemberRoles = existingMembers.filter(
            (m) => m["account-id"] === newMember["account-id"]
          );

          // Use the role management utility to determine actions
          const actions = determineRoleActions(
            newMember["account-id"],
            newMember["role-name"],
            existingMemberRoles,
            selectedCouncil.id,
            allRoles
          );

          allRoleActions.push(...actions);
        }

        // Execute all role actions
        await executeRoleActions(allRoleActions, selectedCouncil.id);
        toast.success("Appraisal Council updated successfully");
      }

      setIsModalOpen(false);
      setSelectedCouncil(null);
    } catch (error) {
      console.error("Failed to save council:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { status: number; data?: unknown };
        };
        if (axiosError.response?.status === 409) {
          toast.error("Conflict: Member role already exists or duplicate data");
        } else if (axiosError.response?.status === 400) {
          toast.error("Invalid data: Please check all required fields");
        } else {
          toast.error("Failed to save council");
        }
      } else {
        toast.error("Failed to save council");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCouncil) return;

    try {
      await deleteCouncilMutation.mutateAsync(selectedCouncil.id);
      setIsDeleteDialogOpen(false);
      setSelectedCouncil(null);
    } catch (error) {
      console.error("Failed to delete council:", error);
      toast.error("Failed to delete council");
    }
  };

  // Filter councils based on current filter values
  const filteredCouncils = useMemo(() => {
    if (!enhancedCouncils) return [];

    return enhancedCouncils.filter((council: AppraisalCouncilWithMembers) => {
      const statusMatch =
        filterValues.status === "all" || council.status === filterValues.status;
      return statusMatch;
    });
  }, [enhancedCouncils, filterValues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Appraisal Councils Management"
        description="Manage appraisal councils and their members"
        badge={{
          text: `${councilsResponse?.["total-count"] || 0} councils`,
          variant: "secondary",
        }}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Council
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Councils
                </p>
                <p className="text-2xl font-bold">
                  {
                    filteredCouncils.filter(
                      (c: AppraisalCouncilWithMembers) => c.status === "created"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Members
                </p>
                <p className="text-2xl font-bold">
                  {filteredCouncils.reduce(
                    (sum: number, c: AppraisalCouncilWithMembers) =>
                      sum + (c.memberCount || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Councils
                </p>
                <p className="text-2xl font-bold">
                  {councilsResponse?.["total-count"] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Councils Table */}
      <DataTable
        data={filteredCouncils}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search councils..."
        searchFields={["name", "code"]}
        globalFilter={searchKeyword}
        onGlobalFilterChange={setSearchKeyword}
        emptyMessage="No councils found. Get started by adding your first council."
        loading={isLoading}
      />

      {/* Appraisal Council Modal */}
      <AppraisalCouncilModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        councilData={
          selectedCouncil
            ? {
                id: selectedCouncil.id,
                code: selectedCouncil.code,
                name: selectedCouncil.name,
                members: selectedCouncil.member
                  ? filterMembersForDisplay(selectedCouncil.member).map((m) =>
                      convertUserRoleToSelectedMember(m)
                    )
                  : [],
              }
            : undefined
        }
        onSave={handleModalSave}
        loading={
          createCouncilMutation.isPending || updateCouncilMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Council"
        description={`Are you sure you want to delete "${selectedCouncil?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={deleteCouncilMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCouncil(null);
        }}
      />
    </div>
  );
};

export default AppraisalCouncilsManagement;
