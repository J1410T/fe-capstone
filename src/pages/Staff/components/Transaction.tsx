import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof transactions)[0] | null
  >(null);
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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.projectTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.pi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default}`}
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

  const TransactionCard = ({
    transaction,
  }: {
    transaction: (typeof transactions)[0];
  }) => (
    <Card
      className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {transaction.projectTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {transaction.pi} • {transaction.description}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status}
            </Badge>
            <Badge className={getTypeColor(transaction.type)}>
              {transaction.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {formatVND(transaction.amount)}
            </span>
            <Badge variant="outline">{transaction.category}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Requested:</span>
              <span className="ml-2 font-medium">
                {transaction.requestDate}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Due:</span>
              <span className="ml-2 font-medium">{transaction.dueDate}</span>
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {transaction.status === "pending" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setIsProcessDialogOpen(true);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Process
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProcessPaymentDialog = () => (
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

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger
            value="processed"
            className="flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Processed</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
              </div>
            </CardContent>
          </Card>

          {/* Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No transactions found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ProcessPaymentDialog />
    </div>
  );
};

export default PaymentManagement;
