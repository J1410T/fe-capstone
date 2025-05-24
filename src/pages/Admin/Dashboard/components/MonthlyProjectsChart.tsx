import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyProjectData {
  month: string;
  projects: number;
  budget: number;
}

interface MonthlyProjectsChartProps {
  data: MonthlyProjectData[];
}

export const MonthlyProjectsChart: React.FC<MonthlyProjectsChartProps> = ({ data }) => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Monthly Projects & Budget</CardTitle>
        <CardDescription>
          Number of projects and budget allocation by month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="projects"
                fill="#8884d8"
                name="Projects"
              />
              <Bar
                yAxisId="right"
                dataKey="budget"
                fill="#82ca9d"
                name="Budget ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
