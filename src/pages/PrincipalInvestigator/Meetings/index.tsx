import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  FileText,
  Download,
  Bell,
  BellOff,
  ExternalLink,
  Plus,
  Eye,
} from "lucide-react";
import { Meeting } from "../shared/types";
import { StatusBadge } from "../shared/components";
import { formatDate, getDaysUntilDeadline } from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Meetings: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [notifications, setNotifications] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    loadMeetings();
    // Set up notification checking
    const interval = setInterval(checkUpcomingMeetings, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [meetings]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMeetings = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const mockMeetings: Meeting[] = [
          {
            id: "1",
            title: "Project Kickoff Meeting",
            date: "2024-12-20",
            time: "10:00",
            type: "Online",
            link: "https://zoom.us/j/123456789",
            agenda:
              "Discuss project objectives, timeline, and team responsibilities",
            documents: ["project-charter.pdf", "timeline.xlsx"],
            attendees: [
              {
                id: "1",
                name: user?.name || "Principal Investigator",
                email: user?.email || "pi@example.com",
                role: "Leader",
                joinedAt: "2023-01-15",
              },
              {
                id: "2",
                name: "Dr. Sarah Johnson",
                email: "sarah.johnson@example.com",
                role: "Secretary",
                joinedAt: "2023-02-01",
              },
              {
                id: "3",
                name: "John Smith",
                email: "john.smith@example.com",
                role: "Normal",
                joinedAt: "2023-03-15",
              },
            ],
            status: "Scheduled",
          },
          {
            id: "2",
            title: "Monthly Progress Review",
            date: "2024-12-25",
            time: "14:30",
            type: "In-Person",
            location: "Conference Room A, Building 1",
            agenda:
              "Review monthly progress, discuss challenges, and plan next steps",
            documents: ["progress-report.pdf", "budget-update.xlsx"],
            attendees: [
              {
                id: "1",
                name: user?.name || "Principal Investigator",
                email: user?.email || "pi@example.com",
                role: "Leader",
                joinedAt: "2023-01-15",
              },
              {
                id: "4",
                name: "Emily Chen",
                email: "emily.chen@example.com",
                role: "Normal",
                joinedAt: "2023-04-01",
              },
            ],
            status: "Scheduled",
          },
          {
            id: "3",
            title: "Research Methodology Workshop",
            date: "2024-12-30",
            time: "09:00",
            type: "Online",
            link: "https://teams.microsoft.com/l/meetup-join/123",
            agenda: "Training session on new research methodologies and tools",
            documents: ["methodology-guide.pdf", "tools-overview.pptx"],
            attendees: [
              {
                id: "1",
                name: user?.name || "Principal Investigator",
                email: user?.email || "pi@example.com",
                role: "Leader",
                joinedAt: "2023-01-15",
              },
            ],
            status: "Scheduled",
          },
          {
            id: "4",
            title: "Final Presentation Rehearsal",
            date: "2024-12-15",
            time: "16:00",
            type: "In-Person",
            location: "Auditorium B",
            agenda: "Practice final project presentation and receive feedback",
            documents: ["presentation-draft.pptx"],
            attendees: [
              {
                id: "1",
                name: user?.name || "Principal Investigator",
                email: user?.email || "pi@example.com",
                role: "Leader",
                joinedAt: "2023-01-15",
              },
            ],
            status: "Completed",
          },
        ];
        setMeetings(mockMeetings);
      }, 1000);
    } catch (error) {
      console.error("Error loading meetings:", error);
    }
  };

  const checkUpcomingMeetings = () => {
    const now = new Date();
    const upcomingMeetings = meetings.filter((meeting) => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
      const timeDiff = meetingDateTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeDiff / (1000 * 60));

      // Notify 15 minutes before meeting
      return (
        minutesUntil <= 15 && minutesUntil > 0 && meeting.status === "Scheduled"
      );
    });

    upcomingMeetings.forEach((meeting) => {
      if (!notifications[meeting.id]) {
        setNotifications((prev) => ({ ...prev, [meeting.id]: true }));
        toast.info(`Meeting "${meeting.title}" starts in 15 minutes!`, {
          action: {
            label: "Join",
            onClick: () => handleJoinMeeting(meeting),
          },
        });
      }
    });
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (meeting.type === "Online" && meeting.link) {
      window.open(meeting.link, "_blank");
      toast.success("Opening meeting link...");
    } else {
      toast.info(`Meeting location: ${meeting.location}`);
    }
  };

  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDialog(true);
  };

  const handleDownloadDocument = (document: string) => {
    // In real app, this would download the actual file
    toast.success(`Downloading ${document}...`);
  };

  const toggleNotification = (meetingId: string) => {
    setNotifications((prev) => ({
      ...prev,
      [meetingId]: !prev[meetingId],
    }));
    toast.success("Notification preference updated");
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
        return meetingDate >= now && meeting.status === "Scheduled";
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );
  };

  const getPastMeetings = () => {
    const now = new Date();
    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
        return meetingDate < now || meeting.status === "Completed";
      })
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`).getTime() -
          new Date(`${a.date}T${a.time}`).getTime()
      );
  };

  const getMeetingStats = () => {
    const upcoming = getUpcomingMeetings().length;
    const today = meetings.filter((meeting) => {
      const today = new Date().toISOString().split("T")[0];
      return meeting.date === today && meeting.status === "Scheduled";
    }).length;
    const thisWeek = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return (
        meetingDate >= now &&
        meetingDate <= weekFromNow &&
        meeting.status === "Scheduled"
      );
    }).length;

    return { upcoming, today, thisWeek };
  };

  const stats = getMeetingStats();
  const upcomingMeetings = getUpcomingMeetings();
  const pastMeetings = getPastMeetings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Meeting Schedule
            </h1>
            <p className="text-muted-foreground">
              Manage your research meetings and online sessions
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">
                  Upcoming Meetings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>
            Your scheduled meetings and online sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No upcoming meetings scheduled.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingMeetings.map((meeting) => {
                  const daysUntil = getDaysUntilDeadline(meeting.date);
                  const isToday = daysUntil === 0;
                  const isSoon = daysUntil <= 1;

                  return (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {meeting.agenda}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p
                              className={`text-sm ${
                                isToday
                                  ? "font-bold text-green-600"
                                  : isSoon
                                  ? "font-medium text-orange-600"
                                  : ""
                              }`}
                            >
                              {formatDate(meeting.date)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {meeting.time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {meeting.type === "Online" ? (
                            <Video className="w-4 h-4 text-blue-600" />
                          ) : (
                            <MapPin className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-sm">{meeting.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {meeting.attendees.slice(0, 3).map((attendee) => (
                            <Avatar
                              key={attendee.id}
                              className="w-6 h-6 border-2 border-white"
                            >
                              <AvatarImage src={attendee.avatar} />
                              <AvatarFallback className="text-xs">
                                {attendee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                +{meeting.attendees.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNotification(meeting.id)}
                          className={
                            notifications[meeting.id]
                              ? "text-blue-600"
                              : "text-gray-400"
                          }
                        >
                          {notifications[meeting.id] ? (
                            <Bell className="w-4 h-4" />
                          ) : (
                            <BellOff className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMeeting(meeting)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          {meeting.type === "Online" && meeting.link && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinMeeting(meeting)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Join
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Past Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Past Meetings</CardTitle>
          <CardDescription>
            Previously completed meetings and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pastMeetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No past meetings found.
            </p>
          ) : (
            <div className="space-y-3">
              {pastMeetings.slice(0, 5).map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {meeting.type === "Online" ? (
                      <Video className="w-4 h-4 text-gray-400" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {meeting.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(meeting.date)} at {meeting.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={meeting.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMeeting(meeting)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Detail Dialog */}
      <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              Meeting details and information
            </DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date & Time</label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedMeeting.date)} at {selectedMeeting.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex items-center space-x-2">
                    {selectedMeeting.type === "Online" ? (
                      <Video className="w-4 h-4 text-blue-600" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm">{selectedMeeting.type}</span>
                  </div>
                </div>
              </div>

              {selectedMeeting.type === "Online" && selectedMeeting.link && (
                <div>
                  <label className="text-sm font-medium">Meeting Link</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJoinMeeting(selectedMeeting)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Join Meeting
                    </Button>
                  </div>
                </div>
              )}

              {selectedMeeting.location && (
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMeeting.location}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Agenda</label>
                <p className="text-sm text-muted-foreground">
                  {selectedMeeting.agenda}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Attendees ({selectedMeeting.attendees.length})
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMeeting.attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback className="text-xs">
                          {attendee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{attendee.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {attendee.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMeeting.documents &&
                selectedMeeting.documents.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">
                      Meeting Documents
                    </label>
                    <div className="space-y-2 mt-2">
                      {selectedMeeting.documents.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{document}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(document)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMeetingDialog(false)}
            >
              Close
            </Button>
            {selectedMeeting?.type === "Online" &&
              selectedMeeting.link &&
              selectedMeeting.status === "Scheduled" && (
                <Button onClick={() => handleJoinMeeting(selectedMeeting)}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
