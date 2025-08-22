import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Line,
  ComposedChart,
} from "recharts";
import {
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Target,
  BookOpen,
  Building2,
  PieChart as PieChartIcon,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Filter,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { formatVND } from "../shared";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
interface Project {
  id: string;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  language: string;
  category: string;
  type: string;
  genre: string;
  status: string;
  progress: number;
  "maximum-member": number;
  "created-at": string;
  "updated-at": string | null;
  "creator-id": string;
  majors: Array<{
    id: string;
    name: string;
    field: {
      id: string;
      name: string;
    };
  }>;
  "project-tags": Array<{
    name: string;
  }>;
}

// Mock projects data with proper statuses
const mockProjects: Project[] = [
  {
    id: "7a117ebd-e5c0-459f-a977-075b492a9aa1",
    code: "PRJ015",
    "english-title":
      "BookStreet - The application helps people look up information about books",
    "vietnamese-title":
      "BookStreet - Ứng dụng giúp mọi người tra cứu thông tin về sách",
    language: "Vietnamese",
    category: "basic",
    type: "school level",
    genre: "normal", // Not proposal
    status: "created",
    progress: 15,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "403c10a6-4889-49c6-b3b7-75d65572e1ee",
    majors: [],
    "project-tags": [],
  },
  {
    id: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    code: "PRJ002",
    "english-title": "Science Research Project Management",
    "vietnamese-title": "Ứng dụng quản lý đề tài khoa học",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "ongoing",
    progress: 45,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [
      {
        id: "74c32ee6-b8a6-4455-8b34-02321af11590",
        name: "Software Engineering",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology",
        },
      },
    ],
    "project-tags": [],
  },
  {
    id: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
    code: "PRJ001",
    "english-title": "AI-based Learning Support System",
    "vietnamese-title": "Hệ thống hỗ trợ học tập dùng AI",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "completed",
    progress: 100,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [],
    "project-tags": [],
  },
  {
    id: "a07cbf07-c165-459c-b99f-2023cbe32653",
    code: "PRJ007",
    "english-title": "FUC - Capstone management system",
    "vietnamese-title": "FUC - Hệ thống quản lý đồ án",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "cancelled",
    progress: 30,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "2427d29b-b64f-4315-b8b4-b0bf2f3c4cee",
    majors: [],
    "project-tags": [],
  },
];

const majorData = [
  { name: "Software Eng", value: 35, students: 120 },
  { name: "IT", value: 28, students: 95 },
  { name: "Computer Sci", value: 20, students: 68 },
  { name: "Data Science", value: 12, students: 41 },
  { name: "Cybersecurity", value: 5, students: 17 },
];

// User Management Stats with roles
const userStats = {
  totalUsers: 156,
  activeUsers: 142,
  principalInvestigators: 25,
  researchers: 78,
  hostInstitutions: 12,
  councilMembers: 18,
  staffs: 23,
};

// Transaction Stats
const transactionStats = {
  totalTransactions: 342,
  pendingTransactions: 23,
  monthlyTransactions: 89,
  totalAmount: 58800000000, // VND
  pendingAmount: 3200000000, // VND
  monthlyAmount: 12400000000, // VND
};

