import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Clock,
  Video,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { format, isAfter, isBefore, parseISO } from "date-fns";

// API hooks following TaskManagement pattern
import { useMyProject } from "@/hooks/queries/project";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";
import { useTasksByMilestoneId } from "@/hooks/queries/task";
import { ProjectTask } from "@/types/task";
import { Loading } from "@/components/ui/loaders";

// Meeting interface based on task data
interface Meeting {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  meetingUrl: string | null;
  status: "Upcoming" | "Completed" | "In Progress" | "Cancelled";
  milestoneId: string;
  milestoneName: string;
  projectId: string;
  projectName: string;
  memberTasks?: Array<{
    id: string;
    memberId: string;
    member?: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }>;
}

// Transform API task to Meeting format
const transformTaskToMeeting = (
  task: ProjectTask,
  milestoneName: string,
  projectId: string,
  projectName: string
): Meeting => {
  const now = new Date();
  const startDate = task["start-date"] ? parseISO(task["start-date"]) : null;
  const endDate = task["end-date"] ? parseISO(task["end-date"]) : null;

  let status: Meeting["status"] = "Upcoming";

  if (task.status.toLowerCase() === "completed") {
    status = "Completed";
  } else if (task.status.toLowerCase() === "cancelled") {
    status = "Cancelled";
  } else if (startDate && endDate) {
    if (isAfter(now, endDate)) {
      status = "Completed";
    } else if (isAfter(now, startDate) && isBefore(now, endDate)) {
      status = "In Progress";
    } else {
      status = "Upcoming";
    }
  }

  return {
    id: task.id,
    title: task.name,
    description: task.description || "",
    startDate: task["start-date"],
    endDate: task["end-date"],
    meetingUrl: task["meeting-url"],
    status,
    milestoneId: task["milestone-id"],
    milestoneName,
    projectId,
    projectName,
    memberTasks:
      task["member-tasks"]?.map((mt) => ({
        id: mt.id,
        memberId: mt.memberId,
        member: {
          id: mt.memberId,
          name: mt["full-name"] || "Unknown Member",
          avatarUrl: mt["avatar-url"] || "",
        },
      })) || [],
  };
};

// Individual meeting milestone task fetcher component
const MeetingTaskFetcher: React.FC<{
  milestoneId: string;
  milestoneName: string;
  projectId: string;
  projectName: string;
  onMeetingsLoaded: (milestoneId: string, meetings: Meeting[]) => void;
}> = ({
  milestoneId,
  milestoneName,
  projectId,
  projectName,
  onMeetingsLoaded,
}) => {
  const {
    data: tasksData,
    isLoading,
    error,
  } = useTasksByMilestoneId(milestoneId, 1, 100);

  useEffect(() => {
    if (!isLoading) {
      if (tasksData?.data?.["data-list"]) {
        const meetings = tasksData.data["data-list"].map((task) =>
          transformTaskToMeeting(task, milestoneName, projectId, projectName)
        );
        onMeetingsLoaded(milestoneId, meetings);
      } else {
        onMeetingsLoaded(milestoneId, []);
      }
    }
  }, [
    tasksData,
    isLoading,
    error,
    milestoneId,
    milestoneName,
    projectId,
    projectName,
    onMeetingsLoaded,
  ]);

  return null;
};

// Component to fetch milestones for a project and create meeting fetchers
const ProjectMilestoneFetcher: React.FC<{
  projectId: string;
  projectName: string;
  onMeetingsLoaded: (milestoneId: string, meetings: Meeting[]) => void;
}> = ({ projectId, projectName, onMeetingsLoaded }) => {
  const { data: milestonesData, isLoading } =
    useMilestonesByProjectId(projectId);

  // Extract and filter meeting milestones
  const meetingMilestones = useMemo(() => {
    if (!milestonesData?.data) return [];

    return milestonesData.data
      .filter(
        (milestone) =>
          milestone.title?.toLowerCase().includes("meeting") ||
          milestone.title?.toLowerCase().includes("meet") ||
          milestone.description?.toLowerCase().includes("meeting")
      )
      .map((milestone) => ({
        id: milestone.id,
        name: milestone.title || `Milestone ${milestone.code}`,
        description: milestone.description,
        startDate: milestone.startDate,
        endDate: milestone.endDate,
        projectId,
        projectName,
      }));
  }, [milestonesData?.data, projectId, projectName]);

  if (isLoading) return null;

  return (
    <>
      {meetingMilestones.map((milestone) => (
        <MeetingTaskFetcher
          key={milestone.id}
          milestoneId={milestone.id}
          milestoneName={milestone.name}
          projectId={milestone.projectId}
          projectName={milestone.projectName}
          onMeetingsLoaded={onMeetingsLoaded}
        />
      ))}
    </>
  );
};

