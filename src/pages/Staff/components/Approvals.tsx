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
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  Eye,
  CheckCircle,
  Clock,
  Download,
  Search,
  Star,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Building,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { formatVND } from "@/utils";

// Mock data for proposals
const proposals = [
  {
    id: 1,
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    institution: "Stanford University",
    department: "Computer Science",
    submittedDate: "2024-01-15",
    budget: 6000000000, // ~250K USD in VND
    duration: "24 months",
    status: "pending",
    priority: "high",
    category: "Applied Research",
    score: null,
    reviewers: ["Dr. Smith", "Dr. Brown"],
    description:
      "Development of machine learning algorithms for accelerated drug discovery...",
  },
  {
    id: 2,
    title: "Sustainable Energy Storage Solutions",
    pi: "Dr. Michael Chen",
    institution: "MIT",
    department: "Materials Science",
    submittedDate: "2024-01-12",
    budget: 4320000000, // ~180K USD in VND
    duration: "18 months",
    status: "under_review",
    priority: "medium",
    category: "Basic Research",
    score: 8.5,
    reviewers: ["Dr. Wilson", "Dr. Davis"],
    description:
      "Research into novel battery technologies for renewable energy storage...",
  },
  {
    id: 3,
    title: "Climate Change Impact on Marine Ecosystems",
    pi: "Dr. Emily Rodriguez",
    institution: "UC San Diego",
    department: "Marine Biology",
    submittedDate: "2024-01-10",
    budget: 7680000000, // ~320K USD in VND
    duration: "36 months",
    status: "approved",
    priority: "high",
    category: "Environmental Science",
    score: 9.2,
    reviewers: ["Dr. Thompson", "Dr. Lee"],
    description:
      "Comprehensive study of climate change effects on marine biodiversity...",
  },
];

