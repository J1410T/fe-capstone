import ProjectCard from "@/components/layout/project-card";
import React from "react";

const projects = [
  {
    category: "Environmental Science",
    title: "Climate Change Impact Analysis",
    description:
      "Analyzing the effects of climate change on coastal ecosystems",
    updatedAt: "3 days ago",
    teamMembers: 8,
    manager: "Dr. Sarah Johnson",
    progress: 75,
    status: "Active",
  },
  {
    category: "Computer Science",
    title: "Quantum Computing Applications",
    description:
      "Exploring practical applications of quantum computing in cryptography",
    updatedAt: "3 days ago",
    teamMembers: 6,
    manager: "Prof. Michael Chen",
    progress: 45,
    status: "Active",
  },
  {
    category: "Microbiology",
    title: "Novel Antibiotics Discovery",
    description: "Researching new antibiotic compounds from marine organisms",
    updatedAt: "3 days ago",
    teamMembers: 12,
    manager: "Dr. Emily Rodriguez",
    progress: 60,
    status: "Completed",
  },
  {
    category: "Artificial Intelligence",
    title: "Neural Network Optimization",
    description: "Developing new algorithms for optimizing neural networks",
    updatedAt: "3 days ago",
    teamMembers: 5,
    manager: "Dr. James Wilson",
    progress: 30,
    status: "Active",
  },
  {
    category: "Materials Science",
    title: "Renewable Energy Storage Solutions",
    description:
      "Investigating novel materials for energy storage applications",
    updatedAt: "3 days ago",
    teamMembers: 10,
    manager: "Prof. Lisa Thompson",
    progress: 85,
    status: "Active",
  },
  {
    category: "Agricultural Science",
    title: "Genetic Markers for Disease Resistance",
    description:
      "Identifying genetic markers associated with disease resistance in crops",
    updatedAt: "3 days ago",
    teamMembers: 7,
    manager: "Dr. Robert Brown",
    progress: 50,
    status: "Completed",
  },
];

const FeaturedProjects: React.FC = () => {
  return (
    <section className=" pt-4 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Projects
          </h2>
          <a
            href="#"
            className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View all projects →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
