import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProposalSelectionDialog } from "./components";
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

interface Topic {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  applicants: number;
  status: string;
  councilApprovals?: number;
  totalCouncilMembers?: number;
}

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  institution: string;
  experience: string;
  publications: number;
  degrees: string[];
  status: string;
  appliedFor: number;
  appliedDate: string;
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
  approvals?: number;
  totalReviewers?: number;
}

// Mock data - in real app this would come from API
const mockTopics: Topic[] = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostics",
    type: "Information Technology",
    category: "Applied Science",
    createdAt: "2023-05-15",
    applicants: 3,
    status: "Waiting for PI",
    councilApprovals: 4,
    totalCouncilMembers: 5,
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    type: "Environment",
    category: "Applied Science",
    createdAt: "2023-05-10",
    applicants: 2,
    status: "Waiting for PI",
    councilApprovals: 3,
    totalCouncilMembers: 5,
  },
  // Add more as needed
];

// Extended majors/fields for the topic
const availableMajors = [
  { name: "Computer Science", color: "bg-blue-100 text-blue-700" },
  { name: "Artificial Intelligence", color: "bg-purple-100 text-purple-700" },
  { name: "Biomedical Engineering", color: "bg-green-100 text-green-700" },
  { name: "Data Science", color: "bg-indigo-100 text-indigo-700" },
  { name: "Machine Learning", color: "bg-pink-100 text-pink-700" },
  { name: "Medical Informatics", color: "bg-teal-100 text-teal-700" },
  { name: "Software Engineering", color: "bg-orange-100 text-orange-700" },
  { name: "Information Systems", color: "bg-cyan-100 text-cyan-700" },
  { name: "Robotics", color: "bg-red-100 text-red-700" },
  { name: "Healthcare Technology", color: "bg-emerald-100 text-emerald-700" },
];

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    institution: "University of Technology",
    experience: "10 years",
    publications: 25,
    degrees: ["Ph.D. in Computer Science", "M.Sc. in Data Science"],
    status: "Pending Review",
    appliedFor: 1,
    appliedDate: "2023-05-20",
    proposalTitle: "🔬 Advanced AI Diagnostic System for Medical Imaging",
    proposalSummary:
      "A comprehensive proposal for developing an AI-powered diagnostic system...",
    proposalType: "Research Proposal",
    submittedBy: "Dr. Jane Smith",
    approvals: 3,
    totalReviewers: 4,
  },
  {
    id: 2,
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 987-6543",
    department: "Computer Science",
    institution: "National Institute of Technology",
    experience: "8 years",
    publications: 18,
    degrees: ["Ph.D. in Artificial Intelligence", "B.Sc. in Computer Science"],
    status: "Pending Review",
    appliedFor: 1,
    appliedDate: "2023-05-18",
    proposalTitle:
      "🤖 Intelligent Medical Diagnosis Platform Using Deep Learning",
    proposalSummary:
      "Development of a comprehensive AI platform that integrates multiple diagnostic tools...",
    proposalType: "Technical Proposal",
    submittedBy: "Dr. Michael Johnson",
    approvals: 2,
    totalReviewers: 5,
  },
  {
    id: 3,
    name: "Dr. Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 456-7890",
    department: "Biomedical Engineering",
    institution: "Medical Research Institute",
    experience: "12 years",
    publications: 32,
    degrees: ["Ph.D. in Biomedical Engineering", "M.Sc. in Medical Technology"],
    status: "Under Review",
    appliedFor: 1,
    appliedDate: "2023-05-22",
    proposalTitle: "🧬 Neural Network-Based Pathology Detection System",
    proposalSummary:
      "Innovative approach to automated pathology detection using advanced neural networks...",
    proposalType: "Innovation Proposal",
    submittedBy: "Dr. Sarah Williams",
    approvals: 4,
    totalReviewers: 4,
  },
];

export const TopicDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null
  );

  const topic = mockTopics.find((t) => t.id === Number(topicId));
  const topicProposals = mockApplicants.filter(
    (applicant) => applicant.appliedFor === Number(topicId)
  );

  const selectedProposal = selectedProposalId
    ? topicProposals.find((p) => p.id === selectedProposalId)
    : null;

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="container mx-auto py-8">
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">Topic not found</p>
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

  const handleProposalClick = (proposalId: number) => {
    navigate(`/council/project-approval/proposal/${proposalId}`);
  };

  const handleOpenProposalDialog = () => {
    setIsProposalDialogOpen(true);
  };

  const handleCloseProposalDialog = () => {
    setIsProposalDialogOpen(false);
  };

  const handleSelectProposal = (proposalId: number) => {
    setSelectedProposalId(proposalId);
    // You can add additional logic here like saving to backend
    console.log("Selected proposal:", proposalId);
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
                {topic.title}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className={
                    topic.status === "Waiting for PI"
                      ? "bg-amber-50 text-amber-700 border-amber-200 font-medium px-3 py-1 text-xs"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1 text-xs"
                  }
                >
                  {topic.status}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Created {new Date(topic.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Research Field
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
                  {topic.applicants} Proposal{topic.applicants !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Related Majors/Fields */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Related Academic Fields
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableMajors.slice(0, 8).map((major, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${major.color} border-0 text-xs px-2 py-0.5 font-medium`}
                >
                  {major.name}
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-600 border-0 text-xs px-2 py-0.5 font-medium"
              >
                +{availableMajors.length - 8} more
              </Badge>
            </div>
          </div>
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
                        • {selectedProposal.name} selected
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
                              {proposal.name.charAt(0)}
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
                                {proposal.proposalTitle}
                              </h4>
                              {selectedProposalId === proposal.id && (
                                <Badge className="bg-emerald-600 text-white">
                                  <CheckSquare className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {proposal.proposalType}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                {proposal.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 line-clamp-2 mb-3">
                              {proposal.proposalSummary}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {proposal.name}
                              </span>
                            </div>
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
        topicTitle={topic?.title || ""}
      />
    </div>
  );
};
