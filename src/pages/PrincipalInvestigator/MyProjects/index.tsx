import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  Search,
  // Users,
  Briefcase,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { useMyProject } from "@/hooks/queries/project";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";
import { Loading } from "@/components/ui/loaders";
import { toast } from "sonner";

const MyProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("englishTitle");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { user } = useAuth();

  // Add user id and role to query key so it refetches on role change
  const {
    data: projectsResponse,
    isLoading: isQueryLoading,
    error,
  } = useMyProject(user?.id, user?.role);
  const projects = projectsResponse?.data || [];

  // Loader: reset on every navigation or role change
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    setIsPageLoading(true);
  }, [location.pathname, user?.role, user?.id]);
  useEffect(() => {
    if (!isQueryLoading) {
      setIsPageLoading(false);
    }
  }, [isQueryLoading]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "completed":
      case "finished":
        return "text-indigo-700 border-indigo-200 bg-indigo-50";
      case "created":
      case "inprogress":
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

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project["english-title"]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project["vietnamese-title"]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || project.category === categoryFilter;
      const matchesType = typeFilter === "All" || project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      let aValue: string = "";
      let bValue: string = "";

      if (sortBy === "englishTitle") {
        aValue = a["english-title"];
        bValue = b["english-title"];
      } else if (sortBy === "vietnameseTitle") {
        aValue = a["vietnamese-title"];
        bValue = b["vietnamese-title"];
      } else if (sortBy === "createdAt") {
        aValue = a["created-at"];
        bValue = b["created-at"];
      } else {
        aValue = String(a[sortBy as keyof typeof a] ?? "");
        bValue = String(b[sortBy as keyof typeof b] ?? "");
      }

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

  const handleViewProject = (id: string) => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      const project = filteredProjects.find((p) => p.id === id);

      // Block access to draft projects for PI
      if (project && project.status === "draft") {
        toast.error("You cannot access the project in draft status.");
        return;
      }

      // Allow access to all other statuses (submitted, approved, inprogress, etc.)
      if (
        project &&
        project.genre?.toLowerCase() === "proposal" &&
        project.status === "created"
      ) {
        navigate(`/pi/project/${id}/enroll`);
      } else {
        navigate(`/pi/project/${id}`);
      }
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      navigate(`/host/project/${id}`);
    } else {
      navigate(`/researcher/project/${id}`);
    }
  };

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(projects.map((p) => p.status)));
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const uniqueTypes = Array.from(new Set(projects.map((p) => p.type)));

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isPageLoading) {
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
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            Manage and track your research projects
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
            Your research projects and their current status
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
                  <TableHead>Genre</TableHead>
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
                          {project["english-title"]}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {project["vietnamese-title"]}
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
                        {capitalize(project.genre)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {project.category?.includes("application")
                          ? "application"
                          : project.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {capitalize(project.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(project.status)}
                      >
                        {capitalize(project.status)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {formatDate(project["created-at"])}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProject(project.id)}
                        >
                          View
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
                {searchTerm ||
                statusFilter !== "All" ||
                categoryFilter !== "All" ||
                typeFilter !== "All"
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

export default MyProject;
