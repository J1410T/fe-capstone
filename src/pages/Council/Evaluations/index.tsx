import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  EvaluationFilters,
  EvaluationHeader,
  EvaluationsList,
} from "./components";

// Mock data
const evaluations = [
  {
    id: 1,
    projectTitle: "AI-Driven Medical Diagnostics",
    projectCode: "PRJ-2023-001",
    submittedDate: "2023-06-15",
    dueDate: "2023-06-30",
    type: "Proposal",
    status: "Pending",
  },
  {
    id: 2,
    projectTitle: "Sustainable Energy Solutions",
    projectCode: "PRJ-2023-002",
    submittedDate: "2023-06-10",
    dueDate: "2023-06-25",
    type: "Proposal",
    status: "In Progress",
  },
  {
    id: 3,
    projectTitle: "Biodiversity Conservation",
    projectCode: "PRJ-2023-003",
    submittedDate: "2023-06-05",
    dueDate: "2023-06-20",
    type: "Milestone",
    status: "Pending",
  },
  {
    id: 4,
    projectTitle: "Quantum Computing Applications",
    projectCode: "PRJ-2023-004",
    submittedDate: "2023-06-01",
    dueDate: "2023-06-16",
    type: "Milestone",
    status: "In Progress",
  },
  {
    id: 5,
    projectTitle: "Genetic Engineering Ethics",
    projectCode: "PRJ-2023-005",
    submittedDate: "2023-05-25",
    dueDate: "2023-06-10",
    type: "Proposal",
    status: "Pending",
  },
];

const PendingEvaluations: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch = evaluation.projectTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || evaluation.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || evaluation.status === selectedStatus;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "proposal" && evaluation.type === "Proposal") ||
      (activeTab === "milestone" && evaluation.type === "Milestone");
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const handleViewEvaluation = (evaluationId: number) => {
    navigate(`/council/evaluation/${evaluationId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <EvaluationHeader
        title="Project Evaluations"
        description="Review and evaluate project proposals and milestone reports"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Evaluations</TabsTrigger>
          <TabsTrigger value="proposal">Proposals</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
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
                onSearchChange={setSearchTerm}
                onTypeChange={setSelectedType}
                onStatusChange={setSelectedStatus}
              />

              <EvaluationsList
                evaluations={filteredEvaluations}
                onViewEvaluation={handleViewEvaluation}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingEvaluations;
