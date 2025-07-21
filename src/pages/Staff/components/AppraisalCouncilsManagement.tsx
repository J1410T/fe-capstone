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
  FormDialog,
  ConfirmDialog,
  FilterBar,
  createCommonActions,
  type AppraisalCouncil,
  type FormConfig,
  type FilterConfig,
  COUNCIL_STATUSES,
  formatDate,
  generateId,
} from "../shared";

// Mock data for appraisal councils
const mockCouncils: AppraisalCouncil[] = [
  {
    id: "council-1",
    name: "AI Research Council",
    description:
      "Council for evaluating AI and machine learning research projects",
    status: "Active",
    chairperson: "Dr. Sarah Johnson",
    members: [
      {
        id: "member-1",
        userId: "user-1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Chairman",
        joinedAt: "2023-01-15T00:00:00Z",
      },
      {
        id: "member-2",
        userId: "user-2",
        name: "Dr. Michael Chen",
        email: "michael.chen@university.edu",
        role: "Member",
        joinedAt: "2023-01-20T00:00:00Z",
      },
      {
        id: "member-3",
        userId: "user-3",
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        role: "Secretary",
        joinedAt: "2023-01-25T00:00:00Z",
      },
    ],
    projectsAssigned: 5,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "council-2",
    name: "Biomedical Research Council",
    description:
      "Council for evaluating biomedical and healthcare research projects",
    status: "Active",
    chairperson: "Dr. James Wilson",
    members: [
      {
        id: "member-4",
        userId: "user-4",
        name: "Dr. James Wilson",
        email: "james.wilson@university.edu",
        role: "Chairman",
        joinedAt: "2023-02-01T00:00:00Z",
      },
      {
        id: "member-5",
        userId: "user-5",
        name: "Dr. Lisa Park",
        email: "lisa.park@university.edu",
        role: "Member",
        joinedAt: "2023-02-05T00:00:00Z",
      },
    ],
    projectsAssigned: 3,
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "council-3",
    name: "Environmental Science Council",
    description:
      "Council for evaluating environmental and sustainability research projects",
    status: "Inactive",
    chairperson: "Dr. Robert Brown",
    members: [
      {
        id: "member-6",
        userId: "user-6",
        name: "Dr. Robert Brown",
        email: "robert.brown@university.edu",
        role: "Chairman",
        joinedAt: "2023-03-01T00:00:00Z",
      },
    ],
    projectsAssigned: 1,
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-12-01T00:00:00Z",
  },
];

