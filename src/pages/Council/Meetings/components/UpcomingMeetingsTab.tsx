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

interface UpcomingMeetingsTabProps {
  meetings: Meeting[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
  onViewMeeting: (meetingId: number) => void;
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

  // Filter upcoming meetings
  const upcomingMeetings = meetings.filter(
    (meeting) =>
      meeting.status === "Upcoming" &&
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No upcoming meetings found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                upcomingMeetings.map((meeting) => (
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
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Upcoming
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onJoinMeeting(meeting.meetingLink)}
                        >
                          <Video className="mr-2 h-3 w-3" />
                          Join
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetingsTab;
