import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, Users, Filter } from "lucide-react";

interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface TaskStatsCardsProps {
  stats: TaskStats;
  teamMembers?: number;
  projectTags?: number;
  showExtendedStats?: boolean;
}

export const TaskStatsCards: React.FC<TaskStatsCardsProps> = ({
  stats,
  teamMembers,
  projectTags,
  showExtendedStats = false,
}) => {
  const baseStats = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: BarChart3,
      color: "bg-slate-100 text-slate-600",
      iconColor: "text-slate-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: () => <div className="w-3 h-3 bg-blue-500 rounded-full"></div>,
      color: "text-blue-900",
      iconColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: () => <div className="w-3 h-3 bg-green-500 rounded-full"></div>,
      color: "text-green-900",
      iconColor: "bg-green-100",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: Calendar,
      color: "text-red-900",
      iconColor: "bg-red-100 text-red-600",
    },
  ];

  const extendedStats = [
    ...(teamMembers !== undefined
      ? [
          {
            title: "Team Members",
            value: teamMembers,
            icon: Users,
            color: "text-purple-900",
            iconColor: "bg-purple-100 text-purple-600",
          },
        ]
      : []),
    ...(projectTags !== undefined
      ? [
          {
            title: "Projects",
            value: projectTags,
            icon: Filter,
            color: "text-indigo-900",
            iconColor: "bg-indigo-100 text-indigo-600",
          },
        ]
      : []),
  ];

  const statsToShow = showExtendedStats ? [...baseStats, ...extendedStats] : baseStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {statsToShow.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.iconColor}`}
                >
                  {typeof IconComponent === "function" && IconComponent.name ? (
                    <IconComponent className="w-4 h-4" />
                  ) : (
                    <IconComponent />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
