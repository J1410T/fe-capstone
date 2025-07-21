import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  PageHeader,
  FilterBar,
  createCommonActions,
  type StaffMeeting,
  type FilterConfig,
  MEETING_STATUSES,
  MEETING_TYPES,
  formatDate,
} from "../shared";
import CreateMeetingForm from "./CreateMeetingForm";
import BulkMeetingCreation from "./BulkMeetingCreation";

// Import types from the form components
interface MeetingFormData {
  title: string;
  projectId: string;
  milestoneId: string;
  council: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  meetingLink: string;
}

interface BulkMeetingData {
  projectId: string;
  projectName: string;
  council: string;
  meetingLinkTemplate: string;
  milestones: Array<{
    milestoneId: string;
    milestoneName: string;
    date: Date | undefined;
    startTime: string;
    endTime: string;
  }>;
}

// Mock data for staff meetings
const mockMeetings: StaffMeeting[] = [
  {
    id: "meeting-1",
    title: "Milestone 2 Review: AI-Driven Medical Diagnostics",
    projectName: "AI-Driven Medical Diagnostics",
    projectId: "PRJ-2024-001",
    milestone: "Data Collection and Preprocessing",
    milestoneId: "MS-001-02",
    council: "Technical Council",
    date: "2024-02-15T10:00:00Z",
    time: "10:00 AM - 12:00 PM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Upcoming",
    type: "Milestone Review",
    attendees: 8,
    createdBy: "Staff Admin",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "meeting-2",
    title: "Milestone 1 Review: Sustainable Energy Solutions",
    projectName: "Sustainable Energy Solutions",
    projectId: "PRJ-2024-002",
    milestone: "Project Planning and Setup",
    milestoneId: "MS-002-01",
    council: "Environmental Council",
    date: "2024-02-20T14:00:00Z",
    time: "2:00 PM - 4:00 PM",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Upcoming",
    type: "Milestone Review",
    attendees: 6,
    createdBy: "Staff Admin",
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "meeting-3",
    title: "Final Review: Smart City Infrastructure",
    projectName: "Smart City Infrastructure",
    projectId: "PRJ-2023-015",
    milestone: "Project Completion",
    milestoneId: "MS-015-05",
    council: "Technical Council",
    date: "2024-01-30T09:00:00Z",
    time: "9:00 AM - 11:00 AM",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    status: "Completed",
    type: "Final Review",
    attendees: 10,
    createdBy: "Staff Admin",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "meeting-4",
    title: "Progress Review: Quantum Computing Research",
    projectName: "Quantum Computing Research",
    projectId: "PRJ-2024-003",
    milestone: "Algorithm Development",
    milestoneId: "MS-003-03",
    council: "Technical Council",
    date: "2024-02-25T16:00:00Z",
    time: "4:00 PM - 5:30 PM",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/xyz",
    status: "Upcoming",
    type: "Progress Review",
    attendees: 5,
    createdBy: "Staff Admin",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "meeting-5",
    title: "Proposal Evaluation: Renewable Energy Storage",
    projectName: "Renewable Energy Storage",
    projectId: "PRJ-2024-004",
    milestone: "Initial Proposal",
    milestoneId: "MS-004-01",
    council: "Environmental Council",
    date: "2024-01-25T13:00:00Z",
    time: "1:00 PM - 3:00 PM",
    meetingLink: "https://meet.google.com/renewable-energy-review",
    status: "Completed",
    type: "Proposal Evaluation",
    attendees: 7,
    createdBy: "Staff Admin",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
];

const StaffMeetings: React.FC = () => {
  const [meetings] = useState<StaffMeeting[]>(mockMeetings);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    type: "all",
    council: "all",
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<StaffMeeting>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Meeting",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.projectName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "milestone",
        header: "Milestone",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("milestone")}</div>
        ),
      },
      {
        accessorKey: "council",
        header: "Council",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("council")}</div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date & Time",
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium">
              {formatDate(row.getValue("date"))}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.time}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("type")} variant="type" size="sm" />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} size="sm" />
        ),
      },
      {
        accessorKey: "attendees",
        header: "Attendees",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{row.getValue("attendees")}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const meeting = row.original;
          const actions = [
            createCommonActions.view(() => handleView(meeting)),
            createCommonActions.edit(() => handleEdit(meeting)),
          ];

          // Add join meeting action for upcoming meetings
          if (meeting.status === "Upcoming") {
            actions.unshift({
              label: "Join Meeting",
              icon: Video,
              onClick: () => handleJoinMeeting(meeting),
              variant: "default" as const,
            });
          }

          actions.push(createCommonActions.delete(() => handleDelete(meeting)));

          return <ActionButtons actions={actions} />;
        },
      },
    ],
    []
  );

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: MEETING_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: MEETING_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    },
    {
      key: "council",
      label: "Council",
      type: "select",
      options: [
        { value: "Technical Council", label: "Technical Council" },
        { value: "Environmental Council", label: "Environmental Council" },
        { value: "Medical Council", label: "Medical Council" },
      ],
    },
  ];

  // Handler functions
  const handleView = (meeting: StaffMeeting) => {
    toast.info(`Viewing ${meeting.title}`);
  };

  const handleEdit = (meeting: StaffMeeting) => {
    toast.info(`Editing ${meeting.title}`);
  };

  const handleDelete = (meeting: StaffMeeting) => {
    toast.info(`Deleting ${meeting.title}`);
  };

  const handleJoinMeeting = (meeting: StaffMeeting) => {
    window.open(meeting.meetingLink, "_blank");
    toast.success(`Joining ${meeting.title}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({ status: "all", type: "all", council: "all" });
  };

  // Filter meetings based on current filter values
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const statusMatch =
        filterValues.status === "all" || meeting.status === filterValues.status;
      const typeMatch =
        filterValues.type === "all" || meeting.type === filterValues.type;
      const councilMatch =
        filterValues.council === "all" ||
        meeting.council === filterValues.council;
      return statusMatch && typeMatch && councilMatch;
    });
  }, [meetings, filterValues]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const upcomingCount = meetings.filter(
      (m) => m.status === "Upcoming"
    ).length;
    const completedCount = meetings.filter(
      (m) => m.status === "Completed"
    ).length;
    const totalAttendees = meetings.reduce((sum, m) => sum + m.attendees, 0);

    return {
      upcoming: upcomingCount,
      completed: completedCount,
      total: meetings.length,
      totalAttendees,
    };
  }, [meetings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Staff Meetings"
        description="Manage and schedule staff meetings for project reviews"
        badge={{ text: `${meetings.length} meetings`, variant: "secondary" }}
        actions={
          <div className="flex items-center space-x-2">
            <Dialog
              open={isBulkCreateDialogOpen}
              onOpenChange={setIsBulkCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Bulk Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Meeting Creation</DialogTitle>
                  <DialogDescription>
                    Create multiple meetings for a project at once
                  </DialogDescription>
                </DialogHeader>
                <BulkMeetingCreation
                  onSubmit={(data: BulkMeetingData) => {
                    console.log("Bulk meeting data:", data);
                    setIsBulkCreateDialogOpen(false);
                    toast.success("Meetings created successfully");
                  }}
                  onCancel={() => setIsBulkCreateDialogOpen(false)}
                  isSubmitting={false}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Meeting</DialogTitle>
                  <DialogDescription>
                    Schedule a new staff meeting for project review
                  </DialogDescription>
                </DialogHeader>
                <CreateMeetingForm
                  onSubmit={(data: MeetingFormData) => {
                    console.log("Meeting data:", data);
                    setIsCreateDialogOpen(false);
                    toast.success("Meeting created successfully");
                  }}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isSubmitting={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming
                </p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Meetings
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Attendees
                </p>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <FilterBar
            filters={filterConfig}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Meetings Table */}
      <DataTable
        data={filteredMeetings}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search meetings..."
        searchFields={["title", "projectName", "milestone"]}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage="No meetings found. Get started by creating your first meeting."
      />
    </div>
  );
};

export default StaffMeetings;
