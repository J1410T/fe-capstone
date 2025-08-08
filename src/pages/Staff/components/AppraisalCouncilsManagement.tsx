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
  formatDate,
} from "../shared";
import { AppraisalCouncilModal } from "./AppraisalCouncilModal";
import {
  useCreateUserRole,
  useDeleteUserRole,
  useUpdateUserRole,
} from "@/hooks/queries/useAuth";
import {
  AppraisalCouncilWithMembers,
  SelectedMember,
  AppraisalCouncilListRequest,
} from "@/types/appraisal-council";
import { UserRole } from "@/types/auth";
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
  const updateUserRoleMutation = useUpdateUserRole();

  // Enhanced councils data with member information
  const enhancedCouncils = useMemo(() => {
    if (!councilsResponse?.["data-list"]) return [];

    return councilsResponse["data-list"].map(
      (council: AppraisalCouncilWithMembers) => ({
        ...council,
        memberCount: council.member?.length || 0,
        president:
          council.member?.find((m: UserRole) => m.name === "Chairman")?.[
            "full-name"
          ] || "Not assigned",
        // Ensure member array is properly typed
        member: council.member || [],
      })
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
        accessorKey: "created-at",
        header: "Created At",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("created-at"))}
          </div>
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

  // Modal save handler
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

        // Create user roles for members with better error handling
        const memberCreationPromises = data.members.map(async (member) => {
          try {
            return await createUserRoleMutation.mutateAsync({
              "account-id": member["account-id"],
              "role-id": member["role-id"],
              "appraisal-council-id": newCouncilId,
              status: "Approved",
            });
          } catch (error) {
            console.error(
              `Failed to create role for member ${member["full-name"]}:`,
              error
            );
            throw new Error(`Failed to add member ${member["full-name"]}`);
          }
        });

        await Promise.all(memberCreationPromises);
        toast.success("Appraisal Council created successfully");
      } else if (modalMode === "edit" && selectedCouncil) {
        // Update council basic information
        await updateCouncilMutation.mutateAsync({
          id: selectedCouncil.id,
          code: data.code,
          name: data.name,
          status: selectedCouncil.status,
        });

        // Get existing members for comparison
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

        // Add new members
        if (membersToAdd.length > 0) {
          const addMemberPromises = membersToAdd.map(async (member) => {
            try {
              return await createUserRoleMutation.mutateAsync({
                "account-id": member["account-id"],
                "role-id": member["role-id"],
                "appraisal-council-id": selectedCouncil.id,
                status: "Approved",
              });
            } catch (error) {
              console.error(
                `Failed to add member ${member["full-name"]}:`,
                error
              );
              // Don't throw here to allow partial success
              return null;
            }
          });

          await Promise.allSettled(addMemberPromises);
        }

        // Remove members that are no longer in the list
        if (membersToRemove.length > 0) {
          const removeMemberPromises = membersToRemove.map(async (member) => {
            try {
              return await deleteUserRoleMutation.mutateAsync(member.id);
            } catch (error) {
              console.error(
                `Failed to remove member ${member["full-name"]}:`,
                error
              );
              // Don't throw here to allow partial success
              return null;
            }
          });

          await Promise.allSettled(removeMemberPromises);
        }

        // Update existing members (for role changes like chairman assignment)
        const membersToUpdate = data.members.filter((newMember) => {
          const existingMember = existingMembers.find(
            (existing) => existing["account-id"] === newMember["account-id"]
          );
          return (
            existingMember && existingMember["role-id"] !== newMember["role-id"]
          );
        });

        if (membersToUpdate.length > 0) {
          const updateMemberPromises = membersToUpdate.map(async (member) => {
            const existingMember = existingMembers.find(
              (existing) => existing["account-id"] === member["account-id"]
            );
            if (!existingMember) return null;

            try {
              return await updateUserRoleMutation.mutateAsync({
                userRoleId: existingMember.id,
                status: "Approved",
                request: {
                  "account-id": member["account-id"],
                  "role-id": member["role-id"],
                  "project-id": null,
                  "appraisal-council-id": selectedCouncil.id,
                },
              });
            } catch (error) {
              console.error(
                `Failed to update member ${member["full-name"]}:`,
                error
              );
              // Don't throw here to allow partial success
              return null;
            }
          });

          await Promise.allSettled(updateMemberPromises);
        }

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
                members:
                  selectedCouncil.member?.map((m) => ({
                    id: m.id || "",
                    "account-id": m["account-id"],
                    "full-name": m["full-name"],
                    email: m.email || "",
                    "avatar-url": m["avatar-url"] || null,
                    isChairman: m.name === "Chairman",
                    "role-id": m["role-id"],
                  })) || [],
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
