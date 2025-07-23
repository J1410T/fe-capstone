import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  type Field,
  type FormConfig,
  type FilterConfig,
  GENERAL_STATUSES,
  formatDate,
  generateId,
} from "../shared";

// Mock data for fields
const mockFields: Field[] = [
  {
    id: "5676c6a2-2b5f-4eaa-90cd-3f3d2f3145d1",
    name: "Engineering & Technology",
    description: "Engineering and Technology fields",
    status: "Active",
    majorCount: 15,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
    name: "Information Technology",
    description: "Information Technology fields",
    status: "Active",
    majorCount: 12,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "d0320c47-6f01-4e98-bcc0-96f3cb95730e",
    name: "Medical & Pharmaceutical Sciences",
    description: "Medical and Pharmaceutical Sciences fields",
    status: "Active",
    majorCount: 8,
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z",
  },
  {
    id: "cf080a69-8860-4751-91f2-c320c767dfb2",
    name: "Social Sciences & Humanities",
    description: "Social Sciences and Humanities fields",
    status: "Active",
    majorCount: 10,
    createdAt: "2024-01-18T11:45:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
  },
  {
    id: "23011a33-a656-45e0-b128-f6a03b0c3aa1",
    name: "Economics & Management",
    description: "Economics and Management fields",
    status: "Active",
    majorCount: 7,
    createdAt: "2024-01-19T16:30:00Z",
    updatedAt: "2024-01-19T16:30:00Z",
  },
];

const FieldsManagement: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<Field>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Field Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground max-w-xs truncate">
            {row.getValue("description")}
          </div>
        ),
      },
      {
        accessorKey: "majorCount",
        header: "Majors",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.getValue("majorCount")} majors
          </div>
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
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("createdAt"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const field = row.original;
          return (
            <ActionButtons
              actions={[
                createCommonActions.view(() => handleView(field)),
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
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter field description",
      },
    ],
  };

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: GENERAL_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    },
  ];

  // Handler functions
  const handleCreate = () => {
    setSelectedField(null);
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleView = (field: Field) => {
    setSelectedField(field);
    // For view, we could open a detailed view dialog or navigate to a detail page
    toast.info(`Viewing ${field.name}`);
  };

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setFormData({
      name: field.name,
      description: field.description,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (field: Field) => {
    setSelectedField(field);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Field name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Field description is required";
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
      if (selectedField) {
        // Update existing field
        setFields((prev) =>
          prev.map((field) =>
            field.id === selectedField.id
              ? {
                  ...field,
                  name: formData.name,
                  description: formData.description,
                  updatedAt: new Date().toISOString(),
                }
              : field
          )
        );
        toast.success("Field updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new field
        const newField: Field = {
          id: generateId(),
          name: formData.name,
          description: formData.description,
          status: "Active",
          majorCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFields((prev) => [...prev, newField]);
        toast.success("Field created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedField(null);
      setFormData({ name: "", description: "" });
      setFormErrors({});
    } catch {
      toast.error("An error occurred while saving the field");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedField) return;

    setIsSubmitting(true);
    try {
      setFields((prev) =>
        prev.filter((field) => field.id !== selectedField.id)
      );
      toast.success("Field deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedField(null);
    } catch {
      toast.error("An error occurred while deleting the field");
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
    setFilterValues({ status: "all" });
  };

  // Filter fields based on current filter values
  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const statusMatch =
        filterValues.status === "all" || field.status === filterValues.status;
      return statusMatch;
    });
  }, [fields, filterValues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Fields Management"
        description="Manage academic fields and their associated majors"
        badge={{ text: `${fields.length} fields`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
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

      {/* Fields Table */}
      <DataTable
        data={filteredFields}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search fields..."
        searchFields={["name", "description"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No fields found. Get started by adding your first field."
      />

      {/* Form Dialog */}
      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedField(null);
            setFormData({ name: "", description: "" });
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
          setSelectedField(null);
          setFormData({ name: "", description: "" });
          setFormErrors({});
        }}
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
