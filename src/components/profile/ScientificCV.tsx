import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  useScientificCV,
  useDeleteDocument,
} from "@/hooks/queries/useDocuments";
import { toast } from "sonner";

interface ScientificCVProps {
  className?: string;
}

export const ScientificCV: React.FC<ScientificCVProps> = ({ className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's Scientific CV
  const {
    data: scientificCV,
    isLoading,
    error,
  } = useScientificCV(user?.id || "");

  // Mutations
  const deleteDocument = useDeleteDocument();

  const handleCreateCV = () => {
    navigate("/profile/scientific-cv/create");
  };

  const handleViewCV = () => {
    navigate("/profile/scientific-cv/view");
  };

  const handleEditCV = () => {
    navigate("/profile/scientific-cv/edit");
  };

  const handleDeleteCV = () => {
    if (!scientificCV?.id) return;

    deleteDocument.mutate(scientificCV.id, {
      onSuccess: () => {
        toast.success("Scientific CV deleted successfully!");
      },
      onError: (error) => {
        console.error("Failed to delete Scientific CV:", error);
        toast.error("Failed to delete Scientific CV");
      },
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Scientific CV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no CV exists, show create button
  if (!scientificCV && !error) {
    return (
      <>
        <Card className={className}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Scientific CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                You haven't created your Scientific CV yet.
              </p>
              <Button
                onClick={handleCreateCV}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Scientific CV
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // If CV exists, show CV info and action buttons
  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Scientific CV
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Created
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* CV Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">
                  📘 Scientific CV Created
                </h4>
                <Badge variant="outline" className="text-xs">
                  {scientificCV && scientificCV.status
                    ? scientificCV.status.charAt(0).toUpperCase() +
                      scientificCV.status.slice(1)
                    : "Created"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created:{" "}
                    {scientificCV?.uploadAt || scientificCV?.["upload-at"]
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
                    {scientificCV?.updatedAt || scientificCV?.["updated-at"]
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleViewCV}
                className="flex-1 sm:flex-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Scientific CV
              </Button>
              <Button
                variant="outline"
                onClick={handleEditCV}
                className="flex-1 sm:flex-none"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      onClick={handleDeleteCV}
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
        </CardContent>
      </Card>
    </>
  );
};
