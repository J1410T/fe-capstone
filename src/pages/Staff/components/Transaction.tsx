import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  CreditCard,
} from "lucide-react";
import {
  DataTable,
  StatusBadge,
  PageHeader,
  FormDialog,
  ConfirmDialog,
} from "../shared";
import {
  TransactionDetail,
  TransactionListRequest,
  TransactionPerson,
  TransactionProject,
} from "@/types/transaction";
import {
  useDeleteTransaction,
  useTransactionList,
  useUpdateTransaction,
} from "@/hooks/queries/transaction";

const DEFAULT_IMAGE_URL =
  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";

// Helper component for user avatar display
const UserAvatar: React.FC<{
  person: TransactionPerson | null;
  size?: string;
}> = ({ person, size = "h-7 w-7" }) => {
  if (!person) return <span className="text-muted-foreground">-</span>;

  const avatarUrl = person["avatar-url"] || DEFAULT_IMAGE_URL;
  const fullName = person["full-name"] || "";

  return (
    <div className="flex items-center space-x-2 min-w-0">
      <Avatar className={`${size} flex-shrink-0`}>
        <AvatarImage
          src={avatarUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_IMAGE_URL;
          }}
        />
        <AvatarFallback className="text-xs">
          {fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span
        className="font-medium text-sm truncate max-w-[80px]"
        title={fullName}
      >
        {fullName}
      </span>
    </div>
  );
};

// Define transaction status tabs
const TRANSACTION_TABS = [
  { value: "pending", label: "Pending Approval", status: "pending" },
  { value: "awaiting", label: "Awaiting Confirmation", status: "approved" },
  { value: "disputed", label: "Disputed", status: "disputed" },
  { value: "completed", label: "Completed", status: "completed" },
  { value: "rejected", label: "Rejected / Cancelled", status: "rejected" },
] as const;

