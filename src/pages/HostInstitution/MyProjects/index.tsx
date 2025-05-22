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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  FileText,
  Calendar,
  Users,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";

// Mock data for joined projects
const myProjects = [
  {
    id: 1,
    title: "Machine Learning for Medical Diagnosis",
    field: "Computer Science",
    status: "Active",
    startDate: "2023-05-15",
    endDate: "2024-11-15",
    pi: "Dr. Jane Smith",
    budget: "$120,000",
    role: "Host Institution",
  },
  {
    id: 2,
    title: "Renewable Energy Storage Solutions",
    field: "Engineering",
    status: "Active",
    startDate: "2023-06-02",
    endDate: "2024-06-02",
    pi: "Dr. Michael Johnson",
    budget: "$85,000",
    role: "Host Institution",
  },
  {
    id: 3,
    title: "Blockchain in Supply Chain Management",
    field: "Business & Economics",
    status: "Completed",
    startDate: "2022-06-10",
    endDate: "2023-06-10",
    pi: "Dr. Sarah Williams",
    budget: "$75,000",
    role: "Host Institution",
  },
];

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique fields for filter
  const fields = [
    "all",
    ...new Set(myProjects.map((project) => project.field)),
  ];

  // Get unique statuses for filter
  const statuses = [
    "all",
    ...new Set(myProjects.map((project) => project.status)),
  ];

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort projects
  const filteredProjects = myProjects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.pi.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (project) => selectedField === "all" || project.field === selectedField
    )
    .filter(
      (project) => selectedStatus === "all" || project.status === selectedStatus
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const handleViewProject = (projectId: number) => {
    navigate(`/host/project/${projectId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            View and manage research projects you are participating in
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Joined Projects</CardTitle>
          <CardDescription>
            Projects where you serve as the host institution
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
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field === "all" ? "All Fields" : field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Project Title
                      {sortColumn === "title" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("field")}
                  >
                    <div className="flex items-center">
                      Field
                      {sortColumn === "field" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("pi")}
                  >
                    <div className="flex items-center">
                      Principal Investigator
                      {sortColumn === "pi" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortColumn === "status" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center">
                      Timeline
                      {sortColumn === "startDate" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>{project.field}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                          {project.pi}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            project.status === "Active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : project.status === "Completed"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">
                              {project.startDate} - {project.endDate}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="mr-2 h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{project.budget}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <FileText className="mr-2 h-3 w-3" />
                          View Details
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
    </div>
  );
};

export default MyProjects;
