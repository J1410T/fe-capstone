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
import { Eye } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  department: string;
  createdAt: string;
  applicants: number;
  status: string;
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
  documents: { name: string; url: string }[];
}

interface ApplicantsTabProps {
  applicants: Applicant[];
  selectedTopic: number | null;
  topics: Topic[];
  onBackToTopics: () => void;
  onViewProfile: (applicantId: number) => void;
}

export const ApplicantsTab: React.FC<ApplicantsTabProps> = ({
  applicants,
  selectedTopic,
  topics,
  onBackToTopics,
  onViewProfile,
}) => {
  const selectedTopicTitle = selectedTopic
    ? topics.find((t) => t.id === selectedTopic)?.title
    : "";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Principal Investigator Applicants</CardTitle>
            <CardDescription>
              {selectedTopic ? (
                <>
                  Applicants for:{" "}
                  <span className="font-medium">{selectedTopicTitle}</span>
                </>
              ) : (
                "Select a topic to view applicants"
              )}
            </CardDescription>
          </div>
          {selectedTopic && (
            <Button variant="outline" onClick={onBackToTopics}>
              Back to Topics
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!selectedTopic ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select a topic from the "Research Topics" tab to view applicants
            </p>
            <Button variant="outline" className="mt-4" onClick={onBackToTopics}>
              Go to Topics
            </Button>
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No applicants found for this topic.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Publications</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">
                    {applicant.name}
                  </TableCell>
                  <TableCell>{applicant.institution}</TableCell>
                  <TableCell>{applicant.experience}</TableCell>
                  <TableCell>{applicant.publications}</TableCell>
                  <TableCell>{applicant.appliedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(applicant.id)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
