import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Users,
  Clock,
  FileText,
  Users as UsersIcon,
  Shield,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { getMyAppraisalCouncils } from "@/services/resources/appraisal-council";
import { getProjectsByCouncilIdWithProposal } from "@/services/resources/project";
import { AppraisalCouncil } from "@/types/appraisal-council";
import { ProjectWithProposals } from "@/types/project";
import { useMyAppraisalCouncils } from "@/hooks/queries/appraisal-council";
import { useProjectsByAppraisalCouncilWithProposal } from "@/hooks/queries/project";
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
    useProjectsByAppraisalCouncilWithProposal(selectedCouncilId, true, [
      "inprogress",
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
        const projectsData = await getProjectsByCouncilIdWithProposal(
          selectedCouncilId,
          true,
          ["inprogress"]
        );
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error loading projects:", error);
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
    }

    // Store current council data for chairman check
    if (selectedCouncilId) {
      const selectedCouncil = councils.find((c) => c.id === selectedCouncilId);
      if (selectedCouncil) {
        sessionStorage.setItem(
          "current_council",
          JSON.stringify(selectedCouncil)
        );
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
    <div className="container mx-auto  py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 text-emerald-600 ">
            <Shield className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Council
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Manage projects and evaluations within your board</span>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
      </div>

      {/* Council Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Select Appraisal Council
              </label>
            </div>
            <Select
              value={selectedCouncilId}
              onValueChange={setSelectedCouncilId}
            >
              <SelectTrigger className="w-[320px] h-[50px] bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Choose an appraisal council" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                {councils.map((council) => (
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
                    className="group bg-white rounded-xl shadow-sm border border-slate-200/50 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() =>
                      handleProjectClick((project as any).id, project)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          {/* Project Code, Status, and Completion */}
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                              {(project as any).code}
                            </Badge>
                            <Badge
                              className="bg-green-100 text-green-700 border-green-200"
                              variant={getStatusBadgeVariant(
                                (project as any).status
                              )}
                            >
                              {(project as any).status}
                            </Badge>
                          </div>

                          {/* Project Title */}
                          <h4 className="font-semibold text-lg text-gray-900">
                            {(project as any)["english-title"]}
                          </h4>

                          {/* Vietnamese Title */}
                          {(project as any)["vietnamese-title"] && (
                            <p className="text-gray-600 text-sm">
                              {(project as any)["vietnamese-title"]}
                            </p>
                          )}

                          {/* Project Metadata */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>CREATED:</span>
                              {new Date(
                                (project as any)["created-at"]
                              ).toLocaleDateString("vi-VN")}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>CATEGORY:</span>
                              {(project as any).category}
                            </span>
                            <span className="flex items-center gap-1">
                              <UsersIcon className="h-4 w-4" />
                              <span>TYPE:</span>
                              {(project as any).type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>DURATION:</span>6 months
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <ChevronRight className="w-6 h-6 text-indigo-600" />
                          </div>
                        </div>{" "}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
