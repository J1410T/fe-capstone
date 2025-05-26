import { FaClock, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface UserProjectCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  updatedAt: string;
  teamMembers: number;
  manager: string;
  progress: number;
  status: string;
}

const UserProjectCard: React.FC<UserProjectCardProps> = ({
  id,
  category,
  title,
  description,
  updatedAt,
  teamMembers,
  manager,
  progress,
  status,
}) => {
  const { user } = useAuth();

  // Determine the correct route based on user role
  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return `/pi/project/${id}`;
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      return `/host/project/${id}`;
    } else {
      // Default to member project details for other roles
      return `/member/project/${id}`;
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition duration-300 h-full flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          {category}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
          {progress}% Complete
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <FaClock className="text-gray-400 flex-shrink-0" />
          <span>Updated {updatedAt}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <FaUsers className="text-gray-400 flex-shrink-0" />
          <span>{teamMembers} team members</span>
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

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">Manager: {manager}</p>
          <Link
            to={getProjectDetailRoute()}
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProjectCard;
