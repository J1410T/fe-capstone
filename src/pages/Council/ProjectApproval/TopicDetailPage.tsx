import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProposalSelectionDialog } from "./components";
import { useUpdateProject } from "@/hooks/queries/project";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  BookOpen,
  FolderOpen,
  GraduationCap,
  Calendar,
  FileText,
  CheckSquare,
} from "lucide-react";
import { ProjectWithProposals, Proposal } from "@/types/project";

export const TopicDetailPage: React.FC = () => {
  const navigate = useNavigate();
  // const { topicId } = useParams<{ topicId: string }>();
  const location = useLocation();

  // Get project and proposals from navigation state
  const { project, proposals } =
    (location.state as {
      project: ProjectWithProposals;
      proposals: Proposal[];
    }) || {};

  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null
  );

  // Add mutation hook for updating projects
  const updateProjectMutation = useUpdateProject();

  // Use real data instead of mock data
  const topic = project;
  const topicProposals = proposals || [];

  const selectedProposal = selectedProposalId
    ? topicProposals.find((p) => p.id === selectedProposalId)
    : null;

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="container mx-auto py-8">
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">Project not found</p>
            <Button
              onClick={() => navigate("/council/project-approval")}
              className="mt-4"
            >
              Back to Topics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleProposalClick = (proposalId: string) => {
    navigate(`/council/project-approval/proposal/${proposalId}`);
  };

  const handleOpenProposalDialog = () => {
    setIsProposalDialogOpen(true);
  };

  const handleCloseProposalDialog = () => {
    setIsProposalDialogOpen(false);
  };

  const handleSelectProposal = async (proposalId: string) => {
    try {
      // Find the selected proposal
      const selectedProposal = topicProposals.find((p) => p.id === proposalId);
      if (!selectedProposal) {
        toast.error("Không tìm thấy proposal được chọn");
        return;
      }

      // Update the selected proposal to "approved" status
      await updateProjectMutation.mutateAsync({
        projectId: proposalId,
        data: {
          "english-title": selectedProposal["english-title"],
          "vietnamese-title": selectedProposal["vietnamese-title"],
          abbreviations: selectedProposal.abbreviations,
          duration: selectedProposal.duration,
          "start-date": selectedProposal["start-date"],
          "end-date": selectedProposal["end-date"],
          description: selectedProposal.description,
          "requirement-note": selectedProposal["requirement-note"],
          "maximum-member": selectedProposal["maximum-member"],
          language: selectedProposal.language,
          category: selectedProposal.category,
          type: selectedProposal.type,
          genre: selectedProposal.genre,
        },
        status: "approved",
      });

      // Update other proposals to "rejected" status
      const otherProposals = topicProposals.filter((p) => p.id !== proposalId);
      for (const proposal of otherProposals) {
        await updateProjectMutation.mutateAsync({
          projectId: proposal.id,
          data: {
            "english-title": proposal["english-title"],
            "vietnamese-title": proposal["vietnamese-title"],
            abbreviations: proposal.abbreviations,
            duration: proposal.duration,
            "start-date": proposal["start-date"],
            "end-date": proposal["end-date"],
            description: proposal.description,
            "requirement-note": proposal["requirement-note"],
            "maximum-member": proposal["maximum-member"],
            language: proposal.language,
            category: proposal.category,
            type: proposal.type,
            genre: proposal.genre,
          },
          status: "rejected",
        });
      }

      setSelectedProposalId(proposalId);
      toast.success(
        `Đã chọn proposal "${selectedProposal["english-title"]}" và cập nhật trạng thái các proposal khác`
      );
    } catch (error) {
      console.error("Error updating proposal status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái proposal");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 space-y-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/council/project-approval")}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Topics
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Topic Details
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  Review topic information and proposals
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
        </div>

        {/* Topic Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {topic["english-title"]}
              </h2>
              {topic["vietnamese-title"] && (
                <p className="text-lg text-gray-600 mb-3 italic">
                  {topic["vietnamese-title"]}
                </p>
              )}
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className={
                    topic.status === "created"
                      ? "bg-amber-50 text-amber-700 border-amber-200 font-medium px-3 py-1 text-xs"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1 text-xs"
                  }
                >
                  {topic.status}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Created {new Date(topic["created-at"]).toLocaleDateString()}
                  </span>
                </div>
                {topic.code && (
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
                  >
                    {topic.code}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {topic.description && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {topic.description}
              </p>
            </div>
          )}

          {/* Requirement Note */}
          {topic["requirement-note"] && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Requirements</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {topic["requirement-note"]}
              </p>
            </div>
          )}

          {/* Topic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Type
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {topic.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-600" />
              <div>
                <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                  Category
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {topic.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
              <div>
                <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                  Applications
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {topicProposals.length} Proposal
                  {topicProposals.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckSquare className="h-6 w-6 text-green-600" />
              <div>
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  Max Members
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {topic["maximum-member"]} People
                </p>
              </div>
            </div>
          </div>

          {/* Related Majors/Fields */}
          {/* {topic.majors && topic.majors.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Related Academic Fields
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topic.majors.slice(0, 8).map((major, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-medium"
                  >
                    {major.name}
                  </Badge>
                ))}
                {topic.majors.length > 8 && (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-600 border-0 text-xs px-2 py-0.5 font-medium"
                  >
                    +{topic.majors.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* Proposals Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Principal Investigator Proposals
                  </h3>
                  <p className="text-xs text-gray-500">
                    {topicProposals.length} proposal
                    {topicProposals.length !== 1 ? "s" : ""} submitted for
                    review
                    {selectedProposal && (
                      <span className="ml-2 text-emerald-600 font-medium">
                        • {selectedProposal.creator?.["full-name"] || "Unknown"}{" "}
                        selected
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {topicProposals.length > 0 && (
                <Button
                  onClick={handleOpenProposalDialog}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Select Proposal
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {topicProposals.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-gray-100 rounded-full">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xl font-medium text-gray-900 mb-2">
                      No proposals yet
                    </p>
                    <p className="text-gray-500">
                      Waiting for Principal Investigators to submit their
                      proposals
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {topicProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    onClick={() => handleProposalClick(proposal.id)}
                    className={`group cursor-pointer bg-white rounded-2xl border p-6 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 ${
                      selectedProposalId === proposal.id
                        ? "border-emerald-300 shadow-lg ring-2 ring-emerald-100"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              selectedProposalId === proposal.id
                                ? "bg-emerald-100"
                                : "bg-emerald-100"
                            }`}
                          >
                            <span
                              className={`text-lg font-bold ${
                                selectedProposalId === proposal.id
                                  ? "text-emerald-700"
                                  : "text-emerald-700"
                              }`}
                            >
                              {(proposal.creator?.["full-name"] || "U").charAt(
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4
                                className={`text-lg font-semibold group-hover:text-emerald-700 transition-colors ${
                                  selectedProposalId === proposal.id
                                    ? "text-emerald-700"
                                    : "text-gray-900"
                                }`}
                              >
                                {proposal["english-title"]}
                              </h4>
                              {selectedProposalId === proposal.id && (
                                <Badge className="bg-emerald-600 text-white">
                                  <CheckSquare className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                            {proposal["vietnamese-title"] && (
                              <p className="text-sm text-gray-600 italic mb-2">
                                {proposal["vietnamese-title"]}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {proposal.genre}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                {proposal.status}
                              </Badge>
                              {proposal.code && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 border-gray-200"
                                >
                                  {proposal.code}
                                </Badge>
                              )}
                            </div>
                            {/* {proposal.description && (
                              <p className="text-gray-600 line-clamp-2 mb-3">
                                {proposal.description}
                              </p>
                            )} */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {/* <span className="font-medium text-gray-900">
                                {proposal.creator?.["full-name"] ||
                                  "Unknown Creator"}
                              </span> */}
                              {proposal.creator?.email && (
                                <span className="text-gray-500">
                                  {proposal.creator.email}
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    proposal["created-at"]
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Additional proposal info */}
                            {/* <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-500 uppercase tracking-wide">
                                    Duration
                                  </span>
                                  <p className="font-semibold text-gray-900">
                                    {proposal.duration} months
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500 uppercase tracking-wide">
                                    Language
                                  </span>
                                  <p className="font-semibold text-gray-900">
                                    {proposal.language}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500 uppercase tracking-wide">
                                    Max Members
                                  </span>
                                  <p className="font-semibold text-gray-900">
                                    {proposal["maximum-member"]}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500 uppercase tracking-wide">
                                    Progress
                                  </span>
                                  <p className="font-semibold text-gray-900">
                                    {proposal.progress}%
                                  </p>
                                </div>
                              </div>
                            </div> */}

                            {/* Evaluations info */}
                            {/* {proposal.evaluations &&
                              proposal.evaluations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckSquare className="h-3 w-3 text-green-600" />
                                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                                      Evaluations
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {proposal.evaluations
                                      .slice(0, 3)
                                      .map((evaluation, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5 font-medium"
                                        >
                                          {evaluation.title}
                                        </Badge>
                                      ))}
                                    {proposal.evaluations.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-2 py-0.5 font-medium"
                                      >
                                        +{proposal.evaluations.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-emerald-100 rounded-full">
                        <svg
                          className="w-6 h-6 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Selection Dialog */}
      <ProposalSelectionDialog
        isOpen={isProposalDialogOpen}
        onClose={handleCloseProposalDialog}
        proposals={topicProposals}
        onSelectProposal={handleSelectProposal}
        topicTitle={topic?.["english-title"] || ""}
        isLoading={updateProjectMutation.isPending}
      />
    </div>
  );
};
