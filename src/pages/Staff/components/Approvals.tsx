import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XCircle,
  Clock,
  Download,
  Filter,
  Search,
  Star,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";

// Mock data for proposals
const proposals = [
  {
    id: 1,
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    institution: "Stanford University",
    department: "Computer Science",
    submittedDate: "2024-01-15",
    budget: 250000,
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
    budget: 180000,
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
    budget: 320000,
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
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<
    (typeof proposals)[0] | null
  >(null);
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

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.pi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && proposal.status === "pending") ||
      (activeTab === "under_review" && proposal.status === "under_review") ||
      (activeTab === "approved" && proposal.status === "approved") ||
      (activeTab === "rejected" && proposal.status === "rejected");

    return matchesSearch && matchesTab;
  });

  const ProposalCard = ({ proposal }: { proposal: (typeof proposals)[0] }) => (
    <Card
      className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {proposal.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {proposal.pi} • {proposal.institution}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(proposal.status)}>
              {proposal.status.replace("_", " ")}
            </Badge>
            <Badge className={getPriorityColor(proposal.priority)}>
              {proposal.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {proposal.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <span className="ml-2 font-medium">
                ${proposal.budget.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 font-medium">{proposal.duration}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <span className="ml-2 font-medium">{proposal.submittedDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Score:</span>
              <span className="ml-2 font-medium">
                {proposal.score ? (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {proposal.score}/10
                  </div>
                ) : (
                  "Not scored"
                )}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedProposal(proposal)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {proposal.status === "pending" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedProposal(proposal);
                  setIsReviewDialogOpen(true);
                }}
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                Review
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      open={!!selectedProposal && !isReviewDialogOpen}
      onOpenChange={() => setSelectedProposal(null)}
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
                <p>${selectedProposal.budget.toLocaleString()}</p>
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
          <Button variant="outline" onClick={() => setSelectedProposal(null)}>
            Close
          </Button>
          {selectedProposal?.status === "pending" && (
            <Button onClick={() => setIsReviewDialogOpen(true)}>
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
            {proposals.filter((p) => p.status === "under_review").length} Under
            Review
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger
            value="under_review"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Under Review</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>Rejected</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>

          {filteredProposals.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No proposals found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ReviewDialog />
      <ProposalDetailDialog />
    </div>
  );
};

export default ProjectApprovals;
