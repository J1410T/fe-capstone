import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  FileText,
  Users,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

interface StatCardsProps {
  totalProjects: number;
  activeUsers: number;
  pendingApprovals: number;
  totalBudget: number;
  projectsChange: string;
  usersChange: string;
  approvalsChange: string;
  budgetChange: string;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalProjects,
  activeUsers,
  pendingApprovals,
  totalBudget,
  projectsChange,
  usersChange,
  approvalsChange,
  budgetChange,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Projects"
        value={totalProjects}
        change={projectsChange}
        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Users"
        value={activeUsers}
        change={usersChange}
        icon={<Users className="w-4 h-4 text-muted-foreground" />}
      />
      <StatCard
        title="Pending Approvals"
        value={pendingApprovals}
        change={approvalsChange}
        icon={<Clock className="w-4 h-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Budget"
        value={`$${totalBudget.toLocaleString()}`}
        change={budgetChange}
        icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
      />
    </div>
  );
};
