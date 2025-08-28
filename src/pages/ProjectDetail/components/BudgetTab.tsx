import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { formatDate } from "@/utils";
import { getStatusColor, formatVND } from "../shared/utils";
import { toast } from "sonner";
import {
  useCreateTransaction,
  useTransactionList,
} from "@/hooks/queries/transaction";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import { useAuth } from "@/contexts";

interface BudgetTabProps {
  projectId: string;
  category: string;
  isMember?: boolean;
  roleInProject?: string[];
}

// Transaction request form interface
interface TransactionRequest {
  title: string;
  type: string;
  "receiver-account": string;
  "receiver-name": string;
  "receiver-bank-name": string;
  "transfer-content": string;
  "total-money": number;
  "pay-method": string;
  status: string;
  "evaluation-stage-id"?: string;
}

const BudgetTab: React.FC<BudgetTabProps> = ({
  projectId,
  category,
  isMember = false,
  roleInProject = [],
}) => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState<TransactionRequest>({
    title: "",
    type: "",
    "receiver-account": "",
    "receiver-name": "",
    "receiver-bank-name": "",
    "transfer-content": "",
    "total-money": 0,
    "pay-method": "transfer", // Default payment method
    status: "pending",
  });

  // Auth hook
  const { user } = useAuth();

  // Check if user can create transactions (must be member and Principal Investigator)
  const canCreateTransaction =
    isMember && roleInProject.includes("Principal Investigator");

  // Check if user can create transactions based on project type
  const canCreateTransactionForProject = () => {
    if (!canCreateTransaction) return false;

    // For basic projects: always allow
    if (isBasicCategory) return true;

    // For application projects: allow if there are evaluation stages
    if (isApplicationCategory) {
      return evaluationStages.length > 0;
    }

    return false;
  };

  // API hooks
  const createTransaction = useCreateTransaction();
  const { data: evaluationsResponse } = useGetEvaluationsByProjectId(projectId);

  // Fetch transactions for this project
  const {
    data: transactionData,
    isLoading,
    refetch,
  } = useTransactionList({
    "key-word": "",
    "sort-by": 0,
    "page-index": 1,
    "page-size": 20,
  });

  // Filter transactions by project-id
  const transactions = (transactionData?.["data-list"] || []).filter(
    (transaction) => transaction["project-id"] === projectId
  );

  // Determine project type
  const categoryLower = category?.toLowerCase() || "";
  const isBasicCategory = categoryLower === "basic";
  const isApplicationCategory =
    categoryLower === "application" ||
    categoryLower === "implementation" ||
    categoryLower.includes("application") ||
    categoryLower.includes("implementation");

  // Get evaluation stages for application projects
  const evaluationStages =
    evaluationsResponse?.["data-list"]?.[0]?.["evaluation-stages"] || [];

  const handleRequestTransaction = () => {
    // Set default type based on project category
    setRequestForm((prev) => ({
      ...prev,
      type: isBasicCategory ? "project" : "evaluationstage",
    }));
    setShowRequestDialog(true);
  };

  const handleCloseDialog = () => {
    setShowRequestDialog(false);
    setRequestForm({
      title: "",
      type: "",
      "receiver-account": "",
      "receiver-name": "",
      "receiver-bank-name": "",
      "transfer-content": "",
      "total-money": 0,
      "pay-method": "transfer", // Default payment method
      status: "pending",
    });
  };

  const handleInputChange = (
    field: keyof TransactionRequest,
    value: string | number
  ) => {
    if (field === "total-money") {
      // Remove non-numeric characters except decimal point
      const numericValue =
        typeof value === "string" ? value.replace(/[^0-9]/g, "") : value;
      setRequestForm((prev) => ({
        ...prev,
        [field]: Number(numericValue) || 0,
      }));
    } else {
      setRequestForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmitRequest = async () => {
    // Validation
    if (!requestForm.title.trim()) {
      toast.error("Please enter a request title");
      return;
    }

    if (!requestForm.type) {
      toast.error("Please select a transaction type");
      return;
    }

    if (!requestForm["receiver-account"].trim()) {
      toast.error("Please enter receiver account");
      return;
    }

    if (!requestForm["receiver-name"].trim()) {
      toast.error("Please enter receiver name");
      return;
    }

    if (!requestForm["receiver-bank-name"].trim()) {
      toast.error("Please enter receiver bank name");
      return;
    }

    if (!requestForm["transfer-content"].trim()) {
      toast.error("Please enter transfer content");
      return;
    }

    if (!requestForm["total-money"] || requestForm["total-money"] <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // For application projects, validate evaluation stage selection
    if (isApplicationCategory && requestForm.type === "evaluationstage") {
      if (!requestForm["evaluation-stage-id"]) {
        toast.error("Please select an evaluation stage");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare transaction data - always include project-id
      const transactionData: {
        title: string;
        type: string;
        "receiver-account": string;
        "receiver-name": string;
        "receiver-bank-name": string;
        "transfer-content": string;
        "total-money": number;
        "pay-method": string;
        status: string;
        "project-id": string;
        "evaluation-stage-id"?: string;
      } = {
        title: requestForm.title,
        type: requestForm.type,
        "receiver-account": requestForm["receiver-account"],
        "receiver-name": requestForm["receiver-name"],
        "receiver-bank-name": requestForm["receiver-bank-name"],
        "transfer-content": requestForm["transfer-content"],
        "total-money": requestForm["total-money"],
        "pay-method": requestForm["pay-method"],
        status: requestForm.status,
        "project-id": projectId, // Always include project-id
      };

      // Add evaluation-stage-id for application projects
      if (isApplicationCategory && requestForm["evaluation-stage-id"]) {
        transactionData["evaluation-stage-id"] =
          requestForm["evaluation-stage-id"];
      }

      await createTransaction.mutateAsync(transactionData);
      handleCloseDialog();
      // Reload transaction list
      refetch();
    } catch (error) {
      console.error("Failed to submit transaction request:", error);
      // Error is already handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceived = async (transactionId: string) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://localhost:7157/api/transaction/${transactionId}?status=completed`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction status");
      }

      toast.success("Transaction marked as received");
      // Reload transaction list
      refetch();
    } catch (error) {
      console.error("Failed to mark transaction as received:", error);
      toast.error("Failed to update transaction status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisputed = async (transactionId: string) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://localhost:7157/api/transaction/${transactionId}?status=disputed`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction status");
      }

      toast.success("Transaction marked as disputed");
      // Reload transaction list
      refetch();
    } catch (error) {
      console.error("Failed to mark transaction as disputed:", error);
      toast.error("Failed to update transaction status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Budget Overview
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              {isBasicCategory
                ? "Project budget allocation and expense tracking for basic research"
                : "Project budget allocation and expense tracking for application projects"}
            </CardDescription>
          </div>
          {canCreateTransactionForProject() && (
            <Button
              onClick={handleRequestTransaction}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Transaction
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        {/* Transactions Table Section */}
        <div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Transaction</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[80px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    Payment Method
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {transaction.title}
                        </p>

                        {transaction["transfer-content"] && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {transaction["transfer-content"]}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatVND(transaction["total-money"])}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(transaction["request-date"])}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          transaction.status
                        )} text-xs`}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction["pay-method"] === "transfer"
                            ? "Bank Transfer"
                            : transaction["pay-method"]}
                        </Badge>
                        {transaction.status === "approved" &&
                          canCreateTransactionForProject() && (
                            <div className="flex gap-1 mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReceived(transaction.id)}
                                disabled={isSubmitting}
                                className="h-6 px-2 text-xs bg-green-50 hover:bg-green-100 border-green-200"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Received
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDisputed(transaction.id)}
                                disabled={isSubmitting}
                                className="h-6 px-2 text-xs bg-red-50 hover:bg-red-100 border-red-200"
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Disputed
                              </Button>
                            </div>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  No transactions found
                </p>
                <p className="text-sm text-muted-foreground">
                  No financial transactions have been recorded for this project
                  yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Request Transaction Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Request Transaction
            </DialogTitle>
            <DialogDescription>
              Submit a new transaction request for this{" "}
              {isBasicCategory ? "project" : "evaluation stage"}. Please provide
              the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="request-title" className="text-sm font-medium">
                Request Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="request-title"
                value={requestForm.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter request title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="transaction-type" className="text-sm font-medium">
                Transaction Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("type", value)}
                value={requestForm.type}
                disabled={true} // Disable selection based on project type
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {isBasicCategory ? (
                    <SelectItem value="project">Project</SelectItem>
                  ) : (
                    <SelectItem value="evaluationstage">
                      Evaluation Stage
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {isBasicCategory
                  ? "Project type is automatically set for basic research projects"
                  : "Evaluation Stage type is automatically set for application projects"}
              </p>
            </div>

            {/* Evaluation Stage Selection for Application Projects */}
            {isApplicationCategory &&
              requestForm.type === "evaluationstage" && (
                <div>
                  <Label
                    htmlFor="evaluation-stage"
                    className="text-sm font-medium"
                  >
                    Evaluation Stage <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("evaluation-stage-id", value)
                    }
                    value={requestForm["evaluation-stage-id"] || ""}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select evaluation stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationStages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="receiver-account"
                  className="text-sm font-medium"
                >
                  Receiver Account <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="receiver-account"
                  value={requestForm["receiver-account"]}
                  onChange={(e) =>
                    handleInputChange("receiver-account", e.target.value)
                  }
                  placeholder="Enter receiver account number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="receiver-name" className="text-sm font-medium">
                  Receiver Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="receiver-name"
                  value={requestForm["receiver-name"]}
                  onChange={(e) =>
                    handleInputChange("receiver-name", e.target.value)
                  }
                  placeholder="Enter receiver name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="receiver-bank-name"
                className="text-sm font-medium"
              >
                Receiver Bank Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="receiver-bank-name"
                value={requestForm["receiver-bank-name"]}
                onChange={(e) =>
                  handleInputChange("receiver-bank-name", e.target.value)
                }
                placeholder="Enter receiver bank name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="transfer-content" className="text-sm font-medium">
                Transfer Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="transfer-content"
                value={requestForm["transfer-content"]}
                onChange={(e) =>
                  handleInputChange("transfer-content", e.target.value)
                }
                placeholder="Enter transfer content/description"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (VND) <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="amount"
                  type="text"
                  value={requestForm["total-money"] || ""}
                  onChange={(e) =>
                    handleInputChange("total-money", e.target.value)
                  }
                  placeholder="Enter amount"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">VND</span>
                </div>
              </div>
              {requestForm["total-money"] && (
                <p className="text-xs text-gray-500 mt-1">
                  Amount: {formatVND(requestForm["total-money"])}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={
                isSubmitting ||
                !requestForm.title.trim() ||
                !requestForm.type ||
                !requestForm["receiver-account"].trim() ||
                !requestForm["receiver-name"].trim() ||
                !requestForm["receiver-bank-name"].trim() ||
                !requestForm["transfer-content"].trim() ||
                !requestForm["total-money"] ||
                (isApplicationCategory &&
                  requestForm.type === "evaluationstage" &&
                  !requestForm["evaluation-stage-id"])
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BudgetTab;
