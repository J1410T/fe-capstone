import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Plus,
  Search,
  // Filter, // Unused import
  Edit,
  Eye,
  Calendar,
  Flag,
  // User, // Unused import
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";

// Task interface for the table
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskView?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onCreateTask?: () => void;
  isLeader?: boolean;
  title?: string;
  description?: string;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onTaskEdit,
  onTaskView,
  onTaskClick,
  onCreateTask,
  // isLeader = true, // Unused parameter
  title = "Task Management",
  description = "Manage and track your tasks efficiently",
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");

  // Check if task is overdue
  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Complete") return false;
    return isAfter(new Date(), parseISO(dueDate));
  };

  // Update task status to Overdue if past due date
  const tasksWithOverdueCheck = useMemo(() => {
    return tasks.map((task) => {
      if (isOverdue(task.dueDate, task.status) && task.status !== "Complete") {
        return { ...task, status: "Overdue" as const };
      }
      return task;
    });
  }, [tasks]);

  // Get priority configuration
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "High":
        return { color: "bg-red-100 text-red-700", icon: "🔴" };
      case "Medium":
        return { color: "bg-yellow-100 text-yellow-700", icon: "🟡" };
      case "Low":
        return { color: "bg-blue-100 text-blue-700", icon: "🔵" };
      default:
        return { color: "bg-slate-100 text-slate-700", icon: "⚪" };
    }
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
        header: ({ column }) => (
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
        cell: ({ row }) => (
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
        accessorKey: "status",
        header: ({ column }) => (
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
        cell: ({ row }) => {
          const statusConfig = getStatusConfig(row.original.status);
          return (
            <Badge className={statusConfig.color}>{row.original.status}</Badge>
          );
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
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
        cell: ({ row }) => {
          const priorityConfig = getPriorityConfig(row.original.priority);
          return (
            <Badge variant="outline" className={priorityConfig.color}>
              {priorityConfig.icon} {row.original.priority}
            </Badge>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
          >
            Due Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const dueDate = parseISO(row.original.dueDate);
          const overdue = isOverdue(row.original.dueDate, row.original.status);
          return (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span
                className={`text-sm ${
                  overdue ? "text-red-600 font-medium" : "text-slate-700"
                }`}
              >
                {format(dueDate, "MMM dd, yyyy")}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "projectTag",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {row.original.projectTag}
          </Badge>
        ),
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={row.original.assignedTo.avatar}
                alt={row.original.assignedTo.name}
              />
              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                {row.original.assignedTo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-700">
              {row.original.assignedTo.name}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
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
    globalFilterFn: (row, _columnId, filterValue) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      </div>

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

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <SelectItem value="High">🔴 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🔵 Low</SelectItem>
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

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {filteredTasks.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Flag className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Not Started
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    filteredTasks.filter((t) => t.status === "Not Started")
                      .length
                  }
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {
                    filteredTasks.filter((t) => t.status === "In Progress")
                      .length
                  }
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Complete</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredTasks.filter((t) => t.status === "Complete").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900">
                  {filteredTasks.filter((t) => t.status === "Overdue").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="bg-slate-50 text-slate-700 font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50 border-slate-200 cursor-pointer"
                      onClick={() => onTaskClick && onTaskClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
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
                      <div className="flex flex-col items-center justify-center text-slate-500">
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
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
                          ? "bg-blue-600 text-white"
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
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
