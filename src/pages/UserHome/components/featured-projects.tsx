// import UserProjectCard from "@/components/layout/project-card";

// const projects = [
//   {
//     id: "1",
//     category: "Environmental Science",
//     title: "Climate Change Impact Analysis",
//     description:
//       "Analyzing the effects of climate change on coastal ecosystems",
//     updatedAt: "3 days ago",
//     teamResearchers: 8,
//     manager: "Dr. Sarah Johnson",
//     progress: 75,
//     status: "In Progress",
//     type: "Application",
//   },
//   {
//     id: "2",
//     category: "Computer Science",
//     title: "Quantum Computing Applications",
//     description:
//       "Exploring practical applications of quantum computing in cryptography",
//     updatedAt: "3 days ago",
//     teamResearchers: 6,
//     manager: "Prof. Michael Chen",
//     progress: 45,
//     status: "In Progress",
//     type: "Fundamental",
//   },
//   {
//     id: "3",
//     category: "Microbiology",
//     title: "Novel Antibiotics Discovery",
//     description: "Researching new antibiotic compounds from marine organisms",
//     updatedAt: "3 days ago",
//     teamResearchers: 12,
//     manager: "Dr. Emily Rodriguez",
//     progress: 60,
//     status: "Done",
//     type: "Application",
//   },
//   {
//     id: "4",
//     category: "Artificial Intelligence",
//     title: "Neural Network Optimization",
//     description: "Developing new algorithms for optimizing neural networks",
//     updatedAt: "3 days ago",
//     teamResearchers: 5,
//     manager: "Dr. James Wilson",
//     progress: 30,
//     status: "In Progress",
//     type: "Technology",
//   },
//   {
//     id: "5",
//     category: "Materials Science",
//     title: "Renewable Energy Storage Solutions",
//     description:
//       "Investigating novel materials for energy storage applications",
//     updatedAt: "3 days ago",
//     teamResearchers: 10,
//     manager: "Prof. Lisa Thompson",
//     progress: 85,
//     status: "In Progress",
//     type: "Technology",
//   },
//   {
//     id: "6",
//     category: "Agricultural Science",
//     title: "Genetic Markers for Disease Resistance",
//     description:
//       "Identifying genetic markers associated with disease resistance in crops",
//     updatedAt: "3 days ago",
//     teamResearchers: 7,
//     manager: "Dr. Robert Brown",
//     progress: 50,
//     status: "Done",
//     type: "Fundamental",
//   },
// ];

// const FeaturedProjects: React.FC = () => {
//   return (
//     <section className="py-16 px-4 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
//             Featured Projects
//           </h2>
//           <a
//             href="#"
//             className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"
//           >
//             View all projects →
//           </a>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {projects.slice(0, 6).map((project) => (
//             <UserProjectCard key={project.id} {...project} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProjects;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ProjectItem } from "@/types/project";
import {
  getProjectListFilter,
  buildFilterParams,
} from "@/services/resources/project";
import ProjectCard from "@/components/layout/project-card";
import { getStatusColor } from "@/pages/ProjectsList/utils/statusHelpers";

const FeaturedProjects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeaturedProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the same filter pattern as ProjectList but with limited page size
      const filterParams = buildFilterParams({
        searchTerm: "",
        selectedStatus: "all",
        selectedField: "all",
        selectedMajor: "all",
        selectedCategory: "all",
        selectedType: "all",
        selectedSort: "latest",
        tags: [],
        currentPage: 1,
        pageSize: 6, // Limit to 6 projects for featured section
      });

      const response = await getProjectListFilter(filterParams);
      setProjects(response["data-list"] || []);
    } catch (error) {
      console.error("Fetch featured projects failed:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

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

  const handleViewAllProjects = () => {
    // Navigate to the projects list page based on user role
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate("/pi/projects");
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      navigate("/host/projects");
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      navigate("/council/projects");
    } else {
      navigate("/researcher/projects");
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Featured Projects
          </h2>
          <button
            onClick={handleViewAllProjects}
            className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View all projects →
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        )}

        {!isLoading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              No featured projects are available at the moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
