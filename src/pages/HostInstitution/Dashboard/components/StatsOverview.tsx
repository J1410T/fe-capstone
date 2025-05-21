import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface StatsOverviewProps {
  totalProjects: number;
  totalPIs: number;
  totalFunding: string;
  completionRate: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalProjects,
  totalPIs,
  totalFunding,
  completionRate,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Projects
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Principal Investigators
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalPIs}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Funding
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalFunding}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </p>
              <h3 className="text-2xl font-bold mt-1">{completionRate}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
