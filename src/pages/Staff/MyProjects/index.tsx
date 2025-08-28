import React, { useState, useMemo } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Briefcase,
  ArrowUpDown,
  Eye,
  RefreshCw,
  Target,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { useProjectByStaff } from "@/hooks/queries/project";
import { useAllProjectResults } from "@/hooks/queries/projectResult";
import type { ProjectResult } from "@/services/resources/projectResult";

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("englishTitle");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch projects from Staff API
  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useProjectByStaff();

  // Fetch all project results
  const { data: projectResultsResponse } = useAllProjectResults();

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

  const filteredProjects = safeProjects.filter((project) => {
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
  });

  // Debug project results
  useMemo(() => {
    if (
      !projectResultsResponse ||
      !Array.isArray(projectResultsResponse["data-list"])
    ) {
      console.log("No project results response or data-list is not array");
      return;
    }

    const projectResults = projectResultsResponse["data-list"];
    console.log("Project results:", projectResults);
    console.log("Safe projects:", safeProjects);

    // Nếu có project-id trong result, thì match với projects
    // Nếu không có, thì hiển thị tất cả results
    const hasProjectId = projectResults.some(
      (result: ProjectResult) => result["project-id"]
    );
    console.log("Has project-id:", hasProjectId);

    if (hasProjectId) {
      const projectIdsWithResults = new Set(
        projectResults.map((result: ProjectResult) => result["project-id"])
      );
      console.log(
        "Project IDs with results:",
        Array.from(projectIdsWithResults)
      );
    } else {
      console.log("No project-id found, showing all results directly");
    }
  }, [safeProjects, projectResultsResponse]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/staff/project/${id}`);
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

  // Calculate statistics
  const totalProjects = safeProjects.length;
  const activeProjects = safeProjects.filter(
    (p) => p.status === "active" || p.status === "approved"
  ).length;
  const completedProjects = safeProjects.filter(
    (p) => p.status === "completed" || p.status === "finished"
  ).length;
  const pendingProjects = safeProjects.filter(
    (p) => p.status === "created" || p.status === "planning"
  ).length;

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
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            View and manage projects you're involved in as Staff
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalProjects}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingProjects}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeProjects}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-2xl font-bold">{completedProjects}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
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
                Projects you're involved in and their current status
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
                        <TableCell className="font-medium">
                          <div className="max-w-[330px]">
                            <div className="font-semibold truncate">
                              {project["english-title"] || "No English Title"}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {project["vietnamese-title"] ||
                                "No Vietnamese Title"}
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
                            className={getStatusColor(
                              project.status || "unknown"
                            )}
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
                  <h3 className="text-lg font-semibold mb-2">
                    No projects found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ||
                    statusFilter !== "All" ||
                    categoryFilter !== "All" ||
                    typeFilter !== "All"
                      ? "Try adjusting your search criteria"
                      : "You're not involved in any projects yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Results View - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle>
                Project Results (
                {projectResultsResponse?.["data-list"]?.length || 0})
              </CardTitle>
              <CardDescription>
                View project results and outcomes (Read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(projectResultsResponse?.["data-list"]?.length || 0) > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectResultsResponse?.["data-list"]?.map(
                        (result: ProjectResult) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[330px]">
                                <div className="font-semibold truncate">
                                  {result.name || "No Name"}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  Project Result
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Result</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Project Result</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-indigo-700 border-indigo-200 bg-indigo-50"
                              >
                                Available
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {result["added-date"]
                                  ? formatDate(result["added-date"])
                                  : "No Date"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(result.url || "#", "_blank")
                                }
                                disabled={!result.url}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Results Available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No completed projects with results are available yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    Results will appear here once projects are completed and
                    results are available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProjects;
