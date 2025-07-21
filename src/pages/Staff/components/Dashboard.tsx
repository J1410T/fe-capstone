import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  FileText,
  UserCheck,
  Zap,
  Target,
  Calendar,
  ChevronRight,
  BookOpen,
  Building2,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { formatVND } from "@/utils";

// Project interface based on the provided data structure
interface Project {
  id: string;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  language: string;
  category: string;
  type: string;
  genre: string;
  status: string;
  progress: number;
  "maximum-member": number;
  "created-at": string;
  "updated-at": string | null;
  "creator-id": string;
  majors: Array<{
    id: string;
    name: string;
    field: {
      id: string;
      name: string;
    };
  }>;
  "project-tags": Array<{
    name: string;
  }>;
}

// Mock projects data (using the same data from ProjectManagementOverview)
const mockProjects: Project[] = [
  {
    id: "7a117ebd-e5c0-459f-a977-075b492a9aa1",
    code: "PRJ015",
    "english-title": "BookStreet - The application helps people look up information about books for Ho Chi Minh city bookstreet company",
    "vietnamese-title": "BookStreet - Ứng dụng giúp mọi người tra cứu thông tin về sách cho công ty đường sách TP.HCM",
    language: "Vietnamese",
    category: "basic",
    type: "school level",
    genre: "proposal",
    status: "created",
    progress: 15,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "403c10a6-4889-49c6-b3b7-75d65572e1ee",
    majors: [],
    "project-tags": [],
  },
  {
    id: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    code: "PRJ002",
    "english-title": "Science Research Project Management",
    "vietnamese-title": "Ứng dụng quản lý đề tài khoa học",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "created",
    progress: 45,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [
      {
        id: "74c32ee6-b8a6-4455-8b34-02321af11590",
        name: "Software Engineering",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      },
      {
        id: "b32a4b6e-3d34-4f79-a345-6b7c08e28474",
        name: "Computer Networks & Data Communication",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      }
    ],
    "project-tags": [
      { name: "task management" },
      { name: "science" },
      { name: "research" },
      { name: "management" },
      { name: "project" },
      { name: "task" },
      { name: "project management" },
      { name: "AI plagmarism" }
    ],
  },
  {
    id: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
    code: "PRJ001",
    "english-title": "AI-based Learning Support System",
    "vietnamese-title": "Hệ thống hỗ trợ học tập dùng AI",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "created",
    progress: 75,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [
      {
        id: "57027f18-9e31-40e6-8df7-633bed2a0131",
        name: "Artificial Intelligence",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      },
      {
        id: "43933e55-b97a-4920-ae62-f1b3c3c111db",
        name: "Psychology",
        field: {
          id: "cf080a69-8860-4751-91f2-c320c767dfb2",
          name: "Social Sciences & Humanities"
        }
      }
    ],
    "project-tags": [],
  },
  {
    id: "a07cbf07-c165-459c-b99f-2023cbe32653",
    code: "PRJ007",
    "english-title": "FUC - Capstone management system for FPT university teachers and students",
    "vietnamese-title": "FUC - Hệ thống quản lý đồ án cho giảng viên và sinh viên của trường đại học FPT",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "propose",
    status: "created",
    progress: 30,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "2427d29b-b64f-4315-b8b4-b0bf2f3c4cee",
    majors: [],
    "project-tags": [],
  },
];

// Mock data for all Staff components (amounts in VND)
const systemStats = {
  totalUsers: 1247,
  activeProjects: mockProjects.length,
  pendingApprovals: 23,
  totalBudget: 58800000000, // ~2.45M USD in VND
  monthlyGrowth: 12.5,
  systemUptime: 99.9,
};

// User Management Stats
const userStats = {
  totalUsers: 4,
  activeUsers: 2,
  pendingUsers: 1,
  inactiveUsers: 1,
  principalInvestigators: 1,
  researchers: 1,
  hostInstitutions: 1,
  councilMembers: 1,
};

// Payment Management Stats
const paymentStats = {
  totalProcessed: 58800000000, // ~2.45M USD in VND
  pendingApprovals: 3000000000, // ~125K USD in VND
  monthlyTotal: 8160000000, // ~340K USD in VND
  transactionCount: 156,
  completedPayments: 142,
  pendingPayments: 14,
};

