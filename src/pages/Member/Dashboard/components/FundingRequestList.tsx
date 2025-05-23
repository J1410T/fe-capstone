import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FundingRequestForm } from "./FundingRequestForm";
import {
  Plus,
  DollarSign,
  Calendar,
  User,
  FileText,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Mock funding request data
interface FundingRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  approvedBy?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  documents?: {
    name: string;
    url: string;
    size: string;
  }[];
}

const mockRequests: FundingRequest[] = [
  {
    id: "1",
    title: "Research Equipment Purchase",
    description:
      "High-performance computing equipment for data analysis and machine learning research",
    amount: 15000,
    reason:
      "Current equipment is outdated and insufficient for complex computational tasks",
    status: "Approved",
    createdAt: "2024-01-15T10:00:00Z",
    approvedBy: {
      id: "leader1",
      name: "Dr. Michael Rodriguez",
      role: "Principal Investigator",
      avatar: "",
    },
    documents: [
      { name: "Equipment_Specifications.pdf", url: "#", size: "2.4 MB" },
      { name: "Vendor_Quotes.pdf", url: "#", size: "1.8 MB" },
    ],
  },
  {
    id: "2",
    title: "Conference Attendance",
    description: "Attendance at International AI Research Conference 2024",
    amount: 3500,
    reason: "Present research findings and network with industry experts",
    status: "Pending",
    createdAt: "2024-01-20T14:30:00Z",
    documents: [{ name: "Conference_Details.pdf", url: "#", size: "1.2 MB" }],
  },
  {
    id: "3",
    title: "Software Licensing",
    description: "Annual license for specialized data analysis software",
    amount: 2800,
    reason: "Required for ongoing research projects and data processing",
    status: "Rejected",
    createdAt: "2024-01-10T09:15:00Z",
    approvedBy: {
      id: "leader2",
      name: "Dr. Emily Johnson",
      role: "Department Head",
      avatar: "",
    },
  },
  {
    id: "4",
    title: "Research Materials",
    description: "Laboratory supplies and materials for experimental research",
    amount: 1200,
    reason: "Consumables needed for ongoing experiments",
    status: "Approved",
    createdAt: "2024-01-05T11:20:00Z",
    approvedBy: {
      id: "leader1",
      name: "Dr. Michael Rodriguez",
      role: "Principal Investigator",
      avatar: "",
    },
  },
  {
    id: "5",
    title: "Travel Expenses",
    description: "Travel costs for field research data collection",
    amount: 4200,
    reason: "Data collection at remote research sites",
    status: "Pending",
    createdAt: "2024-01-25T16:45:00Z",
    documents: [
      { name: "Travel_Itinerary.pdf", url: "#", size: "0.8 MB" },
      { name: "Research_Plan.pdf", url: "#", size: "3.1 MB" },
    ],
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Approved":
      return {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        iconColor: "text-green-600",
      };
    case "Rejected":
      return {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        iconColor: "text-red-600",
      };
    case "Pending":
      return {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        iconColor: "text-yellow-600",
      };
    default:
      return {
        color: "bg-slate-100 text-slate-700",
        icon: AlertCircle,
        iconColor: "text-slate-600",
      };
  }
};

export const FundingRequestList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requests, setRequests] = useState<FundingRequest[]>(mockRequests);

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    if (activeTab === "all") return true;
    return request.status.toLowerCase() === activeTab;
  });

  const handleCreateRequest = (newRequest: any) => {
    const request: FundingRequest = {
      ...newRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
    setRequests((prev) => [request, ...prev]);
    setIsFormOpen(false);
  };

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
    totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
    approvedAmount: requests
      .filter((r) => r.status === "Approved")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Funding Requests
          </h2>
          <p className="text-sm text-slate-600">
            Manage your funding requests and track approval status
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Funding Request
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-sm font-medium text-slate-600">
                  Total Requests
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {stats.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-slate-600">
                  Pending
                </div>
                <div className="text-xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-slate-600">
                  Approved
                </div>
                <div className="text-xl font-bold text-green-600">
                  {stats.approved}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-slate-600">
                  Approved Amount
                </div>
                <div className="text-xl font-bold text-green-600">
                  ${stats.approvedAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request List with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredRequests.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="w-12 h-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No {activeTab === "all" ? "" : activeTab} requests found
                </h3>
                <p className="text-sm text-slate-500 text-center">
                  {activeTab === "all"
                    ? "You haven't created any funding requests yet"
                    : `You don't have any ${activeTab} funding requests`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={request.id}
                  className="border-slate-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">
                            {request.title}
                          </h3>
                          <Badge className={statusConfig.color}>
                            <StatusIcon
                              className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`}
                            />
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {request.description}
                        </p>
                        <p className="text-sm text-slate-700 mb-4">
                          <span className="font-medium">Reason:</span>{" "}
                          {request.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          ${request.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Request Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created:{" "}
                          {format(parseISO(request.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>

                      {request.approvedBy && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>
                            {request.status === "Approved"
                              ? "Approved"
                              : "Reviewed"}{" "}
                            by:
                          </span>
                          <div className="flex items-center space-x-1">
                            <Avatar className="w-5 h-5">
                              <AvatarImage
                                src={request.approvedBy.avatar}
                                alt={request.approvedBy.name}
                              />
                              <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                {request.approvedBy.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {request.approvedBy.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    {request.documents && request.documents.length > 0 && (
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">
                            Attached Documents
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {doc.name} ({doc.size})
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request ID */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-mono">
                        Request ID: #{request.id}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Create Funding Request Form */}
      <FundingRequestForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onCreate={handleCreateRequest}
      />
    </div>
  );
};
