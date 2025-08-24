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
  Loader2,
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
// import { useDashboardSystemStats } from "@/hooks/queries/dashboard";
import {
  useDashboardSystemStats,
  useDashboardTransactions,
  useDashboardMilestonesProgress,
  useDashboardCouncils,
  useDashboardProjectStatus,
  useDashboardUserRoles,
  useDashboardMajorDistribution,
} from "@/hooks/queries/dashboard";
import { Loading } from "@/components";

interface DateRange {
  from: string | null;
  to: string | null;
}

const StaffDashboard: React.FC = () => {
  // Date range state - defaults to null as requested
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  // API queries with date range parameters
  const systemStatsQuery = useDashboardSystemStats(dateRange);
  const transactionsQuery = useDashboardTransactions(dateRange);
  const milestonesQuery = useDashboardMilestonesProgress();
  const councilsQuery = useDashboardCouncils();
  const projectStatusQuery = useDashboardProjectStatus(dateRange);
  const userRolesQuery = useDashboardUserRoles();
  const majorDistributionQuery = useDashboardMajorDistribution(dateRange);

  // Handle loading states
  // const isLoading =
  //   systemStatsQuery.isLoading ||
  //   transactionsQuery.isLoading ||
  //   milestonesQuery.isLoading ||
  //   councilsQuery.isLoading ||
  //   projectStatusQuery.isLoading ||
  //   userRolesQuery.isLoading ||
  //   majorDistributionQuery.isLoading;

  // Process API data
  const systemStats = systemStatsQuery.data?.data;
  const transactions = transactionsQuery.data?.data;
  const milestones = milestonesQuery.data?.data;
  const councils = councilsQuery.data?.data;
  const projectStatus = projectStatusQuery.data?.data;
  const userRoles = userRolesQuery.data?.data;
  const majorDistribution = majorDistributionQuery.data?.data;

  // Calculate evaluation stats (using mock data for now since no API provided)
  const evaluationStats = useMemo(
    () => ({
      totalEvaluations: systemStats?.["total-evaluations"] || 0,
      completedEvaluations: Math.floor(
        (systemStats?.["total-evaluations"] || 0) * 0.9
      ),
      passedEvaluations: Math.floor(
        (systemStats?.["total-evaluations"] || 0) * 0.8
      ),
      failedEvaluations: Math.floor(
        (systemStats?.["total-evaluations"] || 0) * 0.1
      ),
      pendingEvaluations: Math.floor(
        (systemStats?.["total-evaluations"] || 0) * 0.1
      ),
    }),
    [systemStats]
  );

  // Project status pie chart data
  const projectStatusPieData = useMemo(() => {
    if (!projectStatus) return [];
    return [
      { name: "Created", value: projectStatus.created, color: "#3b82f6" },
      {
        name: "In Progress",
        value: projectStatus["in-progress"],
        color: "#f59e0b",
      },
      { name: "Completed", value: projectStatus.completed, color: "#10b981" },
      { name: "Cancelled", value: projectStatus.cancelled, color: "#ef4444" },
    ];
  }, [projectStatus]);

  // Major distribution bar chart data
  const majorDistributionBarData = useMemo(() => {
    if (!majorDistribution) return [];
    return majorDistribution.map((item) => ({
      name: item["major-name"],
      value: item["project-count"],
    }));
  }, [majorDistribution]);

  // User roles processed for display
  const processedUserRoles = useMemo(() => {
    if (!userRoles) return {};

    const roles: { [key: string]: number } = {};
    userRoles.forEach((role) => {
      const roleName = role["role-name"];
      const count = role["user-count"];

      // Map API role names to our display names
      switch (roleName.toLowerCase()) {
        case "principal investigator":
          roles.principalInvestigators = count;
          break;
        case "researcher":
          roles.researchers = count;
          break;
        case "staff":
          roles.staffs = count;
          break;
        case "host institution":
          roles.hostInstitutions = count;
          break;
        case "appraisal council":
          roles.councilMembers = count;
          break;
        case "admin":
        case "leader":
          roles.admins = (roles.admins || 0) + count;
          break;
      }
    });

    return roles;
  }, [userRoles]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "default",
    isLoading: cardLoading = false,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    color?: "default" | "success" | "warning" | "error";
    isLoading?: boolean;
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
              {cardLoading ? (
                <div className="flex items-center space-x-2">
                  <Loading />
                </div>
              ) : (
                <>
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
                </>
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
    const startDate = dateRange.from
      ? new Date(dateRange.from)
      : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
    const endDate = dateRange.to ? new Date(dateRange.to) : new Date();
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

    return data.slice(0, 12);
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
    if (projectStatusQuery.isLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projectStatusPieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {projectStatusPieData.map((entry, index) => (
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
    if (majorDistributionQuery.isLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={majorDistributionBarData}>
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

  // Reset date range function
  const resetDateRange = () => {
    setDateRange({ from: null, to: null });
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
                    : "00-00-0000"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
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
                    if (dateRange.to) {
                      return date > new Date(dateRange.to);
                    }
                    return false;
                  }}
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
                    : "00-00-0000"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
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
                    if (dateRange.from) {
                      return date < new Date(dateRange.from);
                    }
                    return false;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={resetDateRange}>
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
          value={systemStats?.["total-projects-created"] || 0}
          icon={FolderOpen}
          trend="up"
          trendValue="+12%"
          color="default"
          isLoading={systemStatsQuery.isLoading}
        />
        <StatCard
          title="Active Projects"
          value={systemStats?.["active-projects"] || 0}
          icon={Activity}
          trend="up"
          trendValue="+8%"
          color="success"
          isLoading={systemStatsQuery.isLoading}
        />
        <StatCard
          title="Evaluations"
          value={systemStats?.["total-evaluations"] || 0}
          icon={Award}
          trend="up"
          trendValue="+6%"
          color="warning"
          isLoading={systemStatsQuery.isLoading}
        />
        <StatCard
          title="Milestones"
          value={systemStats?.["total-milestones"] || 0}
          icon={Target}
          trend="up"
          trendValue="+10%"
          color="default"
          isLoading={systemStatsQuery.isLoading}
        />
        <StatCard
          title="Active Users"
          value={systemStats?.["active-users"] || 0}
          icon={Users}
          trend="up"
          trendValue="+5%"
          color="success"
          isLoading={systemStatsQuery.isLoading}
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
                  Performance Analytics ({dateRange.from || "All time"} to{" "}
                  {dateRange.to || "Present"})
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
              {transactionsQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="text-2xl font-bold text-green-600">
                      {formatVND(transactions?.["total-money"] || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {transactions?.["total-transactions"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-bold text-yellow-600">
                        {transactions?.["pending-transactions"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">
                        {transactions?.["average-monthly"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Monthly Avg
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing Rate</span>
                      <span className="font-medium">
                        {transactions?.["processing-rate"] || "0%"}
                      </span>
                    </div>
                    <Progress
                      value={parseFloat(
                        transactions?.["processing-rate"]?.replace("%", "") ||
                          "0"
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              )}
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
              {councilsQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-indigo-200 rounded-full">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-xl font-bold text-indigo-600">
                        {councils?.["total-fields"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Fields</p>
                    </div>
                    <div className="text-center p-4 bg-cyan-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-cyan-200 rounded-full">
                        <Building2 className="w-6 h-6 text-cyan-600" />
                      </div>
                      <p className="text-xl font-bold text-cyan-600">
                        {councils?.["total-majors"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Majors</p>
                    </div>
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-teal-200 rounded-full">
                        <Users className="w-6 h-6 text-teal-600" />
                      </div>
                      <p className="text-xl font-bold text-teal-600">
                        {processedUserRoles.councilMembers || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Councils</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Council Members
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {councils?.["total-council-members"] || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Avg Projects/Council
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {councils?.["average-projects-per-council"] || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
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
              {systemStatsQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
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
                        {evaluationStats.completedEvaluations > 0
                          ? Math.round(
                              (evaluationStats.passedEvaluations /
                                evaluationStats.completedEvaluations) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        evaluationStats.completedEvaluations > 0
                          ? (evaluationStats.passedEvaluations /
                              evaluationStats.completedEvaluations) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              )}
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
              {milestonesQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">
                      {milestones?.["completion-rate"] || "0%"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completion Rate
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-sm font-bold text-green-600">
                        {milestones?.["completed-milestones"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-bold text-yellow-600">
                        {milestones?.["in-progress-milestones"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <p className="text-sm font-bold text-red-600">
                        {milestones?.["cancelled-milestones"] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Cancelled</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={parseFloat(
                        milestones?.["completion-rate"]?.replace("%", "") || "0"
                      )}
                      className="h-3"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {milestones?.["completed-milestones"] || 0}/
                      {milestones?.["total-milestones"] || 0} milestones
                      completed
                    </p>
                  </div>
                </div>
              )}
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
              {userRolesQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Principal Investigators
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {processedUserRoles.principalInvestigators || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Researchers</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {processedUserRoles.researchers || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Staffs</span>
                    <Badge className="bg-green-100 text-green-800">
                      {processedUserRoles.staffs || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Host Institutions
                    </span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {processedUserRoles.hostInstitutions || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                    <span className="text-sm font-medium">Council Members</span>
                    <Badge className="bg-teal-100 text-teal-800">
                      {processedUserRoles.councilMembers || 0}
                    </Badge>
                  </div>
                  {processedUserRoles.admins && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Admins & Leaders
                      </span>
                      <Badge className="bg-gray-100 text-gray-800">
                        {processedUserRoles.admins}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
