// src/pages/host/ProjectHistory.tsx
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
import { Search, Briefcase, ArrowUpDown, Eye, RefreshCw } from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { useProjectByHostInstitution } from "@/hooks/queries/project";
import type { ProjectItem } from "@/types/project";

const ProjectHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("englishTitle");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch projects from Host Institution API
  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useProjectByHostInstitution();

  // Debug: Log projects data to check logo URL
  React.useEffect(() => {
    if (projects && projects.length > 0) {
      console.log("Projects data:", projects);
      projects.forEach((project, index) => {
        console.log(`Project ${index + 1}:`, {
          id: project.id,
          title: project["english-title"],
          logoUrl: project["logo-url"],
        });
      });
    }
  }, [projects]);

  const handleRefresh = () => {
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "completed":
      case "finished":
        return "text-indigo-700 border-indigo-200 bg-indigo-50";
      case "created":
      case "planning":
        return "text-blue-700 border-blue-200 bg-blue-50";
      case "on hold":
      case "suspended":
        return "text-orange-700 border-orange-200 bg-orange-50";
      case "rejected":
        return "text-red-700 border-red-200 bg-red-50";
      default:
        return "text-gray-700 border-gray-200 bg-gray-50";
    }
  };

  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredProjects = safeProjects
    .filter((project) => {
      if (!project || typeof project !== "object") return false;

      const matchesSearch =
        !searchTerm ||
        project["english-title"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project["vietnamese-title"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || project.category === categoryFilter;
      const matchesType = typeFilter === "All" || project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (sortBy === "englishTitle") {
        aValue = a["english-title"] || "";
        bValue = b["english-title"] || "";
      } else if (sortBy === "vietnameseTitle") {
        aValue = a["vietnamese-title"] || "";
        bValue = b["vietnamese-title"] || "";
      } else if (sortBy === "createdAt") {
        aValue = a["created-at"] || "";
        bValue = b["created-at"] || "";
      } else {
        aValue = String(a[sortBy as keyof ProjectItem] ?? "");
        bValue = String(b[sortBy as keyof ProjectItem] ?? "");
      }

      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/host/project/${id}`);
  };

  const uniqueStatuses = Array.from(
    new Set(safeProjects.filter((p) => p?.status).map((p) => p.status))
  );
  const uniqueCategories = Array.from(
    new Set(safeProjects.filter((p) => p?.category).map((p) => p.category))
  );
  const uniqueTypes = Array.from(
    new Set(safeProjects.filter((p) => p?.type).map((p) => p.type))
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading className="w-full max-w-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error loading projects</div>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Show warning if data is not in expected format
  if (!isLoading && projects !== undefined && !Array.isArray(projects)) {
    return (
      <div className="text-center py-8">
        <div className="text-orange-600 mb-2">Unexpected data format</div>
        <p className="text-muted-foreground mb-4">
          The API returned data in an unexpected format. Please contact support.
        </p>
        <div className="text-xs text-gray-500 mb-4">
          Data type: {typeof projects}, Value: {JSON.stringify(projects)}
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Host Projects
          </h1>
          <p className="text-muted-foreground">
            View and manage projects you've created as Host Institution
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
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
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {capitalize(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {capitalize(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {capitalize(type)}
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
            Projects you've created and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("englishTitle")}
                      className="hover:bg-transparent p-0 h-auto font-medium"
                    >
                      Project Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {project["logo-url"] ? (
                          <img
                            src={project["logo-url"]}
                            alt={project["english-title"] || "Project Logo"}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center ${
                            project["logo-url"] ? "hidden" : ""
                          }`}
                        >
                          <Briefcase className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-[330px]">
                        <div className="font-semibold truncate">
                          {project["english-title"] || "No English Title"}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {project["vietnamese-title"] || "No Vietnamese Title"}
                        </div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {project.category?.includes("application")
                          ? "Application"
                          : capitalize(project.category || "Unknown")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {capitalize(project.type || "Unknown")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(project.status || "unknown")}
                      >
                        {capitalize(project.status || "Unknown")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {project["created-at"]
                          ? formatDate(project["created-at"])
                          : "No Date"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== "All" ||
                categoryFilter !== "All" ||
                typeFilter !== "All"
                  ? "Try adjusting your search criteria"
                  : "You haven't created any projects yet as a Host Institution"}
              </p>
              {!searchTerm &&
                statusFilter === "All" &&
                categoryFilter === "All" &&
                typeFilter === "All" && (
                  <Button
                    onClick={() => navigate("/host/register-project")}
                    className="mt-2"
                  >
                    Create Your First Project
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectHistory;
