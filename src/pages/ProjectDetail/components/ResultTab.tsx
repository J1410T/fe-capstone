import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Upload,
  Link,
  ExternalLink,
  Save,
  AlertCircle,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/utils";
import {
  useProjectResult,
  useCreateProjectResult,
  useUpdateProjectResult,
  useUploadFileToAzure,
  type ProjectResult,
  type ResultPublish,
} from "@/hooks/queries/projectResult";

// Types are now imported from hooks

interface ResultTabProps {
  projectId: string;
  category: string; // "basic" or "application"
}

const ResultTab: React.FC<ResultTabProps> = ({ projectId, category }) => {
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [editingPublish, setEditingPublish] = useState<ResultPublish | null>(
    null
  );

  // API hooks
  const { data: projectResultResponse, refetch } = useProjectResult(projectId);
  const createProjectResult = useCreateProjectResult();
  const updateProjectResult = useUpdateProjectResult();
  const uploadFileToAzure = useUploadFileToAzure();

  const projectResult = projectResultResponse?.success
    ? projectResultResponse.data
    : null;

  // Debug logging
  console.log("ResultTab - projectResultResponse:", projectResultResponse);
  console.log("ResultTab - projectResult:", projectResult);
  console.log("ResultTab - projectId:", projectId);

  // Form states
  const [resultName, setResultName] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [publishForm, setPublishForm] = useState<Partial<ResultPublish>>({
    url: "",
    title: "",
    description: "",
    publisher: "",
    "publication-date": new Date().toISOString().split("T")[0],
    "access-type": "Open Access",
    tags: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryLower = category?.toLowerCase() || "";
  const isBasicCategory = categoryLower === "basic";
  const isApplicationCategory =
    categoryLower === "application" ||
    categoryLower === "implementation" ||
    categoryLower.includes("application") ||
    categoryLower.includes("implementation");

  // Data is automatically loaded via useProjectResult hook

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    if (!file.name.endsWith(".zip")) {
      toast.error("Only ZIP files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      // 30MB
      toast.error("File size must be under 30MB");
      return;
    }

    try {
      const uploadResponse = await uploadFileToAzure.mutateAsync(file);
      setResultUrl(uploadResponse.url);
    } catch (error) {
      console.error("Failed to upload file:", error);
      // Error is already handled by the mutation
    }
  };

  const handleSaveResult = async () => {
    if (!resultName.trim()) {
      toast.error("Please enter result name");
      return;
    }

    if (!resultUrl.trim()) {
      toast.error(
        isApplicationCategory
          ? "Please upload a ZIP file"
          : "Please enter result URL"
      );
      return;
    }

    try {
      const resultData: ProjectResult = {
        id: projectResult?.id,
        name: resultName,
        url: resultUrl,
        "project-id": projectId,
        "added-date": new Date().toISOString(),
        ...(isBasicCategory && {
          "result-publishs": projectResult?.["result-publishs"] || [],
        }),
      };

      if (projectResult?.id) {
        // Update existing result
        await updateProjectResult.mutateAsync(resultData);
      } else {
        // Create new result
        await createProjectResult.mutateAsync(resultData);
      }

      setShowResultDialog(false);
      setResultName("");
      setResultUrl("");
      refetch(); // Refresh data
    } catch (error) {
      console.error("Failed to save project result:", error);
      // Error is already handled by the mutation
    }
  };

  const handleSavePublish = async () => {
    if (!publishForm.title?.trim() || !publishForm.url?.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const newPublish: ResultPublish = {
        ...(publishForm as ResultPublish),
        "publication-date":
          publishForm["publication-date"] || new Date().toISOString(),
      };

      let updatedPublishes: ResultPublish[];
      if (editingPublish?.id) {
        // Update existing
        updatedPublishes =
          projectResult?.["result-publishs"]?.map((p) =>
            p.id === editingPublish.id
              ? { ...newPublish, id: editingPublish.id }
              : p
          ) || [];
      } else {
        // Add new (without id for creation)
        updatedPublishes = [
          ...(projectResult?.["result-publishs"] || []),
          newPublish,
        ];
      }

      const updatedResult = {
        ...projectResult!,
        "result-publishs": updatedPublishes,
      };

      await updateProjectResult.mutateAsync(updatedResult);

      setShowPublishDialog(false);
      setEditingPublish(null);
      setPublishForm({
        url: "",
        title: "",
        description: "",
        publisher: "",
        "publication-date": new Date().toISOString().split("T")[0],
        "access-type": "Open Access",
        tags: "",
      });
      refetch(); // Refresh data
    } catch (error) {
      console.error("Failed to save publication:", error);
      // Error is already handled by the mutation
    }
  };

  const handleDeletePublish = async (publishId: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;

    try {
      const updatedPublishes =
        projectResult?.["result-publishs"]?.filter((p) => p.id !== publishId) ||
        [];
      const updatedResult = {
        ...projectResult!,
        "result-publishs": updatedPublishes,
      };

      await updateProjectResult.mutateAsync(updatedResult);
      refetch(); // Refresh data
    } catch (error) {
      console.error("Failed to delete publication:", error);
      // Error is already handled by the mutation
    }
  };

  const openEditPublish = (publish: ResultPublish) => {
    setEditingPublish(publish);
    setPublishForm(publish);
    setShowPublishDialog(true);
  };

  const openAddPublish = () => {
    setEditingPublish(null);
    setPublishForm({
      url: "",
      title: "",
      description: "",
      publisher: "",
      "publication-date": new Date().toISOString().split("T")[0],
      "access-type": "Open Access",
      tags: "",
    });
    setShowPublishDialog(true);
  };

  const openEditResult = () => {
    setResultName(projectResult?.name || "");
    setResultUrl(projectResult?.url || "");
    setShowResultDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Project Results
                </CardTitle>
                <CardDescription>
                  {isBasicCategory
                    ? "Manage project results and publications for basic research"
                    : "Upload project deliverables for application projects"}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {category?.charAt(0).toUpperCase() + category?.slice(1)} Project
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Project Result */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {isApplicationCategory ? "Project Deliverable" : "Project Result"}
            </CardTitle>
            <Button
              onClick={
                projectResult ? openEditResult : () => setShowResultDialog(true)
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {projectResult ? "Edit Result" : "Add Result"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projectResult && projectResult.id ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  {isApplicationCategory ? (
                    <FileArchive className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <Link className="h-5 w-5 text-green-600 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {projectResult.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Added: {formatDateTime(projectResult["added-date"])}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(projectResult.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {isApplicationCategory ? "Download" : "View"}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={openEditResult}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No result found</p>
              <p className="text-sm text-muted-foreground">
                {isApplicationCategory
                  ? "Upload your project deliverable (ZIP file under 30MB)"
                  : "Add your project result and publications"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publications (Only for Basic category) */}
      {isBasicCategory && projectResult && projectResult.id && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Publications
              </CardTitle>
              <Button
                onClick={openAddPublish}
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projectResult["result-publishs"]?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Publication Date</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectResult["result-publishs"].map((publish, index) => (
                    <TableRow key={publish.id || index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{publish.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {publish.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{publish.publisher}</TableCell>
                      <TableCell>
                        {new Date(
                          publish["publication-date"]
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {publish["access-type"]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(publish.url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditPublish(publish)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePublish(publish.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  No publications found
                </p>
                <p className="text-sm text-muted-foreground">
                  Add publications related to this project result
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {projectResult ? "Edit" : "Add"}{" "}
              {isApplicationCategory ? "Project Deliverable" : "Project Result"}
            </DialogTitle>
            <DialogDescription>
              {isApplicationCategory
                ? "Upload your project deliverable as a ZIP file (under 30MB)"
                : "Add your project result with URL and publications"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result Name *
              </label>
              <Input
                value={resultName}
                onChange={(e) => setResultName(e.target.value)}
                placeholder="Enter result name"
              />
            </div>

            {isApplicationCategory ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload ZIP File *
                </label>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadFileToAzure.isPending}
                    className="w-full"
                  >
                    {uploadFileToAzure.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose ZIP File
                      </>
                    )}
                  </Button>
                  {resultUrl && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                      <FileArchive className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        File uploaded successfully
                      </span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
                    <div>
                      <p>Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Only ZIP files are allowed</li>
                        <li>Maximum file size: 30MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result URL *
                </label>
                <Input
                  value={resultUrl}
                  onChange={(e) => setResultUrl(e.target.value)}
                  placeholder="https://example.com/project-result"
                  type="url"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResultDialog(false)}
              disabled={
                createProjectResult.isPending || updateProjectResult.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveResult}
              disabled={
                createProjectResult.isPending ||
                updateProjectResult.isPending ||
                uploadFileToAzure.isPending
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createProjectResult.isPending ||
              updateProjectResult.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Result
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publication Dialog (Only for Basic category) */}
      {isBasicCategory && (
        <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPublish ? "Edit" : "Add"} Publication
              </DialogTitle>
              <DialogDescription>
                Add publication details related to this project result
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={publishForm.title || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Publication title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <Input
                    value={publishForm.url || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/publication"
                    type="url"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={publishForm.description || ""}
                  onChange={(e) =>
                    setPublishForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Publication description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <Input
                    value={publishForm.publisher || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        publisher: e.target.value,
                      }))
                    }
                    placeholder="Publisher name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Date
                  </label>
                  <Input
                    type="date"
                    value={publishForm["publication-date"]?.split("T")[0] || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        "publication-date": e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Type
                  </label>
                  <Input
                    value={publishForm["access-type"] || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        "access-type": e.target.value,
                      }))
                    }
                    placeholder="Open Access, Subscription, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    value={publishForm.tags || ""}
                    onChange={(e) =>
                      setPublishForm((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    placeholder="AI, Climate Change, etc."
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPublishDialog(false)}
                disabled={updateProjectResult.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePublish}
                disabled={updateProjectResult.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updateProjectResult.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Publication
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ResultTab;