const AppraisalCouncilsManagement: React.FC = () => {
  const [councils, setCouncils] = useState<AppraisalCouncil[]>(mockCouncils);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCouncil, setSelectedCouncil] =
    useState<AppraisalCouncil | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    chairperson: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<AppraisalCouncil>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Council Name",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.description}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "chairperson",
        header: "Chairperson",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("chairperson")}</div>
        ),
      },
      {
        accessorKey: "members",
        header: "Members",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{row.original.members.length}</span>
          </div>
        ),
      },
      {
        accessorKey: "projectsAssigned",
        header: "Projects",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("projectsAssigned")}</div>
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
          const council = row.original;
          const actions = [
            createCommonActions.view(() => handleView(council)),
            createCommonActions.edit(() => handleEdit(council)),
          ];

          // Add activate/deactivate actions based on status
          if (council.status === "Active") {
            actions.push({
              label: "Deactivate",
              icon: undefined,
              onClick: () => handleDeactivate(council),
              variant: "destructive" as const,
            });
          } else if (council.status === "Inactive") {
            actions.push({
              label: "Activate",
              icon: undefined,
              onClick: () => handleActivate(council),
              variant: "default" as const,
            });
          }

          actions.push(createCommonActions.delete(() => handleDelete(council)));

          return <ActionButtons actions={actions} />;
        },
      },
    ],
    []
  );

  // Handler functions
  const handleCreate = () => {
    setSelectedCouncil(null);
    setFormData({ name: "", description: "", chairperson: "" });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleView = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    toast.info(`Viewing ${council.name}`);
  };

  const handleEdit = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setFormData({
      name: council.name,
      description: council.description,
      chairperson: council.chairperson,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setIsDeleteDialogOpen(true);
  };

  const handleActivate = (council: AppraisalCouncil) => {
    setCouncils((prev) =>
      prev.map((c) =>
        c.id === council.id
          ? {
              ...c,
              status: "Active" as const,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    toast.success(`${council.name} has been activated`);
  };

  const handleDeactivate = (council: AppraisalCouncil) => {
    setCouncils((prev) =>
      prev.map((c) =>
        c.id === council.id
          ? {
              ...c,
              status: "Inactive" as const,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    toast.success(`${council.name} has been deactivated`);
  };

  // Form configuration
  const formConfig: FormConfig = {
    title: selectedCouncil ? "Edit Council" : "Create Council",
    description: selectedCouncil
      ? "Update council information"
      : "Add a new appraisal council to the system",
    fields: [
      {
        name: "name",
        label: "Council Name",
        type: "text",
        required: true,
        placeholder: "Enter council name",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter council description",
      },
      {
        name: "chairperson",
        label: "Chairperson",
        type: "text",
        required: true,
        placeholder: "Enter chairperson name",
      },
    ],
  };

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: COUNCIL_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    },
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Council name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.chairperson.trim()) {
      errors.chairperson = "Chairperson is required";
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
      if (selectedCouncil) {
        // Update existing council
        setCouncils((prev) =>
          prev.map((council) =>
            council.id === selectedCouncil.id
              ? {
                  ...council,
                  name: formData.name,
                  description: formData.description,
                  chairperson: formData.chairperson,
                  updatedAt: new Date().toISOString(),
                }
              : council
          )
        );
        toast.success("Council updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new council
        const newCouncil: AppraisalCouncil = {
          id: generateId(),
          name: formData.name,
          description: formData.description,
          status: "Active",
          chairperson: formData.chairperson,
          members: [],
          projectsAssigned: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCouncils((prev) => [...prev, newCouncil]);
        toast.success("Council created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedCouncil(null);
      setFormData({ name: "", description: "", chairperson: "" });
      setFormErrors({});
    } catch {
      toast.error("An error occurred while saving the council");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCouncil) return;

    setIsSubmitting(true);
    try {
      setCouncils((prev) =>
        prev.filter((council) => council.id !== selectedCouncil.id)
      );
      toast.success("Council deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCouncil(null);
    } catch {
      toast.error("An error occurred while deleting the council");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // Filter councils based on current filter values
  const filteredCouncils = useMemo(() => {
    return councils.filter((council) => {
      const statusMatch =
        filterValues.status === "all" || council.status === filterValues.status;
      return statusMatch;
    });
  }, [councils, filterValues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Appraisal Councils Management"
        description="Manage appraisal councils and their members"
        badge={{ text: `${councils.length} councils`, variant: "secondary" }}
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
                  {councils.filter((c) => c.status === "Active").length}
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
                  {councils.reduce((sum, c) => sum + c.members.length, 0)}
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
                  Projects Assigned
                </p>
                <p className="text-2xl font-bold">
                  {councils.reduce((sum, c) => sum + c.projectsAssigned, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Councils Table */}
      <DataTable
        data={filteredCouncils}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search councils..."
        searchFields={["name", "description", "chairperson"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No councils found. Get started by adding your first council."
      />

      {/* Form Dialog */}
      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedCouncil(null);
            setFormData({ name: "", description: "", chairperson: "" });
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
          setSelectedCouncil(null);
          setFormData({ name: "", description: "", chairperson: "" });
          setFormErrors({});
        }}
        onChange={handleFormChange}
        mode={selectedCouncil ? "edit" : "create"}
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
        loading={isSubmitting}
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
