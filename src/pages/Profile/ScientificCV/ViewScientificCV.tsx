import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  useScientificCV,
  useDeleteDocument,
} from "@/hooks/queries/useDocuments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ViewScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: scientificCV,
    isLoading,
    error,
  } = useScientificCV(user?.id || "");
  const deleteDocument = useDeleteDocument();

  const handleEdit = () => {
    navigate("/profile/scientific-cv/edit");
  };

  const handleDelete = () => {
    if (!scientificCV?.id) return;

    deleteDocument.mutate(scientificCV.id, {
      onSuccess: () => {
        toast.success("Scientific CV deleted successfully!");
        navigate("/profile");
      },
      onError: (error) => {
        console.error("Failed to delete Scientific CV:", error);
        toast.error("Failed to delete Scientific CV");
      },
    });
  };

  const handleBack = () => {
    // Go back to the previous page, or fallback to profile if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Scientific CV...</p>
        </div>
      </div>
    );
  }

  if (error || !scientificCV) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Scientific CV Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Your Scientific CV could not be found or may have been deleted.
          </p>
          <Button
            onClick={handleBack}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Scientific CV
                </h1>
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {scientificCV.status?.charAt(0).toUpperCase() +
                    scientificCV.status?.slice(1) || "Created"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Print/Download
              </Button>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Scientific CV</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your Scientific CV? This
                      action cannot be undone. You will be able to create a new
                      Scientific CV after deletion.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteDocument.isPending}
                    >
                      {deleteDocument.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* CV Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created:{" "}
                    {scientificCV.uploadAt || scientificCV["upload-at"]
                      ? format(
                          new Date(
                            scientificCV.uploadAt || scientificCV["upload-at"]
                          ),
                          "MMM dd, yyyy"
                        )
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    Last updated:{" "}
                    {scientificCV.updatedAt || scientificCV["updated-at"]
                      ? format(
                          new Date(
                            scientificCV.updatedAt || scientificCV["updated-at"]
                          ),
                          "MMM dd, yyyy"
                        )
                      : "Never"}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Document Type: BM2
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 print:p-0 print:max-w-none">
        <Card className="border-0 shadow-lg bg-white print:shadow-none print:border-none">
          <CardContent className="p-8 print:p-0">
            {/* CV Content */}
            <div
              className="prose max-w-none scientific-cv-content print:prose-print"
              dangerouslySetInnerHTML={{
                __html:
                  scientificCV.contentHtml ||
                  scientificCV["content-html"] ||
                  "",
              }}
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: "13px",
                lineHeight: "1.4",
                color: "#333",
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .scientific-cv-content {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
          .scientific-cv-content table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          .scientific-cv-content table td,
          .scientific-cv-content table th {
            border: 1px solid #222 !important;
            padding: 6px 8px !important;
          }
          .scientific-cv-content .dotted-line {
            border-bottom: 1px dotted #222 !important;
            display: inline-block !important;
            min-width: 120px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewScientificCV;
