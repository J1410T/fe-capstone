// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useAuth, UserRole } from "@/contexts/AuthContext";
// import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";
// import { ArrowLeft } from "lucide-react";

// interface ProjectHeaderProps {
//   title: string;
//   status: string;
//   pi: string;
//   hasAccess: boolean;
// }

// export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
//   title,
//   status,
//   hasAccess,
// }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const getBackPath = () => {
//     switch (user?.role) {
//       case UserRole.PRINCIPAL_INVESTIGATOR:
//         return "/pi/projects";
//       case UserRole.HOST_INSTITUTION:
//         return "/host/my-projects";
//       case UserRole.RESEARCHER:
//         return "/researcher/projects";
//       case UserRole.APPRAISAL_COUNCIL:
//         return "/council/projects";
//       default:
//         return "/home";
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex md:flex-row items-start md:items-center gap-4">
//         <Button variant="outline" onClick={() => navigate(getBackPath())}>
//           <ArrowLeft className="w-4 h-4" />
//         </Button>
//         <div className="flex-1">
//           <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
//           <div className="flex items-center gap-2 mt-1">
//             <Badge variant="outline" className={getStatusColor(status)}>
//               {getStatusIcon(status)}
//               {status}
//             </Badge>
//             {hasAccess && (
//               <Badge variant="secondary" className="ml-2">
//                 Researcher
//               </Badge>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";
import { ArrowLeft } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  status: string;
  isMember: boolean;
  roleInProject: string[];
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  status,
  isMember,
  roleInProject,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return "/pi/projects";
      case UserRole.HOST_INSTITUTION:
        return "/host/my-projects";
      case UserRole.RESEARCHER:
        return "/researcher/projects";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/projects";
      default:
        return "/home";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row items-start md:items-center gap-4">
        <Button variant="outline" onClick={() => navigate(getBackPath())}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(status)}>
              {getStatusIcon(status)}
              {status}
            </Badge>
            {isMember && roleInProject.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {roleInProject.join(", ")}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
