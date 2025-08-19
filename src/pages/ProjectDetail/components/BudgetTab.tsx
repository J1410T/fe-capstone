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
import { Wallet, Plus, Loader2 } from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { formatDate } from "@/utils";
import { getStatusColor, formatVND } from "../shared/utils";
import { Transaction } from "@/types/transaction";
import { UserRole } from "@/contexts/auth-types";
import { useAuth } from "@/contexts";
import { toast } from "sonner";

interface BudgetTabProps {
  transactions: Transaction[];
}

// Transaction request form interface
interface TransactionRequest {
  name: string;
  type: string;
  amount: string;
}

// Transaction types available for request
const TRANSACTION_TYPES = [
  { value: "project", label: "Project" },
  { value: "evaluationstage", label: "Evaluation Stage" },
];

const BudgetTab: React.FC<BudgetTabProps> = ({ transactions }) => {
  const [isLoading] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState<TransactionRequest>({
    name: "",
    type: "",
    amount: "",
  });

  // Auth hook to check user role
  const { user } = useAuth();

  const handleRequestTransaction = () => {
    setShowRequestDialog(true);
  };

  const handleCloseDialog = () => {
    setShowRequestDialog(false);
    setRequestForm({
      name: "",
      type: "",
      amount: "",
    });
  };

  const handleInputChange = (
    field: keyof TransactionRequest,
    value: string
  ) => {
    if (field === "amount") {
      // Remove non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9]/g, "");
      setRequestForm((prev) => ({
        ...prev,
        [field]: numericValue,
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
    if (!requestForm.name.trim()) {
      toast.error("Please enter a request name");
      return;
    }

    if (!requestForm.type) {
      toast.error("Please select a transaction type");
      return;
    }

    if (!requestForm.amount.trim() || isNaN(Number(requestForm.amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (Number(requestForm.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit transaction request
      // await submitTransactionRequest(requestForm);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Transaction request submitted successfully!");
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to submit transaction request:", error);
      toast.error("Failed to submit transaction request");
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
              Project budget allocation and expense tracking
            </CardDescription>
          </div>
          {user?.role === UserRole.PRINCIPAL_INVESTIGATOR && (
            <Button
              onClick={handleRequestTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
                  <TableRow key={transaction.code}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {transaction.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {transaction.code}
                        </p>
                        {transaction.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {transaction.description}
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
                      {formatVND(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(transaction.createdAt)}
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
                      <Badge variant="outline" className="text-xs">
                        {transaction.paymentMethod}
                      </Badge>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Request Transaction
            </DialogTitle>
            <DialogDescription>
              Submit a new transaction request for this project. Please provide
              the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="request-name" className="text-sm font-medium">
                Request Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="request-name"
                value={requestForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter request name"
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
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (VND) <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="amount"
                  type="text"
                  value={requestForm.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">VND</span>
                </div>
              </div>
              {requestForm.amount && (
                <p className="text-xs text-gray-500 mt-1">
                  Amount: {formatVND(Number(requestForm.amount) || 0)}
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
                !requestForm.name.trim() ||
                !requestForm.type ||
                !requestForm.amount.trim()
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
