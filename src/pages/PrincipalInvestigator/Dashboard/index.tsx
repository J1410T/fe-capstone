import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Target,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
} from "lucide-react";
import { Project, Milestone, ProgressReport } from "../shared/types";
import { StatusBadge } from "../shared/components";
import { formatDate, getCurrentQuarter, getTimeLimit } from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      setTimeout(() => {
        // Mock data
        const mockProjects: Project[] = [
          {
            id: "1",
            name: "Machine Learning for Medical Diagnosis",
            type: "Application",
            objective: "Develop AI algorithms for early disease detection",
            description:
              "Research project focusing on ML applications in healthcare",
            status: "Active",
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            pi: user?.name || "Principal Investigator",
          },
          {
            id: "2",
            name: "Quantum Computing Research",
            type: "Basic",
            objective: "Explore quantum algorithms for optimization",
            description: "Basic research in quantum computing applications",
            status: "Under Review",
            createdAt: "2024-03-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            pi: user?.name || "Principal Investigator",
          },
        ];

        const mockMilestones: Milestone[] = [
          {
            id: "1",
            name: "Literature Review",
            description: "Complete comprehensive literature review",
            deadline: "2024-03-31",
            status: "Completed",
            progress: 100,
            tasks: [],
          },
          {
            id: "2",
            name: "Data Collection",
            description: "Gather and prepare datasets",
            deadline: "2024-06-30",
            status: "In Progress",
            progress: 75,
            tasks: [],
          },
          {
            id: "3",
            name: "Algorithm Development",
            description: "Develop and test ML algorithms",
            deadline: "2024-09-30",
            status: "Not Started",
            progress: 0,
            tasks: [],
          },
        ];

        const mockReports: ProgressReport[] = [
          {
            id: "1",
            formCode: "BM06",
            title: "Q1 2024 Progress Report",
            period: "January - March 2024",
            submittedAt: "2024-03-31T23:59:00Z",
            status: "Approved",
          },
          {
            id: "2",
            formCode: "BM06",
            title: "Q2 2024 Progress Report",
            period: "April - June 2024",
            submittedAt: "2024-06-30T23:59:00Z",
            status: "Processing",
          },
        ];

        setProjects(mockProjects);
        setMilestones(mockMilestones);
        setReports(mockReports);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setIsLoading(false);
    }
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "Active").length,
      underReview: projects.filter((p) => p.status === "Under Review").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    };
  };

  const getMilestoneStats = () => {
    return {
      total: milestones.length,
      completed: milestones.filter((m) => m.status === "Completed").length,
      inProgress: milestones.filter((m) => m.status === "In Progress").length,
      overdue: milestones.filter(
        (m) => new Date(m.deadline) < new Date() && m.status !== "Completed"
      ).length,
    };
  };

  const getReportStats = () => {
    return {
      total: reports.length,
      approved: reports.filter((r) => r.status === "Approved").length,
      processing: reports.filter((r) => r.status === "Processing").length,
      pending: reports.filter((r) => r.status === "Draft").length,
    };
  };

  const getMilestoneChartData = () => {
    return milestones.map((milestone) => ({
      name:
        milestone.name.length > 15
          ? milestone.name.substring(0, 15) + "..."
          : milestone.name,
      progress: milestone.progress,
      status: milestone.status,
    }));
  };

  const getProjectTypeData = () => {
    const basic = projects.filter((p) => p.type === "Basic").length;
    const application = projects.filter((p) => p.type === "Application").length;

    return [
      { name: "Basic Research", value: basic, color: "#3B82F6" },
      { name: "Application Research", value: application, color: "#10B981" },
    ];
  };

  const projectStats = getProjectStats();
  const milestoneStats = getMilestoneStats();
  const reportStats = getReportStats();
  const milestoneChartData = getMilestoneChartData();
  const projectTypeData = getProjectTypeData();
  const currentQuarter = getCurrentQuarter();
  const timeLimit = getTimeLimit();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PI Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's your research overview.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/pi/project-registration")}
            disabled={!timeLimit.isActive}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          <Button onClick={() => navigate("/pi/progress-reports")}>
            <FileText className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </div>
      </div>

      {/* Quarter Info */}
      <Card
        className={
          timeLimit.isActive
            ? "border-green-200 bg-green-50"
            : "border-yellow-200 bg-yellow-50"
        }
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Quarter {currentQuarter} - Project Registration
              </p>
              <p className="text-sm text-muted-foreground">
                {timeLimit.isActive
                  ? `${timeLimit.allowedProjectTypes.join(
                      ", "
                    )} projects can be created until ${formatDate(
                      timeLimit.deadline
                    )}`
                  : "Project registration is currently closed"}
              </p>
            </div>
            <Badge variant={timeLimit.isActive ? "default" : "secondary"}>
              {timeLimit.isActive ? "Open" : "Closed"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{projectStats.total}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{milestoneStats.completed}</p>
                <p className="text-sm text-muted-foreground">
                  Completed Milestones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reportStats.approved}</p>
                <p className="text-sm text-muted-foreground">
                  Approved Reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{milestoneStats.overdue}</p>
                <p className="text-sm text-muted-foreground">
                  Overdue Milestones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Progress</CardTitle>
            <CardDescription>
              Progress tracking for current milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={milestoneChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Distribution</CardTitle>
            <CardDescription>Breakdown by research type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest research projects</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/pi/projects")}
              >
                <Eye className="w-3 h-3 mr-1" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.type} Research
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No projects yet. Create your first project to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Milestones and reports due soon
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/pi/milestones")}
              >
                <Eye className="w-3 h-3 mr-1" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones
                .filter((m) => m.status !== "Completed")
                .sort(
                  (a, b) =>
                    new Date(a.deadline).getTime() -
                    new Date(b.deadline).getTime()
                )
                .slice(0, 3)
                .map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{milestone.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {formatDate(milestone.deadline)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={milestone.status} />
                      <div className="mt-1">
                        <Progress value={milestone.progress} className="w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              {milestones.filter((m) => m.status !== "Completed").length ===
                0 && (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming deadlines.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
