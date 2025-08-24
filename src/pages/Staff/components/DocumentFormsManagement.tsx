import React, { useState, useMemo, useCallback, useRef } from "react";
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
  useDocumentsByFilter,
  useUpdateDocument,
} from "@/hooks/queries/document";
import { DocumentForm } from "@/types/document";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
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
  Edit,
  Eye,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
} from "lucide-react";
import { Loading } from "@/components";

// Interface for processed form data
interface ProcessedFormTemplate extends DocumentForm {
  description: string;
  category: string;
  lastModified: string;
  createdDate: string;
  usageCount: number;
  content: string;
}

// Document Forms Management Component
const DocumentFormsManagement: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditorDialogOpen, setIsEditorDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProcessedFormTemplate | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef<ScientificCVEditorRef>(null);

  // API mutation for updating templates
  const updateDocumentMutation = useUpdateDocument();
  // Multiple API calls for all document types
  const bm1Query = useDocumentsByFilter(
    "BM1",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm2Query = useDocumentsByFilter(
    "BM2",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm3Query = useDocumentsByFilter(
    "BM3",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm4Query = useDocumentsByFilter(
    "BM4",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm5Query = useDocumentsByFilter(
    "BM5",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm6Query = useDocumentsByFilter(
    "BM6",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm7Query = useDocumentsByFilter(
    "BM7",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm8Query = useDocumentsByFilter(
    "BM8",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm9Query = useDocumentsByFilter(
    "BM9",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm10Query = useDocumentsByFilter(
    "BM10",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm11Query = useDocumentsByFilter(
    "BM11",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm12Query = useDocumentsByFilter(
    "BM12",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );
  const bm13Query = useDocumentsByFilter(
    "BM13",
    true,
    1,
    50,
    true,
    statusFilter === "all" ? undefined : statusFilter
  );

  // Combine all data safely using useMemo
  const documentsData = useMemo(() => {
    const allTemplates: DocumentForm[] = [];

    const queries = [
      bm1Query,
      bm2Query,
      bm3Query,
      bm4Query,
      bm5Query,
      bm6Query,
      bm7Query,
      bm8Query,
      bm9Query,
      bm10Query,
      bm11Query,
      bm12Query,
      bm13Query,
    ];

    queries.forEach((query) => {
      if (query.data?.data?.["data-list"]) {
        allTemplates.push(...query.data.data["data-list"]);
      }
    });

    return { data: { "data-list": allTemplates } };
  }, [
    bm1Query.data,
    bm2Query.data,
    bm3Query.data,
    bm4Query.data,
    bm5Query.data,
    bm6Query.data,
    bm7Query.data,
    bm8Query.data,
    bm9Query.data,
    bm10Query.data,
    bm11Query.data,
    bm12Query.data,
    bm13Query.data,
  ]);

  // Loading and error states
  const isLoading =
    bm1Query.isLoading ||
    bm2Query.isLoading ||
    bm3Query.isLoading ||
    bm4Query.isLoading ||
    bm5Query.isLoading ||
    bm6Query.isLoading ||
    bm7Query.isLoading ||
    bm8Query.isLoading ||
    bm9Query.isLoading ||
    bm10Query.isLoading ||
    bm11Query.isLoading ||
    bm12Query.isLoading ||
    bm13Query.isLoading;
  const error =
    bm1Query.error ||
    bm2Query.error ||
    bm3Query.error ||
    bm4Query.error ||
    bm5Query.error ||
    bm6Query.error ||
    bm7Query.error ||
    bm8Query.error ||
    bm9Query.error ||
    bm10Query.error ||
    bm11Query.error ||
    bm12Query.error ||
    bm13Query.error;

  // Helper function to get category from document type
  const getCategoryFromType = useCallback((type: string) => {
    // Simple mapping based on BM types
    if (type.startsWith("BM")) return "form";
    return "other";
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "created":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Process API data
  const formTemplates = useMemo(() => {
    console.log("API Response:", documentsData);
    if (!documentsData?.data?.["data-list"]) {
      console.log("No data-list found in API response");
      return [];
    }

    const templates = documentsData.data["data-list"].map(
      (doc: DocumentForm): ProcessedFormTemplate => ({
        ...doc, // Spread all DocumentForm properties
        description: "No description available", // Additional field
        category: getCategoryFromType(doc.type), // Additional field
        lastModified: doc["updated-at"] || doc["upload-at"], // Additional field
        createdDate: doc["upload-at"], // Additional field
        usageCount: 0, // Additional field
        content: doc["content-html"], // Additional field
      })
    );

    console.log("Processed templates:", templates);
    return templates;
  }, [documentsData, getCategoryFromType]);

  // Filter forms based on search and category
  const filteredForms = useMemo(() => {
    if (!formTemplates.length) return [];

    return formTemplates.filter((form) => {
      const matchesCategory =
        categoryFilter === "all" || form.category === categoryFilter;
      const matchesSearch =
        form.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        form.description.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [formTemplates, globalFilter, categoryFilter]);

  // Handler functions - Open TinyMCE dialog
  const handleViewDetails = useCallback((form: ProcessedFormTemplate) => {
    setSelectedTemplate(form);
    setEditorContent(form["content-html"] || "");
    setIsEditorDialogOpen(true);

    // Set editor content after dialog opens
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setContent(form["content-html"] || "");
      }
    }, 100);
  }, []);

  const handleEditForm = useCallback((form: ProcessedFormTemplate) => {
    setSelectedTemplate(form);
    setEditorContent(form["content-html"] || "");
    setIsEditorDialogOpen(true);

    // Set editor content after dialog opens
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setContent(form["content-html"] || "");
      }
    }, 100);
  }, []);

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    const content = editorRef.current?.getContent() || editorContent;

    try {
      await updateDocumentMutation.mutateAsync({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        type: selectedTemplate.type,
        "content-html": content,
        status: selectedTemplate.status,
        "is-template": true,
        "project-id": selectedTemplate["project-id"],
      });

      setIsEditorDialogOpen(false);
      setSelectedTemplate(null);
      setEditorContent("");

      // Refetch data to show updated template
      // The queries will automatically refetch due to mutation success
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorDialogOpen(false);
    setSelectedTemplate(null);
    setEditorContent("");
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
              onClick={() => handleEditForm(row.original)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails, handleEditForm]
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
      const searchString =
        `${form.name} ${form.description} ${form.category}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const EditorDialog = () => (
    <Dialog open={isEditorDialogOpen} onOpenChange={setIsEditorDialogOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {selectedTemplate
              ? `Edit Template: ${selectedTemplate.name}`
              : "Template Editor"}
          </DialogTitle>
          <DialogDescription>
            Edit the template content using the rich text editor below
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <div className="h-[500px] border rounded-md overflow-hidden">
            <ScientificCVEditor
              ref={editorRef}
              value={editorContent}
              onChange={setEditorContent}
              height={480}
              preset="document"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center gap-2">
          <div className="flex-1 text-sm text-gray-500">
            {selectedTemplate && (
              <span>
                Type: {selectedTemplate.type} | Status:{" "}
                {selectedTemplate.status}
              </span>
            )}
          </div>
          <Button variant="outline" onClick={handleCloseEditor}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveTemplate}
            disabled={updateDocumentMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateDocumentMutation.isPending ? "Saving..." : "Save Template"}
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
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loading />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-red-400" />
                    <p className="text-lg font-medium">Error loading forms</p>
                    <p className="text-sm text-gray-400">
                      Please try again later
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                      {globalFilter
                        ? "Try adjusting your search criteria"
                        : "Get started by adding your first form"}
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
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
                (pageIndex) => (
                  <Button
                    key={pageIndex}
                    variant={
                      table.getState().pagination.pageIndex === pageIndex
                        ? "default"
                        : "outline"
                    }
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
                )
              )}
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
      <EditorDialog />
    </div>
  );
};

export default DocumentFormsManagement;
