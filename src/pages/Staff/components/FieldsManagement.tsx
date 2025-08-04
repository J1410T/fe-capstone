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
import { FieldItem } from "@/types/field";
import {
  useFieldList,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/hooks/queries/field";
import { useMajorsByField } from "@/hooks/queries/major";

const MajorCount: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const { data, isLoading, error } = useMajorsByField(fieldId);

  if (isLoading) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  if (error) {
    const isNotFound =
      error instanceof Error &&
      (error.message.includes("404") ||
        error.message.includes("not found") ||
        (error as unknown as { status?: number }).status === 404);

    return (
      <StatusBadge
        status={isNotFound ? "0 majors" : "Error"}
        variant="type"
        size="sm"
      />
    );
  }

  const count = Array.isArray(data) ? data.length : 0;
  return (
    <StatusBadge
      status={`${count} ${count === 1 ? "major" : "majors"}`}
      variant="type"
      size="sm"
    />
  );
};

const FieldsManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: fields = [], isLoading, error } = useFieldList();
  const createFieldMutation = useCreateField();
  const updateFieldMutation = useUpdateField();
  const deleteFieldMutation = useDeleteField();

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(field)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(field)}
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

  const handleCreate = () => {
    setSelectedField(null);
    setFormData({ name: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (field: FieldItem) => {
    setSelectedField(field);
    setFormData({ name: field.name });
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
    if (!validateForm()) return;

    try {
      if (selectedField) {
        await updateFieldMutation.mutateAsync({
          id: selectedField.id,
          data: { name: formData.name },
        });
        toast.success("Field updated successfully");
        setIsEditDialogOpen(false);
      } else {
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

      <DataTable
        data={fields}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Search fields..."
        searchFields={["name"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No fields found. Get started by adding your first field."
      />

      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
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

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Field"
        description={`Are you sure you want to delete "${selectedField?.name}"? This action cannot be undone.`}
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
