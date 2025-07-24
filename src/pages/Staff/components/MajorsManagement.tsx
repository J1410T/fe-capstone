import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  StatusBadge,
  PageHeader,
  FormDialog,
  ConfirmDialog,
  type FormConfig,
} from "../shared";
import { MajorItem } from "@/types/major";
import {
  useMajorsWithPagination,
  useCreateMajor,
  useUpdateMajor,
  useDeleteMajor,
} from "@/hooks/queries/major";
import { useFieldList } from "@/hooks/queries/field";

const MajorsManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<MajorItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fieldId: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch all majors with a large page size to get all data at once
  const {
    data: majorsResponse,
    isLoading: majorsLoading,
    error: majorsError,
  } = useMajorsWithPagination({
    "page-index": 0,
    "page-size": 1000, // Large page size to get all majors
  });

  const { data: fields = [], isLoading: fieldsLoading } = useFieldList();
  const createMajorMutation = useCreateMajor();
  const updateMajorMutation = useUpdateMajor();
  const deleteMajorMutation = useDeleteMajor();

  // Extract majors data from the response
  const majors = majorsResponse?.["data-list"] || [];
  const totalCount = majorsResponse?.["total-count"] || 0;

  // Table columns definition
  const columns = useMemo<ColumnDef<MajorItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Major Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "field.name",
        header: "Field",
        cell: ({ row }) => {
          const field = row.original.field;
          return field ? (
            <StatusBadge status={field.name} variant="type" size="sm" />
          ) : (
            <span className="text-muted-foreground">No field</span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const major = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(major)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(major)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Form configuration
  const formConfig: FormConfig = {
    title: selectedMajor ? "Edit Major" : "Create Major",
    description: selectedMajor
      ? "Update major information"
      : "Add a new major to the system",
    fields: [
      {
        name: "name",
        label: "Major Name",
        type: "text",
        required: true,
        placeholder: "Enter major name",
      },
      {
        name: "fieldId",
        label: "Field",
        type: "select",
        required: true,
        placeholder: "Select a field",
        options: fields.map((field) => ({
          value: field.id,
          label: field.name,
        })),
      },
    ],
  };

  // Handler functions
  const handleCreate = () => {
    setSelectedMajor(null);
    setFormData({ name: "", fieldId: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (major: MajorItem) => {
    setSelectedMajor(major);
    setFormData({
      name: major.name,
      fieldId: major.field?.id || "",
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (major: MajorItem) => {
    setSelectedMajor(major);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Major name is required";
    }

    if (!formData.fieldId) {
      errors.fieldId = "Field selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (selectedMajor) {
        // Update existing major
        await updateMajorMutation.mutateAsync({
          id: selectedMajor.id,
          data: {
            name: formData.name,
            "field-id": formData.fieldId,
          },
        });
        toast.success("Major updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new major
        await createMajorMutation.mutateAsync({
          name: formData.name,
          "field-id": formData.fieldId,
        });
        toast.success("Major created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedMajor(null);
      setFormData({ name: "", fieldId: "" });
      setFormErrors({});
    } catch (error) {
      toast.error("An error occurred while saving the major");
      console.error("Form submit error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMajor) return;

    try {
      await deleteMajorMutation.mutateAsync(selectedMajor.id);
      toast.success("Major deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedMajor(null);
    } catch (error) {
      toast.error("An error occurred while deleting the major");
      console.error("Delete error:", error);
    }
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value as string }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedMajor(null);
    setFormData({ name: "", fieldId: "" });
    setFormErrors({});
  };

  const isSubmitting =
    createMajorMutation.isPending ||
    updateMajorMutation.isPending ||
    deleteMajorMutation.isPending;

  const isLoading = majorsLoading || fieldsLoading;

  if (majorsError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Majors Management"
          description="Manage academic majors and their field associations"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading majors:{" "}
              {majorsError instanceof Error
                ? majorsError.message
                : "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Majors Management"
        description="Manage academic majors and their field associations"
        badge={{ text: `${totalCount} majors`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Major
          </Button>
        }
      />

      {/* Majors Table */}
      <DataTable
        data={majors}
        columns={columns}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search majors..."
        searchFields={["name", "field.name"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No majors found. Get started by adding your first major."
      />

      {/* Form Dialog */}
      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          }
        }}
        config={formConfig}
        data={formData}
        errors={formErrors}
        loading={isSubmitting}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseDialog}
        onChange={handleFormChange}
        mode={selectedMajor ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Major"
        description={`Are you sure you want to delete "${selectedMajor?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedMajor(null);
        }}
      />
    </div>
  );
};

export default MajorsManagement;
