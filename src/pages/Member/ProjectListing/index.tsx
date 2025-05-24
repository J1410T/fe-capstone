import { useState, useEffect, useMemo } from "react";
import { Loading } from "@/components/ui/loaders";
import { UserProjectHeader } from "./components/UserProjectHeader";
import { ProjectsPagination } from "@/pages/HostInstitution/ProjectsList/components/ProjectsPagination";
import UserProjectCard from "@/components/layout/project-card";

// Mock data - replace with your actual data source
const mockProjects = [
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
    createdAt: new Date("2024-01-15"),
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
    createdAt: new Date("2024-02-20"),
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
    createdAt: new Date("2023-11-10"),
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
    createdAt: new Date("2024-03-01"),
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
    createdAt: new Date("2024-01-30"),
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
    createdAt: new Date("2023-12-05"),
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
    createdAt: new Date("2024-02-10"),
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
    createdAt: new Date("2023-10-15"),
  },
];

function ProjectListing() {
  // State management
  const [projects] = useState(mockProjects); // Removed unused setProjects
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort logic
  const filteredAndSortedProjects = useMemo(() => {
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
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
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

  // Pagination logic
  const totalCount = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedField, selectedStatus, selectedSort]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFieldChange = (value: string) => {
    setSelectedField(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const retry = () => {
    setError(null);
    setIsLoading(true);
    // Simulate retry logic
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const getFilterSummary = () => {
    const filters = [];
    if (searchTerm) filters.push(`search: "${searchTerm}"`);
    if (selectedField !== "all") filters.push(`field: ${selectedField}`);
    if (selectedStatus !== "all") filters.push(`status: ${selectedStatus}`);
    if (selectedSort !== "latest") filters.push(`sorted by: ${selectedSort}`);

    return filters.length > 0 ? `(${filters.join(", ")})` : "";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={retry}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with search and filters */}
      <UserProjectHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />

      {/* Results summary */}
      <div className="mt-6 mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {currentProjects.length} of {totalCount} projects
          {getFilterSummary() && ` ${getFilterSummary()}`}
        </p>
      </div>

      {/* Project grid */}
      {currentProjects.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No projects found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentProjects.map((project) => (
              <UserProjectCard
                key={project.id}
                id={project.id}
                category={project.category}
                title={project.title}
                description={project.description}
                updatedAt={project.updatedAt}
                teamMembers={project.teamMembers}
                manager={project.manager}
                progress={project.progress}
                status={project.status}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProjectListing;
