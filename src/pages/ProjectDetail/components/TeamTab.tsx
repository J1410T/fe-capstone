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

interface TeamResearcher {
  id?: string;
  accountId?: string;
  name: string;
  role: "Researcher" | "Leader" | "Secretary" | "Principal Investigator";
  major: string;
  email: string;
  avartar: string;
}

interface TeamTabProps {
  team: TeamResearcher[];
}

export const TeamTab: React.FC<TeamTabProps> = ({ team }) => {
  // Function to filter and sort team members
  const processTeamMembers = (members: TeamResearcher[]): TeamResearcher[] => {
    // Group members by a unique identifier (accountId, or email+name as fallback)
    const membersByIdentifier = new Map<string, TeamResearcher[]>();

    members.forEach((member) => {
      // Use accountId if available, otherwise create identifier from email+name
      let identifier: string;
      if (member.accountId && member.accountId.trim() !== "") {
        identifier = member.accountId;
      } else {
        // Fallback to email+name combination for identification
        identifier = `${member.email}|${member.name}`;
      }

      if (!membersByIdentifier.has(identifier)) {
        membersByIdentifier.set(identifier, []);
      }
      membersByIdentifier.get(identifier)!.push(member);
    });

    // For each accountId, select the member with the highest priority role
    const roleHierarchy = {
      "Principal Investigator": 1,
      Leader: 2,
      Secretary: 3,
      Researcher: 4,
    };

    const filteredMembers: TeamResearcher[] = [];

    membersByIdentifier.forEach((membersGroup) => {
      if (membersGroup.length === 1) {
        filteredMembers.push(membersGroup[0]);
      } else {
        // Find the member with the highest priority role (lowest number)
        const selectedMember = membersGroup.reduce((best, current) => {
          const bestPriority = roleHierarchy[best.role] || 999;
          const currentPriority = roleHierarchy[current.role] || 999;
          return currentPriority < bestPriority ? current : best;
        });
        filteredMembers.push(selectedMember);
      }
    });

    // Sort by role hierarchy
    return filteredMembers.sort((a, b) => {
      const aPriority = roleHierarchy[a.role] || 999;
      const bPriority = roleHierarchy[b.role] || 999;
      return aPriority - bPriority;
    });
  };

  const processedTeam = processTeamMembers(team);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal Investigator":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Leader":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Secretary":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Researcher":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // const getRoleIcon = (role: string) => {
  //   switch (role) {
  //     case "Principal Investigator":
  //       return "👑";
  //     case "Leader":
  //       return "⭐";
  //     case "Secretary":
  //       return "📋";
  //     case "Researcher":
  //       return "👤";
  //     default:
  //       return "👤";
  //   }
  // };

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
                Team Researchers involved in the research project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedTeam.map((researcher, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-4">
                  {/* Avatar */}
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                    <img
                      src={researcher.avartar}
                      alt={`${researcher.name}'s avatar`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(researcher.name);
                      }}
                    />
                  </div>

                  {/* Name & Role */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {researcher.name}
                    </h3>
                    <Badge
                      className={`${getRoleColor(
                        researcher.role
                      )} mt-1 text-xs whitespace-nowrap`}
                      variant="outline"
                    >
                      {researcher.role}
                    </Badge>
                  </div>
                </div>

                {/* Major & Email */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{researcher.major}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{researcher.email}</span>
                  </div>
                </div>

                {/* Top indicator for Principal Investigator */}
                {researcher.role === "Principal Investigator" && (
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
