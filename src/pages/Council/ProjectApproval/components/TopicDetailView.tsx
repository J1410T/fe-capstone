import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            {topic.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Project Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Field:</span>
                  <span>{topic.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Category:</span>
                  <span>{topic.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Created:</span>
                  <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Proposals:</span>
                  <span>
                    {topic.applicants} Proposal
                    {topic.applicants !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Approval Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {topic.councilApprovals || 0}/
                    {topic.totalCouncilMembers || 5} Council Approvals
                  </span>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={
                      topic.status === "Waiting for PI"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }
                  >
                    {topic.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6" />
            Principal Investigator Proposals ({topicProposals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topicProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No proposals submitted for this project yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topicProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg text-gray-900 mb-1">
                            {proposal.proposalTitle}
                          </h5>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-200"
                            >
                              {proposal.proposalType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {proposal.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div>
                          <span className="font-medium">Summary:</span>
                          <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                            {proposal.proposalSummary.length > 200
                              ? `${proposal.proposalSummary.substring(
                                  0,
                                  200
                                )}...`
                              : proposal.proposalSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewProposal(proposal)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Review & Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
