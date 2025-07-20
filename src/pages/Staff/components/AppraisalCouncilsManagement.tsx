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
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Council Member interface
interface CouncilMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Chairman" | "Council" | "Secretary";
}

// Project interface for dropdown
interface Project {
  id: string;
  title: string;
  pi: string;
  status: string;
}

// User interface for member selection
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Enhanced AppraisalCouncil interface
interface AppraisalCouncil {
  id: string;
  name: string;
  projectId?: string;
  projectTitle?: string;
  members: CouncilMember[];
  status: "created" | "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

// Mock data for projects (available for assignment)
const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    status: "Active",
  },
  {
    id: "2",
    title: "Sustainable Energy Storage Solutions",
    pi: "Dr. Michael Chen",
    status: "Active",
  },
  {
    id: "3",
    title: "Blockchain-based Supply Chain Management",
    pi: "Dr. Emily Rodriguez",
    status: "Under Review",
  },
  {
    id: "4",
    title: "Machine Learning for Medical Diagnosis",
    pi: "Dr. James Wilson",
    status: "Active",
  },
];

// Mock data for users (available for council membership)
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "PRINCIPAL_INVESTIGATOR",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@mit.edu",
    role: "RESEARCHER",
  },
  {
    id: "3",
    name: "Prof. Emily Rodriguez",
    email: "emily.rodriguez@stanford.edu",
    role: "APPRAISAL_COUNCIL",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@harvard.edu",
    role: "PRINCIPAL_INVESTIGATOR",
  },
  {
    id: "5",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@caltech.edu",
    role: "RESEARCHER",
  },
  {
    id: "6",
    name: "Prof. David Kim",
    email: "david.kim@mit.edu",
    role: "APPRAISAL_COUNCIL",
  },
];

// Mock data for appraisal councils
const mockCouncils: AppraisalCouncil[] = [
  {
    id: "council-1",
    name: "AI Research Evaluation Council",
    projectId: "1",
    projectTitle: "AI-Powered Drug Discovery Platform",
    members: [
      {
        id: "member-1",
        userId: "3",
        name: "Prof. Emily Rodriguez",
        email: "emily.rodriguez@stanford.edu",
        role: "Chairman",
      },
      {
        id: "member-2",
        userId: "2",
        name: "Dr. Michael Chen",
        email: "michael.chen@mit.edu",
        role: "Council",
      },
      {
        id: "member-3",
        userId: "5",
        name: "Dr. Lisa Anderson",
        email: "lisa.anderson@caltech.edu",
        role: "Secretary",
      },
    ],
    status: "active",
    createdAt: "2025-07-18T14:50:33.6033333",
    updatedAt: "2025-07-18T14:50:33.6033333",
  },
  {
    id: "council-2",
    name: "Energy Research Council",
    projectId: "2",
    projectTitle: "Sustainable Energy Storage Solutions",
    members: [
      {
        id: "member-4",
        userId: "6",
        name: "Prof. David Kim",
        email: "david.kim@mit.edu",
        role: "Chairman",
      },
      {
        id: "member-5",
        userId: "4",
        name: "Dr. James Wilson",
        email: "james.wilson@harvard.edu",
        role: "Council",
      },
      {
        id: "member-6",
        userId: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Secretary",
      },
    ],
    status: "created",
    createdAt: "2025-07-17T10:30:00.0000000",
    updatedAt: "2025-07-18T09:15:00.0000000",
  },
];