const TransactionManagement: React.FC = () => {
  // State for tabs and filtering
  const [activeTab, setActiveTab] = useState("pending");

  // State for search and pagination
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState(0); // 0 = RequestDate, 2 = Title
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // State for modals and forms
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmSaveDialogOpen, setIsConfirmSaveDialogOpen] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    "receiver-account": "",
    "receiver-name": "",
    "receiver-bank-name": "",
    title: "",
    type: "",
    "fee-cost": 0,
    "total-money": 0,
    "pay-method": "transfer",
    status: "",
    "project-id": "",
    "evaluation-stage-id": "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // API request parameters
  const transactionRequest: TransactionListRequest = {
    "key-word": searchKeyword,
    "sort-by": sortBy,
    "page-index": currentPage,
    "page-size": pageSize,
  };

  // API hooks
  const { data: transactionData, isLoading } = useTransactionList(
    transactionRequest,
    { enableClientEnrichment: true }
  );
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  // Table columns definition
  const columns = useMemo<ColumnDef<TransactionDetail>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Transaction Code",
        cell: ({ row }) => (
          <div className="font-mono text-sm font-medium">
            {row.getValue("code")}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div
            className="font-medium max-w-[150px] truncate"
            title={row.getValue("title") as string}
          >
            {row.getValue("title")}
          </div>
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
        accessorKey: "total-money",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.getValue("total-money") as number;
          return (
            <div className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{amount.toLocaleString()} VND</span>
            </div>
          );
        },
      },
      {
        accessorKey: "pay-method",
        header: "Payment Method",
        cell: ({ row }) => {
          const method = row.getValue("pay-method") as string;
          const displayMethod =
            method === "transfer" ? "Bank Transfer" : method;
          return (
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm capitalize">{displayMethod}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "request-date",
        header: "Request Date",
        cell: ({ row }) => {
          const date = row.getValue("request-date") as string;
          return (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "request-person",
        header: "Requester",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <UserAvatar person={row.getValue("request-person")} />
          </div>
        ),
      },
      {
        accessorKey: "receiver-name",
        header: "Receiver",
        cell: ({ row }) => {
          const receiverName = row.getValue("receiver-name") as string;
          const receiverAccount = row.original["receiver-account"];
          const receiverBank = row.original["receiver-bank-name"];

          return (
            <div className="min-w-[150px]">
              <div className="font-medium text-sm">{receiverName}</div>
              <div className="text-xs text-muted-foreground">
                {receiverAccount} - {receiverBank}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "project",
        header: "Project",
        cell: ({ row }) => {
          const project = row.getValue("project") as TransactionProject | null;
          return project ? (
            <span
              className="text-sm font-medium max-w-[150px] truncate block"
              title={project["english-title"]}
            >
              {project["english-title"]}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} size="sm" />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex items-center gap-1 min-w-[140px]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(transaction)}
                className="px-2 h-8"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline ml-1">View</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(transaction)}
                className="px-2 h-8"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden lg:inline ml-1">Edit</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(transaction)}
                className="px-2 h-8"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden lg:inline ml-1">Delete</span>
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Handler functions
  const handleView = (transaction: TransactionDetail) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (transaction: TransactionDetail) => {
    setSelectedTransaction(transaction);
    setFormData({
      "receiver-account": transaction["receiver-account"],
      "receiver-name": transaction["receiver-name"],
      "receiver-bank-name": transaction["receiver-bank-name"],
      title: transaction.title,
      type: transaction.type,
      "fee-cost": transaction["fee-cost"],
      "total-money": transaction["total-money"],
      "pay-method": transaction["pay-method"],
      status: transaction.status,
      "project-id": transaction["project-id"] || "",
      "evaluation-stage-id": transaction["evaluation-stage-id"] || "",
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: TransactionDetail) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData["receiver-account"].trim()) {
      errors["receiver-account"] = "Receiver account is required";
    }

    if (!formData["receiver-name"].trim()) {
      errors["receiver-name"] = "Receiver name is required";
    }

    if (!formData["receiver-bank-name"].trim()) {
      errors["receiver-bank-name"] = "Receiver bank name is required";
    }

    if (!formData.type) {
      errors.type = "Transaction type is required";
    }

    if (!formData["pay-method"]) {
      errors["pay-method"] = "Payment method is required";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    // Validate Total Money >= 0
    if (formData["total-money"] < 0) {
      errors["total-money"] = "Total money must be greater than or equal to 0";
    }

    // Validate Fee Cost >= 0
    if (formData["fee-cost"] < 0) {
      errors["fee-cost"] = "Fee cost must be greater than or equal to 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedTransaction) {
      return;
    }

    // Show confirmation dialog before saving
    setIsConfirmSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    setIsConfirmSaveDialogOpen(false);

    try {
      await updateTransactionMutation.mutateAsync({
        id: selectedTransaction.id,
        "receiver-account": formData["receiver-account"],
        "receiver-name": formData["receiver-name"],
        "receiver-bank-name": formData["receiver-bank-name"],
        title: formData.title,
        type: formData.type,
        "fee-cost": formData["fee-cost"],
        "total-money": formData["total-money"],
        "pay-method": "transfer",
        status: formData.status,
        "project-id": formData["project-id"] || null,
        "evaluation-stage-id": formData["evaluation-stage-id"] || null,
      });

      setIsEditDialogOpen(false);
      setSelectedTransaction(null);
      setFormData({
        "receiver-account": "",
        "receiver-name": "",
        "receiver-bank-name": "",
        title: "",
        type: "",
        "fee-cost": 0,
        "total-money": 0,
        "pay-method": "transfer",
        status: "",
        "project-id": "",
        "evaluation-stage-id": "",
      });
      setFormErrors({});
    } catch (error) {
      console.error("Update transaction error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      await deleteTransactionMutation.mutateAsync(selectedTransaction.id);
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Delete transaction error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: unknown) => {
    let processedValue = value;

    // Handle number fields with validation
    if (field === "total-money" || field === "fee-cost") {
      const numValue = Number(value);
      // Ensure the value is not negative and default to 0 if invalid
      processedValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue as string }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Get transactions from API and filter by active tab
  const allTransactions = transactionData?.["data-list"] || [];
  const currentTabStatus = TRANSACTION_TABS.find(
    (tab) => tab.value === activeTab
  )?.status;

  // Filter transactions based on active tab
  const transactions = allTransactions.filter((transaction) => {
    if (currentTabStatus === "rejected") {
      // Include both rejected and cancelled statuses
      return (
        transaction.status === "rejected" || transaction.status === "cancelled"
      );
    }
    return transaction.status === currentTabStatus;
  });

  const totalCount = transactions.length;
  const allTotalCount = transactionData?.["total-count"] || 0;

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setCurrentPage(1); // Reset to first page when changing tab
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue === "title" ? 2 : 0);
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-hidden">
      {/* Page Header */}
      <PageHeader
        title="Transaction Management"
        description="Manage financial transactions and payment requests"
        badge={{
          text: `${allTotalCount} total transactions`,
          variant: "secondary",
        }}
      />

      {/* Transaction Status Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-fit">
          {TRANSACTION_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TRANSACTION_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {/* Tab Header with Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{tab.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {totalCount} transactions
                </Badge>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Search transactions..."
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full max-w-none sm:max-w-sm"
                />
              </div>
              <div className="flex-shrink-0">
                <Select
                  value={sortBy === 2 ? "title" : "date"}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Request Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data Table */}
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[1200px] transaction-table">
                  <DataTable
                    data={transactions}
                    columns={columns}
                    searchable={false}
                    emptyMessage={`No ${tab.label.toLowerCase()} transactions found.`}
                    loading={isLoading}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* View Transaction Dialog */}
      {selectedTransaction && (
        <FormDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          config={{
            title: "View Transaction Details",
            description: "Complete transaction information (Read-only)",
            fields: [
              {
                name: "code",
                label: "Transaction Code",
                type: "text",
                required: false,
              },
              { name: "title", label: "Title", type: "text", required: false },
              { name: "type", label: "Type", type: "text", required: false },
              {
                name: "pay-method",
                label: "Payment Method",
                type: "text",
                required: false,
              },
              {
                name: "status",
                label: "Status",
                type: "text",
                required: false,
              },
              {
                name: "total-money",
                label: "Total Amount (VND)",
                type: "number",
                required: false,
              },
              {
                name: "fee-cost",
                label: "Fee Cost (VND)",
                type: "number",
                required: false,
              },
              {
                name: "request-date",
                label: "Request Date",
                type: "text",
                required: false,
              },
              {
                name: "handle-date",
                label: "Handle Date",
                type: "text",
                required: false,
              },
              {
                name: "receiver-name",
                label: "Receiver Name",
                type: "text",
                required: false,
              },
              {
                name: "receiver-account",
                label: "Receiver Account",
                type: "text",
                required: false,
              },
              {
                name: "receiver-bank-name",
                label: "Receiver Bank",
                type: "text",
                required: false,
              },
              {
                name: "sender-name",
                label: "Sender Name",
                type: "text",
                required: false,
              },
              {
                name: "sender-account",
                label: "Sender Account",
                type: "text",
                required: false,
              },
              {
                name: "sender-bank-name",
                label: "Sender Bank",
                type: "text",
                required: false,
              },
              {
                name: "transfer-content",
                label: "Transfer Content",
                type: "text",
                required: false,
              },
            ],
          }}
          data={{
            code: selectedTransaction.code,
            title: selectedTransaction.title,
            type: selectedTransaction.type,
            "pay-method":
              selectedTransaction["pay-method"] === "transfer"
                ? "Bank Transfer"
                : selectedTransaction["pay-method"],
            status: selectedTransaction.status,
            "total-money": selectedTransaction["total-money"],
            "fee-cost": selectedTransaction["fee-cost"],
            "request-date": selectedTransaction["request-date"]
              ? new Date(
                  selectedTransaction["request-date"]
                ).toLocaleDateString("vi-VN")
              : "-",
            "handle-date": selectedTransaction["handle-date"]
              ? new Date(selectedTransaction["handle-date"]).toLocaleDateString(
                  "vi-VN"
                )
              : "-",
            "receiver-name": selectedTransaction["receiver-name"],
            "receiver-account": selectedTransaction["receiver-account"],
            "receiver-bank-name": selectedTransaction["receiver-bank-name"],
            "sender-name": selectedTransaction["sender-name"] || "-",
            "sender-account": selectedTransaction["sender-account"] || "-",
            "sender-bank-name": selectedTransaction["sender-bank-name"] || "-",
            "transfer-content": selectedTransaction["transfer-content"] || "-",
          }}
          errors={{}}
          loading={true}
          onSubmit={() => {}}
          onCancel={() => setIsViewDialogOpen(false)}
          onChange={() => {}}
          mode="create"
        />
      )}

      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          config={{
            title: "Edit Transaction",
            description: "Update transaction information",
            fields: [
              { name: "title", label: "Title", type: "text", required: true },
              {
                name: "type",
                label: "Type",
                type: "select",
                required: true,
                options: [
                  { value: "project", label: "Project" },
                  { value: "evaluation", label: "Evaluation" },
                ],
              },
              {
                name: "pay-method",
                label: "Payment Method",
                type: "text",
                required: false,
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ],
              },
              {
                name: "receiver-account",
                label: "Receiver Account",
                type: "text",
                required: true,
              },
              {
                name: "receiver-name",
                label: "Receiver Name",
                type: "text",
                required: true,
              },
              {
                name: "receiver-bank-name",
                label: "Receiver Bank",
                type: "text",
                required: true,
              },
              {
                name: "total-money",
                label: "Total Money",
                type: "number",
                required: true,
              },
              {
                name: "fee-cost",
                label: "Fee Cost",
                type: "number",
                required: true,
              },
            ],
          }}
          data={formData}
          errors={formErrors}
          loading={isSubmitting}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditDialogOpen(false);
            setSelectedTransaction(null);
            setFormErrors({});
          }}
          onChange={handleFormChange}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Transaction"
        description={`Are you sure you want to delete the transaction "${selectedTransaction?.title}"? This action cannot be undone.`}
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

      {/* Save Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmSaveDialogOpen}
        onOpenChange={setIsConfirmSaveDialogOpen}
        title="Save Transaction"
        description={`Are you sure you want to save the changes to the transaction "${selectedTransaction?.title}"?`}
        confirmLabel="Save"
        cancelLabel="Cancel"
        variant="default"
        loading={isSubmitting}
        onConfirm={handleConfirmSave}
        onCancel={() => {
          setIsConfirmSaveDialogOpen(false);
        }}
      />
    </div>
  );
};

export default TransactionManagement;
