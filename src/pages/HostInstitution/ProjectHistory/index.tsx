import React, { useState } from "react";
import { Loading } from "@/components/ui/loaders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart } from "lucide-react";
import { HistoryHeader, ProjectListTab, StatisticsTab } from "./components";

// Mock data for historical projects
const historicalProjects = [
  {
    id: 1,
    title: "AI-Driven Healthcare Solutions",
    pi: "Dr. Jane Smith",
    department: "Computer Science",
    year: "2023",
    budget: "$120,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 2,
    title: "Sustainable Energy Research",
    pi: "Dr. Michael Johnson",
    department: "Engineering",
    year: "2023",
    budget: "$85,000",
    status: "Suspended",
    completionRate: 45,
    reports: "Missing",
  },
  {
    id: 3,
    title: "Market Analysis Framework",
    pi: "Dr. Sarah Williams",
    department: "Business",
    year: "2022",
    budget: "$75,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 4,
    title: "Urban Planning Innovations",
    pi: "Dr. Robert Chen",
    department: "Architecture",
    year: "2022",
    budget: "$90,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 5,
    title: "Quantum Computing Applications",
    pi: "Dr. Emily Davis",
    department: "Computer Science",
    year: "2021",
    budget: "$150,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 6,
    title: "Renewable Materials Development",
    pi: "Dr. James Wilson",
    department: "Engineering",
    year: "2021",
    budget: "$110,000",
    status: "Suspended",
    completionRate: 60,
    reports: "Incomplete",
  },
  {
    id: 7,
    title: "Consumer Behavior Analysis",
    pi: "Dr. Lisa Thompson",
    department: "Business",
    year: "2021",
    budget: "$65,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 8,
    title: "Sustainable Architecture Designs",
    pi: "Dr. David Lee",
    department: "Architecture",
    year: "2020",
    budget: "$95,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 9,
    title: "Machine Learning for Finance",
    pi: "Dr. Amanda Brown",
    department: "Computer Science",
    year: "2020",
    budget: "$130,000",
    status: "Completed",
    completionRate: 100,
    reports: "Complete",
  },
  {
    id: 10,
    title: "Nanotechnology Applications",
    pi: "Dr. Thomas White",
    department: "Engineering",
    year: "2020",
    budget: "$180,000",
    status: "Suspended",
    completionRate: 30,
    reports: "Missing",
  },
];

// Mock data for statistics
const yearlyStats = [
  { year: "2020", completed: 2, suspended: 1, total: 3, budget: 405000 },
  { year: "2021", completed: 2, suspended: 1, total: 3, budget: 325000 },
  { year: "2022", completed: 2, suspended: 0, total: 2, budget: 165000 },
  { year: "2023", completed: 1, suspended: 1, total: 2, budget: 205000 },
];

const departmentStats = [
  { name: "Computer Science", value: 4, color: "#3b82f6" },
  { name: "Engineering", value: 3, color: "#10b981" },
  { name: "Business", value: 2, color: "#f59e0b" },
  { name: "Architecture", value: 1, color: "#8b5cf6" },
];

const statusStats = [
  { name: "Completed", value: 7, color: "#10b981" },
  { name: "Suspended", value: 3, color: "#ef4444" },
];

const reportStats = [
  { name: "Complete", value: 7, color: "#10b981" },
  { name: "Incomplete", value: 1, color: "#f59e0b" },
  { name: "Missing", value: 2, color: "#ef4444" },
];

const ProjectHistory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");

  const handleExportData = (format: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1500);
  };

  const filteredProjects = historicalProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.pi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = selectedYear === "all" || project.year === selectedYear;
    const matchesDepartment =
      selectedDepartment === "all" || project.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    return matchesSearch && matchesYear && matchesDepartment && matchesStatus;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <HistoryHeader onExportData={handleExportData} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            Project List
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Project List Tab */}
        <TabsContent value="list" className="space-y-4">
          <ProjectListTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <StatisticsTab
            yearlyStats={yearlyStats}
            departmentStats={departmentStats}
            statusStats={statusStats}
            reportStats={reportStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectHistory;
