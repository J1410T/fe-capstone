import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  CheckCircle,
  TrendingUp,
  PieChart,
  Wallet,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { formatDate } from "@/utils";
import { getStatusColor, formatVND } from "../shared/utils";
import { Transaction } from "@/types/transaction";

interface BudgetTabProps {
  transactions: Transaction[];
}

const BudgetTab: React.FC<BudgetTabProps> = ({ transactions }) => {
  const [isLoading] = useState(false);

  const getStatusStats = () => {
    if (!transactions || transactions.length === 0)
      return { approved: 0, pending: 0, rejected: 0 };

    return {
      approved: transactions.filter(
        (t) => t.status.toLowerCase() === "approved"
      ).length,
      pending: transactions.filter((t) => t.status.toLowerCase() === "pending")
        .length,
      rejected: transactions.filter(
        (t) => t.status.toLowerCase() === "rejected"
      ).length,
    };
  };

  const getTotalAmount = () => {
    if (!transactions || transactions.length === 0) return 0;
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  const getApprovedAmount = () => {
    if (!transactions || transactions.length === 0) return 0;
    return transactions
      .filter((t) => t.status.toLowerCase() === "approved")
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const stats = getStatusStats();
  const totalAmount = getTotalAmount();
  const approvedAmount = getApprovedAmount();
  const utilization =
    totalAmount > 0 ? Math.round((approvedAmount / totalAmount) * 100) : 0;

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
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
            <DollarSign className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {formatVND(totalAmount)}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Amount</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">
                {formatVND(approvedAmount)}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Approved ({utilization}%)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <PieChart className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">
                {formatVND(totalAmount - approvedAmount)}
              </p>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.approved}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Approved Transactions
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Transactions Table Section */}
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
            Transactions
          </h3>
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
    </Card>
  );
};

export default BudgetTab;
