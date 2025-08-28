import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { Eye, Edit, Trash2, Calendar, CreditCard } from "lucide-react";
import { DataTable, StatusBadge, PageHeader, ConfirmDialog } from "../shared";
import { TransactionDetail, TransactionListRequest } from "@/types/transaction";
import {
  useDeleteTransaction,
  useTransactionList,
  useUpdateTransaction,
} from "@/hooks/queries/transaction";

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
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div
            className="font-medium max-w-[200px] truncate"
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
            <div className="font-semibold text-green-600">
              {amount.toLocaleString()} VND
            </div>
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
        accessorKey: "request-date",
        header: "Date",
        cell: ({ row }) => {
          const date = row.getValue("request-date") as string;
          return (
            <div className="text-sm">
              {new Date(date).toLocaleDateString("vi-VN")}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(transaction)}
                className="px-2 h-8"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(transaction)}
                className="px-2 h-8"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(transaction)}
                className="px-2 h-8"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
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
            <div className="w-full">
              <DataTable
                data={transactions}
                columns={columns}
                searchable={false}
                emptyMessage={`No ${tab.label.toLowerCase()} transactions found.`}
                loading={isLoading}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* View Transaction Dialog */}
      {selectedTransaction && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isViewDialogOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsViewDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Transaction Details</h2>
                <p className="text-sm text-muted-foreground">
                  Complete transaction information (Read-only)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewDialogOpen(false)}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Close</span>×
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction.title}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <div className="mt-1">
                        <StatusBadge
                          status={selectedTransaction.type}
                          variant="type"
                          size="sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <StatusBadge
                          status={selectedTransaction.status}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-gray-900">
                          {selectedTransaction["pay-method"] === "transfer"
                            ? "Bank Transfer"
                            : selectedTransaction["pay-method"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Financial Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Total Amount
                      </label>
                      <p className="text-lg font-semibold text-green-600 mt-1">
                        {selectedTransaction["total-money"].toLocaleString()}{" "}
                        VND
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Fee Cost
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction["fee-cost"].toLocaleString()} VND
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Request Date
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-gray-900">
                          {selectedTransaction["request-date"]
                            ? new Date(
                                selectedTransaction["request-date"]
                              ).toLocaleDateString("vi-VN")
                            : "Not specified"}
                        </span>
                      </div>
                    </div>

                    {selectedTransaction["handle-date"] && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Handle Date
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-gray-900">
                            {new Date(
                              selectedTransaction["handle-date"]
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Receiver Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Receiver Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction["receiver-name"]}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Account Number
                      </label>
                      <p className="text-sm text-gray-900 mt-1 font-mono">
                        {selectedTransaction["receiver-account"]}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Bank Name
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction["receiver-bank-name"]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Sender Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction["sender-name"] || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Account Number
                      </label>
                      <p className="text-sm text-gray-900 mt-1 font-mono">
                        {selectedTransaction["sender-account"] ||
                          "Not specified"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Bank Name
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedTransaction["sender-bank-name"] ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Content */}
              {selectedTransaction["transfer-content"] && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    Transfer Content
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedTransaction["transfer-content"]}
                    </p>
                  </div>
                </div>
              )}

              {/* Project Information */}
              {selectedTransaction.project && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    Related Project
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900">
                      {selectedTransaction.project["english-title"]}
                    </p>
                    {selectedTransaction.project["vietnamese-title"] && (
                      <p className="text-sm text-blue-700 mt-1">
                        {selectedTransaction.project["vietnamese-title"]}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isEditDialogOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsEditDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Edit Transaction</h2>
                <p className="text-sm text-muted-foreground">
                  Update transaction information
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(false)}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Close</span>×
              </Button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleFormSubmit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
            >
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors.title ? "border-red-500" : ""
                        }`}
                        placeholder="Enter transaction title"
                      />
                      {formErrors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Type *
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleFormChange("type", value)
                        }
                      >
                        <SelectTrigger
                          className={`mt-1 ${
                            formErrors.type ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="evaluation">Evaluation</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.type && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors.type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleFormChange("status", value)
                        }
                      >
                        <SelectTrigger
                          className={`mt-1 ${
                            formErrors.status ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.status && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors.status}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <Input
                        value="Bank Transfer"
                        disabled
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Financial Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Total Amount (VND) *
                      </label>
                      <Input
                        type="number"
                        value={formData["total-money"]}
                        onChange={(e) =>
                          handleFormChange("total-money", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors["total-money"] ? "border-red-500" : ""
                        }`}
                        placeholder="0"
                        min="0"
                      />
                      {formErrors["total-money"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors["total-money"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Fee Cost (VND) *
                      </label>
                      <Input
                        type="number"
                        value={formData["fee-cost"]}
                        onChange={(e) =>
                          handleFormChange("fee-cost", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors["fee-cost"] ? "border-red-500" : ""
                        }`}
                        placeholder="0"
                        min="0"
                      />
                      {formErrors["fee-cost"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors["fee-cost"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receiver Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Receiver Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <Input
                        value={formData["receiver-name"]}
                        onChange={(e) =>
                          handleFormChange("receiver-name", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors["receiver-name"] ? "border-red-500" : ""
                        }`}
                        placeholder="Enter receiver name"
                      />
                      {formErrors["receiver-name"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors["receiver-name"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Account Number *
                      </label>
                      <Input
                        value={formData["receiver-account"]}
                        onChange={(e) =>
                          handleFormChange("receiver-account", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors["receiver-account"] ? "border-red-500" : ""
                        }`}
                        placeholder="Enter account number"
                      />
                      {formErrors["receiver-account"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors["receiver-account"]}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Bank Name *
                      </label>
                      <Input
                        value={formData["receiver-bank-name"]}
                        onChange={(e) =>
                          handleFormChange("receiver-bank-name", e.target.value)
                        }
                        className={`mt-1 ${
                          formErrors["receiver-bank-name"]
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Enter bank name"
                      />
                      {formErrors["receiver-bank-name"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {formErrors["receiver-bank-name"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedTransaction(null);
                  setFormErrors({});
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
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
