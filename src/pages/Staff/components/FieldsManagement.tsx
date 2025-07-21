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
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Field interface
interface Field {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  majorCount?: number;
}

// Mock data for fields
const mockFields: Field[] = [
  {
    id: "5676c6a2-2b5f-4eaa-90cd-3f3d2f3145d1",
    name: "Engineering & Technology",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    majorCount: 5,
  },
  {
    id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
    name: "Information Technology",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    majorCount: 8,
  },
  {
    id: "d0320c47-6f01-4e98-bcc0-96f3cb95730e",
    name: "Medical & Pharmaceutical Sciences",
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z",
    majorCount: 3,
  },
  {
    id: "cf080a69-8860-4751-91f2-c320c767dfb2",
    name: "Social Sciences & Humanities",
    createdAt: "2024-01-18T11:45:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
    majorCount: 6,
  },
  {
    id: "23011a33-a656-45e0-b128-f6a03b0c3aa1",
    name: "Economics & Management",
    createdAt: "2024-01-19T16:30:00Z",
    updatedAt: "2024-01-19T16:30:00Z",
    majorCount: 4,
  },
];

const FieldsManagement: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Table columns definition with beautiful styling
  const columns = useMemo<ColumnDef<Field>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Field Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "majorCount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Majors
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-medium">
            {row.getValue("majorCount") || 0} majors
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as string;
          return (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">
                {date ? new Date(date).toLocaleDateString() : "-"}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="font-semibold text-gray-700">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original)}
              className="h-8 px-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:text-green-800"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="h-8 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original)}
              className="h-8 px-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 hover:from-red-100 hover:to-rose-100 hover:text-red-800"
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
    data: fields,
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
      const field = row.original;
      const searchString = field.name.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleCreate = () => {
    setFormData({ name: "" });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setFormData({ name: field.name });
    setIsEditDialogOpen(true);
  };

  const handleView = (field: Field) => {
    setSelectedField(field);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (field: Field) => {
    setSelectedField(field);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Field name is required");
      return;
    }

    if (selectedField) {
      // Update existing field
      setFields(prev =>
        prev.map(field =>
          field.id === selectedField.id
            ? { ...field, name: formData.name, updatedAt: new Date().toISOString() }
            : field
        )
      );
      toast.success("Field updated successfully");
      setIsEditDialogOpen(false);
    } else {
      // Create new field
      const newField: Field = {
        id: `field-${Date.now()}`,
        name: formData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        majorCount: 0,
      };
      setFields(prev => [...prev, newField]);
      toast.success("Field created successfully");
      setIsCreateDialogOpen(false);
    }

    setSelectedField(null);
    setFormData({ name: "" });
  };

  const handleDeleteConfirm = () => {
    if (selectedField) {
      setFields(prev => prev.filter(field => field.id !== selectedField.id));
      toast.success("Field deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedField(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fields Management</h2>
          <p className="text-muted-foreground">
            Manage academic fields and their associated majors
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Field
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
                  placeholder="Search fields..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Badge variant="outline">
              {fields.length} total fields
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Clean Fields Table */}
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
                  className="hover:bg-purple-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
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
                    <Search className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No fields found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "Get started by adding your first field"}
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
                      ? "bg-purple-600 text-white hover:bg-purple-700"
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
          setSelectedField(null);
          setFormData({ name: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedField ? "Edit Field" : "Create New Field"}
            </DialogTitle>
            <DialogDescription>
              {selectedField
                ? "Update the field information below."
                : "Enter the details for the new field."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter field name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedField(null);
                setFormData({ name: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedField ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Field Details</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <div className="space-y-4">
              <div>
                <Label>Field Name</Label>
                <p className="text-sm font-medium">{selectedField.name}</p>
              </div>
              <div>
                <Label>Associated Majors</Label>
                <p className="text-sm">{selectedField.majorCount} majors</p>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-sm">
                  {selectedField.createdAt
                    ? new Date(selectedField.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {selectedField.updatedAt
                    ? new Date(selectedField.updatedAt).toLocaleString()
                    : "-"}
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
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedField?.name}"? This action cannot be undone.
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

export default FieldsManagement;