const ProjectApprovals: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState<
    (typeof proposals)[0] | null
  >(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    score: "",
    comments: "",
    recommendation: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter proposals based on status and search
  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
      const matchesSearch =
        proposal.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        proposal.pi.toLowerCase().includes(globalFilter.toLowerCase()) ||
        proposal.institution.toLowerCase().includes(globalFilter.toLowerCase()) ||
        proposal.category.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, globalFilter]);

  // Handler functions
  const handleViewDetails = useCallback((proposal: (typeof proposals)[0]) => {
    setSelectedProposal(proposal);
    setIsViewDialogOpen(true);
  }, []);

  const handleReview = useCallback((proposal: (typeof proposals)[0]) => {
    setSelectedProposal(proposal);
    setIsReviewDialogOpen(true);
  }, []);

  // Table columns definition
  const columns = useMemo<ColumnDef<(typeof proposals)[0]>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Project Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="min-w-0 max-w-[280px]">
            <div className="font-medium truncate">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <User className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{row.original.pi}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "institution",
        header: "Institution",
        cell: ({ row }) => (
          <div className="flex items-center min-w-0 max-w-[200px]">
            <Building className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium truncate">{row.getValue("institution")}</div>
              <div className="text-sm text-muted-foreground truncate">{row.original.department}</div>
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
              {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const priority = row.getValue("priority") as string;
          return (
            <Badge className={getPriorityColor(priority)}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{formatVND(row.getValue("budget"))}</span>
          </div>
        ),
      },
      {
        accessorKey: "submittedDate",
        header: "Submitted",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
            {new Date(row.getValue("submittedDate")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => {
          const score = row.getValue("score") as number | null;
          return score ? (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-medium">{score}/10</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Not scored</span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {row.original.status === "pending" && (
              <Button
                size="sm"
                onClick={() => handleReview(row.original)}
                className="h-8 px-2"
              >
                <ClipboardList className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-8 px-2">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails, handleReview]
  );

  // Create table instance
  const table = useReactTable({
    data: filteredProposals,
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
      const proposal = row.original;
      const searchString = `${proposal.title} ${proposal.pi} ${proposal.institution} ${proposal.category}`.toLowerCase();
      return searchString.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });



  const ReviewDialog = () => (
    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Proposal</DialogTitle>
          <DialogDescription>
            Provide your evaluation for: {selectedProposal?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="score">Score (1-10)</Label>
            <Input
              id="score"
              type="number"
              min="1"
              max="10"
              value={reviewData.score}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, score: e.target.value }))
              }
              placeholder="Enter score"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation">Recommendation</Label>
            <Select
              value={reviewData.recommendation}
              onValueChange={(value) =>
                setReviewData((prev) => ({ ...prev, recommendation: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="approve_with_conditions">
                  Approve with Conditions
                </SelectItem>
                <SelectItem value="request_revisions">
                  Request Revisions
                </SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={reviewData.comments}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, comments: e.target.value }))
              }
              placeholder="Provide detailed feedback..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsReviewDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Review submitted:", reviewData);
              setIsReviewDialogOpen(false);
              setReviewData({ score: "", comments: "", recommendation: "" });
            }}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ProposalDetailDialog = () => (
    <Dialog
      open={isViewDialogOpen}
      onOpenChange={setIsViewDialogOpen}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedProposal?.title}</DialogTitle>
          <DialogDescription>Detailed proposal information</DialogDescription>
        </DialogHeader>
        {selectedProposal && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Principal Investigator</Label>
                <p>{selectedProposal.pi}</p>
              </div>
              <div>
                <Label className="font-semibold">Institution</Label>
                <p>{selectedProposal.institution}</p>
              </div>
              <div>
                <Label className="font-semibold">Department</Label>
                <p>{selectedProposal.department}</p>
              </div>
              <div>
                <Label className="font-semibold">Category</Label>
                <p>{selectedProposal.category}</p>
              </div>
              <div>
                <Label className="font-semibold">Budget</Label>
                <p>{formatVND(selectedProposal.budget)}</p>
              </div>
              <div>
                <Label className="font-semibold">Duration</Label>
                <p>{selectedProposal.duration}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="font-semibold">Description</Label>
              <p className="mt-2 text-sm">{selectedProposal.description}</p>
            </div>

            <div>
              <Label className="font-semibold">Reviewers</Label>
              <div className="flex space-x-2 mt-2">
                {selectedProposal.reviewers.map((reviewer, index) => (
                  <Badge key={index} variant="outline">
                    {reviewer}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          {selectedProposal?.status === "pending" && (
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsReviewDialogOpen(true);
            }}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Review Proposal
            </Button>
          )}
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
            Project Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and approve project proposals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="w-4 h-4 mr-1" />
            {proposals.filter((p) => p.status === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Eye className="w-4 h-4 mr-1" />
            {proposals.filter((p) => p.status === "under_review").length} Under Review
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            {proposals.filter((p) => p.status === "approved").length} Approved
          </Badge>
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
                  placeholder="Search proposals..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Proposals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed"
            style={{ minWidth: '1000px' }}>
          <TableHeader>
            <TableRow className="bg-white border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-900 py-3 px-3 text-left bg-gray-50/50"
                    style={{
                      width: index === 0 ? '30%' : // Project Title
                             index === 1 ? '20%' : // Institution
                             index === 2 ? '10%' : // Status
                             index === 3 ? '8%' :  // Priority
                             index === 4 ? '12%' : // Budget
                             index === 5 ? '10%' : // Submitted
                             index === 6 ? '8%' :  // Score
                             '12%' // Actions
                    }}
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
                  className="hover:bg-teal-50/50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-3 text-gray-900"
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
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                    <p className="text-lg font-medium">No proposals found</p>
                    <p className="text-sm text-gray-400">
                      {globalFilter ? "Try adjusting your search criteria" : "No proposals to review"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>

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
                      ? "bg-teal-600 text-white hover:bg-teal-700"
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

      <ReviewDialog />
      <ProposalDetailDialog />
    </div>
  );
};

export default ProjectApprovals;
