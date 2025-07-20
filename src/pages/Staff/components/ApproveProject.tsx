import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  UserPlus,
  Users,
  Search,
  AlertCircle,
  Mail,
  MapPin,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

// Mock data
const approvedProjects = [
  {
    id: 1,
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    budget: 250000,
    duration: "24 months",
    status: "unassigned",
    requiredSkills: ["Machine Learning", "Biochemistry", "Python"],
    teamSize: 4,
    startDate: "2024-02-01",
  },
  {
    id: 2,
    title: "Sustainable Energy Storage Solutions",
    pi: "Dr. Michael Chen",
    budget: 180000,
    duration: "18 months",
    status: "partially_assigned",
    requiredSkills: ["Materials Science", "Chemistry", "Engineering"],
    teamSize: 3,
    startDate: "2024-02-15",
    assignedMembers: [
      { id: 1, name: "Dr. Alice Wilson", role: "Lead Researcher" },
    ],
  },
  {
    id: 3,
    title: "Climate Change Impact Study",
    pi: "Dr. Emily Rodriguez",
    budget: 320000,
    duration: "36 months",
    status: "fully_assigned",
    requiredSkills: ["Environmental Science", "Data Analysis", "GIS"],
    teamSize: 5,
    startDate: "2024-01-15",
    assignedMembers: [
      { id: 2, name: "Dr. Bob Thompson", role: "Lead Researcher" },
      { id: 3, name: "Dr. Carol Lee", role: "Data Analyst" },
      { id: 4, name: "Dr. David Brown", role: "Field Researcher" },
      { id: 5, name: "Dr. Eva Davis", role: "GIS Specialist" },
      { id: 6, name: "Dr. Frank Miller", role: "Research Assistant" },
    ],
  },
];

const availableResearchers = [
  {
    id: 7,
    name: "Dr. Grace Taylor",
    email: "grace.taylor@university.edu",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    skills: ["Machine Learning", "Data Science", "Python", "R"],
    experience: "5 years",
    currentProjects: 2,
    maxProjects: 4,
    availability: "available",
    avatar: "/avatars/grace.jpg",
  },
  {
    id: 8,
    name: "Dr. Henry Wilson",
    email: "henry.wilson@research.org",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    skills: ["Biochemistry", "Molecular Biology", "Lab Management"],
    experience: "8 years",
    currentProjects: 1,
    maxProjects: 3,
    availability: "available",
    avatar: "/avatars/henry.jpg",
  },
  {
    id: 9,
    name: "Dr. Iris Chen",
    email: "iris.chen@institute.edu",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    skills: ["Environmental Science", "Climate Modeling", "Statistics"],
    experience: "6 years",
    currentProjects: 3,
    maxProjects: 4,
    availability: "limited",
    avatar: "/avatars/iris.jpg",
  },
];

