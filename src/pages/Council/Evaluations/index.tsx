import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, Calendar, Clock } from "lucide-react";

// Mock data for evaluations
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

  // Filter evaluations based on search term, type, and status
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Pending Evaluations
        </h1>
        <p className="text-muted-foreground">
          Review and evaluate project proposals and milestone reports
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Project Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvaluations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No evaluations found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvaluations.map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">
                            {evaluation.projectTitle}
                          </TableCell>
                          <TableCell>{evaluation.projectCode}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                evaluation.type === "Proposal"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-purple-100 text-purple-800 border-purple-200"
                              }
                            >
                              {evaluation.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                              {evaluation.submittedDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                              {evaluation.dueDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                evaluation.status === "Pending"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
                              }
                            >
                              {evaluation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewEvaluation(evaluation.id)
                              }
                            >
                              <FileText className="mr-2 h-3 w-3" />
                              Evaluate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingEvaluations;
