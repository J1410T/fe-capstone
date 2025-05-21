import React, { useState } from "react";
import { Loading } from "@/components/ui/loaders";
import {
  DashboardHeader,
  StatsOverview,
  ProjectStatusChart,
  FundingChart,
  RecentProjects,
} from "./components";
import { getStatusColor } from "./utils/statusHelpers";

// Mock data for the dashboard
const projectStatusData = [
  { name: "Pending", value: 12, color: "#f59e0b" },
  { name: "In Progress", value: 18, color: "#3b82f6" },
  { name: "Completed", value: 24, color: "#10b981" },
];

const fundingData = [
  { name: "Q1", proposed: 120000, disbursed: 95000 },
  { name: "Q2", proposed: 180000, disbursed: 150000 },
  { name: "Q3", proposed: 220000, disbursed: 180000 },
  { name: "Q4", proposed: 280000, disbursed: 210000 },
];

const recentProjects = [
  {
    id: 1,
    title: "AI-Driven Healthcare Solutions",
    pi: "Dr. Jane Smith",
    department: "Computer Science",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    title: "Sustainable Energy Research",
    pi: "Dr. Michael Johnson",
    department: "Engineering",
    status: "Pending",
    progress: 20,
  },
  {
    id: 3,
    title: "Market Analysis Framework",
    pi: "Dr. Sarah Williams",
    department: "Business",
    status: "Completed",
    progress: 100,
  },
];

const HostDashboard: React.FC = () => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Stats Overview */}
      <StatsOverview
        totalProjects={54}
        totalPIs={32}
        totalFunding="$800,000"
        completionRate="78%"
      />

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <ProjectStatusChart data={projectStatusData} />
        <FundingChart data={fundingData} />
      </div>

      {/* Recent Projects */}
      <RecentProjects
        projects={recentProjects}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default HostDashboard;
