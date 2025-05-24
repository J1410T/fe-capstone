import React from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, CheckCircle } from "lucide-react";

interface Applicant {
  id: number;
  name: string;
  department: string;
  experience: string;
  publications: number;
  status: string;
}

interface Topic {
  id: number;
  title: string;
}

interface ApplicantsListProps {
  applicants: Applicant[];
  selectedTopic: number | null;
  topics: Topic[];
  onBackToTopics: () => void;
  onViewProfile: (applicantId: number) => void;
  onApprove: (applicantId: number) => void;
  onReject: (applicantId: number) => void;
  onRequestMoreInfo: (applicantId: number) => void;
}

export const ApplicantsList: React.FC<ApplicantsListProps> = ({
  applicants,
  selectedTopic,
  topics,
  onBackToTopics,
  onViewProfile,
  onApprove,
  // onReject, // Unused prop
  // onRequestMoreInfo, // Unused prop
}) => {
  const selectedTopicTitle = selectedTopic
    ? topics.find((t) => t.id === selectedTopic)?.title
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>PI Applications</CardTitle>
        <CardDescription>
          Review and manage principal investigator applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedTopic ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Applicants for: {selectedTopicTitle}
              </h3>
              <Button variant="outline" size="sm" onClick={onBackToTopics}>
                Back to Topics
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Publications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No applicants found for this topic.
                    </TableCell>
                  </TableRow>
                ) : (
                  applicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">
                        {applicant.name}
                      </TableCell>
                      <TableCell>{applicant.department}</TableCell>
                      <TableCell>{applicant.experience}</TableCell>
                      <TableCell>{applicant.publications}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {applicant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewProfile(applicant.id)}
                          >
                            View Profile
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Approve Principal Investigator
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to approve{" "}
                                  {applicant.name} as the Principal
                                  Investigator? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={() => onApprove(applicant.id)}>
                                  Confirm Approval
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Select a topic from the "Waiting for PI" tab to view applicants.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
