import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Plus,
  Eye,
  FileText,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building,
  User,
} from "lucide-react";
import { formatVND } from "@/utils";

// Mock data (amounts in VND)
const paymentStats = {
  totalProcessed: 58800000000, // ~2.45M USD converted to VND
  pendingApprovals: 3000000000, // ~125K USD converted to VND
  monthlyTotal: 8160000000, // ~340K USD converted to VND
  transactionCount: 156,
};

const transactions = [
  {
    id: 1,
    projectTitle: "AI Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    institution: "University of Technology",
    amount: 600000000, // ~25K USD in VND
    type: "milestone",
    status: "pending",
    requestDate: "2024-01-15",
    dueDate: "2024-01-30",
    description: "Q1 Milestone Payment",
    category: "Research Funding",
  },
  {
    id: 2,
    projectTitle: "Sustainable Energy Storage",
    pi: "Dr. Michael Chen",
    institution: "Institute of Science",
    amount: 360000000, // ~15K USD in VND
    type: "equipment",
    status: "approved",
    requestDate: "2024-01-12",
    dueDate: "2024-01-25",
    description: "Laboratory Equipment Purchase",
    category: "Equipment",
  },
  {
    id: 3,
    projectTitle: "Climate Change Study",
    pi: "Dr. Emily Rodriguez",
    institution: "Environmental Research Center",
    amount: 204000000, // ~8.5K USD in VND
    type: "travel",
    status: "processed",
    requestDate: "2024-01-10",
    dueDate: "2024-01-20",
    description: "Conference Travel Expenses",
    category: "Travel",
  },
  {
    id: 4,
    projectTitle: "Marine Biology Research",
    pi: "Dr. James Wilson",
    institution: "Marine Research Institute",
    amount: 1080000000, // ~45K USD in VND
    type: "personnel",
    status: "rejected",
    requestDate: "2024-01-08",
    dueDate: "2024-01-22",
    description: "Research Assistant Salary",
    category: "Personnel",
  },
];

const PaymentManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof transactions)[0] | null
  >(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "processed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "bg-purple-100 text-purple-800";
      case "equipment":
        return "bg-blue-100 text-blue-800";
      case "travel":
        return "bg-green-100 text-green-800";
      case "personnel":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter transactions based on status, type and search
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesSearch =
        transaction.projectTitle.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.pi.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.description.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [statusFilter, typeFilter, globalFilter]);

  // Handler functions
  const handleViewDetails = useCallback((transaction: (typeof transactions)[0]) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  }, []);

  const handleProcessPayment = useCallback((transaction: (typeof transactions)[0]) => {
    setSelectedTransaction(transaction);
    setIsProcessDialogOpen(true);
  }, []);

  // Table columns definition
  const columns = useMemo<ColumnDef<(typeof transactions)[0]>[]>(
    () => [
      {
        accessorKey: "projectTitle",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="max-w-[250px]">
            <div className="font-medium truncate">{row.getValue("projectTitle")}</div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <User className="w-3 h-3 mr-1" />
              {row.original.pi}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge className={getTypeColor(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{formatVND(row.getValue("amount"))}</span>
          </div>
        ),
      },
      {
        accessorKey: "requestDate",
        header: "Requested",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
            {new Date(row.getValue("requestDate")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "institution",
        header: "Institution",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-sm">{row.getValue("institution")}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {row.original.status === "pending" && (
              <Button
                size="sm"
                onClick={() => handleProcessPayment(row.original)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Process
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails, handleProcessPayment]
  );

  // Create table instance
  const table = useReactTable({
    data: filteredTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const transaction = row.original;
      const searchString = `${transaction.projectTitle} ${transaction.pi} ${transaction.description}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "default",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: "default" | "success" | "warning" | "error";
  }) => {
    const colorClasses = {
      default: "text-blue-600 bg-blue-50",
      success: "text-green-600 bg-green-50",
      warning: "text-yellow-600 bg-yellow-50",
      error: "text-red-600 bg-red-50",
    };

    return (
      <Card
        className="border rounded-lg"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
              {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };



  const TransactionDetailDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View detailed information about the transaction
          </DialogDescription>
        </DialogHeader>
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Title</Label>
                <p className="text-sm font-medium">{selectedTransaction.projectTitle}</p>
              </div>
              <div>
                <Label>Principal Investigator</Label>
                <p className="text-sm">{selectedTransaction.pi}</p>
              </div>
              <div>
                <Label>Institution</Label>
                <p className="text-sm">{selectedTransaction.institution}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-sm font-medium">{formatVND(selectedTransaction.amount)}</p>
              </div>
              <div>
                <Label>Type</Label>
                <Badge className={getTypeColor(selectedTransaction.type)}>
                  {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                </Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedTransaction.status)}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </Badge>
              </div>
              <div>
                <Label>Request Date</Label>
                <p className="text-sm">{new Date(selectedTransaction.requestDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="text-sm">{new Date(selectedTransaction.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                {selectedTransaction.description}
              </p>
            </div>


          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          {selectedTransaction?.status === "pending" && (
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsProcessDialogOpen(true);
            }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ProcessPaymentDialog = () => {
    return (
    <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Review and process payment for: {selectedTransaction?.projectTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              value={selectedTransaction ? formatVND(selectedTransaction.amount) : ""}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="wire">Wire Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Processing Notes</Label>
            <Input placeholder="Add processing notes (optional)" />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsProcessDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("Payment rejected");
              setIsProcessDialogOpen(false);
            }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => {
              console.log("Payment approved");
              setIsProcessDialogOpen(false);
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Manage and process project payments and transactions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Processed"
          value={`$${(paymentStats.totalProcessed / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend="+12.5% from last month"
          color="success"
        />
        <StatCard
          title="Pending Approvals"
          value={`$${(paymentStats.pendingApprovals / 1000).toFixed(0)}K`}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Monthly Total"
          value={`$${(paymentStats.monthlyTotal / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          trend="+8.2% from last month"
          color="default"
        />
        <StatCard
          title="Transactions"
          value={paymentStats.transactionCount}
          icon={CreditCard}
          trend="+15 this week"
          color="default"
        />
      </div>



      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-900 py-3 px-4 text-left bg-gray-50/50"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "No transactions to display"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Clean Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/30 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`h-8 w-8 p-0 ${
                    table.getState().pagination.pageIndex === pageIndex
                      ? "bg-slate-600 text-white hover:bg-slate-700"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageIndex + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <TransactionDetailDialog />
      <ProcessPaymentDialog />
    </div>
  );
};

export default PaymentManagement;
