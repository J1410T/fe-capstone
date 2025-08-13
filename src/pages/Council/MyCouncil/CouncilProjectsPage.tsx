import React, { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Calendar, FileText, ChevronRight } from "lucide-react";
import { useMyProject } from "@/hooks/queries/project";
import { Loading } from "@/components/ui/loaders";
import { useAppraisalCouncilsListBasic } from "@/hooks/queries/appraisal-council";
import { AppraisalCouncil } from "@/types/appraisal-council";
import { councilApi, CouncilProject } from "./api";

const CouncilProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: projectsResponse, error } = useMyProject();
  const [projects, setProjects] = useState<CouncilProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCouncil, setSelectedCouncil] = useState<string>("all");

  // Load projects from consolidated API if no API data
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const apiProjects = projectsResponse?.data || [];
        if (apiProjects.length > 0) {
          // Convert API response to CouncilProject format
          const convertedProjects: CouncilProject[] = apiProjects.map(
            (project) => ({
              id: project.id,
              "english-title": project["english-title"],
              "vietnamese-title": project["vietnamese-title"] || undefined,
              category: project.category || "General",
              type: project.type || "Research",
              status: project.status,
              "created-at": project["created-at"],
              "council-id": undefined, // API doesn't have council-id field
              description: project.description || undefined,
            })
          );
          setProjects(convertedProjects);
        } else {
          // Use consolidated API as fallback
          const consolidatedProjects = await councilApi.getAllProjects();
          setProjects(consolidatedProjects);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        // Fallback to consolidated API on error
        try {
          const consolidatedProjects = await councilApi.getAllProjects();
          setProjects(consolidatedProjects);
        } catch (consolidatedError) {
          console.error(
            "Error loading consolidated projects:",
            consolidatedError
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [projectsResponse]);

  // Fetch appraisal councils
  const { data: councilsResponse } = useAppraisalCouncilsListBasic({
    "key-word": "",
    "page-index": 1,
    "page-size": 100,
  });

  const availableCouncils = useMemo(() => {
    return councilsResponse?.["data-list"] || [];
  }, [councilsResponse]);

  // Auto-select first council if available and no council is selected
  useEffect(() => {
    if (availableCouncils.length > 0 && selectedCouncil === "all") {
      setSelectedCouncil(availableCouncils[0].id);
    }
  }, [availableCouncils, selectedCouncil]);

  const onCouncilChange = (value: string) => {
    setSelectedCouncil(value);
  };

  // Filter projects by selected council
  const filteredProjects = projects.filter((project: CouncilProject) => {
    if (selectedCouncil === "all") return true;
    // Filter by council assignment - check if project has council-id matching selected council
    return project["council-id"] === selectedCouncil;
  });

  const handleViewProjectMilestones = (projectId: string) => {
    navigate(`/council/project-milestones/${projectId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loading className="w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading projects</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Council Projects
            </h1>
            <p className="text-gray-600">
              Projects assigned to your appraisal council for evaluation and
              review
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Council Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Select Appraisal Council
              </label>
            </div>
            <Select value={selectedCouncil} onValueChange={onCouncilChange}>
              <SelectTrigger className="w-[320px] h-[50px] bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Choose an appraisal council" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                <SelectItem value="all" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    All Councils
                  </div>
                </SelectItem>
                {availableCouncils.map((council: AppraisalCouncil) => (
                  <SelectItem
                    key={council.id}
                    value={council.id}
                    className="rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {council.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Council Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Projects assigned to your appraisal council
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    No projects found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    No projects are assigned to the selected council
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  onClick={() => handleViewProjectMilestones(project.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                          {project["english-title"] || "Untitled Project"}
                        </h3>
                        {project["vietnamese-title"] && (
                          <p className="text-sm text-gray-600 mb-2">
                            {project["vietnamese-title"]}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {project.category}
                          </span>
                          <Badge variant="outline">{project.type}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(project["created-at"])}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={getStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>

                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CouncilProjectsPage;
