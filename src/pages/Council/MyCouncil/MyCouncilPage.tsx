import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Calendar,
  // FileText,
  ChevronRight,
  Users,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { getMyAppraisalCouncils } from "@/services/resources/appraisal-council";
import { getProjectsByCouncilId } from "@/services/resources/project";
import { AppraisalCouncil } from "@/types/appraisal-council";
import { ProjectWithProposals } from "@/types/project";
import { useMyAppraisalCouncils } from "@/hooks/queries/appraisal-council";
import { useProjectsByAppraisalCouncil } from "@/hooks/queries/project";
// import { ProjectWithProposals } from "@/types/project";

const MyCouncilPage: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [councils, setCouncils] = useState<AppraisalCouncil[]>([]);
  const [selectedCouncilId, setSelectedCouncilId] = useState<string>("");

  const [projects, setProjects] = useState<ProjectWithProposals[]>([]);
  const [isLoadingCouncils, setIsLoadingCouncils] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Query hooks
  const { data: councilsData, isLoading: isLoadingCouncilsQuery } =
    useMyAppraisalCouncils({
      "page-index": 1,
      "page-size": 10,
    });

  const { data: projectsData, isLoading: isLoadingProjectsQuery } =
    useProjectsByAppraisalCouncil(selectedCouncilId, [
      "inprogress",
      "completed",
      "canceled",
      "approved",
    ]);

  // Load user's councils on mount
  useEffect(() => {
    const loadCouncils = async () => {
      try {
        setIsLoadingCouncils(true);
        const response = await getMyAppraisalCouncils({
          "page-index": 1,
          "page-size": 10,
        });
        setCouncils(response["data-list"] || []);

        // Auto-select first council if available
        if (response["data-list"]?.length > 0) {
          setSelectedCouncilId(response["data-list"][0].id);
        }
      } catch (error) {
        console.error("Error loading councils:", error);
      } finally {
        setIsLoadingCouncils(false);
      }
    };

    loadCouncils();
  }, []);

  // Handle councils data from query hooks
  useEffect(() => {
    if (councilsData?.["data-list"]) {
      setCouncils(councilsData["data-list"]);
      setIsLoadingCouncils(false);

      // Auto-select first council if available and none selected
      if (councilsData["data-list"].length > 0 && !selectedCouncilId) {
        setSelectedCouncilId(councilsData["data-list"][0].id);
      }
    }
  }, [councilsData, selectedCouncilId]);

  // Handle projects data from query hooks
  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
      setIsLoadingProjects(false);
    }
  }, [projectsData]);

  // Load projects when council is selected
  useEffect(() => {
    const loadProjects = async () => {
      if (!selectedCouncilId) {
        setProjects([]);
        return;
      }

      try {
        setIsLoadingProjects(true);
        console.log("Loading projects for council:", selectedCouncilId);

        const projectsData = await getProjectsByCouncilId(selectedCouncilId, [
          "inprogress",
          "completed",
          "canceled",
          "approved",
        ]);

        console.log("Projects data received:", projectsData);
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error loading projects:", error);
        console.error("Error details:", error);

        // No fallback mock data - just show empty state if API fails
        console.log(
          "No projects found or API failed for council:",
          selectedCouncilId
        );
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, [selectedCouncilId]);

  const selectedCouncil = councils.find((c) => c.id === selectedCouncilId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "secondary";
      case "submitted":
        return "default";
      case "approved":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleProjectClick = (projectId: string, projectData?: any) => {
    // Store project data for use in ProjectDetailPage
    if (projectData) {
      const projectDataKey = `project_${projectId}`;
      sessionStorage.setItem(projectDataKey, JSON.stringify(projectData));
      console.log("Stored project data for:", projectId, projectData);
    }

    // Store current council data for chairman check
    if (selectedCouncilId) {
      const selectedCouncil = councils.find((c) => c.id === selectedCouncilId);
      if (selectedCouncil) {
        sessionStorage.setItem(
          "current_council",
          JSON.stringify(selectedCouncil)
        );
        console.log("Stored current council:", selectedCouncil);
      }
    }

    navigate(`/council/project/${projectId}`);
  };

  // Remove evaluation handlers since they're now in project detail

  if (isLoadingCouncils || isLoadingCouncilsQuery) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Council</h1>
          <p className="text-gray-600 mt-1">
            Manage projects and evaluations within your board
          </p>
        </div>

        {/* Council Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Appraisal Council
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCouncilId}
              onValueChange={setSelectedCouncilId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a appraisal council" />
              </SelectTrigger>
              <SelectContent>
                {councils.map((council) => (
                  <SelectItem key={council.id} value={council.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{council.code}</span>
                      <span className="text-gray-600">- {council.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {selectedCouncilId && selectedCouncil && (
        <div className="space-y-6">
          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6" />
              <h2 className="text-2xl font-bold">
                Projects ({projects.length})
              </h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Projects in {selectedCouncil.name}</CardTitle>
                <CardDescription>
                  A list of projects assigned to this board
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProjects || isLoadingProjectsQuery ? (
                  <div className="flex justify-center py-8">
                    <Loading />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No project assigned to this council</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <Card
                        key={(project as any).id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          handleProjectClick((project as any).id, project)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {(project as any).code}
                                </h3>
                                <Badge
                                  className="bg-purple-100 text-purple-700 border-purple-200"
                                  variant={getStatusBadgeVariant(
                                    (project as any).status
                                  )}
                                >
                                  {(project as any).status}
                                </Badge>
                              </div>

                              <h4 className="font-medium text-blue-600">
                                {(project as any)["english-title"]}
                              </h4>

                              {(project as any)["vietnamese-title"] && (
                                <p className="text-gray-600">
                                  {(project as any)["vietnamese-title"]}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(
                                    (project as any)["created-at"]
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                                <span>
                                  Category: {(project as any).category}
                                </span>
                                <span>Type: {(project as any).type}</span>
                              </div>
                            </div>

                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Evaluations will be shown in project detail page */}
        </div>
      )}

      {/* No Council Selected */}
      {!selectedCouncilId && councils.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              Choose a appraisal council to view projects
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Councils */}
      {councils.length === 0 && !isLoadingCouncils && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              You are not assigned to any appraisal council
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyCouncilPage;
