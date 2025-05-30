import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import { ProjectsHeader, ProjectCard, ProjectsPagination } from "./components";
import { getStatusColor } from "./utils/statusHelpers";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// TypeScript interfaces
interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  updatedAt: string;
  teamMembers: number;
  manager: string;
  progress: number;
  status: "Active" | "Completed" | "Pending" | "On Hold";
  year: string;
}

type SortOption =
  | "latest"
  | "oldest"
  | "a-z"
  | "z-a"
  | "progress-high"
  | "progress-low";
type StatusFilter = "all" | "Active" | "Completed" | "Pending" | "On Hold";
type FieldFilter = "all" | string;

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "1",
    category: "Environmental Science",
    title: "Climate Change Impact Study",
    description:
      "Analyzing the effects of climate change on coastal ecosystems",
    updatedAt: "2 days ago",
    teamMembers: 8,
    manager: "Dr. Sarah Johnson",
    progress: 75,
    status: "Active",
    year: "2024",
  },
  {
    id: "2",
    category: "Computer Science",
    title: "AI-Powered Data Analysis",
    description:
      "Developing machine learning algorithms for big data processing",
    updatedAt: "1 week ago",
    teamMembers: 5,
    manager: "Prof. Michael Chen",
    progress: 45,
    status: "Active",
    year: "2020",
  },
  {
    id: "3",
    category: "Microbiology",
    title: "Antibiotic Resistance Research",
    description:
      "Investigating new approaches to combat antibiotic-resistant bacteria",
    updatedAt: "3 days ago",
    teamMembers: 12,
    manager: "Dr. Emily Rodriguez",
    progress: 90,
    status: "Completed",
    year: "2024",
  },
  {
    id: "4",
    category: "Artificial Intelligence",
    title: "Natural Language Processing",
    description: "Building advanced NLP models for multilingual text analysis",
    updatedAt: "5 days ago",
    teamMembers: 6,
    manager: "Dr. James Wilson",
    progress: 30,
    status: "Pending",
    year: "2022",
  },
  {
    id: "5",
    category: "Materials Science",
    title: "Sustainable Materials Development",
    description:
      "Researching eco-friendly alternatives to traditional materials",
    updatedAt: "1 day ago",
    teamMembers: 9,
    manager: "Prof. Lisa Anderson",
    progress: 60,
    status: "Active",
    year: "2024",
  },
  {
    id: "6",
    category: "Engineering",
    title: "Renewable Energy Systems",
    description:
      "Designing efficient solar panel systems for urban environments",
    updatedAt: "4 days ago",
    teamMembers: 7,
    manager: "Dr. Robert Kim",
    progress: 85,
    status: "Active",
    year: "2021",
  },
  {
    id: "7",
    category: "Medicine",
    title: "Cancer Treatment Innovation",
    description: "Developing targeted therapies for rare cancer types",
    updatedAt: "2 weeks ago",
    teamMembers: 15,
    manager: "Dr. Maria Garcia",
    progress: 25,
    status: "On Hold",
    year: "2024",
  },
  {
    id: "8",
    category: "Business",
    title: "Market Analysis Platform",
    description: "Creating tools for real-time market trend analysis",
    updatedAt: "6 days ago",
    teamMembers: 4,
    manager: "Prof. David Lee",
    progress: 100,
    status: "Completed",
    year: "2023",
  },
];

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects] = useState<Project[]>(mockProjects);
  const [isLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [selectedField, setSelectedField] = useState<FieldFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("latest");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Filter projects based on search term, status, and department
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.manager.toLowerCase().includes(searchLower)
      );
    }

    // Apply field filter
    if (selectedField !== "all") {
      filtered = filtered.filter(
        (project) => project.category === selectedField
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "latest":
          return new Date(b.year).getTime() - new Date(a.year).getTime();
        case "oldest":
          return new Date(a.year).getTime() - new Date(b.year).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "progress-high":
          return b.progress - a.progress;
        case "progress-low":
          return a.progress - b.progress;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedField, selectedStatus, selectedSort]);

  // Handlers
  const handleFieldChange = useCallback((value: string) => {
    setSelectedField(value as FieldFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value as StatusFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSelectedSort(value as SortOption);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = useCallback(
    (projectId: string | number) => {
      // Navigate to project details page based on user role
      if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
        navigate(`/pi/project/${projectId}`);
      } else if (user?.role === UserRole.HOST_INSTITUTION) {
        navigate(`/host/project/${projectId}`);
      } else {
        // Default to member project details for other roles
        navigate(`/member/project/${projectId}`);
      }
    },
    [navigate, user?.role]
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <ProjectsHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                progress={project.progress}
                status={project.status}
                manager={project.manager}
                category={project.category}
                year={project.year}
                teamMembers={project.teamMembers}
                onViewDetails={handleViewDetails}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>

          {/* No results message */}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredProjects.length > 0 && (
            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsList;
