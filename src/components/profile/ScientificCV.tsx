import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Edit,
  Calendar,
  User,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { getAuthResponse } from "@/utils/cookie-manager";
import {
  useScientificCVByEmail,
  useDeleteDocumentById,
} from "@/hooks/queries/document";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { useQueryClient } from "@tanstack/react-query";

interface ScientificCVProps {
  className?: string;
}

export const ScientificCV: React.FC<ScientificCVProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get email from auth response cookie
  const authResponse = getAuthResponse<{ email: string }>();
  const userEmail = authResponse?.email || "";

  // Fetch user's Scientific CV by email
  const {
    data: scientificCV,
    isLoading,
    error,
    refetch: refetchScientificCV,
  } = useScientificCVByEmail(userEmail, !!userEmail);

  const deleteDocument = useDeleteDocumentById();

  const handleViewCV = () => {
    navigate("/profile/scientific-cv/view");
  };

  const handleEditCV = () => {
    navigate("/profile/scientific-cv/edit");
  };

  const handleCreateCV = () => {
    navigate("/profile/scientific-cv/create");
  };

  // const handleDeleteConfirm = async () => {
  //   if (!scientificCV?.data?.id) {
  //     toast.error("Scientific CV not found");
  //     return;
  //   }

  //   setIsDeleting(true);
  //   setDeleteDialogOpen(false);

  //   deleteDocument.mutate(scientificCV.data.id, {
  //     onSuccess: () => {
  //       toast.success("Scientific CV deleted successfully!");
  //       refetchScientificCV();
  //     },
  //     onError: (error) => {
  //       console.error("Failed to delete Scientific CV:", error);
  //       toast.error("Failed to delete Scientific CV");
  //     },
  //     onSettled: () => {
  //       setIsDeleting(false);
  //     },
  //   });
  // };
  const handleDeleteConfirm = async () => {
    if (!scientificCV?.data?.id) {
      toast.error("Scientific CV not found");
      return;
    }

    setIsDeleting(true);
    setDeleteDialogOpen(false);

    deleteDocument.mutate(scientificCV.data.id, {
      onSuccess: () => {
        toast.success("Scientific CV deleted successfully!");
        // Force remove cache and refetch
        queryClient.removeQueries({
          queryKey: ["scientificCV"],
        });
        queryClient.invalidateQueries({
          queryKey: ["scientificCV"],
        });
        // Force immediate refetch
        refetchScientificCV();
      },
      onError: (error) => {
        console.error("Failed to delete Scientific CV:", error);
        toast.error("Failed to delete Scientific CV");
      },
      onSettled: () => {
        setIsDeleting(false);
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

  // Check for 404 error or no CV data
  const is404Error = error && scientificCV?.status === 404;
  const shouldShowCreate = !scientificCV || is404Error;

  if (shouldShowCreate) {
    return (
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
    );
  }

  // If CV exists, show CV info and action buttons
  return (
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
                {scientificCV?.data.status
                  ? String(scientificCV.data.status).charAt(0).toUpperCase() +
                    String(scientificCV.data.status).slice(1)
                  : "Created"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created:{" "}
                  {scientificCV?.data["upload-at"]
                    ? format(
                        new Date(scientificCV.data["upload-at"]),
                        "MMM dd, yyyy"
                      )
                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  Last updated:{" "}
                  {scientificCV?.data["updated-at"]
                    ? format(
                        new Date(scientificCV.data["updated-at"]),
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
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none text-red-600 border-red-300 hover:bg-red-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Scientific CV</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete your Scientific CV? This
                    action is permanent and cannot be undone. All your CV data
                    will be lost.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete CV"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
