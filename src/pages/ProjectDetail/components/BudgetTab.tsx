import React, { useState, useEffect } from "react";
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
  Receipt,
  CheckCircle,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";

// Local types
interface BudgetData {
  total: number;
  spent: number;
  allocated: {
    personnel: number;
    equipment: number;
    travel: number;
    materials: number;
    other: number;
  };
  expenses: ExpenseItem[];
}

interface ExpenseItem {
  id: string;
  category: "personnel" | "equipment" | "travel" | "materials" | "other";
  description: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  receipt?: string;
  approvedBy?: string;
  feedback?: string;
}

// Utility functions
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "personnel":
      return "👥";
    case "equipment":
      return "🖥️";
    case "travel":
      return "✈️";
    case "materials":
      return "📦";
    case "other":
      return "📋";
    default:
      return "💰";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "personnel":
      return "bg-blue-100 text-blue-800";
    case "equipment":
      return "bg-purple-100 text-purple-800";
    case "travel":
      return "bg-green-100 text-green-800";
    case "materials":
      return "bg-orange-100 text-orange-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const BudgetTab: React.FC = () => {
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockBudget: BudgetData = {
          total: 120000,
          spent: 78000,
          allocated: {
            personnel: 60000,
            equipment: 30000,
            travel: 10000,
            materials: 15000,
            other: 5000,
          },
          expenses: [
            {
              id: "1",
              category: "personnel",
              description: "Research Assistant Salary - Q1",
              amount: 15000,
              date: "2024-03-31",
              status: "Approved",
              receipt: "salary-receipt-q1.pdf",
              approvedBy: "Finance Department",
            },
            {
              id: "2",
              category: "equipment",
              description: "High-Performance Computing Server",
              amount: 25000,
              date: "2024-04-15",
              status: "Approved",
              receipt: "server-invoice.pdf",
              approvedBy: "Finance Department",
            },
            {
              id: "3",
              category: "travel",
              description: "Conference Travel - ICML 2024",
              amount: 3500,
              date: "2024-05-20",
              status: "Pending",
              receipt: "travel-receipts.pdf",
            },
            {
              id: "4",
              category: "materials",
              description: "Research Materials and Supplies",
              amount: 2800,
              date: "2024-06-01",
              status: "Rejected",
              receipt: "materials-invoice.pdf",
              feedback:
                "Please provide more detailed breakdown of materials needed",
            },
          ],
        };
        setBudget(mockBudget);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading budget data:", error);
      setIsLoading(false);
    }
  };

  const getStatusStats = () => {
    if (!budget) return { approved: 0, pending: 0, rejected: 0 };

    return {
      approved: budget.expenses.filter((e) => e.status === "Approved").length,
      pending: budget.expenses.filter((e) => e.status === "Pending").length,
      rejected: budget.expenses.filter((e) => e.status === "Rejected").length,
    };
  };

  const getBudgetUtilization = () => {
    if (!budget) return 0;
    return Math.round((budget.spent / budget.total) * 100);
  };

  const stats = getStatusStats();
  const utilization = getBudgetUtilization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!budget) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No budget data available.</p>
        </CardContent>
      </Card>
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
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xl font-bold">
                ${budget.total.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xl font-bold">
                ${budget.spent.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Spent ({utilization}%)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <PieChart className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xl font-bold">
                ${(budget.total - budget.spent).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved Expenses</p>
            </div>
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Budget Allocation Section */}
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
            Budget Allocation
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(budget.allocated).map(([category, amount]) => {
              const spent = budget.expenses
                .filter(
                  (e) => e.category === category && e.status === "Approved"
                )
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = Math.round((spent / (amount as number)) * 100);

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {getCategoryIcon(category)}
                      </span>
                      <span className="font-medium capitalize text-sm sm:text-base">
                        {category}
                      </span>
                      <Badge
                        className={`${getCategoryColor(category)} text-xs`}
                      >
                        ${spent.toLocaleString()} / $
                        {(amount as number).toLocaleString()}
                      </Badge>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Expenses Table Section */}
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
            Recent Expenses
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Category</TableHead>
                  <TableHead className="min-w-[80px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    Receipt
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.expenses.slice(0, 5).map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {expense.description}
                        </p>
                        {expense.feedback && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1">
                            {expense.feedback}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm">
                          {getCategoryIcon(expense.category)}
                        </span>
                        <Badge
                          className={`${getCategoryColor(
                            expense.category
                          )} text-xs`}
                        >
                          {expense.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      ${expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(expense.status)} text-xs`}
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {expense.receipt && (
                        <Badge variant="outline" className="text-xs">
                          <Receipt className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Receipt</span>
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {budget.expenses.length === 0 && (
              <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">
                No expenses recorded yet.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTab;
