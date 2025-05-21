import { FaClock, FaUsers } from "react-icons/fa";

interface ProjectCardProps {
  category: string;
  title: string;
  description: string;
  updatedAt: string;
  teamMembers: number;
  manager: string;
  progress: number;
  status: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  category,
  title,
  description,
  updatedAt,
  teamMembers,
  manager,
  progress,
  status,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition duration-300">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          {category}
        </span>
        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
          {progress}% Complete
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 ">{title}</h3>
      <p className="text-sm text-gray-600 mb-2 ">{description}</p>

      <div className="flex items-center text-sm text-gray-500 mb-1 gap-2">
        <FaClock className="text-gray-400" />
        Updated {updatedAt}
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-1 gap-2">
        <FaUsers className="text-gray-400" />
        {teamMembers} team members
      </div>

      {/* Status section */}
      <div className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-sm gap-1 my-2">
        <span className="text-gray-700">Status:</span>
        <span
          className={`font-semibold ${
            status === "Active"
              ? "text-emerald-700"
              : status === "Completed"
              ? "text-indigo-700"
              : "text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between ">
        <p className="text-sm text-gray-600">Manager: {manager}</p>
        <a
          href="#"
          className="text-sm font-semibold text-emerald-600 hover:underline"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