const StaffDashboard: React.FC = () => {
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Calculate project statistics (excluding proposals)
  const projectStats = useMemo(() => {
    // Filter out proposals
    const nonProposalProjects = mockProjects.filter(
      (p) => p.genre !== "proposal"
    );

    const total = nonProposalProjects.length;
    const created = nonProposalProjects.filter(
      (p) => p.status === "created"
    ).length;
    const ongoing = nonProposalProjects.filter(
      (p) => p.status === "ongoing"
    ).length;
    const completed = nonProposalProjects.filter(
      (p) => p.status === "completed"
    ).length;
    const cancelled = nonProposalProjects.filter(
      (p) => p.status === "cancelled"
    ).length;

    // Active projects are those in progress (ongoing)
    const activeProjects = ongoing;

    return {
      total,
      created,
      ongoing,
      completed,
      cancelled,
      activeProjects,
    };
  }, []);

  // Academic Management Stats with calculated average
  const academicStats = useMemo(
    () => ({
      totalFields: 8,
      totalMajors: 24,
      totalCouncils: 6,
      activeCouncils: 4,
      councilMembers: 18,
      averageProjectsPerCouncil: Math.round((projectStats.total / 6) * 10) / 10, // 6 total councils
    }),
    [projectStats.total]
  );

  // Evaluation Stats
  const evaluationStats = {
    totalEvaluations: 156,
    completedEvaluations: 142,
    passedEvaluations: 128,
    failedEvaluations: 14,
    pendingEvaluations: 14,
  };

  // Milestone Stats
  const milestoneStats = {
    totalMilestones: 89,
    completedMilestones: 67,
    inProgressMilestones: 15,
    overdueMilestones: 7,
  };

  const data = [
    { name: "Created", value: projectStats.created, color: "#3b82f6" },
    { name: "Ongoing", value: projectStats.ongoing, color: "#f59e0b" },
    { name: "Completed", value: projectStats.completed, color: "#10b981" },
    { name: "Cancelled", value: projectStats.cancelled, color: "#ef4444" },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "default",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
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
        className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
              {trend && trendValue && (
                <div className="flex items-center mt-1">
                  <TrendingUp
                    className={`w-4 h-4 mr-1 ${
                      trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Generate data based on selected date range
  const generateTimeSeriesData = () => {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const data = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      const monthName = current.toLocaleDateString("en-US", { month: "short" });
      const dayOfMonth = current.getDate();

      // Generate realistic data based on time progression
      const baseProjects = Math.floor(Math.random() * 15) + 5;
      const baseUsers = Math.floor(Math.random() * 50) + 140;
      const baseTransactions = Math.floor(Math.random() * 100) + 200;
      const baseEvaluations = Math.floor(Math.random() * 20) + 10;
      const baseMilestones = Math.floor(Math.random() * 25) + 15;

      data.push({
        date: current.toISOString().split("T")[0],
        month: `${monthName} ${dayOfMonth}`,
        projects: baseProjects,
        users: baseUsers,
        transactions: baseTransactions,
        evaluations: baseEvaluations,
        milestones: baseMilestones,
      });

      current.setDate(
        current.getDate() +
          Math.max(
            1,
            Math.floor(
              (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24 * 10)
            )
          )
      );
    }

    return data.slice(0, 12); // Limit to 12 data points for readability
  };

  // Performance Line Chart
  const PerformanceLineChart = () => {
    const data = generateTimeSeriesData();

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            {/* All metrics as line charts */}
            <Line
              type="monotone"
              dataKey="projects"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="evaluations"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="milestones"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Pie Chart for Project Status
  const ProjectStatusPieChart = () => {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Bar Chart for Major Distribution
  const MajorBarChart = () => {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={majorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Date Range Picker */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system activity and manage platform operations
          </p>
        </div>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>

            {/* From Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-36 justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from
                    ? new Date(dateRange.from).toLocaleDateString("vi-VN")
                    : "Choose start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  key={`from-${dateRange.from}`}
                  mode="single"
                  selected={
                    dateRange.from ? new Date(dateRange.from) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setDateRange((prev) => ({
                        ...prev,
                        from: date.toISOString().split("T")[0],
                      }));
                    }
                  }}
                  disabled={(date) => {
                    // Disable dates after the 'to' date if it's set
                    if (dateRange.to) {
                      return date > new Date(dateRange.to);
                    }
                    return false;
                  }}
                  defaultMonth={
                    dateRange.from ? new Date(dateRange.from) : undefined
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-gray-500">to</span>

            {/* To Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-36 justify-start text-left font-normal",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.to
                    ? new Date(dateRange.to).toLocaleDateString("vi-VN")
                    : "Choose end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  key={`to-${dateRange.to}`}
                  mode="single"
                  selected={dateRange.to ? new Date(dateRange.to) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setDateRange((prev) => ({
                        ...prev,
                        to: date.toISOString().split("T")[0],
                      }));
                    }
                  }}
                  disabled={(date) => {
                    // Disable dates before the 'from' date if it's set
                    if (dateRange.from) {
                      return date < new Date(dateRange.from);
                    }
                    return false;
                  }}
                  defaultMonth={
                    dateRange.to ? new Date(dateRange.to) : undefined
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateRange({
                  from: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 5,
                    1
                  )
                    .toISOString()
                    .split("T")[0],
                  to: new Date().toISOString().split("T")[0],
                });
              }}
            >
              <Filter className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          icon={FolderOpen}
          trend="up"
          trendValue="+12%"
          color="default"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.activeProjects}
          icon={Activity}
          trend="up"
          trendValue="+8%"
          color="success"
        />
        <StatCard
          title="Evaluations"
          value={evaluationStats.totalEvaluations}
          icon={Award}
          trend="up"
          trendValue="+6%"
          color="warning"
        />
        <StatCard
          title="Milestones"
          value={milestoneStats.totalMilestones}
          icon={Target}
          trend="up"
          trendValue="+10%"
          color="default"
        />
        <StatCard
          title="Active Users"
          value={userStats.activeUsers}
          icon={Users}
          trend="up"
          trendValue="+5%"
          color="success"
        />
      </div>

      {/* Overview Section */}
      <div className="space-y-8">
        {/* Charts Row 1 - Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                <span>Project Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectStatusPieChart />
            </CardContent>
          </Card>

          {/* Major Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Major Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MajorBarChart />
            </CardContent>
          </Card>
        </div>

        {/* Combined Performance Chart - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span>
                  Performance Analytics ({dateRange.from} to {dateRange.to})
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Evaluations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Transactions</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceLineChart />
          </CardContent>
        </Card>

        {/* Financial & Academic Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Financial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {formatVND(transactionStats.totalAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {transactionStats.totalTransactions}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600">
                      {transactionStats.pendingTransactions}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">
                      {transactionStats.monthlyTransactions}
                    </p>
                    <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing Rate</span>
                    <span className="font-medium">
                      {Math.round(
                        ((transactionStats.totalTransactions -
                          transactionStats.pendingTransactions) /
                          transactionStats.totalTransactions) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      ((transactionStats.totalTransactions -
                        transactionStats.pendingTransactions) /
                        transactionStats.totalTransactions) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Academic Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-indigo-200 rounded-full">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-xl font-bold text-indigo-600">
                      {academicStats.totalFields}
                    </p>
                    <p className="text-xs text-muted-foreground">Fields</p>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-cyan-200 rounded-full">
                      <Building2 className="w-6 h-6 text-cyan-600" />
                    </div>
                    <p className="text-xl font-bold text-cyan-600">
                      {academicStats.totalMajors}
                    </p>
                    <p className="text-xs text-muted-foreground">Majors</p>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-teal-200 rounded-full">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <p className="text-xl font-bold text-teal-600">
                      {academicStats.totalCouncils}
                    </p>
                    <p className="text-xs text-muted-foreground">Councils</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Council Members</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {academicStats.councilMembers}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Avg Projects/Council
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {academicStats.averageProjectsPerCouncil}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Row - Evaluations & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evaluation Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-600" />
                <span>Evaluation Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <p className="text-2xl font-bold text-orange-600">
                    {evaluationStats.totalEvaluations}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Evaluations
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-600">
                      {evaluationStats.passedEvaluations}
                    </p>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-red-600">
                      {evaluationStats.failedEvaluations}
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate</span>
                    <span className="font-medium">
                      {Math.round(
                        (evaluationStats.passedEvaluations /
                          evaluationStats.completedEvaluations) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (evaluationStats.passedEvaluations /
                        evaluationStats.completedEvaluations) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestone Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Milestone Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (milestoneStats.completedMilestones /
                        milestoneStats.totalMilestones) *
                        100
                    )}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-sm font-bold text-green-600">
                      {milestoneStats.completedMilestones}
                    </p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-bold text-yellow-600">
                      {milestoneStats.inProgressMilestones}
                    </p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <p className="text-sm font-bold text-red-600">
                      {milestoneStats.overdueMilestones}
                    </p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress
                    value={
                      (milestoneStats.completedMilestones /
                        milestoneStats.totalMilestones) *
                      100
                    }
                    className="h-3"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    {milestoneStats.completedMilestones}/
                    {milestoneStats.totalMilestones} milestones completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* User Roles Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span>User Roles Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">
                    Principal Investigators
                  </span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {userStats.principalInvestigators}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Researchers</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {userStats.researchers}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Staffs</span>
                  <Badge className="bg-green-100 text-green-800">
                    {userStats.staffs}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Host Institutions</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {userStats.hostInstitutions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                  <span className="text-sm font-medium">Council Members</span>
                  <Badge className="bg-teal-100 text-teal-800">
                    {userStats.councilMembers}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
      </div>
    </div>
  );
};

export default StaffDashboard;
