import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RegisterHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  projectsCount: number;
}

export const RegisterHeader: React.FC<RegisterHeaderProps> = ({
  activeTab,
  onTabChange,
  projectsCount,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">Register New Project</TabsTrigger>
        <TabsTrigger value="projects">
          My Projects
          <Badge variant="secondary" className="ml-2">
            {projectsCount}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
