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
  id: number;
  title: string;
  projectName: string;
  date: string;
  time: string;
  meetingLink: string;
  status: string;
  type: string;
  joined: boolean;
}

interface ProjectMeetingsTabProps {
  meetings: Meeting[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
  onViewMeeting: (meetingId: number) => void;
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

    if (meeting.status === "Canceled") {
      return null;
    }

    // Other statuses (Upcoming, etc.)
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onJoinMeeting(meeting.meetingLink)}
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

  // Group meetings by project
  const groupedMeetings = filteredMeetings.reduce((acc, meeting) => {
    if (!acc[meeting.projectName]) {
      acc[meeting.projectName] = [];
    }
    acc[meeting.projectName].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

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
              placeholder="Search meetings or projects..."
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
                ([projectName, projectMeetings]) => (
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
                              {projectMeetings.length} meeting
                              {projectMeetings.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {projectMeetings.map((meeting) => (
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
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMeetingsTab;
