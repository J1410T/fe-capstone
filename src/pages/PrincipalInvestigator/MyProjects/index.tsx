import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Briefcase, ArrowUpDown, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for Principal Investigator's projects
// Note: In real implementation, this would be filtered by API to only include
// projects where current user is the Principal Investigator
const getAllProjects = () => [
  {
    id: 1,
    title: "Machine Learning for Medical Diagnosis",
    field: "Computer Science",
    status: "Active",
    startDate: "2023-05-15",
    endDate: "2024-11-15",
    budget: "$120,000",
    teamSize: 5,
    progress: 65,
    description: "Developing AI algorithms for early disease detection",
    pi: "Test PI", // Matches the current test user
  },
  {
    id: 2,
    title: "Quantum Computing Applications",
    field: "Physics",
    status: "Planning",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    budget: "$200,000",
    teamSize: 3,
    progress: 10,
    description: "Research into practical quantum computing applications",
    pi: "Test PI", // Matches the current test user
  },
  {
    id: 3,
    title: "Sustainable Energy Solutions",
    field: "Engineering",
    status: "Completed",
    startDate: "2022-06-01",
    endDate: "2023-06-01",
    budget: "$85,000",
    teamSize: 4,
    progress: 100,
    description: "Development of renewable energy storage systems",
    pi: "Dr. John Doe", // Different PI - should not appear for Test PI
  },
  {
    id: 4,
    title: "Blockchain Security Research",
    field: "Computer Science",
    status: "Active",
    startDate: "2023-09-01",
    endDate: "2024-09-01",
    budget: "$95,000",
    teamSize: 6,
    progress: 45,
    description: "Advanced cryptographic security for blockchain systems",
    pi: "Test PI", // Matches the current test user
  },
  {
    id: 5,
    title: "AI-Powered Data Analytics Platform",
    field: "Computer Science",
    status: "Active",
    startDate: "2023-10-01",
    endDate: "2024-12-01",
    budget: "$150,000",
    teamSize: 8,
    progress: 30,
    description:
      "Building an advanced analytics platform using AI technologies",
    pi: "Test PI", // Matches the current test user
  },
];

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fieldFilter, setFieldFilter] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter projects to only show those where current user is the PI
  const myProjects = getAllProjects().filter((project) => {
    console.log(
      "Checking project:",
      project.title,
      "PI:",
      project.pi,
      "vs User:",
      user?.name
    );
    return project.pi === user?.name;
  });

  console.log("My Projects (filtered):", myProjects);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "completed":
        return "text-indigo-700 border-indigo-200 bg-indigo-50";
      case "planning":
        return "text-blue-700 border-blue-200 bg-blue-50";
      case "on hold":
        return "text-orange-700 border-orange-200 bg-orange-50";
      default:
        return "text-gray-700 border-gray-200 bg-gray-50";
    }
  };

  // Filter and sort projects
  const filteredProjects = myProjects
    .filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesField =
        fieldFilter === "All" || project.field === fieldFilter;
      return matchesSearch && matchesStatus && matchesField;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/pi/project/${projectId}`);
  };

  // Get unique fields for filter
  const uniqueFields = Array.from(new Set(myProjects.map((p) => p.field)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            Manage and track your research projects as Principal Investigator
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Fields</SelectItem>
                {uniqueFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Projects where you serve as the Principal Investigator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("title")}
                      className="hover:bg-transparent p-0 h-auto font-medium"
                    >
                      Project Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{project.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.field}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(project.status)}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.teamSize}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{project.budget}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          to {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "All" || fieldFilter !== "All"
                  ? "Try adjusting your search criteria"
                  : "You haven't created any projects yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProjects;
