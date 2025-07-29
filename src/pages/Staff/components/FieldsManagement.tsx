import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  ActionButtons,
  PageHeader,
  FormDialog,
  ConfirmDialog,
  createCommonActions,
  type FormConfig,
} from "../shared";
import { FieldItem } from "@/types/field";
import {
  useFieldList,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/hooks/queries/field";
import { useMajorsByField } from "@/hooks/queries/major";
import { Loading } from "@/components/ui/loaders";

// Component to handle major count for individual field
// Fixed MajorCount component with better error handling
const MajorCount: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const { data, isLoading, error } = useMajorsByField(fieldId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loading className="w-full max-w-xs scale-75" />
      </div>
    );
  }

  if (error) {
    const isNotFound =
      error instanceof Error &&
      (error.message.includes("404") ||
        error.message.includes("not found") ||
        (error as unknown as { status?: number }).status === 404);

    if (isNotFound) {
      return <div className="text-center font-medium">0 majors</div>;
    }

    return <div className="text-center text-muted-foreground">Error</div>;
  }

  // Handle the case where data might not be an array or might be undefined
  const majors = Array.isArray(data) ? data : [];
  const majorCount = majors.length;

  return (
    <div className="text-center font-medium">
      {majorCount} {majorCount === 1 ? "major" : "majors"}
    </div>
  );
};

const FieldsManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Queries and mutations
  const { data: fields = [], isLoading, error } = useFieldList();
  const createFieldMutation = useCreateField();
  const updateFieldMutation = useUpdateField();
  const deleteFieldMutation = useDeleteField();

  // Table columns definition
  const columns = useMemo<ColumnDef<FieldItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Field Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        id: "majorCount",
        header: "Majors",
        cell: ({ row }) => {
          const field = row.original;
          return <MajorCount fieldId={field.id} />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const field = row.original;
          return (
            <ActionButtons
              actions={[
                createCommonActions.edit(() => handleEdit(field)),
                createCommonActions.delete(() => handleDelete(field)),
              ]}
            />
          );
        },
      },
    ],
    []
  );

  // Form configuration
  const formConfig: FormConfig = {
    title: selectedField ? "Edit Field" : "Create Field",
    description: selectedField
      ? "Update field information"
      : "Add a new field to the system",
    fields: [
      {
        name: "name",
        label: "Field Name",
        type: "text",
        required: true,
        placeholder: "Enter field name",
      },
    ],
  };

  // Handler functions
  const handleCreate = () => {
    setSelectedField(null);
    setFormData({ name: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (field: FieldItem) => {
    setSelectedField(field);
    setFormData({
      name: field.name,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (field: FieldItem) => {
    setSelectedField(field);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Field name is required";
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
      if (selectedField) {
        // Update existing field
        await updateFieldMutation.mutateAsync({
          id: selectedField.id,
          data: { name: formData.name },
        });
        toast.success("Field updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new field
        await createFieldMutation.mutateAsync({ name: formData.name });
        toast.success("Field created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedField(null);
      setFormData({ name: "" });
      setFormErrors({});
    } catch (error) {
      toast.error("An error occurred while saving the field");
      console.error("Form submit error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedField) return;

    try {
      await deleteFieldMutation.mutateAsync(selectedField.id);
      toast.success("Field deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedField(null);
    } catch (error) {
      toast.error("An error occurred while deleting the field");
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
    setSelectedField(null);
    setFormData({ name: "" });
    setFormErrors({});
  };

  const isSubmitting =
    createFieldMutation.isPending ||
    updateFieldMutation.isPending ||
    deleteFieldMutation.isPending;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Fields Management"
          description="Manage academic fields and their associated majors"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading fields:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
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
        title="Fields Management"
        description="Manage academic fields and their associated majors"
        badge={{ text: `${fields.length} fields`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        }
      />

      {/* Fields Table */}
      <DataTable
        data={fields}
        columns={columns}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search fields..."
        searchFields={["name"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No fields found. Get started by adding your first field."
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
        mode={selectedField ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Field"
        description={`Are you sure you want to delete "${selectedField?.name}"? This action cannot be undone and will affect all associated majors.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedField(null);
        }}
      />
    </div>
  );
};

export default FieldsManagement;
