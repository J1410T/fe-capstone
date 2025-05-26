import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Plus,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { ProgressReport } from "../shared/types";
import { StatusBadge, FileUpload } from "../shared/components";
import { formatDateTime } from "../shared/utils";
import { FileUpload as FileUploadType } from "../shared/types";
import { toast } from "sonner";

const ProgressReports: React.FC = () => {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(
    null
  );
  const [files, setFiles] = useState<FileUploadType[]>([]);

  const [reportForm, setReportForm] = useState({
    title: "",
    period: "",
    content: "",
  });

  useEffect(() => {
    loadProgressReports();
  }, []);

  const loadProgressReports = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockReports: ProgressReport[] = [
          {
            id: "1",
            formCode: "BM06",
            title: "Q1 2024 Progress Report",
            period: "January - March 2024",
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
            period: "April - June 2024",
            submittedAt: "2024-06-30T23:59:00Z",
            status: "Processing",
            file: "q2-2024-progress-report.pdf",
          },
          {
            id: "3",
            formCode: "BM06",
            title: "Q3 2024 Progress Report",
            period: "July - September 2024",
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
            period: "October - December 2024",
            submittedAt: "",
            status: "Draft",
          },
        ];
        setReports(mockReports);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading progress reports:", error);
      setIsLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!reportForm.title || !reportForm.period || !reportForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload the progress report file");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newReport: ProgressReport = {
          id: `report_${Date.now()}`,
          formCode: "BM06",
          title: reportForm.title,
          period: reportForm.period,
          submittedAt: new Date().toISOString(),
          status: "Submitted",
          file: files[0].name,
        };

        setReports((prev) => [...prev, newReport]);
        setReportForm({ title: "", period: "", content: "" });
        setFiles([]);
        setShowCreateDialog(false);
        toast.success("Progress report submitted successfully");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Failed to submit progress report");
      setIsLoading(false);
    }
  };

  const handleViewReport = (report: ProgressReport) => {
    setSelectedReport(report);
    setShowViewDialog(true);
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
        return <Upload className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusStats = () => {
    return {
      total: reports.length,
      approved: reports.filter((r) => r.status === "Approved").length,
      processing: reports.filter((r) => r.status === "Processing").length,
      rejected: reports.filter((r) => r.status === "Rejected").length,
      draft: reports.filter((r) => r.status === "Draft").length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Progress Reports
            </h1>
            <p className="text-muted-foreground">
              Form BM06 - Submit and track progress reports
            </p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Progress Report</DialogTitle>
              <DialogDescription>
                Submit a new progress report (BM06) for your research project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title *</Label>
                <Input
                  id="report-title"
                  value={reportForm.title}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., Q1 2024 Progress Report"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-period">Reporting Period *</Label>
                <Input
                  id="report-period"
                  value={reportForm.period}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      period: e.target.value,
                    }))
                  }
                  placeholder="e.g., January - March 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-content">Summary *</Label>
                <Textarea
                  id="report-content"
                  value={reportForm.content}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Provide a brief summary of the progress made during this period"
                  rows={4}
                />
              </div>
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                maxFiles={1}
                label="Upload Progress Report *"
                description="PDF, DOC, DOCX up to 10MB"
                accept=".pdf,.doc,.docx"
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateReport} disabled={isLoading}>
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Form Badge */}
      <div className="flex items-center space-x-2">
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Reports History</CardTitle>
          <CardDescription>
            Track the status of all submitted progress reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Form {report.formCode}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>
                    {report.submittedAt
                      ? formatDateTime(report.submittedAt)
                      : "Not submitted"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>{report.approvedBy || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {report.file && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In real app, this would download the file
                            toast.success("Downloading report...");
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
        </CardContent>
      </Card>

      {/* View Report Dialog */}
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
                  <Label className="text-sm font-medium">Period</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.period}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.submittedAt
                      ? formatDateTime(selectedReport.submittedAt)
                      : "Not submitted"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Approved By</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.approvedBy || "Pending"}
                  </p>
                </div>
              </div>

              {selectedReport.file && (
                <div>
                  <Label className="text-sm font-medium">Attached File</Label>
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
                  <Label className="text-sm font-medium">Feedback</Label>
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
    </div>
  );
};

export default ProgressReports;
