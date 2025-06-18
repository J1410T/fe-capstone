import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Mail } from "lucide-react";

interface TeamMember {
  id?: string;
  name: string;
  role: "Member" | "Leader" | "Secretary" | "Principal Investigator";
  department: string;
  email: string;
}

interface TeamTabProps {
  team: TeamMember[];
}

export const TeamTab: React.FC<TeamTabProps> = ({ team }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal Investigator":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Leader":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Secretary":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Member":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Principal Investigator":
        return "👑";
      case "Leader":
        return "⭐";
      case "Secretary":
        return "📋";
      case "Member":
        return "👤";
      default:
        return "👤";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Project Team
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Team members involved in the research project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-3 ">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">
                      {getRoleIcon(member.role)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <Badge
                      className={`${getRoleColor(member.role)} mt-1 text-xs`}
                      variant="outline"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{member.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Special indicator for Principal Investigator */}
                {member.role === "Principal Investigator" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-t-lg"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
