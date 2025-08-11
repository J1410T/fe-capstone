import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { User, Users, Eye, Mail, Phone, Building } from "lucide-react";
import { PrincipalInvestigator, EnhancedTeamMember } from "../types";

interface EnhancedTeamInformationProps {
  principalInvestigator: PrincipalInvestigator;
  teamMembers: EnhancedTeamMember[];
  onViewMemberDetail?: (memberId: string) => void;
  onViewPIDetail?: () => void;
  className?: string;
}

export const EnhancedTeamInformation: React.FC<
  EnhancedTeamInformationProps
> = ({
  principalInvestigator,
  teamMembers,
  onViewMemberDetail,
  onViewPIDetail,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Principal Investigator & Team
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Principal Investigator */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Principal Investigator
            </h3>
            {onViewPIDetail && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewPIDetail}
                className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-300"
              >
                <Eye className="h-4 w-4" />
                View Detail
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  Personal Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Name:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {principalInvestigator.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Academic Title:
                    </span>
                    <p className="text-gray-900">
                      {principalInvestigator.academicTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-900">
                      {principalInvestigator.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-900">
                      {principalInvestigator.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Work Unit</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-900">
                      {principalInvestigator.workUnit}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    {principalInvestigator.workAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-900">
                Team Members
              </span>
              <Badge
                variant="outline"
                className="bg-white border-purple-300 text-purple-700"
              >
                {teamMembers.length} Member{teamMembers.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {teamMembers.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-dashed border-purple-300">
              <Users className="h-12 w-12 text-purple-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No team members assigned to this project.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Team members will appear here once assigned.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id || index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {member.academicTitle}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Work Unit
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {member.workUnit}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Contribution
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {member.contribution}
                          </p>
                        </div>
                      </div>

                      {member.workDuration && (
                        <div className="mt-3">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            Duration: {member.workDuration}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {onViewMemberDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewMemberDetail(member.id)}
                          className="flex items-center gap-2 bg-white hover:bg-purple-50 border-purple-300"
                        >
                          <Eye className="h-4 w-4" />
                          View Detail
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTeamInformation;
