import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Plus,
  Receipt,
  Upload,
  CheckCircle,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { Budget as BudgetType, Expense } from "../shared/types";
import { StatusBadge, FileUpload } from "../shared/components";
import { formatDate } from "../shared/utils";
import { FileUpload as FileUploadType } from "../shared/types";
import { toast } from "sonner";

const Budget: React.FC = () => {
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [receiptFiles, setReceiptFiles] = useState<FileUploadType[]>([]);

  const [expenseForm, setExpenseForm] = useState({
    category: "" as
      | "personnel"
      | "equipment"
      | "travel"
      | "materials"
      | "other"
      | "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockBudget: BudgetType = {
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

  const handleAddExpense = async () => {
    if (
      !expenseForm.category ||
      !expenseForm.description ||
      !expenseForm.amount ||
      !expenseForm.date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (receiptFiles.length === 0) {
      toast.error("Please upload a receipt");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newExpense: Expense = {
          id: `expense_${Date.now()}`,
          category: expenseForm.category as any,
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          date: expenseForm.date,
          status: "Pending",
          receipt: receiptFiles[0].name,
        };

        setBudget((prev) =>
          prev
            ? {
                ...prev,
                expenses: [...prev.expenses, newExpense],
                spent: prev.spent + newExpense.amount,
              }
            : null
        );

        setExpenseForm({
          category: "",
          description: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
        });
        setReceiptFiles([]);
        setShowExpenseDialog(false);
        toast.success("Expense submitted for approval");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to submit expense");
      setIsLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to submit BM05 + BM06 for approval
      setTimeout(() => {
        toast.success(
          "Budget approval request (BM05 + BM06) submitted successfully"
        );
        setShowApprovalDialog(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting for approval:", error);
      toast.error("Failed to submit for approval");
      setIsLoading(false);
    }
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

  if (!budget) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Budget Management
            </h1>
            <p className="text-muted-foreground">
              Forms BM05 + BM06 - Manage expenses and budget approvals
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense for budget tracking
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category *</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value: any) =>
                        setExpenseForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personnel">👥 Personnel</SelectItem>
                        <SelectItem value="equipment">🖥️ Equipment</SelectItem>
                        <SelectItem value="travel">✈️ Travel</SelectItem>
                        <SelectItem value="materials">📦 Materials</SelectItem>
                        <SelectItem value="other">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount (USD) *</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Description *</Label>
                  <Textarea
                    id="expense-description"
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the expense"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date *</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <FileUpload
                  files={receiptFiles}
                  onFilesChange={setReceiptFiles}
                  maxFiles={1}
                  label="Upload Receipt *"
                  description="PDF, JPG, PNG up to 10MB"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowExpenseDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddExpense} disabled={isLoading}>
                  <Receipt className="w-4 h-4 mr-2" />
                  {isLoading ? "Adding..." : "Add Expense"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showApprovalDialog}
            onOpenChange={setShowApprovalDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Budget for Approval</DialogTitle>
                <DialogDescription>
                  Submit forms BM05 + BM06 for budget approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Forms to be submitted:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• BM05 - Budget Request Form</li>
                    <li>• BM06 - Expense Report</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Label>Current Budget Status</Label>
                  <div className="text-sm text-muted-foreground">
                    <p>Total Budget: ${budget.total.toLocaleString()}</p>
                    <p>
                      Spent: ${budget.spent.toLocaleString()} ({utilization}%)
                    </p>
                    <p>
                      Remaining: $
                      {(budget.total - budget.spent).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitForApproval} disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isLoading ? "Submitting..." : "Submit for Approval"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Form Badges */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            BM05
          </Badge>
          <span className="text-sm text-muted-foreground">Budget Request</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Receipt className="w-3 h-3 mr-1" />
            BM06
          </Badge>
          <span className="text-sm text-muted-foreground">Expense Report</span>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${budget.total.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${budget.spent.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Spent ({utilization}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${(budget.total - budget.spent).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">
                  Approved Expenses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>Breakdown of budget by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(budget.allocated).map(([category, amount]) => {
              const spent = budget.expenses
                .filter(
                  (e) => e.category === category && e.status === "Approved"
                )
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = Math.round((spent / amount) * 100);

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {getCategoryIcon(category)}
                      </span>
                      <span className="font-medium capitalize">{category}</span>
                      <Badge className={getCategoryColor(category)}>
                        ${spent.toLocaleString()} / ${amount.toLocaleString()}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>
            Track all submitted expenses and their approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      {expense.feedback && (
                        <p className="text-sm text-red-600 mt-1">
                          {expense.feedback}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{getCategoryIcon(expense.category)}</span>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={expense.status} />
                  </TableCell>
                  <TableCell>{expense.approvedBy || "-"}</TableCell>
                  <TableCell className="text-right">
                    {expense.receipt && (
                      <Button variant="outline" size="sm">
                        <Receipt className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {budget.expenses.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No expenses recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;
