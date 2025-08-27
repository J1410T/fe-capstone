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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar as CalendarIcon, Clock, Video } from "lucide-react";

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

interface UpcomingMeetingsTabProps {
  meetings: Meeting[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
  onViewMeeting: (meetingId: string) => void;
  canViewDetails: boolean;
}

const UpcomingMeetingsTab: React.FC<UpcomingMeetingsTabProps> = ({
  meetings,
  searchTerm,
  onSearchChange,
  onJoinMeeting,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get badge variant and styling based on task status
  const getTaskStatusBadge = (taskStatus: string) => {
    const status = taskStatus?.toLowerCase() || "";

    switch (status) {
      case "todo":
      case "to do":
      case "create":
      case "not started":
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          label: "Todo",
        };
      case "inprogress":
      case "in progress":
      case "in_progress":
        return {
          variant: "outline" as const,
          className: "bg-blue-50 text-blue-700 border-blue-200",
          label: "In Progress",
        };
      case "completed":
        return {
          variant: "outline" as const,
          className: "bg-green-50 text-green-700 border-green-200",
          label: "Completed",
        };
      case "canceled":
      case "cancelled":
        return {
          variant: "outline" as const,
          className: "bg-red-50 text-red-700 border-red-200",
          label: "Canceled",
        };
      case "overdue":
        return {
          variant: "outline" as const,
          className: "bg-orange-50 text-orange-700 border-orange-200",
          label: "Overdue",
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          label: taskStatus || "Unknown",
        };
    }
  };

  // Filter upcoming meetings with Todo and InProgress task status
  const upcomingMeetings = meetings.filter((meeting) => {
    const statusMatch = meeting.status === "Upcoming";

    // Check for Todo and InProgress task statuses (case-insensitive and multiple variations)
    const taskStatusLower = meeting.taskStatus?.toLowerCase() || "";
    const taskStatusMatch =
      taskStatusLower === "todo" ||
      taskStatusLower === "to do" ||
      taskStatusLower === "create" ||
      taskStatusLower === "not started" ||
      taskStatusLower === "inprogress" ||
      taskStatusLower === "in progress" ||
      taskStatusLower === "in_progress";

    const searchMatch = meeting.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return statusMatch && taskStatusMatch && searchMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        <CardDescription>
          Scheduled council meetings that require your participation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meetings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Appraisal Council</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Task Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No upcoming meetings found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                upcomingMeetings.map((meeting) => {
                  // Check if Join button should be enabled
                  const taskStatusLower =
                    meeting.taskStatus?.toLowerCase() || "";
                  const canJoin =
                    taskStatusLower === "todo" ||
                    taskStatusLower === "to do" ||
                    taskStatusLower === "create" ||
                    taskStatusLower === "not started" ||
                    taskStatusLower === "inprogress" ||
                    taskStatusLower === "in progress" ||
                    taskStatusLower === "in_progress";

                  const statusBadge = getTaskStatusBadge(meeting.taskStatus);

                  return (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <p className="break-words whitespace-normal leading-relaxed">
                            {meeting.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="break-words whitespace-normal leading-relaxed">
                            {meeting.projectName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="break-words whitespace-normal leading-relaxed">
                            {meeting.councilName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {formatDate(meeting.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {meeting.time}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={statusBadge.variant}
                          className={statusBadge.className}
                        >
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!canJoin || !meeting.meetingLink}
                            onClick={() =>
                              canJoin &&
                              meeting.meetingLink &&
                              onJoinMeeting(meeting.meetingLink)
                            }
                          >
                            <Video className="mr-2 h-3 w-3" />
                            Join
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetingsTab;
