import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ProgressReport } from "../shared/types";
import { formatDateTime } from "../shared/utils";
import { UserRole, useAuth } from "@/contexts/AuthContext";

const ProgressTab: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(
    null
  );

  useEffect(() => {
    loadProgressReports();
  }, []);

  const loadProgressReports = async () => {
    try {
      setTimeout(() => {
        const mockReports: ProgressReport[] = [
          {
            id: "1",
            formCode: "BM06",
            title: "Q1 2024 Progress Report",
            submittedAt: "2024-03-31T23:59:00Z",
            status: "Approved",
            file: "q1-2024-progress-report.pdf",
            approvedBy: "Dr. Review Committee",
            feedback:
              "Excellent progress on all milestones. Keep up the good work.",
          },
          {
            id: "2",
            formCode: "BM06",
            title: "Q2 2024 Progress Report",
            submittedAt: "2024-06-30T23:59:00Z",
            status: "Processing",
            file: "q2-2024-progress-report.pdf",
          },
          {
            id: "3",
            formCode: "BM06",
            title: "Q3 2024 Progress Report",
            submittedAt: "2024-09-30T23:59:00Z",
            status: "Rejected",
            file: "q3-2024-progress-report.pdf",
            feedback:
              "Please provide more detailed analysis of the experimental results and revise the methodology section.",
          },
          {
            id: "4",
            formCode: "BM06",
            title: "Q4 2024 Progress Report",
            submittedAt: "",
            status: "Draft",
          },
        ];
        setReports(mockReports);
      }, 1000);
    } catch (error) {
      console.error("Error loading progress reports:", error);
    }
  };

  const handleViewReport = (report: ProgressReport) => {
    setSelectedReport(report);
    setShowViewDialog(true);
  };

  const handleCreateForm = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate("/pi/forms");
    } else if (user?.role === UserRole.MEMBER) {
      navigate("/member/forms");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Processing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Submitted":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
      case "submitted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Progress Reports
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Form BM06 - Submit and track progress reports
            </CardDescription>
          </div>
          <Button
            onClick={handleCreateForm}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Form</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <FileText className="w-3 h-3 mr-1" />
            BM06
          </Badge>
          <span className="text-sm text-muted-foreground">
            Progress Report Form
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sm:w-[300px]">
                  Report
                </TableHead>
                <TableHead className="min-w-[120px]">Submitted</TableHead>
                <TableHead className="min-w-[120px]">Approved By</TableHead>
                <TableHead className="text-right min-w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <div>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {report.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Form {report.formCode}
                          </p>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              report.status
                            )} text-xs`}
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.submittedAt
                      ? formatDateTime(report.submittedAt)
                      : "Not submitted"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.approvedBy || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      {report.file && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("Downloading report...");
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {reports.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No progress reports submitted yet.
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              Progress Report Details - Form {selectedReport?.formCode}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.submittedAt
                      ? formatDateTime(selectedReport.submittedAt)
                      : "Not submitted"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedReport.status)}
                    >
                      {selectedReport.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Approved By</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.approvedBy || "Pending"}
                  </p>
                </div>
              </div>

              {selectedReport.file && (
                <div>
                  <p className="text-sm font-medium">Attached File</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{selectedReport.file}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {selectedReport.feedback && (
                <div>
                  <p className="text-sm font-medium">Feedback</p>
                  <div
                    className={`mt-1 p-3 rounded-lg ${
                      selectedReport.status === "Approved"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        selectedReport.status === "Approved"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {selectedReport.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProgressTab;
