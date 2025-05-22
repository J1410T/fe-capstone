import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvaluationFilters } from "./EvaluationFilters";
import { EvaluationsList } from "./EvaluationsList";

interface Evaluation {
  id: number;
  projectTitle: string;
  projectCode: string;
  submittedDate: string;
  dueDate: string;
  type: string;
  status: string;
}

interface EvaluationTabsProps {
  activeTab: string;
  searchTerm: string;
  selectedType: string;
  selectedStatus: string;
  evaluations: Evaluation[];
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewEvaluation: (id: number) => void;
}

export const EvaluationTabs: React.FC<EvaluationTabsProps> = ({
  activeTab,
  searchTerm,
  selectedType,
  selectedStatus,
  evaluations,
  onTabChange,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onViewEvaluation,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Evaluations</TabsTrigger>
        <TabsTrigger value="proposal">Proposals</TabsTrigger>
        <TabsTrigger value="milestone">Milestones</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Requests</CardTitle>
            <CardDescription>
              Review and evaluate research projects and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EvaluationFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              onSearchChange={onSearchChange}
              onTypeChange={onTypeChange}
              onStatusChange={onStatusChange}
            />
            <EvaluationsList
              evaluations={evaluations}
              onViewEvaluation={onViewEvaluation}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
