import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  // Clock, // Unused import
  PlayCircle,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

// Mock data for demonstration
const taskStats = {
  total: 12,
  completed: 8,
  inProgress: 3,
  overdue: 1,
};

const fundingStats = {
  totalRequests: 5,
  approved: 3,
  pending: 1,
  rejected: 1,
  totalAmount: 45000,
  approvedAmount: 32000,
};

const recentActivity = [
  {
    id: 1,
    type: "task_completed",
    title: "Completed Q4 Financial Report Review",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "funding_approved",
    title: "Research Equipment Funding Approved",
    time: "1 day ago",
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "task_assigned",
    title: "New task assigned: Client Onboarding Update",
    time: "2 days ago",
    icon: PlayCircle,
    color: "text-orange-600",
  },
];

export const DashboardOverview: React.FC = () => {
  const completionRate =
    taskStats.total > 0
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;
  const approvalRate =
    fundingStats.totalRequests > 0
      ? Math.round((fundingStats.approved / fundingStats.totalRequests) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Task Summary Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Task Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {taskStats.total}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {completionRate}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {taskStats.completed}
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 mt-2"
              >
                {completionRate}% completion rate
              </Badge>
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                In Progress
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {taskStats.inProgress}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Active tasks in progress
              </p>
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {taskStats.overdue}
              </div>
              {taskStats.overdue > 0 ? (
                <Badge variant="destructive" className="mt-2">
                  Needs attention
                </Badge>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  All tasks on track
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Funding Summary Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Funding Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Requests */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Requests
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {fundingStats.totalRequests}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                ${fundingStats.totalAmount.toLocaleString()} requested
              </p>
            </CardContent>
          </Card>

          {/* Approved Requests */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Approved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {fundingStats.approved}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  {approvalRate}% approval rate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Approved Amount */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Approved Amount
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${fundingStats.approvedAmount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {Math.round(
                  (fundingStats.approvedAmount / fundingStats.totalAmount) * 100
                )}
                % of requested amount
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Activity
        </h2>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full bg-slate-100 ${activity.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