const PImeetings: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [projectFilter, setProjectFilter] = useState<string>("All");

  // API hooks following TaskManagement pattern
  const { data: projectsData, error: projectsError } = useMyProject();

  // Extract projects
  const projects = useMemo(
    () => projectsData?.data || [],
    [projectsData?.data]
  );

  // Use a simple meetings map since we're fetching milestones per project
  const [meetingsMap, setMeetingsMap] = useState<Record<string, Meeting[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleMeetingsLoaded = useCallback(
    (milestoneId: string, meetings: Meeting[]) => {
      setMeetingsMap((prev) => ({ ...prev, [milestoneId]: meetings }));
      setLoadingMap((prev) => ({ ...prev, [milestoneId]: false }));
    },
    []
  );

  // Combine all meetings from all milestones
  const allMeetings = useMemo(() => {
    const meetings: Meeting[] = [];
    Object.values(meetingsMap).forEach((milestoneMeetings) => {
      meetings.push(...milestoneMeetings);
    });
    return meetings;
  }, [meetingsMap]);

  // Filter meetings by status and project
  const filteredMeetings = useMemo(() => {
    let filtered = allMeetings;

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((meeting) => meeting.status === statusFilter);
    }

    // Filter by project
    if (projectFilter !== "All") {
      filtered = filtered.filter(
        (meeting) => meeting.projectId === projectFilter
      );
    }

    return filtered;
  }, [allMeetings, statusFilter, projectFilter]);

  // Sort meetings by start date (upcoming first, then by date)
  const sortedMeetings = useMemo(() => {
    return [...filteredMeetings].sort((a, b) => {
      // Sort by status priority first (upcoming > in-progress > completed > cancelled)
      const statusPriority = {
        Upcoming: 4,
        "In Progress": 3,
        Completed: 2,
        Cancelled: 1,
      };
      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      if (statusDiff !== 0) return statusDiff;

      // Then sort by start date
      const dateA = a.startDate ? parseISO(a.startDate) : new Date(0);
      const dateB = b.startDate ? parseISO(b.startDate) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredMeetings]);

  // Log any API errors
  useEffect(() => {
    if (projectsError) {
      console.error("Projects API error:", projectsError);
    }
  }, [projectsError]);

  const isLoading = Object.values(loadingMap).some((loading) => loading);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Project milestone fetchers - invisible components that handle data fetching */}
      {projects.map((project) => (
        <ProjectMilestoneFetcher
          key={project.id}
          projectId={project.id}
          projectName={project["english-title"]}
          onMeetingsLoaded={handleMeetingsLoaded}
        />
      ))}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Project Meetings
          </h1>
          <p className="text-gray-600">
            View and manage meetings across all your projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Project
              </label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project["english-title"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Meetings</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex text-lg">
            Meetings Overview
            <div className="ml-2 flex items-center gap-2 text-sm text-gray-500">
              (<Video className="w-4 h-4" />
              <span>{sortedMeetings.length} meetings</span>)
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
              <span className="ml-2 text-gray-500">Loading meetings...</span>
            </div>
          ) : sortedMeetings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Meeting Title</TableHead>
                    <TableHead className="w-[200px]">Project</TableHead>
                    <TableHead className="w-[150px]">Date & Time</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMeetings.map((meeting) => (
                    <MeetingTableRow key={meeting.id} meeting={meeting} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No meetings found
              </h3>
              <p className="text-gray-600 mb-4">
                {statusFilter === "All" && projectFilter === "All"
                  ? "No meeting milestones found across your projects."
                  : `No meetings found matching the selected filters.`}
              </p>
              <p className="text-sm text-gray-500">
                Meetings are created as tasks within milestones that contain
                "Meeting" in their name.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Meeting Table Row Component
const MeetingTableRow: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Upcoming":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Meeting["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <RefreshCw className="w-4 h-4" />;
      case "Upcoming":
        return <Clock className="w-4 h-4" />;
      case "Cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return format(parseISO(dateString), "HH:mm");
    } catch {
      return "Invalid time";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{meeting.title}</div>
          {meeting.description && (
            <div className="text-sm text-gray-600 line-clamp-1">
              {meeting.description}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Milestone: {meeting.milestoneName}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="font-medium text-gray-900">{meeting.projectName}</div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {formatDate(meeting.startDate)}
          </div>
          <div className="text-xs text-gray-500">
            {formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge className={`border ${getStatusColor(meeting.status)}`}>
          <div className="flex items-center gap-1">
            {getStatusIcon(meeting.status)}
            {meeting.status}
          </div>
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {meeting.meetingUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.open(meeting.meetingUrl!, "_blank")}
            >
              <Video className="w-3 h-3" />
              Join
              <ExternalLink className="w-3 h-3" />
            </Button>
          ) : (
            <span className="text-xs text-gray-500">No link</span>
          )}

          {meeting.memberTasks && meeting.memberTasks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              {meeting.memberTasks.length}
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PImeetings;
