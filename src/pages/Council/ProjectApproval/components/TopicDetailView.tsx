import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  BookOpen,
  FolderOpen,
  GraduationCap,
  Calendar,
  FileText,
} from "lucide-react";
import { ProfileData, EvaluationData } from "../types";

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
  profileData: ProfileData; // Add missing property
  evaluationData: EvaluationData; // Add missing property
}

interface TopicDetailViewProps {
  topic: Topic;
  applicants: Applicant[];
  onViewProposal: (proposal: Applicant) => void;
  onViewProfile: (applicantId: number) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  applicants,
  onViewProposal,
}) => {
  const topicProposals = applicants.filter(
    (applicant) => applicant.appliedFor === topic.id
  );

  return (
    <div className="space-y-6">
      {/* Topic Overview */}
      <div className="bg-gradient-to-r from-white via-emerald-50/30 to-white rounded-2xl border border-emerald-100 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
              {topic.title}
            </h2>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={
                  topic.status === "Waiting for PI"
                    ? "bg-amber-50 text-amber-700 border-amber-200 font-medium"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                }
              >
                {topic.status}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {new Date(topic.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Project Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Research Field
                  </span>
                  <p className="font-semibold text-gray-900">{topic.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    Category
                  </span>
                  <p className="font-semibold text-gray-900">
                    {topic.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                    Applications
                  </span>
                  <p className="font-semibold text-gray-900">
                    {topic.applicants} Proposal
                    {topic.applicants !== 1 ? "s" : ""} Submitted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Principal Investigator Proposals
              </h3>
              <p className="text-sm text-gray-500">
                {topicProposals.length} proposal
                {topicProposals.length !== 1 ? "s" : ""} submitted for review
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {topicProposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    No proposals yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Waiting for Principal Investigators to submit their
                    proposals
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {topicProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="group bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Header with badges */}
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {proposal.proposalTitle}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                          >
                            {proposal.proposalType}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 font-medium"
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Proposal Summary
                        </h5>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {proposal.proposalSummary}
                        </p>
                      </div>

                      {/* Applicant Info */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-emerald-700">
                              {proposal.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {proposal.name}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span>{proposal.institution}</span>
                        <span className="text-gray-400">•</span>
                        <span>{proposal.experience} experience</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 flex items-center">
                      <Button
                        onClick={() => onViewProposal(proposal)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review & Evaluate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