const AppraisalCouncilsManagement: React.FC = () => {
  const [councils, setCouncils] = useState<AppraisalCouncil[]>(mockCouncils);
  const [projects] = useState<Project[]>(mockProjects);
  const [users] = useState<User[]>(mockUsers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState<AppraisalCouncil | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    members: [
      { userId: "", role: "Chairman" as CouncilMember["role"] },
      { userId: "", role: "Council" as CouncilMember["role"] },
      { userId: "", role: "Secretary" as CouncilMember["role"] },
    ],
    status: "created" as AppraisalCouncil["status"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get available projects (not assigned to other councils)
  const getAvailableProjects = (currentCouncilId?: string) => {
    const assignedProjectIds = councils
      .filter(council => council.id !== currentCouncilId && council.projectId)
      .map(council => council.projectId);
    return projects.filter(project => !assignedProjectIds.includes(project.id));
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<AppraisalCouncil>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Council Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "projectTitle",
        header: "Assigned Project",
        cell: ({ row }) => {
          const projectTitle = row.getValue("projectTitle") as string;
          return (
            <div className="text-sm">
              {projectTitle ? (
                <span className="text-blue-600 font-medium">{projectTitle}</span>
              ) : (
                <span className="text-gray-400 italic">No project assigned</span>
              )}
            </div>
          );
        },
      },
      {
        id: "memberCount",
        header: "Members",
        cell: ({ row }) => {
          const council = row.original;
          return (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">{council.members.length}</span>
            </div>
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
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
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
              View Details
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
    data: councils,
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
      const council = row.original;
      const searchString = `${council.name} ${council.projectTitle || ""}`.toLowerCase();
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
      name: "",
      projectId: "",
      members: [
        { userId: "", role: "Chairman" },
        { userId: "", role: "Council" },
        { userId: "", role: "Secretary" },
      ],
      status: "created",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setFormData({
      name: council.name,
      projectId: council.projectId || "",
      members: council.members.length >= 3
        ? council.members.map(member => ({ userId: member.userId, role: member.role }))
        : [
            ...council.members.map(member => ({ userId: member.userId, role: member.role })),
            ...Array(3 - council.members.length).fill(null).map((_, index) => ({
              userId: "",
              role: ["Chairman", "Council", "Secretary"][council.members.length + index] as CouncilMember["role"]
            }))
          ],
      status: council.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Council name is required");
      return;
    }

    if (!formData.projectId) {
      toast.error("Please assign a project to the council");
      return;
    }

    // Check if minimum 3 members are selected
    const filledMembers = formData.members.filter(member => member.userId);
    if (filledMembers.length < 3) {
      toast.error("Council must have at least 3 members");
      return;
    }

    // Check for duplicate members
    const userIds = filledMembers.map(member => member.userId);
    if (new Set(userIds).size !== userIds.length) {
      toast.error("Cannot assign the same person to multiple roles");
      return;
    }

    // Check if project is already assigned to another council
    const isProjectAssigned = councils.some(council =>
      council.id !== selectedCouncil?.id && council.projectId === formData.projectId
    );
    if (isProjectAssigned) {
      toast.error("This project is already assigned to another council");
      return;
    }

    const selectedProject = projects.find(p => p.id === formData.projectId);
    const councilMembers: CouncilMember[] = filledMembers.map((member, index) => {
      const user = users.find(u => u.id === member.userId);
      return {
        id: `member-${Date.now()}-${index}`,
        userId: member.userId,
        name: user?.name || "",
        email: user?.email || "",
        role: member.role,
      };
    });

    if (selectedCouncil) {
      // Update existing council
      setCouncils(prev =>
        prev.map(council =>
          council.id === selectedCouncil.id
            ? {
                ...council,
                name: formData.name,
                projectId: formData.projectId,
                projectTitle: selectedProject?.title,
                members: councilMembers,
                status: formData.status,
                updatedAt: new Date().toISOString(),
              }
            : council
        )
      );
      toast.success("Council updated successfully");
      setIsEditDialogOpen(false);
    } else {
      // Create new council
      const newCouncil: AppraisalCouncil = {
        id: `council-${Date.now()}`,
        name: formData.name,
        projectId: formData.projectId,
        projectTitle: selectedProject?.title,
        members: councilMembers,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCouncils(prev => [...prev, newCouncil]);
      toast.success("Council created successfully");
      setIsCreateDialogOpen(false);
    }

    setSelectedCouncil(null);
    setFormData({
      name: "",
      projectId: "",
      members: [
        { userId: "", role: "Chairman" },
        { userId: "", role: "Council" },
        { userId: "", role: "Secretary" },
      ],
      status: "created",
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedCouncil) {
      setCouncils(prev => prev.filter(council => council.id !== selectedCouncil.id));
      toast.success("Council deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCouncil(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Council Management</h2>
          <p className="text-muted-foreground">
            Manage appraisal councils, assign projects, and configure member roles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Council
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
                  placeholder="Search councils..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {councils.filter(c => c.status === "created").length} Created
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {councils.filter(c => c.status === "active").length} Active
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {councils.filter(c => c.status === "inactive").length} Inactive
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Councils Table */}
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
                  className="hover:bg-orange-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
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
                    <Users className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No councils found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "Get started by adding your first council"}
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
                      ? "bg-orange-600 text-white hover:bg-orange-700"
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
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedCouncil(null);
            setFormData({
              name: "",
              projectId: "",
              members: [
                { userId: "", role: "Chairman" },
                { userId: "", role: "Council" },
                { userId: "", role: "Secretary" },
              ],
              status: "created",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCouncil ? "Edit Council" : "Add New Council"}
            </DialogTitle>
            <DialogDescription>
              {selectedCouncil
                ? "Update the council information and member assignments."
                : "Create a new appraisal council with project assignment and members."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Council Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Council Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter council name"
              />
            </div>

            {/* Assign to Project */}
            <div className="space-y-2">
              <Label htmlFor="project">Assign to Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProjects(selectedCouncil?.id).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.title}</span>
                        <span className="text-sm text-gray-500">PI: {project.pi}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Council Members */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Council Members *</Label>
              <p className="text-sm text-gray-600">Minimum 3 members required</p>

              {formData.members.map((member, index) => (
                <div key={index} className="relative">
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Select User</Label>
                      <Select
                        value={member.userId}
                        onValueChange={(value) => {
                          const newMembers = [...formData.members];
                          newMembers[index] = { ...newMembers[index], userId: value };
                          setFormData({ ...formData, members: newMembers });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-gray-500">{user.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={member.role}
                        onValueChange={(value) => {
                          const newMembers = [...formData.members];
                          newMembers[index] = { ...newMembers[index], role: value as CouncilMember["role"] };
                          setFormData({ ...formData, members: newMembers });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chairman">Chairman</SelectItem>
                          <SelectItem value="Council">Council Member</SelectItem>
                          <SelectItem value="Secretary">Secretary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remove button for additional members (beyond first 3) */}
                  {index >= 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMembers = formData.members.filter((_, i) => i !== index);
                        setFormData({ ...formData, members: newMembers });
                      }}
                      className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}

              {/* Add Member Button */}
              {formData.members.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      members: [...formData.members, { userId: "", role: "Council" }]
                    });
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              )}

              {/* Remove Member Buttons (for members beyond the first 3) */}
              {formData.members.length > 3 && (
                <div className="text-sm text-gray-600">
                  <p>You can remove additional members (minimum 3 required)</p>
                </div>
              )}
              </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedCouncil(null);
                setFormData({
                  name: "",
                  projectId: "",
                  members: [
                    { userId: "", role: "Chairman" },
                    { userId: "", role: "Council" },
                    { userId: "", role: "Secretary" },
                  ],
                  status: "created",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedCouncil ? "Update Council" : "Create Council"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Council Details</DialogTitle>
            <DialogDescription>
              View detailed information about the appraisal council
            </DialogDescription>
          </DialogHeader>
          {selectedCouncil && (
            <div className="space-y-6 py-4">
              {/* Council Name */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Council Name</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedCouncil.name}</p>
              </div>

              {/* Assigned Project */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Assigned Project</Label>
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  {selectedCouncil.projectTitle ? (
                    <div>
                      <p className="font-medium text-blue-900">{selectedCouncil.projectTitle}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        PI: {projects.find(p => p.id === selectedCouncil.projectId)?.pi}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No project assigned</p>
                  )}
                </div>
              </div>

              {/* Council Members */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Council Members</Label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Member Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedCouncil.members.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                member.role === "Chairman"
                                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                  : member.role === "Secretary"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }
                            >
                              {member.role}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status and Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedCouncil.status)}>
                    {selectedCouncil.status.charAt(0).toUpperCase() + selectedCouncil.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedCouncil.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Council</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCouncil?.name}"? This action cannot be undone.
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

export default AppraisalCouncilsManagement;
