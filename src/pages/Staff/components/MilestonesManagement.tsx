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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  CheckSquare,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND } from "@/utils";

// Task interface
interface Task {
  id: string;
  code: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  deliveryDate: string | null;
  priority: string | null;
  progress: number;
  overdue: number;
  meetingUrl: string | null;
  note: string | null;
  status: string;
  milestoneId: string;
  creatorId: string;
}

// Milestone interface
interface Milestone {
  id: string;
  code: string;
  title: string;
  description: string | null;
  objective: string | null;
  cost: number;
  startDate: string | null;
  endDate: string | null;
  type: "normal" | "critical" | "review";
  createdAt: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  projectId: string;
  creatorId: string;
  project: {
    id: string;
    title: string;
    status: string;
  } | null;
  creator: {
    id: string;
    code: string;
    groupName: string;
    isOfficial: boolean;
    expireDate: string | null;
    createdAt: string;
    status: string;
    accountId: string;
    roleId: string;
    projectId: string;
    appraisalCouncilId: string | null;
  };
  evaluations: {
    id: string;
    score: number;
    feedback: string;
  }[];
  tasks: Task[];
}

// Mock data for milestones
const mockMilestones: Milestone[] = [
  {
    id: "32a57f6b-3ea9-43a2-98ec-1b3701c98b01",
    code: "ms-001",
    title: "Khởi tạo đề tài",
    description: "Milestone khởi tạo và thiết lập dự án",
    objective: "Hoàn thành việc khởi tạo dự án và phân công nhiệm vụ",
    cost: 50000000,
    startDate: "2025-07-20T00:00:00Z",
    endDate: "2025-08-20T00:00:00Z",
    type: "normal",
    createdAt: "2025-07-18T14:50:33.74",
    status: "created",
    projectId: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    creatorId: "de9a7591-c8a4-4cb1-bb96-21213b14336e",
    project: null,
    creator: {
      id: "de9a7591-c8a4-4cb1-bb96-21213b14336e",
      code: "userRole-09",
      groupName: "SU25SE007",
      isOfficial: true,
      expireDate: null,
      createdAt: "2025-07-18T14:50:33.6366667",
      status: "created",
      accountId: "0e541f99-5b82-4a78-ad92-ef4918b1cf90",
      roleId: "3651f185-4599-463d-b7f0-9f28f5a28163",
      projectId: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
      appraisalCouncilId: null,
    },
    evaluations: [],
    tasks: [
      {
        id: "96da4ce5-c104-4623-a40f-03e7fb2da31f",
        code: "T-004",
        name: "Phân công nhóm thực hiện",
        description: null,
        startDate: null,
        endDate: null,
        deliveryDate: null,
        priority: null,
        progress: 0,
        overdue: 0,
        meetingUrl: null,
        note: null,
        status: "created",
        milestoneId: "32a57f6b-3ea9-43a2-98ec-1b3701c98b01",
        creatorId: "bf519c36-844c-4c30-a43e-7db79cee795d",
      },
      {
        id: "d512c1a9-f406-4d09-8906-675f9a653234",
        code: "T-003",
        name: "Thu thập tài liệu tham khảo",
        description: null,
        startDate: null,
        endDate: null,
        deliveryDate: null,
        priority: null,
        progress: 0,
        overdue: 0,
        meetingUrl: null,
        note: null,
        status: "created",
        milestoneId: "32a57f6b-3ea9-43a2-98ec-1b3701c98b01",
        creatorId: "bf519c36-844c-4c30-a43e-7db79cee795d",
      },
    ],
  },
];

