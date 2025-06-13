import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Building,
  ArrowLeft,
} from "lucide-react";

// Mock data for a specific evaluation
const evaluationDetails = {
  id: 1,
  projectTitle: "AI-Driven Medical Diagnostics",
  projectCode: "PRJ-2023-001",
  submittedDate: "2023-06-15",
  dueDate: "2023-06-30",
  type: "Proposal",
  status: "Pending",
  description:
    "This project aims to develop AI algorithms for early detection of diseases from medical imaging data. The research will focus on improving accuracy and reducing false positives in diagnostic procedures.",
  objectives: [
    "Develop deep learning models for medical image analysis",
    "Validate algorithms against expert diagnoses",
    "Create a user-friendly interface for medical professionals",
    "Conduct clinical trials to assess effectiveness",
  ],
  institution: "University of Technology",
  department: "Computer Science",
  budget: "$250,000",
  duration: "24 months",
  team: [
    {
      name: "Dr. Jane Smith",
      role: "Principal Investigator",
      institution: "University of Technology",
    },
    {
      name: "Dr. Michael Johnson",
      role: "Co-Investigator",
      institution: "Medical Research Institute",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Research Associate",
      institution: "University of Technology",
    },
  ],
  documents: [
    { name: "Project Proposal (BM01)", url: "#" },
    { name: "Budget Breakdown", url: "#" },
    { name: "Research Timeline", url: "#" },
    { name: "Team CVs", url: "#" },
  ],
};

const EvaluationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // In a real application, you would fetch the evaluation details based on the ID
  const evaluation = evaluationDetails;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => navigate("/council/evaluations")}
        >
          <ArrowLeft className="  h-4 w-4" />
        </Button>
        <div className="flex justify-between flex-col ">
          <h1 className="text-2xl font-bold tracking-tight">
            {evaluation.projectTitle}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{evaluation.projectCode}</span>
            <span>•</span>
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
            <span>•</span>
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
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/council/evaluation/${id}/form`)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Complete Evaluation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Research Team</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation Form</TabsTrigger>
        </TabsList>

        {/* Project Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Key information about the research project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {evaluation.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Institution:</span>
                      <span className="text-sm text-muted-foreground">
                        {evaluation.institution}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Department:</span>
                      <span className="text-sm text-muted-foreground">
                        {evaluation.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline & Budget</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm text-muted-foreground">
                        {evaluation.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Budget:</span>
                      <span className="text-sm text-muted-foreground">
                        {evaluation.budget}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>
                Review all documents related to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluation.documents.map((doc, index) => (
                  <Card key={index}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Research Team</CardTitle>
              <CardDescription>
                Members involved in this research project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Institution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluation.team.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.institution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Form Tab */}
        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Form</CardTitle>
              <CardDescription>
                Complete your evaluation for this{" "}
                {evaluation.type.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please complete the evaluation form by clicking the button
                  below. Your evaluation will be used in the council's
                  decision-making process.
                </p>
                <Button
                  onClick={() => navigate(`/council/evaluation/${id}/form`)}
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Complete Evaluation Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvaluationDetail;
