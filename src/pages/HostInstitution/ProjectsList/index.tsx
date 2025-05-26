import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loaders";
import { ProjectsHeader, ProjectCard, ProjectsPagination } from "./components";
import { getStatusColor } from "./utils/statusHelpers";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// Mock data for projects
const projects = [
  {
    id: 1,
    title: "AI-Driven Healthcare Solutions",
    pi: "Dr. Jane Smith",
    department: "Computer Science",
    year: "2023",
    status: "In Progress",
    progress: 65,
    budget: "$120,000",
  },
  {
    id: 2,
    title: "Sustainable Energy Systems",
    pi: "Dr. Michael Johnson",
    department: "Engineering",
    year: "2023",
    status: "Pending",
    progress: 25,
    budget: "$85,000",
  },
  {
    id: 3,
    title: "Market Analysis of Emerging Economies",
    pi: "Dr. Sarah Williams",
    department: "Business",
    year: "2023",
    status: "Completed",
    progress: 100,
    budget: "$75,000",
  },
  {
    id: 4,
    title: "Novel Drug Delivery Systems",
    pi: "Dr. Robert Chen",
    department: "Medicine",
    year: "2023",
    status: "In Progress",
    progress: 45,
    budget: "$150,000",
  },
  {
    id: 5,
    title: "Cultural Impact of Digital Media",
    pi: "Dr. Emily Davis",
    department: "Arts",
    year: "2023",
    status: "Pending",
    progress: 10,
    budget: "$60,000",
  },
  {
    id: 6,
    title: "Quantum Computing Applications",
    pi: "Dr. David Lee",
    department: "Computer Science",
    year: "2023",
    status: "In Progress",
    progress: 55,
    budget: "$200,000",
  },
  {
    id: 7,
    title: "Renewable Materials for Construction",
    pi: "Dr. Lisa Wang",
    department: "Engineering",
    year: "2023",
    status: "Completed",
    progress: 100,
    budget: "$110,000",
  },
  {
    id: 8,
    title: "Financial Technology Innovations",
    pi: "Dr. James Wilson",
    department: "Business",
    year: "2023",
    status: "In Progress",
    progress: 70,
    budget: "$95,000",
  },
  {
    id: 9,
    title: "Genomic Analysis of Rare Diseases",
    pi: "Dr. Maria Rodriguez",
    department: "Medicine",
    year: "2023",
    status: "Pending",
    progress: 30,
    budget: "$180,000",
  },
  {
    id: 10,
    title: "Digital Preservation of Historical Artifacts",
    pi: "Dr. Thomas Brown",
    department: "Arts",
    year: "2023",
    status: "Completed",
    progress: 100,
    budget: "$70,000",
  },
];

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter projects based on search term, status, and department
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === "all" || project.department === selectedDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedDepartment, pageSize]);

  const handleViewDetails = (projectId: number) => {
    // Navigate to project details page based on user role
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate(`/pi/project/${projectId}`);
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      navigate(`/host/project/${projectId}`);
    } else {
      // Default to member project details for other roles
      navigate(`/member/project/${projectId}`);
    }
  };

  const handleExportData = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <ProjectsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        onExportData={handleExportData}
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
                project={project}
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
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsList;
