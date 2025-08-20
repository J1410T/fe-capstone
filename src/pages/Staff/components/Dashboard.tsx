import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Activity,
  UserCheck,
  Target,
  BookOpen,
  Building2,
  XCircle,
  Clock,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { formatVND } from "../shared";

// Project interface based on the provided data structure
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

// Academic Management Stats
const academicStats = {
  totalFields: 8,
  totalMajors: 24,
  totalCouncils: 6,
  activeCouncils: 4,
  councilMembers: 18,
};

const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system activity and manage platform operations
          </p>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          icon={FolderOpen}
          trend="up"
          color="default"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.activeProjects}
          icon={Activity}
          trend="up"
          color="success"
        />
        <StatCard
          title="Total Transactions"
          value={transactionStats.totalTransactions}
          icon={DollarSign}
          trend="up"
          color="success"
        />
        <StatCard
          title="Active Users"
          value={userStats.activeUsers}
          icon={Users}
          trend="up"
          color="default"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="w-4 h-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Finance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Project Status Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-200 rounded-full">
                        <FolderOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {projectStats.created}
                      </p>
                      <p className="text-sm text-muted-foreground">Created</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-200 rounded-full">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {projectStats.ongoing}
                      </p>
                      <p className="text-sm text-muted-foreground">Ongoing</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-200 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {projectStats.completed}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-red-200 rounded-full">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {projectStats.cancelled}
                      </p>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Transaction Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {formatVND(transactionStats.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xl font-bold text-yellow-600">
                        {transactionStats.pendingTransactions}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-sm font-medium text-yellow-600">
                        {formatVND(transactionStats.pendingAmount)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">
                        {transactionStats.monthlyTransactions}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly</p>
                      <p className="text-sm font-medium text-blue-600">
                        {formatVND(transactionStats.monthlyAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Academic Management Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-indigo-100 rounded-full">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {academicStats.totalFields}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Academic Fields
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-cyan-100 rounded-full">
                    <Building2 className="w-8 h-8 text-cyan-600" />
                  </div>
                  <p className="text-2xl font-bold text-cyan-600">
                    {academicStats.totalMajors}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Academic Majors
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-teal-100 rounded-full">
                    <Users className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-2xl font-bold text-teal-600">
                    {academicStats.totalCouncils}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Appraisal Councils
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {academicStats.activeCouncils} Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Project Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Total Projects (Non-Proposal)
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {projectStats.total}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Active Projects (In Progress)
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {projectStats.activeProjects}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Project Completion Rate</span>
                      <span>
                        {Math.round(
                          (projectStats.completed / projectStats.total) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (projectStats.completed / projectStats.total) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Status Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{projectStats.created}</Badge>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (projectStats.created / projectStats.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ongoing</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{projectStats.ongoing}</Badge>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (projectStats.ongoing / projectStats.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {projectStats.completed}
                      </Badge>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (projectStats.completed / projectStats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelled</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {projectStats.cancelled}
                      </Badge>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (projectStats.cancelled / projectStats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Management Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {userStats.totalUsers}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Users
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {userStats.activeUsers}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active Users
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Activity Rate</span>
                      <span>
                        {Math.round(
                          (userStats.activeUsers / userStats.totalUsers) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (userStats.activeUsers / userStats.totalUsers) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Roles Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>User Roles Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Principal Investigators</span>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      {userStats.principalInvestigators}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Researchers</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {userStats.researchers}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staffs</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {userStats.staffs}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Host Institutions</span>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      {userStats.hostInstitutions}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Council Members</span>
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-800"
                    >
                      {userStats.councilMembers}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Transaction Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {formatVND(transactionStats.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Transaction Amount
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">
                        {transactionStats.totalTransactions}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xl font-bold text-yellow-600">
                        {transactionStats.pendingTransactions}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600">
                        {transactionStats.monthlyTransactions}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Financial Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Amount</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {formatVND(transactionStats.pendingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Amount</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatVND(transactionStats.monthlyAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Rate</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {Math.round(
                          ((transactionStats.totalTransactions -
                            transactionStats.pendingTransactions) /
                            transactionStats.totalTransactions) *
                            100
                        )}
                        %
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          ((transactionStats.totalTransactions -
                            transactionStats.pendingTransactions) /
                            transactionStats.totalTransactions) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
