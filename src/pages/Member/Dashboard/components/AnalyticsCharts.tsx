import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target, 
  FileText, 
  BookOpen,
  Award
} from "lucide-react";

// Mock data for analytics
const projectProgress = [
  { name: "AI Research Platform", completion: 85, status: "On Track" },
  { name: "Data Analysis Tool", completion: 62, status: "In Progress" },
  { name: "Machine Learning Model", completion: 94, status: "Near Completion" },
  { name: "User Interface Design", completion: 38, status: "Early Stage" },
  { name: "Security Audit System", completion: 100, status: "Completed" },
];

const taskDistribution = [
  { status: "Completed", count: 8, percentage: 50, color: "bg-green-500" },
  { status: "In Progress", count: 3, percentage: 19, color: "bg-blue-500" },
  { status: "To Do", count: 4, percentage: 25, color: "bg-slate-400" },
  { status: "Overdue", count: 1, percentage: 6, color: "bg-red-500" },
];

const researchOutput = [
  { month: "Jan", articles: 2, reports: 1, presentations: 3 },
  { month: "Feb", articles: 3, reports: 2, presentations: 2 },
  { month: "Mar", articles: 1, reports: 3, presentations: 4 },
  { month: "Apr", articles: 4, reports: 2, presentations: 3 },
  { month: "May", articles: 2, reports: 4, presentations: 5 },
  { month: "Jun", articles: 3, reports: 3, presentations: 2 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Near Completion":
      return "bg-blue-100 text-blue-700";
    case "On Track":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Early Stage":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const AnalyticsCharts: React.FC = () => {
  const totalTasks = taskDistribution.reduce((sum, item) => sum + item.count, 0);
  const totalOutput = researchOutput.reduce((sum, month) => 
    sum + month.articles + month.reports + month.presentations, 0
  );

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Analytics Overview</h2>
        <p className="text-sm text-slate-600">
          Visual insights into your project progress, task distribution, and research output
        </p>
      </div>

      {/* Project Progress Section */}
      <div>
        <h3 className="text-md font-medium text-slate-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Project Progress
        </h3>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700">
              Completion Percentage by Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectProgress.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    {project.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <span className="text-sm font-medium text-slate-600">
                      {project.completion}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={project.completion} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task Distribution Section */}
      <div>
        <h3 className="text-md font-medium text-slate-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-green-600" />
          Task Distribution
        </h3>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700">
              Tasks by Status ({totalTasks} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Visual Bar Chart */}
              <div className="space-y-3">
                {taskDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {item.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">
                          {item.count} tasks
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((taskDistribution[0].count / totalTasks) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Completion Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {taskDistribution[1].count}
                    </div>
                    <div className="text-xs text-slate-500">Active Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Output Section */}
      <div>
        <h3 className="text-md font-medium text-slate-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Research Output
        </h3>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700">
              Monthly Research Output by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Output Types Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600">Articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600">Presentations</span>
                </div>
              </div>

              {/* Monthly Data */}
              <div className="space-y-3">
                {researchOutput.map((month, index) => {
                  const monthTotal = month.articles + month.reports + month.presentations;
                  const maxValue = Math.max(...researchOutput.map(m => m.articles + m.reports + m.presentations));
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 w-12">
                          {month.month}
                        </span>
                        <div className="flex items-center space-x-4 text-xs text-slate-600">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-blue-500" />
                            <span>{month.articles}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3 text-green-500" />
                            <span>{month.reports}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3 text-purple-500" />
                            <span>{month.presentations}</span>
                          </div>
                          <span className="font-medium text-slate-900">
                            Total: {monthTotal}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(monthTotal / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {researchOutput.reduce((sum, m) => sum + m.articles, 0)}
                    </div>
                    <div className="text-xs text-slate-500">Total Articles</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {researchOutput.reduce((sum, m) => sum + m.reports, 0)}
                    </div>
                    <div className="text-xs text-slate-500">Total Reports</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {researchOutput.reduce((sum, m) => sum + m.presentations, 0)}
                    </div>
                    <div className="text-xs text-slate-500">Total Presentations</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
