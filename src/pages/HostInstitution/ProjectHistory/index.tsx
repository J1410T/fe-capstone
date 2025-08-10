import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
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
import { Progress } from "@/components/ui/progress";
import { Search, Briefcase, ArrowUpDown, Eye } from "lucide-react";
import { useProjectListFilter } from "@/hooks/queries/project";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loaders";
import type { ProjectItem } from "@/types/project";
import { getUserRoleById } from "@/services/resources/auth";
import type { UserRole } from "@/types/auth";

// Custom hook for Host Institution project access control with two-step verification
const useHostInstitutionProjects = () => {
  const { user } = useAuth();
  console.log("Debug: Authenticated user from useAuth()", user);

  // Fetch all projects using project list filter
  const {
    data: projectsResponse,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectListFilter({
    searchTerm: "",
    selectedStatus: "all",
    selectedField: "all",
    selectedMajor: "all",
    selectedCategory: "all",
    selectedType: "all",
    selectedSort: "latest",
    tags: [],
    currentPage: 1,
    pageSize: 1000,
  });

  // Extract unique creator IDs from projects
  const creatorIds = useMemo(() => {
    const projects = projectsResponse?.["data-list"] || [];
    const allCreatorIds = projects
      .map((project: ProjectItem) => project["creator-id"])
      .filter(Boolean);
    return Array.from(new Set(allCreatorIds));
  }, [projectsResponse]);

  // Fetch user role information for each creator ID
  const userRoleQueries = useQueries({
    queries: creatorIds.map((creatorId) => ({
      queryKey: ["user-role-by-id", creatorId],
      queryFn: () => getUserRoleById(creatorId),
      enabled: !!creatorId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 1,
    })),
  });

  // Create a map of creator-id to user role data for efficient lookup
  const creatorToUserRoleMap = useMemo(() => {
    const map = new Map<string, UserRole>();

    userRoleQueries.forEach((query, index) => {
      if (query.data && !query.isLoading && !query.error) {
        const creatorId = creatorIds[index];
        const userRole = query.data as UserRole;
        if (creatorId) {
          map.set(creatorId, userRole);
        }
        console.log("Debug: Creator ID to User Role Mapping", {
          creatorId,
          userRole,
        });
      }
    });

    return map;
  }, [userRoleQueries, creatorIds]);

  // Determine loading and error states
  const isLoadingUserRoles = userRoleQueries.some((query) => query.isLoading);
  const isLoading = projectsLoading || isLoadingUserRoles;
  const error = projectsError || userRoleQueries.find((q) => q.error)?.error;

  // Apply two-step verification process
  const projects = useMemo(() => {
    if (!user?.id) {
      console.log("Debug: No authenticated user ID available");
      return [];
    }

    const rawProjects = projectsResponse?.["data-list"] || [];
    console.log("Debug: Starting two-step verification", {
      totalRawProjects: rawProjects.length,
      authenticatedUserId: user.id,
      creatorRoleMapSize: creatorToUserRoleMap.size,
    });

    // Filter projects based on two-step verification
    const filteredProjects = rawProjects.filter((project: ProjectItem) => {
      const creatorId = project["creator-id"];

      if (!creatorId) {
        console.log("Debug: Project missing creator-id", {
          projectId: project.id,
          projectTitle: project["english-title"],
        });
        return false;
      }

      // Step 1: Get user role data for this creator-id
      const userRole = creatorToUserRoleMap.get(creatorId);

      if (!userRole) {
        console.log("Debug: No user role found for creator-id", {
          projectId: project.id,
          projectTitle: project["english-title"],
          creatorId,
          note: "getUserRoleById(creator-id) may have failed or is still loading",
        });
        return false;
      }

      // Step 2: Verify Host Institution role and account-id match
      const isHostInstitution = userRole.name === "Host Institution";
      const accountMatches = userRole["account-id"] === user.id;
      const hasAccess = isHostInstitution && accountMatches;

      console.log("Debug: Two-step verification result", {
        projectId: project.id,
        projectTitle: project["english-title"],
        creatorId,
        userRoleName: userRole.name,
        userRoleAccountId: userRole["account-id"],
        authenticatedUserId: user.id,
        step1_isHostInstitution: isHostInstitution,
        step2_accountMatches: accountMatches,
        finalAccessGranted: hasAccess,
        verificationDetails: {
          roleNameCheck: `"${userRole.name}" === "Host Institution" = ${isHostInstitution}`,
          accountIdCheck: `"${userRole["account-id"]}" === "${user.id}" = ${accountMatches}`,
        },
      });

      return hasAccess;
    });

    console.log("Debug: Two-step verification complete", {
      totalRawProjects: rawProjects.length,
      totalFilteredProjects: filteredProjects.length,
      accessControlSummary: {
        projectsWithCreatorId: rawProjects.filter((p) => p["creator-id"])
          .length,
        projectsWithUserRoleData: rawProjects.filter(
          (p) => p["creator-id"] && creatorToUserRoleMap.has(p["creator-id"])
        ).length,
        projectsWithHostInstitutionRole: rawProjects.filter((p) => {
          const role = p["creator-id"]
            ? creatorToUserRoleMap.get(p["creator-id"])
            : null;
          return role?.name === "Host Institution";
        }).length,
        finalAuthorizedProjects: filteredProjects.length,
      },
    });

    return filteredProjects;
  }, [projectsResponse, user?.id, creatorToUserRoleMap]);

  return {
    projects,
    isLoading,
    error,
  };
};

const ProjectHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("englishTitle");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Use the sophisticated filtering hook
  const { projects, isLoading, error } = useHostInstitutionProjects();

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

  const uniqueStatuses = Array.from(new Set(projects.map((p) => p.status)));
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const uniqueTypes = Array.from(new Set(projects.map((p) => p.type)));

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
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project History</h1>
          <p className="text-muted-foreground">
            View and manage projects you've created as Host Institution
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
            Projects you've created and their current status
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
                  <TableHead>Progress</TableHead>
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
                        {project.category?.includes("application")
                          ? "Application"
                          : capitalize(project.category)}
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
                      <div className="flex items-center gap-2">
                        <Progress
                          value={project.progress || 0}
                          className="w-16 h-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {project.progress || 0}%
                        </span>
                      </div>
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
                  : "No projects found that match your Host Institution account"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectHistory;
