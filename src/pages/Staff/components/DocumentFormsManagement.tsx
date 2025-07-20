import React, { useState, useMemo, useCallback } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Copy,
  Eye,
  Download,
  Upload,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  FileText,
} from "lucide-react";

// Mock data for forms
const formTemplates = [
  {
    id: 1,
    name: "Budget Request Form",
    description: "Standard form for requesting project budget allocations",
    category: "Budget",
    status: "active",
    lastModified: "2024-01-15",
    createdDate: "2024-01-01",
    usageCount: 45,
    fields: [
      { label: "Project Title", type: "text", required: true },
      { label: "Budget Amount", type: "number", required: true },
      { label: "Justification", type: "textarea", required: true },
      { label: "Department", type: "select", required: false },
    ],
  },
  {
    id: 2,
    name: "Equipment Purchase Form",
    description: "Form for requesting equipment purchases",
    category: "Procurement",
    status: "active",
    lastModified: "2024-01-12",
    createdDate: "2024-01-02",
    usageCount: 23,
    fields: [
      { label: "Equipment Name", type: "text", required: true },
      { label: "Vendor", type: "text", required: true },
      { label: "Cost", type: "number", required: true },
      { label: "Specifications", type: "textarea", required: false },
    ],
  },
  {
    id: 3,
    name: "Travel Authorization Form",
    description: "Form for travel expense authorization",
    category: "Travel",
    status: "draft",
    lastModified: "2024-01-10",
    createdDate: "2024-01-03",
    usageCount: 12,
    fields: [
      { label: "Destination", type: "text", required: true },
      { label: "Travel Dates", type: "date", required: true },
      { label: "Purpose", type: "textarea", required: true },
      { label: "Estimated Cost", type: "number", required: false },
    ],
  },
  {
    id: 4,
    name: "Personnel Request Form",
    description: "Form for requesting additional personnel",
    category: "HR",
    status: "active",
    lastModified: "2024-01-08",
    createdDate: "2024-01-04",
    usageCount: 8,
    fields: [
      { label: "Position Title", type: "text", required: true },
      { label: "Department", type: "select", required: true },
      { label: "Job Description", type: "textarea", required: true },
      { label: "Salary Range", type: "text", required: false },
    ],
  },
];

const DocumentFormsManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedForm, setSelectedForm] = useState<(typeof formTemplates)[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter forms based on category, status and search
  const filteredForms = useMemo(() => {
    return formTemplates.filter((form) => {
      const matchesCategory = categoryFilter === "all" || form.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === "all" || form.status === statusFilter;
      const matchesSearch =
        form.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        form.description.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [categoryFilter, statusFilter, globalFilter]);

  // Handler functions
  const handleViewDetails = useCallback((form: (typeof formTemplates)[0]) => {
    setSelectedForm(form);
    setIsViewDialogOpen(true);
  }, []);

  const handleCreateForm = () => {
    setSelectedForm(null);
    setIsCreateDialogOpen(true);
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<(typeof formTemplates)[0]>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Form Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="max-w-[250px]">
            <div className="font-medium truncate">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground mt-1 truncate">
              {row.original.description}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.getValue("category")}
          </Badge>
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
        accessorKey: "usageCount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Usage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{row.getValue("usageCount")} times</span>
          </div>
        ),
      },
      {
        accessorKey: "lastModified",
        header: "Last Modified",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
            {new Date(row.getValue("lastModified")).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails]
  );

  // Create table instance
  const table = useReactTable({
    data: filteredForms,
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
      const form = row.original;
      const searchString = `${form.name} ${form.description} ${form.category}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });



  const FormDetailDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Form Details</DialogTitle>
          <DialogDescription>
            View detailed information about the form template
          </DialogDescription>
        </DialogHeader>
        {selectedForm && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Form Name</Label>
                <p className="text-sm font-medium">{selectedForm.name}</p>
              </div>
              <div>
                <Label>Category</Label>
                <Badge variant="outline">{selectedForm.category}</Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedForm.status)}>
                  {selectedForm.status.charAt(0).toUpperCase() + selectedForm.status.slice(1)}
                </Badge>
              </div>
              <div>
                <Label>Usage Count</Label>
                <p className="text-sm">{selectedForm.usageCount} times</p>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-sm">{new Date(selectedForm.createdDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Last Modified</Label>
                <p className="text-sm">{new Date(selectedForm.lastModified).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                {selectedForm.description}
              </p>
            </div>

            <div>
              <Label>Form Fields</Label>
              <div className="mt-2 space-y-2">
                {selectedForm.fields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <span className="text-sm font-medium">{field.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({field.type})</span>
                    </div>
                    {field.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Clone Form
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const CreateFormDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Form Template</DialogTitle>
          <DialogDescription>
            Create a new document form template that can be used across the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">Form Name</Label>
            <Input id="form-name" placeholder="Enter form name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              placeholder="Enter form description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Forms Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage Budget Management forms and templates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Button onClick={handleCreateForm}>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>
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
                  placeholder="Search forms..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Forms Table */}
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
                  className="hover:bg-rose-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
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
                    <FileText className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No forms found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "Get started by adding your first form"}
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
                      ? "bg-rose-600 text-white hover:bg-rose-700"
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

      <FormDetailDialog />
      <CreateFormDialog />
    </div>
  );
};

export default DocumentFormsManagement;
