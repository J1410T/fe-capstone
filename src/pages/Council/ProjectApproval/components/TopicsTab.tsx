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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  CheckCircle,
  Users,
  BookOpen,
  FolderOpen,
  Eye,
  GraduationCap,
} from "lucide-react";

interface Topic {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  applicants: number;
  status: string;
  councilApprovals?: number; // Number of council members who approved
  totalCouncilMembers?: number; // Total number of council members
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
  // Proposal-specific information
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
}

interface TopicsTabProps {
  topics: Topic[];
  applicants: Applicant[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onViewProfile: (applicantId: number) => void;
}

export const TopicsTab: React.FC<TopicsTabProps> = ({
  topics,
  applicants,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onViewProfile,
}) => {
  // Fixed types for filter
  const types = [
    "all",
    "Information Technology",
    "Environment",
    "Biology",
    "Physics",
    "Biotechnology",
    "Civil Engineering",
    "Environmental Science",
  ];

  // Fixed categories for filter (Applied Science and Basic Science)
  const categories = ["all", "Applied Science", "Basic Science"];

  // Fixed statuses for filter
  const statuses = ["all", "Waiting for PI", "PI Assigned"];

  console.log("Topics:", topics);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Topics</CardTitle>
        <CardDescription>
          Review research projects and their Principal Investigator proposals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No projects found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {topics.map((topic) => (
              <AccordionItem
                key={topic.id}
                value={topic.id.toString()}
                className="border rounded-lg bg-white shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline px-6 py-4">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-start space-x-4 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {topic.councilApprovals || 0}/
                            {topic.totalCouncilMembers || 5} Approved
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {topic.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{topic.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FolderOpen className="h-4 w-4" />
                            <span>{topic.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {topic.applicants} Proposal
                              {topic.applicants !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Show proposal list in collapsed view */}
                        {topic.applicants > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Proposals Submitted:
                            </h4>
                            <div className="space-y-1">
                              {applicants
                                .filter(
                                  (applicant) =>
                                    applicant.appliedFor === topic.id
                                )
                                .map((applicant) => (
                                  <div
                                    key={applicant.id}
                                    className="text-xs text-gray-600 truncate"
                                  >
                                    • {applicant.proposalTitle}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
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
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Project Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Field:</span>{" "}
                            {topic.type}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {topic.category}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(topic.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Approval Status
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">
                              Council Approvals:
                            </span>{" "}
                            {topic.councilApprovals || 0} of{" "}
                            {topic.totalCouncilMembers || 5}
                          </div>
                          <div>
                            <span className="font-medium">PI Proposals:</span>{" "}
                            {topic.applicants}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{" "}
                            {topic.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Applicant Information */}
                    {topic.applicants > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 text-lg">
                          Principal Investigator Proposals
                        </h4>
                        <div className="space-y-3">
                          {applicants
                            .filter(
                              (applicant) => applicant.appliedFor === topic.id
                            )
                            .map((applicant) => (
                              <div
                                key={applicant.id}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-lg text-gray-900 mb-1">
                                          {applicant.proposalTitle}
                                        </h5>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge
                                            variant="outline"
                                            className="bg-blue-100 text-blue-800 border-blue-200"
                                          >
                                            {applicant.proposalType}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="bg-green-100 text-green-800 border-green-200"
                                          >
                                            {applicant.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-2">
                                      <div>
                                        <span className="font-medium">
                                          Summary:
                                        </span>
                                        <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                                          {applicant.proposalSummary.length >
                                          150
                                            ? `${applicant.proposalSummary.substring(
                                                0,
                                                150
                                              )}...`
                                            : applicant.proposalSummary}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                          <GraduationCap className="h-4 w-4" />
                                          <span>
                                            Submitted by:{" "}
                                            {applicant.submittedBy}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Date:
                                          </span>{" "}
                                          {new Date(
                                            applicant.appliedDate
                                          ).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        onViewProfile(applicant.id)
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Document
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {topic.applicants === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No proposals submitted for this project yet.</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};
