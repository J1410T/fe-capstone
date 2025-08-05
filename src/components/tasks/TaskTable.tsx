import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  Column,
  Row,
  Header,
  Cell,
} from "@tanstack/react-table";
import { useTasksWithMembersByMilestoneId } from "@/hooks/queries/useTasksWithMembers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Avatar,
  AvatarFallback,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AvatarImage,
  Loading,
} from "@/components/ui";
import {
  Search,
  Edit,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, isAfter, isValid } from "date-fns";
import { getPriorityConfig as getPriorityConfigShared } from "@/utils";

// Task interface for the table
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  "member-tasks": Array<{
    id: string;
    "member-id": string;
    member: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TaskTableProps {
  // Option 1: Pass milestone ID to fetch tasks automatically
  milestoneId?: string;
  // Project ID for efficient member data fetching
  projectId?: string;
  // Option 2: Pass tasks directly (for backward compatibility)
  tasks?: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskView?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onCreateTask?: () => void;
  isLeader?: boolean;
  title?: string;
  description?: string;
}

// Date validation helpers
const isValidDateString = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== "string") return false;
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate);
  } catch {
    return false;
  }
};

const formatDueDate = (dueDate: string): string => {
  // Handle null or empty dates
  if (!dueDate || dueDate === "null" || dueDate === "") {
    return "Invalid date";
  }

  if (!isValidDateString(dueDate)) {
    return "Invalid date";
  }

  try {
    return format(parseISO(dueDate), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === "Complete") return false;
  if (!isValidDateString(dueDate)) return false;

  try {
    return isAfter(new Date(), parseISO(dueDate));
  } catch {
    return false;
  }
};

export const TaskTable: React.FC<TaskTableProps> = ({
  milestoneId,
  projectId,
  tasks: propTasks,
  onTaskEdit,
  onTaskView,
  onTaskClick,
}) => {
  // Use enhanced hook if milestoneId is provided, otherwise use passed tasks
  const {
    tasks: fetchedTasks,
    loading: fetchingTasks,
    error: fetchError
  } = useTasksWithMembersByMilestoneId(milestoneId || "", projectId);

  // Determine which tasks to use - wrapped in useMemo to prevent dependency issues
  const tasks = useMemo(() => {
    const finalTasks = milestoneId ? fetchedTasks : (propTasks || []);

    // Debug logging
    console.log("🔍 TaskTable Debug:", {
      milestoneId,
      usingEnhancedHook: !!milestoneId,
      fetchedTasksCount: fetchedTasks.length,
      finalTasksCount: finalTasks.length,
      fetchingTasks,
      fetchError,
      sampleTask: finalTasks[0] ? {
        id: finalTasks[0].id,
        title: finalTasks[0].title,
        memberTasksCount: finalTasks[0]["member-tasks"]?.length || 0,
        memberTasksData: finalTasks[0]["member-tasks"]
      } : null
    });

    return finalTasks;
  }, [milestoneId, fetchedTasks, propTasks, fetchingTasks, fetchError]);

  const isLoading = milestoneId ? fetchingTasks : false;
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");

  // Note: Overdue status is now handled in the useTasksWithMembersByMilestoneId hook
  // to ensure consistency across the application. We'll use tasks directly.
  const tasksWithOverdueCheck = useMemo(() => {
    // If using the enhanced hook (milestoneId provided), overdue logic is already applied
    if (milestoneId) {
      return tasks;
    }

    // For backward compatibility with passed tasks, still apply overdue logic
    return tasks.map((task) => {
      if (isOverdue(task.dueDate, task.status) && task.status !== "Complete") {
        return { ...task, status: "Overdue" as const };
      }
      return task;
    });
  }, [tasks, milestoneId]);

  // Get priority configuration from shared utilities
  const getPriorityConfig = (priority: string) => {
    const config = getPriorityConfigShared(priority);
    const normalizedPriority = priority.toLowerCase().trim();

    // Add icon based on priority
    let icon = "";
    switch (normalizedPriority) {
      case "high":
      case "urgent":
        icon = "🔴";
        break;
      case "medium":
      case "normal":
        icon = "🟡";
        break;
      case "low":
        icon = "🟢";
        break;
      default:
        icon = "⚪";
    }

    return { color: config.badgeColor, icon };
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Complete":
        return { color: "bg-green-100 text-green-700" };
      case "In Progress":
        return { color: "bg-blue-100 text-blue-700" };
      case "Overdue":
        return { color: "bg-red-100 text-red-700" };
      case "Not Started":
        return { color: "bg-slate-100 text-slate-700" };
      default:
        return { color: "bg-slate-100 text-slate-700" };
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tasks.map((task) => task.projectTag))
    );
    return uniqueCategories.sort();
  }, [tasks]);

  // Table columns definition
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }: { column: Column<Task, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
          >
            Task Title
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }: { row: Row<Task> }) => (
          <div className="max-w-[300px]">
            <div className="font-medium text-slate-900 truncate">
              {row.original.title}
            </div>
            <div className="text-sm text-slate-500 truncate">
              {row.original.description}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }: { column: Column<Task, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
          >
            Priority
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }: { row: Row<Task> }) => {
          const priorityConfig = getPriorityConfig(row.original.priority);
          return (
            <div className="flex justify-center">
              <Badge variant="outline" className={priorityConfig.color}>
                {priorityConfig.icon} {row.original.priority}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }: { column: Column<Task, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
          >
            End Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }: { row: Row<Task> }) => {
          const formattedDueDate = formatDueDate(row.original.dueDate);
          const isDateValid = isValidDateString(row.original.dueDate);
          const overdue = isOverdue(row.original.dueDate, row.original.status);

          return (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span
                className={`text-sm ${
                  !isDateValid
                    ? "text-slate-400 italic"
                    : overdue
                    ? "text-red-600 font-medium"
                    : "text-slate-700"
                }`}
              >
                {formattedDueDate}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "projectTag",
        header: "Category",
        cell: ({ row }: { row: Row<Task> }) => (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {row.original.projectTag}
          </Badge>
        ),
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }: { row: Row<Task> }) => {
          const memberTasks = row.original["member-tasks"];

          if (!memberTasks || memberTasks.length === 0) {
            return (
              <span className="text-muted-foreground text-xs">Unassigned</span>
            );
          }

          // If only one member, show avatar with name
          if (memberTasks.length === 1) {
            const member = memberTasks[0].member;
            return (
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6 border">
                  {member?.avatarUrl ? (
                    <AvatarImage
                      src={member.avatarUrl}
                      alt={member.name}
                    />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {member?.name
                        ?.split(" ")
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm text-slate-700 truncate max-w-[100px]">
                  {member?.name || "Unknown"}
                </span>
              </div>
            );
          }

          // If multiple members, show stacked avatars with count and names on hover
          return (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2" title={memberTasks.map(mt => mt.member?.name).join(", ")}>
                {memberTasks.slice(0, 3).map((mt) => (
                  <Avatar key={mt.id} className="w-6 h-6 border">
                    {mt.member?.avatarUrl ? (
                      <AvatarImage
                        src={mt.member.avatarUrl}
                        alt={mt.member.name}
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {mt.member?.name
                          ?.split(" ")
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                ))}
                {memberTasks.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 border flex items-center justify-center">
                    <span className="text-xs text-slate-600">+{memberTasks.length - 3}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {memberTasks.length} member{memberTasks.length > 1 ? 's' : ''}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }: { column: Column<Task, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }: { row: Row<Task> }) => {
          const statusConfig = getStatusConfig(row.original.status);
          return (
            <Badge className={statusConfig.color}>{row.original.status}</Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Task> }) => (
          <div className="flex items-center space-x-2">
            {onTaskView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTaskView(row.original)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
            {onTaskEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTaskEdit(row.original)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onTaskEdit, onTaskView]
  );

  // Filter tasks based on all filters
  const filteredTasks = useMemo(() => {
    let filtered = tasksWithOverdueCheck;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.projectTag === categoryFilter);
    }

    // Due date filter
    if (dueDateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter((task) => {
        if (!isValidDateString(task.dueDate)) return false;

        const taskDueDate = parseISO(task.dueDate);
        switch (dueDateFilter) {
          case "overdue":
            return isOverdue(task.dueDate, task.status);
          case "today":
            return taskDueDate >= today && taskDueDate < tomorrow;
          case "week":
            return taskDueDate >= today && taskDueDate <= nextWeek;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    tasksWithOverdueCheck,
    statusFilter,
    priorityFilter,
    categoryFilter,
    dueDateFilter,
  ]);

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (
      row: Row<Task>,
      _columnId: string,
      filterValue: string
    ) => {
      const task = row.original;
      const searchString = `${task.title} ${task.description}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Show loading state when fetching tasks
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-center p-8">
        <Loading className="w-full max-w-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state when there's an error fetching tasks
  if (fetchError) {
    return (
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-center p-8">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Error loading tasks</p>
              <p className="text-red-600 text-sm">{fetchError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        {onCreateTask && (
          <Button
            onClick={onCreateTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
      </div> */}

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-slate-900">
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search tasks by title or description..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Row - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Due Date
              </label>
              <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="today">Due Today</SelectItem>
                  <SelectItem value="week">Due This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(globalFilter ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            categoryFilter !== "all" ||
            dueDateFilter !== "all") && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGlobalFilter("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setCategoryFilter("all");
                  setDueDateFilter("all");
                }}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              {" "}
              {/* Đảm bảo bảng không bị bóp quá nhỏ */}
              <Table>
                <TableHeader className="pt-0">
                  <TableRow className="pt-0 border-slate-200">
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map(
                        (header: Header<Task, unknown>) => (
                          <TableHead
                            key={header.id}
                            className="pt-0 bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base px-4 py-3 whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row: Row<Task>) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-slate-50 border-slate-200 cursor-pointer"
                        onClick={() => onTaskClick && onTaskClick(row.original)}
                      >
                        {row
                          .getVisibleCells()
                          .map((cell: Cell<Task, unknown>) => (
                            <TableCell
                              key={cell.id}
                              className="py-3 px-4 text-sm sm:text-base break-words max-w-[200px] whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center justify-center text-slate-500 px-4">
                          <Search className="w-8 h-8 mb-2 opacity-50" />
                          <p>No tasks found</p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} tasks
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
              .filter((page) => {
                const current = table.getState().pagination.pageIndex + 1;
                return (
                  page === 1 ||
                  page === table.getPageCount() ||
                  Math.abs(page - current) <= 1
                );
              })
              .map((page, index, array) => {
                const current = table.getState().pagination.pageIndex + 1;
                const showEllipsis = index > 0 && page - array[index - 1] > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 py-1 text-slate-500">...</span>
                    )}
                    <Button
                      variant={current === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => table.setPageIndex(page - 1)}
                      className={
                        current === page
                          ? "var(--secondary) text-white"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
