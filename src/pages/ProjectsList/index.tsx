import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import {
  ProjectsHeader,
  ProjectCard,
  ProjectsPagination,
  StatusFilter,
  FieldFilter,
  MajorFilter,
  CategoryFilter,
  TypeFilter,
  SortOption,
} from "./components";
import { getStatusColor } from "./utils/statusHelpers";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Project } from "@/types/project";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [selectedField, setSelectedField] = useState<FieldFilter>("all");
  const [selectedMajor, setSelectedMajor] = useState<MajorFilter>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("latest");
  const [tags, setTags] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        "page-index": currentPage.toString(),
        "page-size": pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(selectedField !== "all" && { field: selectedField }),
        ...(selectedMajor !== "all" && { major: selectedMajor }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedType !== "all" && { type: selectedType }),
        ...(selectedSort && { sort: selectedSort }),
        ...(tags.length > 0 && { tags: tags.join(",") }),
      });

      const response = await fetch(`/api/projects?${searchParams}`);
      const data = await response.json();

      setProjects(data["data-list"] || []);
      setTotalPages(data["total-page"] || 1);
    } catch (error) {
      console.error("Search failed:", error);
      setProjects([]);
      setTotalPages(1);
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

  const handleViewDetails = useCallback(
    (projectId: string | number) => {
      if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
        navigate(`/pi/project/${projectId}`);
      } else if (user?.role === UserRole.HOST_INSTITUTION) {
        navigate(`/host/project/${projectId}`);
      } else {
        navigate(`/researcher/project/${projectId}`);
      }
    },
    [navigate, user?.role]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="space-y-6">
      <ProjectsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        selectedMajor={selectedMajor}
        onMajorChange={setSelectedMajor}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        tags={tags}
        onTagsChange={setTags}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={
                  project["englishTitle"] ||
                  project["vietnameseTitle"] ||
                  "Untitled"
                }
                status={project.status}
                type={project.type}
                category={project.category}
                description={project.description || ""}
                progress={project.progress}
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
