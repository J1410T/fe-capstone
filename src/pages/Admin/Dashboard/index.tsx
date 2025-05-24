import React from "react";
import {
  StatCards,
  MonthlyProjectsChart,
  ProjectStatusChart,
  UserRolesChart,
  PendingForms,
  RecentNotifications,
} from "./components";

/**
 * Admin Dashboard page with system overview
 */
const AdminDashboard: React.FC = () => {
  // Sample data for charts and statistics
  const projectStatusData = [
    { name: "Ongoing", value: 12, color: "#4f46e5" },
    { name: "Completed", value: 8, color: "#10b981" },
    { name: "Rejected", value: 3, color: "#ef4444" },
    { name: "Pending", value: 5, color: "#f59e0b" },
  ];

  // const budgetData = [
  //   { name: "Disbursed", value: 65, color: "#10b981" },
  //   { name: "Remaining", value: 35, color: "#f59e0b" },
  // ];

  const userRoleData = [
    { name: "PI", value: 15, color: "#4f46e5" },
    { name: "Member", value: 42, color: "#10b981" },
    { name: "Council", value: 8, color: "#f59e0b" },
    { name: "Staff", value: 5, color: "#ef4444" },
  ];

  // const projectProgressData = [
  //   { name: "On Track", value: 75, color: "#10b981" },
  //   { name: "Delayed", value: 25, color: "#ef4444" },
  // ];

  const monthlyProjectData = [
    { month: "Jan", projects: 5, budget: 50000 },
    { month: "Feb", projects: 7, budget: 70000 },
    { month: "Mar", projects: 10, budget: 100000 },
    { month: "Apr", projects: 8, budget: 80000 },
    { month: "May", projects: 12, budget: 120000 },
    { month: "Jun", projects: 15, budget: 150000 },
  ];

  const pendingFormsData = [
    { type: "BM05", count: 7 },
    { type: "BM06", count: 4 },
    { type: "Budget Plans", count: 9 },
  ];

  const recentNotifications = [
    {
      id: 1,
      title: "New project proposal submitted",
      time: "10 minutes ago",
      type: "approval" as const,
    },
    {
      id: 2,
      title: "Budget request needs review",
      time: "1 hour ago",
      type: "budget" as const,
    },
    {
      id: 3,
      title: "User account activation request",
      time: "3 hours ago",
      type: "user" as const,
    },
    {
      id: 4,
      title: "Form BM05 submitted for review",
      time: "Yesterday",
      type: "form" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated:</span>
          <span className="text-sm font-medium">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <StatCards
        totalProjects={28}
        activeUsers={70}
        pendingApprovals={12}
        totalBudget={570000}
        projectsChange="+2 from last month"
        usersChange="+5 from last month"
        approvalsChange="-3 from last week"
        budgetChange="+$120,000 from last quarter"
      />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlyProjectsChart data={monthlyProjectData} />
        <ProjectStatusChart data={projectStatusData} />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UserRolesChart data={userRoleData} />
        <PendingForms data={pendingFormsData} />
        <RecentNotifications notifications={recentNotifications} />
      </div>
    </div>
  );
};

export default AdminDashboard;
