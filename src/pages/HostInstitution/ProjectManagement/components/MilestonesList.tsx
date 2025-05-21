import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  documents: Document[];
  comments: Comment[];
}

interface MilestonesListProps {
  milestones: Milestone[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  feedbackText: string;
  onFeedbackTextChange: (value: string) => void;
  onDownloadDocument: (documentName: string) => void;
  onAddComment: (milestoneId: number) => void;
  onConfirmMilestone: (milestoneId: number) => void;
  onRequestRevision: (milestoneId: number) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const MilestonesList: React.FC<MilestonesListProps> = ({
  milestones,
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  commentText,
  onCommentTextChange,
  feedbackText,
  onFeedbackTextChange,
  onDownloadDocument,
  onAddComment,
  onConfirmMilestone,
  onRequestRevision,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Project Milestones</CardTitle>
            <CardDescription>
              Track and manage project milestones and deliverables
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search milestones..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No milestones found. Try adjusting your search.
            </div>
          ) : (
            milestones.map((milestone) => (
              <AccordionItem
                key={milestone.id}
                value={`milestone-${milestone.id}`}
              >
                <AccordionTrigger className="hover:bg-accent/50 px-4 py-2 rounded-lg">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(milestone.status)}
                      >
                        {getStatusIcon(milestone.status)}
                        <span className="ml-1">{milestone.status}</span>
                      </Badge>
                      <span className="font-medium">{milestone.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {milestone.dueDate}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <div className="space-y-4">
                    <p className="text-sm">{milestone.description}</p>

                    {/* Documents */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Documents</h4>
                      {milestone.documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No documents uploaded yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {milestone.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.type} • {doc.size}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  onDownloadDocument(doc.name)
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Comments</h4>
                      {milestone.comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No comments yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {milestone.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-2 bg-muted/50 rounded"
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">
                                  {comment.user}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {comment.date}
                                </p>
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="space-y-2">
                      <Label htmlFor={`comment-${milestone.id}`}>
                        Add Comment
                      </Label>
                      <Textarea
                        id={`comment-${milestone.id}`}
                        placeholder="Type your comment here..."
                        value={commentText}
                        onChange={(e) => onCommentTextChange(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => onAddComment(milestone.id)}
                      >
                        Post Comment
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-2 pt-2">
                      {milestone.status !== "Completed" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => onConfirmMilestone(milestone.id)}
                          >
                            Confirm Milestone
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const dialog = document.getElementById(
                                `revision-dialog-${milestone.id}`
                              ) as HTMLDialogElement;
                              if (dialog) dialog.showModal();
                            }}
                          >
                            Request Revision
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Revision Dialog (using native dialog for simplicity) */}
                    <dialog
                      id={`revision-dialog-${milestone.id}`}
                      className="p-6 rounded-lg shadow-lg max-w-md w-full"
                    >
                      <h3 className="text-lg font-medium mb-4">
                        Request Revision
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feedback-${milestone.id}`}>
                            Feedback
                          </Label>
                          <Textarea
                            id={`feedback-${milestone.id}`}
                            placeholder="Provide feedback for revision..."
                            rows={4}
                            value={feedbackText}
                            onChange={(e) => onFeedbackTextChange(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const dialog = document.getElementById(
                                `revision-dialog-${milestone.id}`
                              ) as HTMLDialogElement;
                              if (dialog) dialog.close();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              onRequestRevision(milestone.id);
                              const dialog = document.getElementById(
                                `revision-dialog-${milestone.id}`
                              ) as HTMLDialogElement;
                              if (dialog) dialog.close();
                            }}
                          >
                            Submit Feedback
                          </Button>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};
