// import React, { useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Loading } from "@/components/ui/loaders";

// import { getStatusColor } from "./utils/statusHelpers";
// import { useAuth, UserRole } from "@/contexts/AuthContext";
// import {
//   CategoryFilter,
//   FieldFilter,
//   MajorFilter,
//   ProjectFilterItem,
//   SortOption,
//   StatusFilter,
//   TypeFilter,
// } from "@/types/project";
// import {
//   getProjectListFilter,
//   buildFilterParams,
// } from "@/services/resources/project";
// import { ProjectCard, ProjectsHeader, ProjectsPagination } from "./components";

// const ProjectsList: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [projects, setProjects] = useState<ProjectFilterItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
//   const [selectedField, setSelectedField] = useState<FieldFilter>("all");
//   const [selectedMajor, setSelectedMajor] = useState<MajorFilter>("all");
//   const [selectedCategory, setSelectedCategory] =
//     useState<CategoryFilter>("all");
//   const [selectedType, setSelectedType] = useState<TypeFilter>("all");
//   const [selectedSort, setSelectedSort] = useState<SortOption>("latest");
//   const [tags, setTags] = useState<string[]>([]);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(9);

//   const handleSearch = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const filterParams = buildFilterParams({
//         searchTerm,
//         selectedStatus,
//         selectedField,
//         selectedMajor,
//         selectedCategory,
//         selectedType,
//         selectedSort,
//         tags,
//         currentPage,
//         pageSize,
//       });

//       const response = await getProjectListFilter(filterParams);

//       setProjects(response["data-list"] || []);
//       setTotalPages(response["total-page"] || 1);
//       setTotalCount(response["total-count"] || 0);
//     } catch (error) {
//       console.error("Search failed:", error);
//       setProjects([]);
//       setTotalPages(1);
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     searchTerm,
//     selectedStatus,
//     selectedField,
//     selectedMajor,
//     selectedCategory,
//     selectedType,
//     selectedSort,
//     tags,
//     currentPage,
//     pageSize,
//   ]);

//   const handleViewDetails = useCallback(
//     (projectId: string | number) => {
//       if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
//         navigate(`/pi/project/${projectId}`);
//       } else if (user?.role === UserRole.HOST_INSTITUTION) {
//         navigate(`/host/project/${projectId}`);
//       } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
//         navigate(`/council/project/${projectId}`);
//       } else {
//         navigate(`/researcher/project/${projectId}`);
//       }
//     },
//     [navigate, user?.role]
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handlePageSizeChange = (size: number) => {
//     setPageSize(size);
//     setCurrentPage(1);
//   };

//   // Reset to first page when filters change
//   const handleFilterChange = useCallback(() => {
//     setCurrentPage(1);
//   }, []);

//   const handleStatusChange = (status: StatusFilter) => {
//     setSelectedStatus(status);
//     handleFilterChange();
//   };

//   const handleFieldChange = (field: FieldFilter) => {
//     setSelectedField(field);
//     setSelectedMajor("all"); // Reset major when field changes
//     handleFilterChange();
//   };

//   const handleMajorChange = (major: MajorFilter) => {
//     setSelectedMajor(major);
//     handleFilterChange();
//   };

//   const handleCategoryChange = (category: CategoryFilter) => {
//     setSelectedCategory(category);
//     handleFilterChange();
//   };

//   const handleTypeChange = (type: TypeFilter) => {
//     setSelectedType(type);
//     handleFilterChange();
//   };

//   const handleSortChange = (sort: SortOption) => {
//     setSelectedSort(sort);
//     handleFilterChange();
//   };

//   const handleSearchTermChange = (term: string) => {
//     setSearchTerm(term);
//     handleFilterChange();
//   };

//   const handleTagsChange = (newTags: string[]) => {
//     setTags(newTags);
//     handleFilterChange();
//   };

//   return (
//     <div className="space-y-6">
//       <ProjectsHeader
//         searchTerm={searchTerm}
//         onSearchChange={handleSearchTermChange}
//         selectedStatus={selectedStatus}
//         onStatusChange={handleStatusChange}
//         selectedField={selectedField}
//         onFieldChange={handleFieldChange}
//         selectedMajor={selectedMajor}
//         onMajorChange={handleMajorChange}
//         selectedSort={selectedSort}
//         onSortChange={handleSortChange}
//         selectedCategory={selectedCategory}
//         onCategoryChange={handleCategoryChange}
//         selectedType={selectedType}
//         onTypeChange={handleTypeChange}
//         tags={tags}
//         onTagsChange={handleTagsChange}
//         onSearch={handleSearch}
//       />

//       {isLoading ? (
//         <Loading />
//       ) : (
//         <>
//           {totalCount > 0 && (
//             <div className="text-sm text-muted-foreground">
//               Found {totalCount} projects
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <ProjectCard
//                 key={project.id}
//                 id={project.id}
//                 title={project["english-title"] || "Untitled"}
//                 vietnameseTitle={project["vietnamese-title"]}
//                 status={project.status}
//                 type={project.type}
//                 category={project.category}
//                 description={project.description || ""}
//                 progress={project.progress}
//                 tags={project["project-tags"]?.map((tag) => tag.name) || []}
//                 onViewDetails={handleViewDetails}
//                 getStatusColor={getStatusColor}
//               />
//             ))}
//           </div>

//           {projects.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-10">
//               <h3 className="text-lg font-medium">No projects found</h3>
//               <p className="text-muted-foreground">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           )}

//           {projects.length > 0 && (
//             <ProjectsPagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               pageSize={pageSize}
//               onPageChange={handlePageChange}
//               onPageSizeChange={handlePageSizeChange}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ProjectsList;

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";

import { getStatusColor } from "./utils/statusHelpers";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  CategoryFilter,
  FieldFilter,
  MajorFilter,
  ProjectFilterItem,
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
  const [projects, setProjects] = useState<ProjectFilterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [selectedField, setSelectedField] = useState<FieldFilter>("all");
  const [selectedMajor, setSelectedMajor] = useState<MajorFilter>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("latest");
  const [tags, setTags] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

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
