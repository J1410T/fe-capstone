import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  FileText,
  Eye,
  UserCheck,
  XCircle,
  Edit,
  Download,
} from "lucide-react";
import { DocumentViewer } from "./DocumentViewer";
import { StatusBadge } from "./StatusBadge";
import {
  Proposal,
  EnhancedProject,
  EnhancedMilestone,
  ProjectDocument,
} from "./types";

interface SidePanelContentProps {
  type:
    | "proposal"
    | "clone"
    | "evaluation"
    | "request"
    | "milestone"
    | "council"
    | "project";
  data: unknown;
  onClose?: () => void;
}

export const SidePanelContent: React.FC<SidePanelContentProps> = ({
  type,
  data,
}) => {
  // Check if data is a document
  if (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as Record<string, unknown>).type === "document"
  ) {
    return <DocumentViewer document={data as unknown as ProjectDocument} />;
  }

  // Council Assignment Panel
  if (type === "council") {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8 p-1">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Assign Council</h3>
            <p className="text-base text-gray-600">
              Select a council to assign to this project for review and
              oversight.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Available Councils
            </h4>
            <div className="space-y-3">
              {[
                "AI Research Council",
                "Medical Technology Council",
                "Education Technology Council",
                "Software Engineering Council",
                "Data Science Council",
              ].map((council) => (
                <div
                  key={council}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {council}
                    </p>
                    <p className="text-sm text-gray-600">
                      Specialized review board
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Project Details Panel
  if (type === "project") {
    const project = data as unknown as EnhancedProject;

    // Handle specific view types (documents, milestones)
    if (project.viewType === "documents") {
      return (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 p-1">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                All Project Documents
              </h3>
              <p className="text-lg text-gray-600">
                {project["english-title"]}
              </p>
              <Separator />
            </div>

            <div className="space-y-4">
              {project.allDocuments?.map((doc: ProjectDocument) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    // Open document viewer - could be enhanced to open in new side panel
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded:{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      );
    }

    if (project.viewType === "milestones") {
      return (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 p-1">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                All Project Milestones
              </h3>
              <p className="text-lg text-gray-600">
                {project["english-title"]}
              </p>
              <Separator />
            </div>

            <div className="space-y-4">
              {project.allMilestones?.map((milestone: EnhancedMilestone) => (
                <div
                  key={milestone.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {milestone.title}
                    </h4>
                    <StatusBadge
                      status={milestone.status}
                      type="milestone"
                      size="md"
                    />
                  </div>
                  <p className="text-base text-gray-600 mb-3">
                    {milestone.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Due:{" "}
                      {new Date(milestone.scheduledDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span>
                        Evaluation: {milestone.evaluationStage || "Not started"}
                      </span>
                      <span>{milestone.documents?.length || 0} documents</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      );
    }
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8 p-1">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {project["english-title"]}
            </h3>
            <p className="text-lg text-gray-600">
              {project["vietnamese-title"]}
            </p>
            <Separator />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                Project Information
              </h4>
              <div className="space-y-3 text-base">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Code:</span>
                  <span className="text-gray-600">{project.code}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <StatusBadge
                    status={project.status}
                    type="project"
                    size="md"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Genre:</span>
                  <span className="text-gray-600 capitalize">
                    {project.genre}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Language:</span>
                  <span className="text-gray-600">{project.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    Max Members:
                  </span>
                  <span className="text-gray-600">
                    {project["maximum-member"]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Progress:</span>
                  <span className="text-gray-600">{project.progress}%</span>
                </div>
                {project.council && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">
                      Assigned Council:
                    </span>
                    <span className="text-green-600 font-medium">
                      {project.council}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {project.majors && project.majors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Majors</h4>
                <div className="flex flex-wrap gap-2">
                  {project.majors.map((major: { id: string; name: string }) => (
                    <span
                      key={major.id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {major.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project["project-tags"] && project["project-tags"].length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project["project-tags"].map(
                    (tag: { name: string }, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-6 border-t">
            <Button variant="outline" size="default" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
            <Button variant="outline" size="default" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Proposal Content
  if (type === "proposal") {
    const proposal = data as unknown as Proposal;
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8 p-1">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {proposal.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 text-base">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">
                  Principal Investigator:
                </span>
                <span className="text-gray-600">{proposal.pi}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <StatusBadge
                  status={proposal.status}
                  type="proposal"
                  size="md"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Submitted:</span>
                <span className="text-gray-600">
                  {new Date(proposal.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Separator />
          </div>

          {proposal.objectives && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                Objectives
              </h4>
              <p className="text-base text-gray-700 leading-relaxed">
                {proposal.objectives}
              </p>
            </div>
          )}

          {proposal.members && proposal.members.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                Team Members
              </h4>
              <ul className="space-y-2">
                {proposal.members.map((member, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-base text-gray-700"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {proposal.documents && proposal.documents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
              <div className="space-y-2">
                {proposal.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.type} •{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-6 border-t">
            <Button variant="default" size="default" className="flex-1">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button variant="destructive" size="default" className="flex-1">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button variant="outline" size="default" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Milestone Details Panel
  if (type === "milestone") {
    const milestone = data as unknown as EnhancedMilestone;
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8 p-1">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {milestone.title}
            </h3>
            <p className="text-lg text-gray-600">{milestone.description}</p>
            <Separator />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                Milestone Information
              </h4>
              <div className="space-y-3 text-base">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <StatusBadge
                    status={milestone.status}
                    type="milestone"
                    size="md"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    Scheduled Date:
                  </span>
                  <span className="text-gray-600">
                    {new Date(milestone.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    Evaluation Stage:
                  </span>
                  <StatusBadge
                    status={milestone.evaluationStage || "not_started"}
                    type="evaluation"
                    size="md"
                  />
                </div>
                {milestone.evaluators && milestone.evaluators.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">
                      Evaluators:
                    </span>
                    <span className="text-gray-600">
                      {milestone.evaluators.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Milestone Documents */}
            {milestone.documents && milestone.documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Milestone Documents
                </h4>
                <div className="space-y-2">
                  {milestone.documents.map((doc: ProjectDocument) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {doc.type} •{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Stage Documents */}
            {milestone.evaluationStageDocuments &&
              milestone.evaluationStageDocuments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Evaluation Stage Documents
                  </h4>
                  <div className="space-y-2">
                    {milestone.evaluationStageDocuments.map(
                      (doc: ProjectDocument) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-blue-600">
                                Evaluation Framework •{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-blue-400" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Evaluation Results */}
            {milestone.evaluationData &&
              milestone.evaluationData.status !== "pending" && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Evaluation Results
                  </h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="space-y-3">
                      {milestone.evaluationData.score && (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Score:
                          </span>
                          <span className="text-green-600 font-bold text-lg">
                            {milestone.evaluationData.score}/10
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">
                          Status:
                        </span>
                        <StatusBadge
                          status={milestone.evaluationData.status}
                          type="evaluation"
                          size="md"
                        />
                      </div>
                      {milestone.evaluationData.submittedAt && (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Submitted:
                          </span>
                          <span className="text-gray-600">
                            {new Date(
                              milestone.evaluationData.submittedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {milestone.evaluationData.comments && (
                        <div className="space-y-2">
                          <span className="font-semibold text-gray-700">
                            Comments:
                          </span>
                          <p className="text-gray-600 bg-white p-3 rounded border">
                            {milestone.evaluationData.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Evaluation Documents */}
                  {milestone.evaluationData.documents &&
                    milestone.evaluationData.documents.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Evaluation Documents
                        </h4>
                        <div className="space-y-2">
                          {milestone.evaluationData.documents.map(
                            (doc: ProjectDocument) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-green-600" />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {doc.name}
                                    </p>
                                    <p className="text-sm text-green-600">
                                      Evaluation Report •{" "}
                                      {new Date(
                                        doc.uploadedAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Eye className="w-5 h-5 text-green-400" />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
          </div>

          <div className="flex space-x-3 pt-6 border-t">
            <Button variant="default" size="default" className="flex-1">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve Milestone
            </Button>
            <Button variant="destructive" size="default" className="flex-1">
              <XCircle className="w-4 h-4 mr-2" />
              Reject Milestone
            </Button>
            <Button variant="outline" size="default" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Default fallback
  return (
    <div className="p-6 text-center">
      <p className="text-base text-gray-500">Content not available</p>
    </div>
  );
};
