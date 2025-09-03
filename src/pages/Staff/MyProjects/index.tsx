import React, { useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Calendar,
  Users,
  DollarSign,
  Tag,
  Globe,
  BookOpen,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { useProjectByStaff } from "@/hooks/queries/project";
import { useAllProjectResults } from "@/hooks/queries/projectResult";
import type {
  ProjectResult,
  ResultPublish,
} from "@/services/resources/projectResult";
import type { ProjectItem } from "@/types/project";
import { useAuth } from "@/contexts";

const MyProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("englishTitle");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ProjectResult | null>(
    null
  );
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  // Get current staff user
  const { user } = useAuth();

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
  const safeProjects = useMemo(() => {
    return Array.isArray(projects) ? projects : [];
  }, [projects]);

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

  // Filter project results for current staff user
  const staffProjectResults = useMemo(() => {
    if (!projectResultsResponse?.["data-list"] || !user) {
      return [];
    }

    const allResults = projectResultsResponse["data-list"];

    // Find projects created by the current staff user
    const staffCreatedProjectIds = safeProjects
      .filter((project) => project["creator-id"] === user.id)
      .map((project) => project.id);
    
    // Filter results that belong to projects created by this staff member
    return allResults.filter(
      (result: ProjectResult) =>
        result["project-id"] &&
        staffCreatedProjectIds.includes(result["project-id"])
    );
  }, [projectResultsResponse, safeProjects, user]);

  const handleViewResult = (result: ProjectResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsDetailDialogOpen(true);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const ProjectDetailDialog = () => {
    if (!selectedProject) return null;

    return (
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Project Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the project
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    English Title
                  </label>
                  <p className="font-medium">
                    {selectedProject["english-title"] || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Vietnamese Title
                  </label>
                  <p className="font-medium">
                    {selectedProject["vietnamese-title"] || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Abbreviations
                  </label>
                  <p>{selectedProject.abbreviations || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </label>
                  <p className="mt-1 font-medium">
                    {selectedProject.language || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(
                        selectedProject.status || "unknown"
                      )}
                    >
                      {capitalize(selectedProject.status || "Unknown")}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {selectedProject.category?.includes("application")
                        ? "Application"
                        : capitalize(selectedProject.category || "Unknown")}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Type
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {capitalize(selectedProject.type || "Unknown")}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Genre
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {capitalize(selectedProject.genres || "Unknown")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedProject.description || "No description provided"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Requirement Note
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedProject["requirement-note"] ||
                    "No requirement note provided"}
                </p>
              </div>
            </div>

            {/* Project Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="font-semibold text-blue-800">
                    {selectedProject.budget
                      ? formatCurrency(selectedProject.budget)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-semibold text-green-800">
                    {selectedProject.duration
                      ? `${selectedProject.duration} months`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Max Members
                  </p>
                  <p className="font-semibold text-purple-800">
                    {selectedProject["maximum-member"] || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Start Date
                  </p>
                  <p className="font-semibold text-orange-800">
                    {selectedProject["start-date"]
                      ? formatDate(selectedProject["start-date"])
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <Calendar className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="font-semibold text-red-800">
                    {selectedProject["end-date"]
                      ? formatDate(selectedProject["end-date"])
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Majors */}
            {selectedProject.majors && selectedProject.majors.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Majors & Fields
                </label>
                <div className="mt-2 space-y-2">
                  {selectedProject.majors.map((major, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">
                        {major.name || "Unknown Major"}
                      </div>
                      {major.field && (
                        <div className="text-sm text-gray-600">
                          Field: {major.field.name || "Unknown Field"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Tags */}
            {selectedProject["project-tags"] &&
              selectedProject["project-tags"].length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProject["project-tags"].map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Timestamps */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {selectedProject["created-at"]
                    ? formatDate(selectedProject["created-at"])
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {selectedProject["updated-at"]
                    ? formatDate(selectedProject["updated-at"])
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Project Result Detail Dialog
  const ProjectResultDialog = () => {
    if (!selectedResult) return null;

    return (
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Project Result Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the project result
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Result Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Result ID
                  </label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {selectedResult.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="font-medium">{selectedResult.name || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Added Date
                  </label>
                  <p>
                    {selectedResult["added-date"]
                      ? formatDate(selectedResult["added-date"])
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Project ID
                  </label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {selectedResult["project-id"] || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Result URL
                  </label>
                  {selectedResult.url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(selectedResult.url || "#", "_blank")
                      }
                      className="mt-1"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Open URL
                    </Button>
                  ) : (
                    <p className="text-gray-400 italic">No URL provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Result Publications */}
            {selectedResult["result-publishs"] &&
              selectedResult["result-publishs"].length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Publications ({selectedResult["result-publishs"].length})
                  </label>
                  <div className="mt-3 space-y-4">
                    {selectedResult["result-publishs"].map(
                      (publication: ResultPublish, index: number) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Title
                              </label>
                              <p className="font-medium text-lg mt-1">
                                {publication.title}
                              </p>
                            </div>

                            {publication.description && (
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Description
                                </label>
                                <p className="text-sm mt-1">
                                  {publication.description}
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Publisher
                                </label>
                                <p className="text-sm mt-1">
                                  {publication.publisher || "N/A"}
                                </p>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Publication Date
                                </label>
                                <p className="text-sm mt-1">
                                  {publication["publication-date"]
                                    ? formatDate(
                                        publication["publication-date"]
                                      )
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Access Type
                                </label>
                                <Badge
                                  variant="outline"
                                  className={`mt-1 ${
                                    publication["access-type"] === "Open Access"
                                      ? "text-green-700 border-green-200 bg-green-50"
                                      : "text-blue-700 border-blue-200 bg-blue-50"
                                  }`}
                                >
                                  {publication["access-type"] || "N/A"}
                                </Badge>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Tags
                                </label>
                                <div className="mt-1">
                                  {publication.tags ? (
                                    <Badge variant="secondary">
                                      {publication.tags}
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-gray-400 italic">
                                      No tags
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {publication.url && (
                              <div className="pt-2 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(publication.url, "_blank")
                                  }
                                  className="w-full"
                                >
                                  <Globe className="h-4 w-4 mr-2" />
                                  View Publication
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Detail Dialog */}
      <ProjectDetailDialog />

      {/* Project Result Detail Dialog */}
      <ProjectResultDialog />

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
                            onClick={() => handleViewProject(project)}
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
          {/* Results View - Filtered by Staff Created Projects */}
          <Card>
            <CardHeader>
              <CardTitle>
                Project Results ({staffProjectResults.length})
              </CardTitle>
              <CardDescription>
                View project results from your created projects (Read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {staffProjectResults.length > 0 ? (
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
                      {staffProjectResults.map((result: ProjectResult) => {
                        // Find the corresponding project for this result
                        const relatedProject = safeProjects.find(
                          (p) => p.id === result["project-id"]
                        );

                        return (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[330px]">
                                <div className="font-semibold truncate">
                                  {result.name || "No Name"}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {relatedProject
                                    ? `From: ${
                                        relatedProject["english-title"] ||
                                        relatedProject["vietnamese-title"] ||
                                        "Unknown Project"
                                      }`
                                    : "Project Result"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {relatedProject?.category?.includes(
                                  "application"
                                )
                                  ? "Application"
                                  : capitalize(
                                      relatedProject?.category || "Result"
                                    )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {capitalize(
                                  relatedProject?.type || "Project Result"
                                )}
                              </Badge>
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
                              <div className="flex gap-2">
                                {/* Only show detailed view for basic projects */}
                                {relatedProject?.category === "basic" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewResult(result)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Details
                                  </Button>
                                )}
                                {result.url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(result.url || "#", "_blank")
                                    }
                                  >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Open
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
                    No project results are available from your created projects
                    yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    Results will appear here once your projects are completed
                    and results are published.
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
