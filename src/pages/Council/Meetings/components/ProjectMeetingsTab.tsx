import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileText,
  FolderOpen,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  projectName: string;
  projectCode: string;
  councilName: string;
  date: string;
  time: string;
  meetingLink: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  type: string;
  joined: boolean;
  taskStatus: string;
}

interface ProjectMeetingsTabProps {
  meetings: Meeting[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
  onViewMeeting: (meetingId: string) => void;
  canViewDetails: boolean;
}

const ProjectMeetingsTab: React.FC<ProjectMeetingsTabProps> = ({
  meetings,
  searchTerm,
  onSearchChange,
  onJoinMeeting,
  onViewMeeting,
  canViewDetails,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Use the unified StatusBadge component instead of inline implementation
  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} variant="outline" />;
  };

  const renderActionButtons = (meeting: Meeting) => {
    // Handle projects without meeting tasks
    if (meeting.taskStatus === "no-task") {
      return (
        <span className="text-sm text-muted-foreground italic">
          No meeting scheduled
        </span>
      );
    }

    if (meeting.status === "Completed") {
      return canViewDetails ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewMeeting(meeting.id)}
        >
          <FileText className="mr-2 h-3 w-3" />
          Detail
        </Button>
      ) : null;
    }

    if (meeting.status === "Cancelled") {
      return null;
    }

    // Check if Join button should be enabled based on task status
    const taskStatusLower = meeting.taskStatus?.toLowerCase() || "";
    const canJoin =
      taskStatusLower === "todo" ||
      taskStatusLower === "to do" ||
      taskStatusLower === "create" ||
      taskStatusLower === "not started" ||
      taskStatusLower === "inprogress" ||
      taskStatusLower === "in progress" ||
      taskStatusLower === "in_progress";

    // Other statuses (Upcoming, etc.)
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={!canJoin || !meeting.meetingLink}
        onClick={() =>
          canJoin && meeting.meetingLink && onJoinMeeting(meeting.meetingLink)
        }
      >
        <Video className="mr-2 h-3 w-3" />
        Join
      </Button>
    );
  };

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group meetings by project (with council name and code)
  const groupedMeetings = filteredMeetings.reduce((acc, meeting) => {
    const projectKey = `${meeting.projectName} - ${meeting.councilName}`;
    if (!acc[projectKey]) {
      acc[projectKey] = [];
    }
    acc[projectKey].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  // Helper function to count actual meetings (exclude no-task entries)
  const getActualMeetingCount = (projectMeetings: Meeting[]) => {
    return projectMeetings.filter((meeting) => meeting.taskStatus !== "no-task")
      .length;
  };

  // Helper function to check if project has any actual meetings
  const hasActualMeetings = (projectMeetings: Meeting[]) => {
    return projectMeetings.some((meeting) => meeting.taskStatus !== "no-task");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Meetings</CardTitle>
        <CardDescription>
          Meetings organized by project with detailed information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg">
          {Object.keys(groupedMeetings).length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No meetings found</p>
              </div>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(groupedMeetings).map(
                ([projectName, projectMeetings]) => {
                  const actualMeetingCount =
                    getActualMeetingCount(projectMeetings);
                  const hasRealMeetings = hasActualMeetings(projectMeetings);

                  return (
                    <AccordionItem
                      key={projectName}
                      value={projectName}
                      className="border-0"
                    >
                      <AccordionTrigger className="hover:no-underline bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mr-2 sm:mr-4 gap-3 sm:gap-4">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <FolderOpen className="h-5 w-5 text-blue-600" />
                            <div className="text-left min-w-0 flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 break-words">
                                {projectName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {actualMeetingCount} meeting
                                {actualMeetingCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {!hasRealMeetings ? (
                          // Hiển thị message khi không có meeting tasks
                          <div className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <p className="text-gray-500 font-medium">
                                No meeting tasks found for this project
                              </p>
                            </div>
                          </div>
                        ) : (
                          // Hiển thị danh sách meetings (chỉ những meetings thực sự)
                          <div className="space-y-3">
                            {projectMeetings
                              .filter(
                                (meeting) => meeting.taskStatus !== "no-task"
                              )
                              .map((meeting) => (
                                <div
                                  key={meeting.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 break-words whitespace-normal leading-relaxed">
                                          {meeting.title}
                                        </h4>
                                        {meeting.date && meeting.time ? (
                                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                              <CalendarIcon className="h-4 w-4" />
                                              {formatDate(meeting.date)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-4 w-4" />
                                              {meeting.time}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="mt-2 text-sm text-muted-foreground italic">
                                            No meeting time scheduled
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {getStatusBadge(meeting.status)}
                                        {renderActionButtons(meeting)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                }
              )}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMeetingsTab;
