import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  UserCheck,
  Zap,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { formatVND } from "@/utils";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration (budget in VND)
const systemStats = {
  totalUsers: 1247,
  activeProjects: 89,
  pendingApprovals: 23,
  totalBudget: 58800000000, // ~2.45M USD in VND
  monthlyGrowth: 12.5,
  systemUptime: 99.9,
};

const recentActivity = [
  {
    id: 1,
    type: "project_created",
    message: "New project 'AI Research Initiative' created by Dr. Smith",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    type: "approval_pending",
    message: "Budget request for $50,000 awaiting approval",
    timestamp: "4 hours ago",
    status: "warning",
  },
  {
    id: 3,
    type: "user_registered",
    message: "5 new researchers registered today",
    timestamp: "6 hours ago",
    status: "info",
  },
  {
    id: 4,
    type: "payment_processed",
    message: "Payment of $25,000 processed for Project Alpha",
    timestamp: "8 hours ago",
    status: "success",
  },
];

const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

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

  const ActivityItem = ({
    activity,
  }: {
    activity: (typeof recentActivity)[0];
  }) => {
    const statusColors = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };

    const statusIcons = {
      success: CheckCircle,
      warning: AlertCircle,
      error: AlertCircle,
      info: Activity,
    };

    const StatusIcon = statusIcons[activity.status as keyof typeof statusIcons];

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div
          className={`p-1 rounded-full ${
            statusColors[activity.status as keyof typeof statusColors]
          }`}
        >
          <StatusIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {activity.message}
          </p>
          <p className="text-xs text-gray-500">{activity.timestamp}</p>
        </div>
      </div>
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
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Quick Navigation for Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation (Testing)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/staff/forms")}
              className="flex flex-col h-20"
            >
              <FileText className="w-6 h-6 mb-2" />
              BM Forms
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/staff/projects/register")}
              className="flex flex-col h-20"
            >
              <FolderOpen className="w-6 h-6 mb-2" />
              Register Project
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/staff/projects/assignments")}
              className="flex flex-col h-20"
            >
              <Users className="w-6 h-6 mb-2" />
              Assignments
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/staff/approvals")}
              className="flex flex-col h-20"
            >
              <CheckCircle className="w-6 h-6 mb-2" />
              Approvals
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/staff/payments")}
              className="flex flex-col h-20"
            >
              <DollarSign className="w-6 h-6 mb-2" />
              Payments
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/staff/users")}
              className="flex flex-col h-20"
            >
              <Users className="w-6 h-6 mb-2" />
              User Management
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={systemStats.totalUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+12.5%"
          color="success"
        />
        <StatCard
          title="Active Projects"
          value={systemStats.activeProjects}
          icon={FolderOpen}
          trend="up"
          trendValue="+8.2%"
          color="default"
        />
        <StatCard
          title="Pending Approvals"
          value={systemStats.pendingApprovals}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Total Budget"
          value={formatVND(systemStats.totalBudget)}
          icon={DollarSign}
          trend="up"
          trendValue="+15.3%"
          color="success"
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
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {systemStats.systemUptime}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm font-bold">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Server Load</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      Low
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Projects This Month
                    </span>
                    <span className="text-sm font-bold">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Forms Submitted</span>
                    <span className="text-sm font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Payments Processed
                    </span>
                    <span className="text-sm font-bold">$1.2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  User management features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  System configuration panel coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
