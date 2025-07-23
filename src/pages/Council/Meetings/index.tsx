import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar as CalendarIcon } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import UpcomingMeetingsTab from "./components/UpcomingMeetingsTab";
import ProjectMeetingsTab from "./components/ProjectMeetingsTab";

// Mock data for meetings
const meetings = [
  {
    id: 1,
    title: "Project Evaluation: AI-Driven Medical Diagnostics",
    projectName: "AI-Driven Medical Diagnostics",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Upcoming",
    type: "Proposal Evaluation",
    joined: false,
  },
  {
    id: 2,
    title: "Project Evaluation: Sustainable Energy Solutions",
    projectName: "Sustainable Energy Solutions",
    date: "2024-01-20",
    time: "2:00 PM - 4:00 PM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Upcoming",
    type: "Proposal Evaluation",
    joined: false,
  },
  {
    id: 3,
    title: "Milestone Review: Biodiversity Conservation",
    projectName: "Biodiversity Conservation",
    date: "2024-01-10",
    time: "9:00 AM - 11:00 AM",
    meetingLink: "https://zoom.us/j/987654321",
    status: "Completed",
    type: "Milestone Evaluation",
    joined: true,
  },
  {
    id: 4,
    title: "Project Evaluation: Quantum Computing Applications",
    projectName: "Quantum Computing Applications",
    date: "2024-01-05",
    time: "1:00 PM - 3:00 PM",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
    status: "Completed",
    type: "Proposal Evaluation",
    joined: true,
  },
  {
    id: 5,
    title: "Milestone Review: Genetic Engineering Ethics",
    projectName: "Genetic Engineering Ethics",
    date: "2024-01-25",
    time: "11:00 AM - 1:00 PM",
    meetingLink: "https://zoom.us/j/123123123",
    status: "Upcoming",
    type: "Milestone Evaluation",
    joined: false,
  },
  {
    id: 6,
    title: "Final Review: AI-Driven Medical Diagnostics",
    projectName: "AI-Driven Medical Diagnostics",
    date: "2024-02-01",
    time: "3:00 PM - 5:00 PM",
    meetingLink: "https://zoom.us/j/456789123",
    status: "Canceled",
    type: "Final Evaluation",
    joined: false,
  },
  {
    id: 7,
    title: "Progress Review: Sustainable Energy Solutions",
    projectName: "Sustainable Energy Solutions",
    date: "2024-01-30",
    time: "1:00 PM - 2:30 PM",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    status: "Completed",
    type: "Progress Review",
    joined: true,
  },
];

const Meetings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is chairman
  // const isChairman = user?.role === UserRole.APPRAISAL_COUNCIL;

  // Check if user can view meeting details
  const canViewDetails =
    user?.role === UserRole.APPRAISAL_COUNCIL ||
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR;

  const handleViewMeeting = (meetingId: number) => {
    if (!canViewDetails) {
      // Don't navigate if user doesn't have permission
      return;
    }

    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate(`/pi/meeting/${meetingId}`);
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      navigate(`/council/meeting/${meetingId}`);
    }
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  // const handleScheduleMeeting = () => {
  //   if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
  //     navigate("/pi/meetings/schedule");
  //   } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
  //     navigate("/council/meetings/schedule");
  //   }
  // };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Schedule and participate in Online meetings
          </p>
        </div>
        {/* {isChairman && (
          <Button onClick={handleScheduleMeeting}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        )} */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="projects">Project Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingMeetingsTab
            meetings={meetings}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onJoinMeeting={handleJoinMeeting}
            onViewMeeting={handleViewMeeting}
            canViewDetails={canViewDetails}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectMeetingsTab
            meetings={meetings}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onJoinMeeting={handleJoinMeeting}
            onViewMeeting={handleViewMeeting}
            canViewDetails={canViewDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meetings;
