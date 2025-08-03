import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  useScientificCV,
  useDeleteDocument,
} from "@/hooks/queries/useDocuments";
import { toast } from "sonner";
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
import { Loading } from "@/components";

const ViewScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: scientificCV,
    isLoading,
    error,
  } = useScientificCV(user?.id || "");
  const deleteDocument = useDeleteDocument();

  const handleBack = () => navigate("/profile");
  const handlePrint = () => window.print();
  const handleEdit = () => navigate("/profile/scientific-cv/edit");

  const handleDelete = () => {
    if (!scientificCV?.id) return;
    deleteDocument.mutate(scientificCV.id, {
      onSuccess: () => {
        toast.success("Scientific CV deleted successfully!");
        navigate("/profile");
      },
      onError: () => {
        toast.error("Failed to delete Scientific CV");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[800px]">
        <div className="text-center">
          <Loading className="w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (error || !scientificCV) {
    return (
      <div className="text-center py-12 text-gray-600">
        <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold">Scientific CV Not Found</h2>
        <p className="mb-4">Unable to load your Scientific CV document.</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white pt-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-5">
            <FileText className="w-5 h-5 text-emerald-600" />
            Scientific CV Document
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 ml-2">
              {scientificCV.status?.charAt(0).toUpperCase() +
                scientificCV.status?.slice(1) || "Created"}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex justify-between mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created:{" "}
                  {scientificCV.uploadAt
                    ? format(new Date(scientificCV.uploadAt), "MMM dd, yyyy")
                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  Last updated:{" "}
                  {scientificCV.updatedAt
                    ? format(new Date(scientificCV.updatedAt), "MMM dd, yyyy")
                    : "Never"}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Document Type: BM2
            </Badge>
          </div>

          <div
            className="prose max-w-none scientific-cv-content"
            dangerouslySetInnerHTML={{ __html: scientificCV.contentHtml || "" }}
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: "13px",
              lineHeight: "1.4",
              color: "#333",
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between flex-wrap gap-3 print:hidden">
        <Button
          variant="outline"
          onClick={handleBack}
          size="lg"
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button onClick={handlePrint} size="lg" className="px-6">
            <Download className="w-4 h-4 mr-2" />
            Print/Download
          </Button>

          <Button
            onClick={handleEdit}
            variant="outline"
            size="lg"
            className="px-6"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-600 px-6 hover:bg-red-50 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Scientific CV</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this document? This action
                  cannot be undone.
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

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
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
        }
      `}</style>
    </div>
  );
};

export default ViewScientificCV;
