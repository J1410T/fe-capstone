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
  type Major,
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
    name: "Information Technology",
    description: "Information Technology fields",
    status: "Active",
    majorCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "d0320c47-6f01-4e98-bcc0-96f3cb95730e",
    name: "Medical & Pharmaceutical Sciences",
    description: "Medical and Pharmaceutical Sciences fields",
    status: "Active",
    majorCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cf080a69-8860-4751-91f2-c320c767dfb2",
    name: "Social Sciences & Humanities",
    description: "Social Sciences and Humanities fields",
    status: "Active",
    majorCount: 10,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "23011a33-a656-45e0-b128-f6a03b0c3aa1",
    name: "Economics & Management",
    description: "Economics and Management fields",
    status: "Active",
    majorCount: 7,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock data for majors
const mockMajors: Major[] = [
  {
    id: "818cb649-49ac-4920-a2fe-57d3b9f62217",
    name: "Accounting",
    fieldId: "23011a33-a656-45e0-b128-f6a03b0c3aa1",
    field: mockFields.find(
      (f) => f.id === "23011a33-a656-45e0-b128-f6a03b0c3aa1"
    )!,
    status: "Active",
    studentCount: 120,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "57027f18-9e31-40e6-8df7-633bed2a0131",
    name: "Artificial Intelligence",
    fieldId: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
    field: mockFields.find(
      (f) => f.id === "b0686776-c61c-44d2-a17a-8c05fc6fd7f6"
    )!,
    status: "Active",
    studentCount: 85,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "1762ef71-ae65-4ef6-8614-12cadbb2e5a7",
    name: "Automation Engineering",
    fieldId: "5676c6a2-2b5f-4eaa-90cd-3f3d2f3145d1",
    field: mockFields.find(
      (f) => f.id === "5676c6a2-2b5f-4eaa-90cd-3f3d2f3145d1"
    )!,
    status: "Active",
    studentCount: 95,
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z",
  },
];

const MajorsManagement: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>(mockMajors);
  const [fields] = useState<Field[]>(mockFields);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fieldId: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    field: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<Major>[]>(
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
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.field.name}
            variant="type"
            size="sm"
          />
        ),
      },
      {
        accessorKey: "studentCount",
        header: "Students",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.getValue("studentCount")}
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
          const major = row.original;
          return (
            <ActionButtons
              actions={[
                createCommonActions.view(() => handleView(major)),
                createCommonActions.edit(() => handleEdit(major)),
                createCommonActions.delete(() => handleDelete(major)),
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
    {
      key: "field",
      label: "Field",
      type: "select",
      options: fields.map((field) => ({
        value: field.id,
        label: field.name,
      })),
    },
  ];

  // Handler functions
  const handleCreate = () => {
    setSelectedMajor(null);
    setFormData({ name: "", fieldId: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleView = (major: Major) => {
    setSelectedMajor(major);
    // For view, we could open a detailed view dialog or navigate to a detail page
    toast.info(`Viewing ${major.name}`);
  };

  const handleEdit = (major: Major) => {
    setSelectedMajor(major);
    setFormData({
      name: major.name,
      fieldId: major.fieldId,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (major: Major) => {
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

    setIsSubmitting(true);

    try {
      const selectedField = fields.find((f) => f.id === formData.fieldId)!;

      if (selectedMajor) {
        // Update existing major
        setMajors((prev) =>
          prev.map((major) =>
            major.id === selectedMajor.id
              ? {
                  ...major,
                  name: formData.name,
                  fieldId: formData.fieldId,
                  field: selectedField,
                  updatedAt: new Date().toISOString(),
                }
              : major
          )
        );
        toast.success("Major updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new major
        const newMajor: Major = {
          id: generateId(),
          name: formData.name,
          fieldId: formData.fieldId,
          field: selectedField,
          status: "Active",
          studentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMajors((prev) => [...prev, newMajor]);
        toast.success("Major created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedMajor(null);
      setFormData({ name: "", fieldId: "" });
      setFormErrors({});
    } catch {
      toast.error("An error occurred while saving the major");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedMajor) {
      setMajors((prev) =>
        prev.filter((major) => major.id !== selectedMajor.id)
      );
      toast.success("Major deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedMajor(null);
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
    setFilterValues({ status: "all", field: "all" });
  };

  // Filter majors based on current filter values
  const filteredMajors = useMemo(() => {
    return majors.filter((major) => {
      const statusMatch =
        filterValues.status === "all" || major.status === filterValues.status;
      const fieldMatch =
        filterValues.field === "all" || major.fieldId === filterValues.field;
      return statusMatch && fieldMatch;
    });
  }, [majors, filterValues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Majors Management"
        description="Manage academic majors and their field associations"
        badge={{ text: `${majors.length} majors`, variant: "secondary" }}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Major
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

      {/* Majors Table */}
      <DataTable
        data={filteredMajors}
        columns={columns}
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
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedMajor(null);
            setFormData({ name: "", fieldId: "" });
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
          setSelectedMajor(null);
          setFormData({ name: "", fieldId: "" });
          setFormErrors({});
        }}
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
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedMajor(null);
        }}
      />
    </div>
  );
};

export default MajorsManagement;
