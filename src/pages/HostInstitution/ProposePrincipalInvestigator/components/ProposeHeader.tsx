import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProposeHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  waitingCount: number;
  applicationsCount: number;
}

export const ProposeHeader: React.FC<ProposeHeaderProps> = ({
  activeTab,
  onTabChange,
  waitingCount,
  applicationsCount,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Principal Investigator Management
        </h1>
        <p className="text-muted-foreground">
          Create research topics and manage principal investigator applications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="create">Create Topic</TabsTrigger>
          <TabsTrigger value="waiting">
            Waiting for PI
            <Badge variant="secondary" className="ml-2">
              {waitingCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="applications">
            PI Applications
            <Badge variant="secondary" className="ml-2">
              {applicationsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