const ApproveProject: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<
    (typeof approvedProjects)[0] | null
  >(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedResearchers, setSelectedResearchers] = useState<number[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unassigned":
        return "bg-red-100 text-red-800";
      case "partially_assigned":
        return "bg-yellow-100 text-yellow-800";
      case "fully_assigned":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter projects based on status and search
  const filteredProjects = useMemo(() => {
    return approvedProjects.filter((project) => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesSearch =
        project.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        project.pi.toLowerCase().includes(globalFilter.toLowerCase());      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, globalFilter]);

  // Handler functions
  const handleViewDetails = useCallback((project: (typeof approvedProjects)[0]) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  }, []);

  const handleAssignTeam = useCallback((project: (typeof approvedProjects)[0]) => {
    setSelectedProject(project);
    setIsAssignDialogOpen(true);
  }, []);

  // Table columns definition
  const columns = useMemo<ColumnDef<(typeof approvedProjects)[0]>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Project Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="min-w-0 max-w-[250px]">
            <div className="font-medium truncate">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Users className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{row.original.pi}</span>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "status",
        header: "Assignment Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={getStatusColor(status)}>
              {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "teamSize",
        header: "Team",
        cell: ({ row }) => {
          const assignedCount = row.original.assignedMembers?.length || 0;
          const totalSize = row.getValue("teamSize") as number;
          return (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-gray-500" />
              <span className="font-medium">{assignedCount}/{totalSize}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="font-medium truncate">${(row.getValue("budget") as number).toLocaleString()}</span>
          </div>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="truncate">{row.getValue("duration")}</span>
          </div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="truncate">{new Date(row.getValue("startDate")).toLocaleDateString()}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {row.original.status !== "fully_assigned" && (
              <Button
                size="sm"
                onClick={() => handleAssignTeam(row.original)}
                className="h-8 px-2"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleViewDetails, handleAssignTeam]
  );

  // Create table instance
  const table = useReactTable({
    data: filteredProjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const project = row.original;
      const searchString = `${project.title} ${project.pi} ${project.startDate}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });



  const ResearcherCard = ({
    researcher,
    isSelected,
    onToggle,
  }: {
    researcher: (typeof availableResearchers)[0];
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={researcher.avatar} />
            <AvatarFallback>
              {researcher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{researcher.name}</h4>
              <Badge className={getAvailabilityColor(researcher.availability)}>
                {researcher.availability}
              </Badge>
            </div>
            <div className="space-y-1 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {researcher.email}
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {researcher.location}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {researcher.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {researcher.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{researcher.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{researcher.experience} experience</span>
              <span>
                {researcher.currentProjects}/{researcher.maxProjects} projects
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AssignmentDialog = () => (
    <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Researchers</DialogTitle>
          <DialogDescription>
            Select researchers to assign to: {selectedProject?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Search researchers..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="ml">Machine Learning</SelectItem>
                <SelectItem value="bio">Biochemistry</SelectItem>
                <SelectItem value="env">Environmental Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableResearchers.map((researcher) => (
              <ResearcherCard
                key={researcher.id}
                researcher={researcher}
                isSelected={selectedResearchers.includes(researcher.id)}
                onToggle={() => {
                  setSelectedResearchers((prev) =>
                    prev.includes(researcher.id)
                      ? prev.filter((id) => id !== researcher.id)
                      : [...prev, researcher.id]
                  );
                }}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsAssignDialogOpen(false);
              setSelectedResearchers([]);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(
                "Assigning researchers:",
                selectedResearchers,
                "to project:",
                selectedProject?.id
              );
              setIsAssignDialogOpen(false);
              setSelectedResearchers([]);
            }}
            disabled={selectedResearchers.length === 0}
          >
            Assign {selectedResearchers.length} Researcher
            {selectedResearchers.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ProjectDetailDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>
            View detailed information about the project
          </DialogDescription>
        </DialogHeader>
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <Label>Project Title</Label>
              <p className="text-sm font-medium">{selectedProject.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Principal Investigator</Label>
                <p className="text-sm">{selectedProject.pi}</p>
              </div>

              <div>
                <Label>Budget</Label>
                <p className="text-sm font-medium">${selectedProject.budget.toLocaleString()}</p>
              </div>
              <div>
                <Label>Duration</Label>
                <p className="text-sm">{selectedProject.duration}</p>
              </div>
              <div>
                <Label>Start Date</Label>
                <p className="text-sm">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Team Size</Label>
                <p className="text-sm">{selectedProject.assignedMembers?.length || 0}/{selectedProject.teamSize}</p>
              </div>
            </div>
            <div>
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedProject.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Assignment Status</Label>
              <Badge className={getStatusColor(selectedProject.status)}>
                {selectedProject.status.replace("_", " ").charAt(0).toUpperCase() + selectedProject.status.replace("_", " ").slice(1)}
              </Badge>
            </div>
            {selectedProject.assignedMembers && selectedProject.assignedMembers.length > 0 && (
              <div>
                <Label>Assigned Team Members</Label>
                <div className="mt-2 space-y-2">
                  {selectedProject.assignedMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{member.name}</span>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          {selectedProject?.status !== "fully_assigned" && (
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsAssignDialogOpen(true);
            }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Team
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Assignments
          </h1>
          <p className="text-muted-foreground">
            Assign researchers to approved projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            {approvedProjects.filter((p) => p.status === "unassigned").length} Unassigned
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="w-4 h-4 mr-1" />
            {approvedProjects.filter((p) => p.status === "partially_assigned").length} Partial
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Users className="w-4 h-4 mr-1" />
            {availableResearchers.filter((r) => r.availability === "available").length} Available
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="partially_assigned">Partially Assigned</SelectItem>
                  <SelectItem value="fully_assigned">Fully Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Projects Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed" style={{ minWidth: '1000px' }}>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-900 py-3 px-3 text-left bg-gray-50/50"
                      style={{
                        width: index === 0 ? '25%' : // Project Title
                               index === 1 ? '12%' : // Assignment Status
                               index === 2 ? '8%' :  // Team
                               index === 3 ? '12%' : // Budget
                               index === 4 ? '10%' : // Duration
                               index === 5 ? '12%' : // Start Date
                               '21%' // Actions (wider for two buttons)
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-indigo-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-3 text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No projects found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "No projects to review"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>

        {/* Clean Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/30 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`h-8 w-8 p-0 ${
                    table.getState().pagination.pageIndex === pageIndex
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageIndex + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <AssignmentDialog />
      <ProjectDetailDialog />
    </div>
  );
};

export default ApproveProject;
