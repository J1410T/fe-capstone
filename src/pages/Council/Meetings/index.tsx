import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Clock, Video, FileText } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// Mock data for meetings
const meetings = [
  {
    id: 1,
    title: "Project Evaluation: AI-Driven Medical Diagnostics",
    date: "2023-07-15",
    time: "10:00 AM - 12:00 PM",
    location: "Virtual (Zoom)",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Upcoming",
    type: "Proposal Evaluation",
    projectCode: "PRJ-2023-001",
  },
  {
    id: 2,
    title: "Project Evaluation: Sustainable Energy Solutions",
    date: "2023-07-20",
    time: "2:00 PM - 4:00 PM",
    location: "Virtual (Google Meet)",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Upcoming",
    type: "Proposal Evaluation",
    projectCode: "PRJ-2023-002",
  },
  {
    id: 3,
    title: "Milestone Review: Biodiversity Conservation",
    date: "2023-07-10",
    time: "9:00 AM - 11:00 AM",
    location: "Virtual (Zoom)",
    meetingLink: "https://zoom.us/j/987654321",
    status: "Completed",
    type: "Milestone Evaluation",
    projectCode: "PRJ-2023-003",
  },
  {
    id: 4,
    title: "Project Evaluation: Quantum Computing Applications",
    date: "2023-07-05",
    time: "1:00 PM - 3:00 PM",
    location: "Virtual (Microsoft Teams)",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
    status: "Completed",
    type: "Proposal Evaluation",
    projectCode: "PRJ-2023-004",
  },
  {
    id: 5,
    title: "Milestone Review: Genetic Engineering Ethics",
    date: "2023-07-25",
    time: "11:00 AM - 1:00 PM",
    location: "Virtual (Zoom)",
    meetingLink: "https://zoom.us/j/123123123",
    status: "Upcoming",
    type: "Milestone Evaluation",
    projectCode: "PRJ-2023-005",
  },
];

const CouncilMeetings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Check if user is chairman
  const isChairman = user?.role === UserRole.APPRAISAL_COUNCIL;

  // Filter meetings based on search term, type, and tab
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || meeting.type === selectedType;
    const matchesTab =
      (activeTab === "upcoming" && meeting.status === "Upcoming") ||
      (activeTab === "completed" && meeting.status === "Completed");
    return matchesSearch && matchesType && matchesTab;
  });

  const handleViewMeeting = (meetingId: number) => {
    navigate(`/council/meeting/${meetingId}`);
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Council Meetings
          </h1>
          <p className="text-muted-foreground">
            Schedule and participate in council meetings
          </p>
        </div>
        {isChairman && (
          <Button onClick={() => navigate("/council/meeting/schedule")}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="completed">Completed Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "upcoming"
                  ? "Upcoming Meetings"
                  : "Completed Meetings"}
              </CardTitle>
              <CardDescription>
                {activeTab === "upcoming"
                  ? "Scheduled council meetings that require your participation"
                  : "Past council meetings and their outcomes"}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Meeting Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Proposal Evaluation">
                        Proposal Evaluation
                      </SelectItem>
                      <SelectItem value="Milestone Evaluation">
                        Milestone Evaluation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting Title</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeetings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No meetings found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMeetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell className="font-medium">
                            {meeting.title}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                                <span>{meeting.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                                <span>{meeting.time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                meeting.type === "Proposal Evaluation"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-purple-100 text-purple-800 border-purple-200"
                              }
                            >
                              {meeting.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{meeting.projectCode}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {meeting.status === "Upcoming" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleJoinMeeting(meeting.meetingLink)
                                  }
                                >
                                  <Video className="mr-2 h-3 w-3" />
                                  Join
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewMeeting(meeting.id)}
                              >
                                <FileText className="mr-2 h-3 w-3" />
                                {meeting.status === "Upcoming"
                                  ? "Details"
                                  : "Minutes"}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouncilMeetings;
