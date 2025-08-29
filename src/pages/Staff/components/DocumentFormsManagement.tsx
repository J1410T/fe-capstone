import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Edit, Eye, Search, RefreshCw, FileText, Save } from "lucide-react";
import { Loading } from "@/components";
import {
  getAllDocumentTemplates,
  updateDocument,
} from "@/services/resources/document";
import { DocumentForm } from "@/types/document";
import {
  ScientificCVEditor,
  ScientificCVEditorRef,
} from "@/components/ui/TinyMCE";
import { toast } from "sonner";

const DocumentFormsManagement: React.FC = () => {
  // State
  const [templates, setTemplates] = useState<DocumentForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentForm | null>(
    null
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = React.useRef<ScientificCVEditorRef>(null);

  // Load templates
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDocumentTemplates(
        1,
        100,
        statusFilter === "all" ? undefined : statusFilter
      );
      setTemplates(response.data["data-list"] || []);
      console.log("Templates loaded:", response.data["data-list"]);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  // Load templates on mount and when filter changes
  useEffect(() => {
    loadTemplates();
  }, [statusFilter]);

  // Filter templates
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open editor
  const handleEdit = (template: DocumentForm) => {
    setSelectedTemplate(template);
    setEditorContent(template["content-html"] || "");
    setIsEditorOpen(true);

    // Set content in editor after dialog opens
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setContent(template["content-html"] || "");
      }
    }, 100);
  };

  // View template
  const handleView = (template: DocumentForm) => {
    setSelectedTemplate(template);
    setEditorContent(template["content-html"] || "");
    setIsEditorOpen(true);

    // Set content in editor after dialog opens
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setContent(template["content-html"] || "");
      }
    }, 100);
  };

  // Save template
  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      setIsSaving(true);
      const content = editorRef.current?.getContent() || editorContent;

      await updateDocument({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        type: selectedTemplate.type,
        "content-html": content,
        status: selectedTemplate.status,
        "is-template": true,
        "project-id": selectedTemplate["project-id"],
      });

      toast.success("Template saved successfully!");
      setIsEditorOpen(false);
      setSelectedTemplate(null);
      setEditorContent("");

      // Reload templates
      loadTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  // Close editor
  const handleClose = () => {
    setIsEditorOpen(false);
    setSelectedTemplate(null);
    setEditorContent("");
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "created":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Templates Management
          </h1>
          <p className="text-muted-foreground">
            Edit and manage document templates
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadTemplates}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filter */}
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
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loading />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">
                No templates found
              </p>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No templates available"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Type: {template.type}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Updated:{" "}
                        {new Date(template["updated-at"]).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(template)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {selectedTemplate
                ? `${selectedTemplate.name} (${selectedTemplate.type})`
                : "Template Editor"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? "Edit the template content below"
                : "Template content"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0">
            <div className="h-[500px] border rounded-md overflow-hidden">
              <ScientificCVEditor
                ref={editorRef}
                value={editorContent}
                onChange={setEditorContent}
                height={480}
                preset="document"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center gap-2">
            <div className="flex-1 text-sm text-gray-500">
              {selectedTemplate && (
                <span>
                  Type: {selectedTemplate.type} | Status:{" "}
                  {selectedTemplate.status}
                </span>
              )}
            </div>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentFormsManagement;
