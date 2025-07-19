import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Users,
  FolderOpen,
  Search,
  AlertCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";

// Mock data
const approvedProjects = [
  {
    id: 1,
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    institution: "Stanford University",
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
    institution: "MIT",
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
    institution: "UC San Diego",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<
    (typeof approvedProjects)[0] | null
  >(null);
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

  const filteredProjects = approvedProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.pi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ProjectCard = ({
    project,
  }: {
    project: (typeof approvedProjects)[0];
  }) => (
    <Card
      className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {project.pi} • {project.institution}
            </p>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <span className="ml-2 font-medium">
                ${project.budget.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 font-medium">{project.duration}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Team Size:</span>
              <span className="ml-2 font-medium">
                {project.teamSize} members
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Start Date:</span>
              <span className="ml-2 font-medium">{project.startDate}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Required Skills:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {project.assignedMembers && project.assignedMembers.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Assigned Members:</Label>
              <div className="space-y-2 mt-2">
                {project.assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedProject(project)}
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {project.status !== "fully_assigned" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedProject(project);
                  setIsAssignDialogOpen(true);
                }}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Assign
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      className={`${UI_CONSTANTS.BORDERS.default} ${
        UI_CONSTANTS.RADIUS.default
      } cursor-pointer transition-all ${
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
            {
              approvedProjects.filter((p) => p.status === "unassigned").length
            }{" "}
            Unassigned
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Users className="w-4 h-4 mr-1" />
            {
              availableResearchers.filter((r) => r.availability === "available")
                .length
            }{" "}
            Available
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="partially_assigned">
                  Partially Assigned
                </SelectItem>
                <SelectItem value="fully_assigned">Fully Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects found</p>
          </CardContent>
        </Card>
      )}

      <AssignmentDialog />
    </div>
  );
};

export default ApproveProject;
