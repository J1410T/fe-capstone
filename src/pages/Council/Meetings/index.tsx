import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar as CalendarIcon } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useAllMeetingTaskByCouncil } from "@/hooks/queries/task";
import { Loading } from "@/components/ui/loaders";
import UpcomingMeetingsTab from "./components/UpcomingMeetingsTab";
import ProjectMeetingsTab from "./components/ProjectMeetingsTab";

// Interface for transformed meeting data
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

const Meetings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch meeting data from API
  const { data: meetingData, isLoading, error } = useAllMeetingTaskByCouncil();

  // Transform API data to meeting format
  const meetings: Meeting[] = React.useMemo(() => {
    if (!meetingData?.["data-list"]) return [];

    const transformedMeetings: Meeting[] = [];

    meetingData["data-list"].forEach((council) => {
      council.proposal?.forEach((project) => {
        // Check if project has meeting tasks
        if (project.tasks && project.tasks.length > 0) {
          // Project has meeting tasks - create meeting entries for each task
          project.tasks.forEach((task) => {
            const meeting: Meeting = {
              id: task.id,
              title: task.name,
              projectName: `${project["english-title"]}`,
              projectCode: project.code,
              councilName: council.name,
              date: task["start-date"],
              time: `${new Date(
                task["start-date"]
              ).toLocaleTimeString()} - ${new Date(
                task["end-date"]
              ).toLocaleTimeString()}`,
              meetingLink: task["meeting-url"] || "",
              status:
                task.status === "completed"
                  ? "Completed"
                  : task.status === "cancelled"
                  ? "Cancelled"
                  : "Upcoming",
              type: "Task Meeting",
              joined: false,
              taskStatus: task.status,
            };
            transformedMeetings.push(meeting);
          });
        } else {
          // Project has no meeting tasks - create a placeholder entry to show the proposal
          const meeting: Meeting = {
            id: `no-task-${project.id}`, // Unique ID for projects without tasks
            title: "No meeting task scheduled",
            projectName: `${project["english-title"]}`,
            projectCode: project.code,
            councilName: council.name,
            date: "", // No date for projects without tasks
            time: "", // No time for projects without tasks
            meetingLink: "",
            status: "Upcoming", // Default status for projects without tasks
            type: "No Task",
            joined: false,
            taskStatus: "no-task", // Special status for projects without tasks
          };
          transformedMeetings.push(meeting);
        }
      });
    });

    return transformedMeetings;
  }, [meetingData]);

  // Check if user is chairman
  // const isChairman = user?.role === UserRole.APPRAISAL_COUNCIL;

  // Check if user can view meeting details
  const canViewDetails =
    user?.role === UserRole.APPRAISAL_COUNCIL ||
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR;

  const handleViewMeeting = (meetingId: string) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Loading />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-red-500">
            Error loading meetings: {error.message}
          </p>
        </div>
      </div>
    );
  }

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