const MilestonesManagement: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    objective: "",
    cost: "",
    startDate: "",
    endDate: "",
    type: "normal" as Milestone["type"],
    status: "created" as Milestone["status"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "normal":
        return "bg-gray-100 text-gray-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<Milestone>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.getValue("code")}</div>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium max-w-[200px] truncate">
            {row.getValue("title")}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge className={getTypeColor(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={getStatusColor(status)}>
              {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "cost",
        header: "Budget",
        cell: ({ row }) => {
          const cost = row.getValue("cost") as number;
          return (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
              {formatVND(cost)}
            </div>
          );
        },
      },
      {
        accessorKey: "tasks",
        header: "Tasks",
        cell: ({ row }) => {
          const tasks = row.getValue("tasks") as Task[];
          return (
            <div className="flex items-center">
              <CheckSquare className="w-4 h-4 mr-1 text-gray-500" />
              {tasks.length} tasks
            </div>
          );
        },
      },
      {
        accessorKey: "endDate",
        header: "Due Date",
        cell: ({ row }) => {
          const date = row.getValue("endDate") as string;
          return date ? (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
              {new Date(date).toLocaleDateString()}
            </div>
          ) : (
            "-"
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: milestones,
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
      const milestone = row.original;
      const searchString = `${milestone.code} ${milestone.title} ${milestone.description || ""}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleCreate = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      objective: "",
      cost: "",
      startDate: "",
      endDate: "",
      type: "normal",
      status: "created",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setFormData({
      code: milestone.code,
      title: milestone.title,
      description: milestone.description || "",
      objective: milestone.objective || "",
      cost: milestone.cost.toString(),
      startDate: milestone.startDate ? milestone.startDate.split("T")[0] : "",
      endDate: milestone.endDate ? milestone.endDate.split("T")[0] : "",
      type: milestone.type,
      status: milestone.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.title.trim()) {
      toast.error("Code and title are required");
      return;
    }

    const cost = parseFloat(formData.cost) || 0;

    if (selectedMilestone) {
      // Update existing milestone
      setMilestones(prev =>
        prev.map(milestone =>
          milestone.id === selectedMilestone.id
            ? {
                ...milestone,
                code: formData.code,
                title: formData.title,
                description: formData.description || null,
                objective: formData.objective || null,
                cost,
                startDate: formData.startDate ? `${formData.startDate}T00:00:00Z` : null,
                endDate: formData.endDate ? `${formData.endDate}T00:00:00Z` : null,
                type: formData.type,
                status: formData.status,
              }
            : milestone
        )
      );
      toast.success("Milestone updated successfully");
      setIsEditDialogOpen(false);
    } else {
      // Create new milestone
      const newMilestone: Milestone = {
        id: `milestone-${Date.now()}`,
        code: formData.code,
        title: formData.title,
        description: formData.description || null,
        objective: formData.objective || null,
        cost,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00Z` : null,
        endDate: formData.endDate ? `${formData.endDate}T00:00:00Z` : null,
        type: formData.type,
        createdAt: new Date().toISOString(),
        status: formData.status,
        projectId: "sample-project-id",
        creatorId: "sample-creator-id",
        project: null,
        creator: {
          id: "sample-creator-id",
          code: "sample-code",
          groupName: "Sample Group",
          isOfficial: true,
          expireDate: null,
          createdAt: new Date().toISOString(),
          status: "created",
          accountId: "sample-account-id",
          roleId: "sample-role-id",
          projectId: "sample-project-id",
          appraisalCouncilId: null,
        },
        evaluations: [],
        tasks: [],
      };
      setMilestones(prev => [...prev, newMilestone]);
      toast.success("Milestone created successfully");
      setIsCreateDialogOpen(false);
    }

    setSelectedMilestone(null);
    setFormData({
      code: "",
      title: "",
      description: "",
      objective: "",
      cost: "",
      startDate: "",
      endDate: "",
      type: "normal",
      status: "created",
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedMilestone) {
      setMilestones(prev => prev.filter(milestone => milestone.id !== selectedMilestone.id));
      toast.success("Milestone deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedMilestone(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Milestones Management</h2>
          <p className="text-muted-foreground">
            Manage project milestones and their associated tasks
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search milestones..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {milestones.filter(m => m.status === "created").length} Created
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {milestones.filter(m => m.status === "in_progress").length} In Progress
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {milestones.filter(m => m.status === "completed").length} Completed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Milestones Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-900 py-3 px-4 text-left bg-gray-50/50"
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
                  className="hover:bg-emerald-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 text-gray-900"
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
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Target className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No milestones found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "Get started by adding your first milestone"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Clean Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/30 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`h-8 w-8 p-0 ${
                    table.getState().pagination.pageIndex === pageIndex
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageIndex + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedMilestone(null);
          setFormData({
            code: "",
            title: "",
            description: "",
            objective: "",
            cost: "",
            startDate: "",
            endDate: "",
            type: "normal",
            status: "created",
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMilestone ? "Edit Milestone" : "Create New Milestone"}
            </DialogTitle>
            <DialogDescription>
              {selectedMilestone
                ? "Update the milestone information below."
                : "Enter the details for the new milestone."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Milestone Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Enter milestone code"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter milestone title"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter milestone description"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="objective">Objective</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="Enter milestone objective"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="cost">Budget (VND)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Enter budget amount"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Milestone["type"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Milestone["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedMilestone(null);
                setFormData({
                  code: "",
                  title: "",
                  description: "",
                  objective: "",
                  cost: "",
                  startDate: "",
                  endDate: "",
                  type: "normal",
                  status: "created",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedMilestone ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Milestone Code</Label>
                  <p className="text-sm font-mono">{selectedMilestone.code}</p>
                </div>
                <div>
                  <Label>Title</Label>
                  <p className="text-sm font-medium">{selectedMilestone.title}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge className={getTypeColor(selectedMilestone.type)}>
                    {selectedMilestone.type.charAt(0).toUpperCase() + selectedMilestone.type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedMilestone.status)}>
                    {selectedMilestone.status.replace("_", " ").charAt(0).toUpperCase() + selectedMilestone.status.replace("_", " ").slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label>Budget</Label>
                  <p className="text-sm font-medium">{formatVND(selectedMilestone.cost)}</p>
                </div>
                <div>
                  <Label>Tasks</Label>
                  <p className="text-sm">{selectedMilestone.tasks.length} tasks</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm">
                    {selectedMilestone.startDate
                      ? new Date(selectedMilestone.startDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm">
                    {selectedMilestone.endDate
                      ? new Date(selectedMilestone.endDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
              </div>
              
              {selectedMilestone.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedMilestone.description}
                  </p>
                </div>
              )}
              
              {selectedMilestone.objective && (
                <div>
                  <Label>Objective</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedMilestone.objective}
                  </p>
                </div>
              )}

              {selectedMilestone.tasks.length > 0 && (
                <div>
                  <Label>Associated Tasks</Label>
                  <div className="mt-2 space-y-2">
                    {selectedMilestone.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="text-sm font-medium">{task.name}</p>
                          <p className="text-xs text-gray-500">{task.code}</p>
                        </div>
                        <Badge variant="outline">
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Created</Label>
                <p className="text-sm">
                  {new Date(selectedMilestone.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milestone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMilestone?.title}"? This action cannot be undone and will also delete all associated tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestonesManagement;
