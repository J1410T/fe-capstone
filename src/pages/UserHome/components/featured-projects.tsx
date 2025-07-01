import UserProjectCard from "@/components/layout/project-card";

const projects = [
  {
    id: "1",
    category: "Environmental Science",
    title: "Climate Change Impact Analysis",
    description:
      "Analyzing the effects of climate change on coastal ecosystems",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 8,
    manager: "Dr. Sarah Johnson",
    progress: 75,
    status: "In Progress",
    type: "Application",
  },
  {
    id: "2",
    category: "Computer Science",
    title: "Quantum Computing Applications",
    description:
      "Exploring practical applications of quantum computing in cryptography",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 6,
    manager: "Prof. Michael Chen",
    progress: 45,
    status: "In Progress",
    type: "Fundamental",
  },
  {
    id: "3",
    category: "Microbiology",
    title: "Novel Antibiotics Discovery",
    description: "Researching new antibiotic compounds from marine organisms",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 12,
    manager: "Dr. Emily Rodriguez",
    progress: 60,
    status: "Done",
    type: "Application",
  },
  {
    id: "4",
    category: "Artificial Intelligence",
    title: "Neural Network Optimization",
    description: "Developing new algorithms for optimizing neural networks",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 5,
    manager: "Dr. James Wilson",
    progress: 30,
    status: "In Progress",
    type: "Technology",
  },
  {
    id: "5",
    category: "Materials Science",
    title: "Renewable Energy Storage Solutions",
    description:
      "Investigating novel materials for energy storage applications",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 10,
    manager: "Prof. Lisa Thompson",
    progress: 85,
    status: "In Progress",
    type: "Technology",
  },
  {
    id: "6",
    category: "Agricultural Science",
    title: "Genetic Markers for Disease Resistance",
    description:
      "Identifying genetic markers associated with disease resistance in crops",
    updatedAt: "3 days ago",
    teamRESEARCHERs: 7,
    manager: "Dr. Robert Brown",
    progress: 50,
    status: "Done",
    type: "Fundamental",
  },
];

const FeaturedProjects: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Featured Projects
          </h2>
          <a
            href="#"
            className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View all projects →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 6).map((project) => (
            <UserProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
