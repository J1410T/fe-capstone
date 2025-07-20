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

// AppraisalCouncil interface
interface AppraisalCouncil {
  id: string;
  code: string;
  name: string;
  status: "created" | "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

// Mock data for appraisal councils
const mockCouncils: AppraisalCouncil[] = [
  {
    id: "8d1b3c4a-b2de-46be-b309-5ed9ec992058",
    code: "councilAu-01",
    name: "Hội Đồng Nghiệm Thu 1",
    status: "created",
    createdAt: "2025-07-18T14:50:33.6033333",
    updatedAt: "2025-07-18T14:50:33.6033333",
    memberCount: 5,
  },
  {
    id: "9e2c4d5b-c3ef-47cf-c410-6fe0fd003169",
    code: "councilAu-02",
    name: "Hội Đồng Nghiệm Thu 2",
    status: "active",
    createdAt: "2025-07-17T10:30:00.0000000",
    updatedAt: "2025-07-18T09:15:00.0000000",
    memberCount: 7,
  },
  {
    id: "af3d5e6c-d4f0-58d0-d521-7gf1ge114270",
    code: "councilAu-03",
    name: "Hội Đồng Nghiệm Thu 3",
    status: "inactive",
    createdAt: "2025-07-16T16:20:00.0000000",
    updatedAt: "2025-07-17T14:45:00.0000000",
    memberCount: 3,
  },
];

const AppraisalCouncilsManagement: React.FC = () => {
  const [councils, setCouncils] = useState<AppraisalCouncil[]>(mockCouncils);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState<AppraisalCouncil | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
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

  // Table columns definition
  const columns = useMemo<ColumnDef<AppraisalCouncil>[]>(
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
        accessorKey: "memberCount",
        header: "Members",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-gray-500" />
            {row.getValue("memberCount") || 0}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as string;
          return new Date(date).toLocaleDateString();
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
      const searchString = `${council.code} ${council.name}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleCreate = () => {
    setFormData({ code: "", name: "", status: "created" });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (council: AppraisalCouncil) => {
    setSelectedCouncil(council);
    setFormData({
      code: council.code,
      name: council.name,
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
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Code and name are required");
      return;
    }

    if (selectedCouncil) {
      // Update existing council
      setCouncils(prev =>
        prev.map(council =>
          council.id === selectedCouncil.id
            ? {
                ...council,
                code: formData.code,
                name: formData.name,
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
        code: formData.code,
        name: formData.name,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 0,
      };
      setCouncils(prev => [...prev, newCouncil]);
      toast.success("Council created successfully");
      setIsCreateDialogOpen(false);
    }

    setSelectedCouncil(null);
    setFormData({ code: "", name: "", status: "created" });
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
          <h2 className="text-2xl font-bold">Appraisal Councils Management</h2>
          <p className="text-muted-foreground">
            Manage appraisal councils and their status
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
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedCouncil(null);
          setFormData({ code: "", name: "", status: "created" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCouncil ? "Edit Council" : "Create New Council"}
            </DialogTitle>
            <DialogDescription>
              {selectedCouncil
                ? "Update the council information below."
                : "Enter the details for the new council."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Council Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Enter council code"
              />
            </div>
            <div>
              <Label htmlFor="name">Council Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter council name"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as AppraisalCouncil["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
                setSelectedCouncil(null);
                setFormData({ code: "", name: "", status: "created" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedCouncil ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Council Details</DialogTitle>
          </DialogHeader>
          {selectedCouncil && (
            <div className="space-y-4">
              <div>
                <Label>Council Code</Label>
                <p className="text-sm font-mono">{selectedCouncil.code}</p>
              </div>
              <div>
                <Label>Council Name</Label>
                <p className="text-sm font-medium">{selectedCouncil.name}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedCouncil.status)}>
                  {selectedCouncil.status.charAt(0).toUpperCase() + selectedCouncil.status.slice(1)}
                </Badge>
              </div>
              <div>
                <Label>Members</Label>
                <p className="text-sm">{selectedCouncil.memberCount || 0} members</p>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-sm">
                  {new Date(selectedCouncil.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {new Date(selectedCouncil.updatedAt).toLocaleString()}
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
