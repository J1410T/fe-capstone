import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Briefcase, Mail } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  email: string;
}

interface TeamTabProps {
  team: TeamMember[];
}

export const TeamTab: React.FC<TeamTabProps> = ({ team }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Team</CardTitle>
        <CardDescription>Team members involved in the research project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {member.department}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
