import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Download } from "lucide-react";
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
  type Transaction,
  type FormConfig,
  type FilterConfig,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  formatDate,
  formatVND,
  generateId,
} from "../shared";

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    projectId: "proj-1",
    projectTitle: "AI Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    amount: 600000000, // ~25K USD in VND
    type: "Payment",
    status: "Pending",
    description: "Q1 Milestone Payment",
    requestDate: "2024-01-15T00:00:00Z",
    notes: "Research funding for milestone completion",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "txn-2",
    projectId: "proj-2",
    projectTitle: "Sustainable Energy Storage",
    pi: "Dr. Michael Chen",
    amount: 360000000, // ~15K USD in VND
    type: "Payment",
    status: "Approved",
    description: "Laboratory Equipment Purchase",
    requestDate: "2024-01-12T00:00:00Z",
    processedDate: "2024-01-20T00:00:00Z",
    processedBy: "Admin User",
    notes: "Equipment procurement approved",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "txn-3",
    projectId: "proj-3",
    projectTitle: "Climate Change Study",
    pi: "Dr. Emily Rodriguez",
    amount: 204000000, // ~8.5K USD in VND
    type: "Payment",
    status: "Completed",
    description: "Conference Travel Expenses",
    requestDate: "2024-01-10T00:00:00Z",
    processedDate: "2024-01-18T00:00:00Z",
    processedBy: "Finance Team",
    notes: "Travel expenses processed",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "txn-4",
    projectId: "proj-4",
    projectTitle: "Marine Biology Research",
    pi: "Dr. James Wilson",
    amount: 1080000000, // ~45K USD in VND
    type: "Refund",
    status: "Rejected",
    description: "Research Assistant Salary",
    requestDate: "2024-01-08T00:00:00Z",
    notes: "Budget allocation issue",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "txn-5",
    projectId: "proj-5",
    projectTitle: "Quantum Computing Research",
    pi: "Dr. Lisa Park",
    amount: 840000000, // ~35K USD in VND
    type: "Adjustment",
    status: "Pending",
    description: "Budget adjustment for equipment",
    requestDate: "2024-01-20T00:00:00Z",
    notes: "Equipment cost adjustment needed",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: "",
    pi: "",
    amount: "",
    type: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    type: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "projectTitle",
        header: "Project",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("projectTitle")}</div>
            <div className="text-sm text-muted-foreground">
              PI: {row.original.pi}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <div className="font-medium">{formatVND(row.getValue("amount"))}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("type")} variant="type" size="sm" />
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
        accessorKey: "requestDate",
        header: "Request Date",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("requestDate"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const transaction = row.original;
          const actions = [
            createCommonActions.view(() => handleView(transaction)),
            createCommonActions.edit(() => handleEdit(transaction)),
          ];

          // Add approve/reject actions for pending transactions
          if (transaction.status === "Pending") {
            actions.push({
              label: "Approve",
              icon: undefined,
              onClick: () => handleApprove(transaction),
              variant: "default" as const,
            });
            actions.push({
              label: "Reject",
              icon: undefined,
              onClick: () => handleReject(transaction),
              variant: "destructive" as const,
              separator: true,
            });
          }

          actions.push(
            createCommonActions.delete(() => handleDelete(transaction))
          );

          return <ActionButtons actions={actions} />;
        },
      },
    ],
    []
  );

  // Form configuration
  const formConfig: FormConfig = {
    title: selectedTransaction ? "Edit Transaction" : "Create Transaction",
    description: selectedTransaction
      ? "Update transaction information"
      : "Add a new transaction to the system",
    fields: [
      {
        name: "projectTitle",
        label: "Project Title",
        type: "text",
        required: true,
        placeholder: "Enter project title",
      },
      {
        name: "pi",
        label: "Principal Investigator",
        type: "text",
        required: true,
        placeholder: "Enter PI name",
      },
      {
        name: "amount",
        label: "Amount (VND)",
        type: "number",
        required: true,
        placeholder: "Enter amount",
      },
      {
        name: "type",
        label: "Transaction Type",
        type: "select",
        required: true,
        placeholder: "Select transaction type",
        options: TRANSACTION_TYPES.map((type) => ({
          value: type.value,
          label: type.label,
        })),
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter transaction description",
      },
    ],
  };

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: TRANSACTION_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: TRANSACTION_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    },
  ];

  // Handler functions
  const handleCreate = () => {
    setSelectedTransaction(null);
    setFormData({
      projectTitle: "",
      pi: "",
      amount: "",
      type: "",
      description: "",
    });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    toast.info(`Viewing transaction for ${transaction.projectTitle}`);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      projectTitle: transaction.projectTitle,
      pi: transaction.pi,
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleApprove = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: "Approved" as const,
              processedDate: new Date().toISOString(),
              processedBy: "Current User",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    toast.success(
      `Transaction for ${transaction.projectTitle} has been approved`
    );
  };

  const handleReject = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: "Rejected" as const,
              processedDate: new Date().toISOString(),
              processedBy: "Current User",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    toast.success(
      `Transaction for ${transaction.projectTitle} has been rejected`
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.projectTitle.trim()) {
      errors.projectTitle = "Project title is required";
    }

    if (!formData.pi.trim()) {
      errors.pi = "Principal investigator is required";
    }

    if (!formData.amount.trim()) {
      errors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }

    if (!formData.type) {
      errors.type = "Transaction type is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
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
      if (selectedTransaction) {
        // Update existing transaction
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === selectedTransaction.id
              ? {
                  ...transaction,
                  projectTitle: formData.projectTitle,
                  pi: formData.pi,
                  amount: Number(formData.amount),
                  type: formData.type as Transaction["type"],
                  description: formData.description,
                  updatedAt: new Date().toISOString(),
                }
              : transaction
          )
        );
        toast.success("Transaction updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new transaction
        const newTransaction: Transaction = {
          id: generateId(),
          projectId: generateId(),
          projectTitle: formData.projectTitle,
          pi: formData.pi,
          amount: Number(formData.amount),
          type: formData.type as Transaction["type"],
          status: "Pending",
          description: formData.description,
          requestDate: new Date().toISOString(),
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTransactions((prev) => [...prev, newTransaction]);
        toast.success("Transaction created successfully");
        setIsCreateDialogOpen(false);
      }

      setSelectedTransaction(null);
      setFormData({
        projectTitle: "",
        pi: "",
        amount: "",
        type: "",
        description: "",
      });
      setFormErrors({});
    } catch {
      toast.error("An error occurred while saving the transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== selectedTransaction.id)
      );
      toast.success("Transaction deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch {
      toast.error("An error occurred while deleting the transaction");
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
    setFilterValues({ status: "all", type: "all" });
  };

  // Filter transactions based on current filter values
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const statusMatch =
        filterValues.status === "all" ||
        transaction.status === filterValues.status;
      const typeMatch =
        filterValues.type === "all" || transaction.type === filterValues.type;
      return statusMatch && typeMatch;
    });
  }, [transactions, filterValues]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions
      .filter((t) => t.status === "Pending")
      .reduce((sum, t) => sum + t.amount, 0);
    const approvedAmount = transactions
      .filter((t) => t.status === "Approved")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      total: totalAmount,
      pending: pendingAmount,
      approved: approvedAmount,
      count: transactions.length,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Transaction Management"
        description="Manage financial transactions and payment requests"
        badge={{
          text: `${transactions.length} transactions`,
          variant: "secondary",
        }}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => toast.info("Export functionality coming soon")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-2xl font-bold">{formatVND(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold">{formatVND(stats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Approved
                </p>
                <p className="text-2xl font-bold">
                  {formatVND(stats.approved)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Count
                </p>
                <p className="text-2xl font-bold">{stats.count}</p>
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

      {/* Transactions Table */}
      <DataTable
        data={filteredTransactions}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search transactions..."
        searchFields={["projectTitle", "pi", "description"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No transactions found. Get started by adding your first transaction."
      />

      {/* Form Dialog */}
      <FormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedTransaction(null);
            setFormData({
              projectTitle: "",
              pi: "",
              amount: "",
              type: "",
              description: "",
            });
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
          setSelectedTransaction(null);
          setFormData({
            projectTitle: "",
            pi: "",
            amount: "",
            type: "",
            description: "",
          });
          setFormErrors({});
        }}
        onChange={handleFormChange}
        mode={selectedTransaction ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Transaction"
        description={`Are you sure you want to delete the transaction for "${selectedTransaction?.projectTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default TransactionManagement;