// Milestone Management Stats
const milestoneStats = {
  totalMilestones: 4,
  completedMilestones: 1,
  approvedMilestones: 1,
  pendingMilestones: 2,
  rejectedMilestones: 0,
};

// Document Forms Stats
const documentStats = {
  totalForms: 5,
  activeForms: 4,
  draftForms: 1,
  totalSubmissions: 234,
  budgetForms: 2,
  procurementForms: 2,
  reportingForms: 1,
};

// Academic Management Stats
const academicStats = {
  totalFields: 6,
  totalMajors: 8,
  itMajors: 3,
  engineeringMajors: 2,
  businessMajors: 2,
  socialScienceMajors: 1,
};

// Appraisal Councils Stats
const councilStats = {
  totalCouncils: 3,
  activeCouncils: 2,
  pendingCouncils: 1,
  totalMembers: 9,
  chairmen: 3,
  councilMembers: 3,
  secretaries: 3,
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

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const total = mockProjects.length;
    const created = mockProjects.filter(p => p.status === "created").length;
    const ongoing = mockProjects.filter(p => p.status === "ongoing").length;
    const completed = mockProjects.filter(p => p.status === "completed").length;
    const avgProgress = mockProjects.reduce((sum, p) => sum + p.progress, 0) / total;

    // Calculate progress distribution
    const lowProgress = mockProjects.filter(p => p.progress < 30).length;
    const mediumProgress = mockProjects.filter(p => p.progress >= 30 && p.progress < 70).length;
    const highProgress = mockProjects.filter(p => p.progress >= 70).length;

    return {
      total,
      created,
      ongoing,
      completed,
      avgProgress: Math.round(avgProgress),
      lowProgress,
      mediumProgress,
      highProgress
    };
  }, []);

  // Get recent projects (last 3)
  const recentProjects = useMemo(() => {
    return mockProjects
      .sort((a, b) => new Date(b["created-at"]).getTime() - new Date(a["created-at"]).getTime())
      .slice(0, 3);
  }, []);

  // Get principal investigator name (mock data for now)
  const getPrincipalInvestigator = (creatorId: string) => {
    const mockPIs: Record<string, string> = {
      "403c10a6-4889-49c6-b3b7-75d65572e1ee": "Dr. Nguyen Van A",
      "5439fe48-5101-4266-a10f-afabcafb2f74": "Dr. Tran Thi B",
      "2427d29b-b64f-4315-b8b4-b0bf2f3c4cee": "Dr. Le Van C",
    };
    return mockPIs[creatorId] || "Not assigned yet";
  };

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          icon={FolderOpen}
          trend="up"
          trendValue="+8.2%"
          color="default"
        />
        <StatCard
          title="Average Progress"
          value={`${projectStats.avgProgress}%`}
          icon={Target}
          trend="up"
          trendValue="+5.1%"
          color="success"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.created}
          icon={Activity}
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="w-4 h-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Finance</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Progress Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Project Progress Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Progress (&lt;30%)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {projectStats.lowProgress}
                      </Badge>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(projectStats.lowProgress / projectStats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Progress (30-70%)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {projectStats.mediumProgress}
                      </Badge>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(projectStats.mediumProgress / projectStats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Progress (&gt;70%)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projectStats.highProgress}
                      </Badge>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(projectStats.highProgress / projectStats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {project["english-title"]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.code} • {getPrincipalInvestigator(project["creator-id"])}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{project.progress}%</p>
                          <Progress value={project.progress} className="w-16 h-1" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Project Status Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full">
                    <FolderOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{projectStats.created}</p>
                  <p className="text-sm text-muted-foreground">Created Projects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full">
                    <Activity className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{projectStats.ongoing}</p>
                  <p className="text-sm text-muted-foreground">Ongoing Projects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project & Milestone Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Project & Milestone Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{projectStats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{milestoneStats.completedMilestones}</p>
                      <p className="text-sm text-muted-foreground">Completed Milestones</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Milestone Progress</span>
                      <span>{Math.round((milestoneStats.completedMilestones / milestoneStats.totalMilestones) * 100)}%</span>
                    </div>
                    <Progress value={(milestoneStats.completedMilestones / milestoneStats.totalMilestones) * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-semibold text-yellow-600">{milestoneStats.pendingMilestones}</p>
                      <p className="text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{milestoneStats.approvedMilestones}</p>
                      <p className="text-muted-foreground">Approved</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-red-600">{milestoneStats.rejectedMilestones}</p>
                      <p className="text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Forms Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Document Forms Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{documentStats.totalForms}</p>
                      <p className="text-sm text-muted-foreground">Total Forms</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{documentStats.totalSubmissions}</p>
                      <p className="text-sm text-muted-foreground">Total Submissions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget Forms</span>
                      <Badge variant="secondary">{documentStats.budgetForms}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Procurement Forms</span>
                      <Badge variant="secondary">{documentStats.procurementForms}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reporting Forms</span>
                      <Badge variant="secondary">{documentStats.reportingForms}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Forms</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">{documentStats.activeForms}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Academic Management Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-indigo-100 rounded-full">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">{academicStats.totalFields}</p>
                  <p className="text-sm text-muted-foreground">Academic Fields</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-cyan-100 rounded-full">
                    <Building2 className="w-8 h-8 text-cyan-600" />
                  </div>
                  <p className="text-2xl font-bold text-cyan-600">{academicStats.totalMajors}</p>
                  <p className="text-sm text-muted-foreground">Academic Majors</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-teal-100 rounded-full">
                    <Users className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-2xl font-bold text-teal-600">{councilStats.totalCouncils}</p>
                  <p className="text-sm text-muted-foreground">Appraisal Councils</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-pink-100 rounded-full">
                    <UserCheck className="w-8 h-8 text-pink-600" />
                  </div>
                  <p className="text-2xl font-bold text-pink-600">{councilStats.totalMembers}</p>
                  <p className="text-sm text-muted-foreground">Council Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{userStats.activeUsers}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Principal Investigators</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">{userStats.principalInvestigators}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Researchers</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">{userStats.researchers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Host Institutions</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">{userStats.hostInstitutions}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Council Members</span>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">{userStats.councilMembers}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>User Status Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Users</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {userStats.activeUsers}
                        </Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(userStats.activeUsers / userStats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Users</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {userStats.pendingUsers}
                        </Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(userStats.pendingUsers / userStats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Inactive Users</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {userStats.inactiveUsers}
                        </Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(userStats.inactiveUsers / userStats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">User Activity Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Payment Management Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{formatVND(paymentStats.totalProcessed)}</p>
                      <p className="text-sm text-muted-foreground">Total Processed</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-bold text-yellow-600">{formatVND(paymentStats.pendingApprovals)}</p>
                      <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{formatVND(paymentStats.monthlyTotal)}</p>
                      <p className="text-sm text-muted-foreground">Monthly Total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Transaction Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{paymentStats.transactionCount}</p>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{paymentStats.completedPayments}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completion Rate</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {Math.round((paymentStats.completedPayments / paymentStats.transactionCount) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Payments</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {paymentStats.pendingPayments}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(paymentStats.completedPayments / paymentStats.transactionCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Budget Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-600">{formatVND(paymentStats.totalProcessed)}</p>
                  <p className="text-sm text-muted-foreground">Total Budget Processed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-lg font-bold text-yellow-600">{formatVND(paymentStats.pendingApprovals)}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-blue-600">+{systemStats.monthlyGrowth}%</p>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
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
                    <span className="text-sm font-medium">System Uptime</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {systemStats.systemUptime}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm font-bold">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Server Load</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Platform Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{systemStats.totalUsers}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">{systemStats.activeProjects}</p>
                      <p className="text-xs text-muted-foreground">Active Projects</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Growth</span>
                      <span className="text-green-600 font-semibold">+{systemStats.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Approvals</span>
                      <span className="font-semibold">{systemStats.pendingApprovals}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>System Overview Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-200 rounded-full">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-blue-600">{projectStats.total}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-200 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-600">{userStats.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-200 rounded-full">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-purple-600">{documentStats.totalForms}</p>
                  <p className="text-xs text-muted-foreground">Forms</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-200 rounded-full">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-600">{paymentStats.transactionCount}</p>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
