import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";

import { getStatusColor } from "./utils/statusHelpers";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  CategoryFilter,
  FieldFilter,
  MajorFilter,
  ProjectItem,
  SortOption,
  StatusFilter,
  TypeFilter,
} from "@/types/project";
import {
  getProjectListFilter,
  buildFilterParams,
} from "@/services/resources/project";
import { ProjectCard, ProjectsHeader, ProjectsPagination } from "./components";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Default values for filters
  const DEFAULT_FILTERS = {
    searchTerm: "",
    selectedStatus: "all" as StatusFilter,
    selectedField: "all" as FieldFilter,
    selectedMajor: "all" as MajorFilter,
    selectedCategory: "all" as CategoryFilter,
    selectedType: "all" as TypeFilter,
    selectedSort: "latest" as SortOption,
    tags: [] as string[],
    currentPage: 1,
    pageSize: 9,
  };

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>(
    DEFAULT_FILTERS.searchTerm
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(
    DEFAULT_FILTERS.selectedStatus
  );
  const [selectedField, setSelectedField] = useState<FieldFilter>(
    DEFAULT_FILTERS.selectedField
  );
  const [selectedMajor, setSelectedMajor] = useState<MajorFilter>(
    DEFAULT_FILTERS.selectedMajor
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    DEFAULT_FILTERS.selectedCategory
  );
  const [selectedType, setSelectedType] = useState<TypeFilter>(
    DEFAULT_FILTERS.selectedType
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    DEFAULT_FILTERS.selectedSort
  );
  const [tags, setTags] = useState<string[]>(DEFAULT_FILTERS.tags);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(
    DEFAULT_FILTERS.currentPage
  );
  const [pageSize, setPageSize] = useState<number>(DEFAULT_FILTERS.pageSize);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const filterParams = buildFilterParams({
        searchTerm,
        selectedStatus,
        selectedField,
        selectedMajor,
        selectedCategory,
        selectedType,
        selectedSort,
        tags,
        currentPage,
        pageSize,
      });

      const response = await getProjectListFilter(filterParams);

      setProjects(response["data-list"] || []);
      setTotalPages(response["total-page"] || 1);
      setTotalCount(response["total-count"] || 0);
    } catch (error) {
      console.error("Fetch projects failed:", error);
      setProjects([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchTerm,
    selectedStatus,
    selectedField,
    selectedMajor,
    selectedCategory,
    selectedType,
    selectedSort,
    tags,
    currentPage,
    pageSize,
  ]);

  // Load projects on component mount and when pagination changes
  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, fetchProjects]);

  const handleSearch = useCallback(async () => {
    // Reset to first page when searching
    setCurrentPage(1);
    await fetchProjects();
  }, [fetchProjects]);

  const handleReset = useCallback(() => {
    // Reset all filters to default values
    setSearchTerm(DEFAULT_FILTERS.searchTerm);
    setSelectedStatus(DEFAULT_FILTERS.selectedStatus);
    setSelectedField(DEFAULT_FILTERS.selectedField);
    setSelectedMajor(DEFAULT_FILTERS.selectedMajor);
    setSelectedCategory(DEFAULT_FILTERS.selectedCategory);
    setSelectedType(DEFAULT_FILTERS.selectedType);
    setSelectedSort(DEFAULT_FILTERS.selectedSort);
    setTags(DEFAULT_FILTERS.tags);
    setCurrentPage(DEFAULT_FILTERS.currentPage);
    setPageSize(DEFAULT_FILTERS.pageSize);
    // fetchProjects will be called automatically via useEffect when states change
  }, []);

  const handleViewDetails = useCallback(
    (projectId: string | number) => {
      if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
        navigate(`/pi/project/${projectId}`);
      } else if (user?.role === UserRole.HOST_INSTITUTION) {
        navigate(`/host/project/${projectId}`);
      } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
        navigate(`/council/project/${projectId}`);
      } else {
        navigate(`/researcher/project/${projectId}`);
      }
    },
    [navigate, user?.role]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetchProjects will be called automatically via useEffect
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    // fetchProjects will be called automatically via useEffect
  };

  // Reset to first page when filters change
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleStatusChange = (status: StatusFilter) => {
    setSelectedStatus(status);
    handleFilterChange();
  };

  const handleFieldChange = (field: FieldFilter) => {
    setSelectedField(field);
    setSelectedMajor("all"); // Reset major when field changes
    handleFilterChange();
  };

  const handleMajorChange = (major: MajorFilter) => {
    setSelectedMajor(major);
    handleFilterChange();
  };

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    handleFilterChange();
  };

  const handleTypeChange = (type: TypeFilter) => {
    setSelectedType(type);
    handleFilterChange();
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    handleFilterChange();
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    handleFilterChange();
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    handleFilterChange();
  };

  return (
    <div className="space-y-6">
      <ProjectsHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchTermChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        selectedMajor={selectedMajor}
        onMajorChange={handleMajorChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        tags={tags}
        onTagsChange={handleTagsChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              Found {totalCount} projects
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project["english-title"] || "Untitled"}
                vietnameseTitle={project["vietnamese-title"]}
                status={project.status}
                type={project.type}
                category={project.category}
                description={project.description || ""}
                progress={project.progress}
                tags={project["project-tags"]?.map((tag) => tag.name) || []}
                onViewDetails={handleViewDetails}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {projects.length > 0 && (
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
};

export default ProjectsList;
