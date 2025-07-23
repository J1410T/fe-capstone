import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FormMetadata, FormStatus, FORM_TYPES } from "./constants";
import { FormAPI } from "./api";
import { FormActions } from "@/components/forms/FormActions";
import { getStatusColor } from "@/utils/status";

const FormsOverview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [forms, setForms] = useState<FormMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "grouped">(
    "table"
  );
  const [groupedForms, setGroupedForms] = useState<
    Record<string, FormMetadata[]>
  >({});

  const previousPage = location.state?.from || "/pi/projects";

  const loadForms = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const formsData = await FormAPI.getForms(user.role);
      setForms(formsData);
    } catch (error) {
      console.error("Error loading forms:", error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load forms on component mount
  useEffect(() => {
    loadForms();
  }, [loadForms]);

  // Load grouped data for timeline and grouped views
  useEffect(() => {
    if (!user || viewMode === "table") return;

    const loadGroupedData = async () => {
      try {
        if (viewMode === "timeline") {
          const grouped = await FormAPI.getFormsGroupedByDate(user.role);
          setGroupedForms(grouped);
        } else if (viewMode === "grouped") {
          const grouped = await FormAPI.getFormsGroupedByType(user.role);
          setGroupedForms(grouped);
        }
      } catch (error) {
        console.error("Error loading grouped forms:", error);
      }
    };

    loadGroupedData();
  }, [viewMode, user]);

  // Filter forms based on search and filters
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.formType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || form.status === statusFilter;
      const matchesType = typeFilter === "all" || form.formType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [forms, searchTerm, statusFilter, typeFilter]);

  // Handle back navigation
  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(previousPage);
    } else {
      navigate(-1);
    }
  };

  // Get status icon
  const getStatusIcon = (status: FormStatus) => {
    switch (status) {
      case FormStatus.DRAFT:
        return <Edit className="w-4 h-4" />;
      case FormStatus.SUBMITTED:
        return <CheckCircle className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_PI:
        return <Clock className="w-4 h-4" />;
      case FormStatus.WAITING_FOR_STAFF:
        return <Clock className="w-4 h-4" />;
      case FormStatus.FINALIZED:
        return <CheckCircle className="w-4 h-4" />;
      case FormStatus.VIEW_ONLY:
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Handle form actions
  const handleViewForm = (form: FormMetadata) => {
    const basePath =
      user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "/pi" : "/researcher";
    navigate(`${basePath}/forms/${form.id}/view`);
  };

  const handleEditForm = (form: FormMetadata) => {
    const basePath =
      user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "/pi" : "/researcher";
    navigate(`${basePath}/forms/${form.id}/edit`);
  };

  // Handle form updated
  const handleFormUpdated = (updatedForm: FormMetadata | null) => {
    if (updatedForm === null) {
      // Form was deleted, reload the list
      loadForms();
    } else {
      // Form was updated, update the local state
      setForms((prevForms) =>
        prevForms.map((f) => (f.id === updatedForm.id ? updatedForm : f))
      );
    }
  };

  const handleCreateForm = () => {
    const basePath =
      user?.role === UserRole.PRINCIPAL_INVESTIGATOR ? "/pi" : "/researcher";
    navigate(`${basePath}/forms/create`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading forms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <Card className="border-none shadow-none pt-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackNavigation}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">Forms Overview</CardTitle>
          </div>
          <Button
            onClick={handleCreateForm}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Form
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search forms, projects, or types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(FormStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(FORM_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Tabs */}
          <Tabs
            value={viewMode}
            onValueChange={(value) =>
              setViewMode(value as "table" | "timeline" | "grouped")
            }
          >
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline View
              </TabsTrigger>
              <TabsTrigger value="grouped" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Grouped View
              </TabsTrigger>
            </TabsList>

            {/* Table View */}
            <TabsContent value="table" className="space-y-4">
              {filteredForms.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No forms found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {forms.length === 0
                        ? "You haven't created any forms yet."
                        : "No forms match your current filters."}
                    </p>
                    <Button
                      onClick={handleCreateForm}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Form
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Updated By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredForms.map((form) => (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">
                            {form.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{form.formType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-48 truncate">
                            {form.projectTitle || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(
                                form.status
                              )} flex items-center gap-1`}
                            >
                              {getStatusIcon(form.status)}
                              {form.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(form.lastUpdated)}</TableCell>
                          <TableCell>{form.lastUpdatedByName}</TableCell>
                          <TableCell>
                            <FormActions
                              form={form}
                              onFormUpdated={handleFormUpdated}
                              onNavigateToView={handleViewForm}
                              onNavigateToEdit={handleEditForm}
                              showDropdown={true}
                              size="sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>

            {/* Timeline View */}
            <TabsContent value="timeline" className="space-y-4">
              {Object.keys(groupedForms).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No forms to display in timeline view
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedForms)
                    .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
                    .map(([monthYear, monthForms]) => {
                      const [year, month] = monthYear.split("-");
                      const monthName = new Date(
                        parseInt(year),
                        parseInt(month) - 1
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      });

                      return (
                        <Card key={monthYear}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Calendar className="w-5 h-5" />
                              {monthName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {monthForms.map((form) => (
                                <div
                                  key={form.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">
                                        {form.formType}
                                      </Badge>
                                      <span className="font-medium">
                                        {form.title}
                                      </span>
                                      <Badge
                                        variant="secondary"
                                        className={`${getStatusColor(
                                          form.status
                                        )} flex items-center gap-1`}
                                      >
                                        {getStatusIcon(form.status)}
                                        {form.status}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {form.projectTitle &&
                                        `Project: ${form.projectTitle} • `}
                                      Last updated by {form.lastUpdatedByName}{" "}
                                      on {formatDate(form.lastUpdated)}
                                    </div>
                                  </div>
                                  <FormActions
                                    form={form}
                                    onFormUpdated={handleFormUpdated}
                                    onNavigateToView={handleViewForm}
                                    onNavigateToEdit={handleEditForm}
                                    size="sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </TabsContent>

            {/* Grouped View */}
            <TabsContent value="grouped" className="space-y-4">
              {Object.keys(groupedForms).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No forms to display in grouped view
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedForms).map(([formType, typeForms]) => {
                    const formTypeConfig = FORM_TYPES[formType];

                    return (
                      <Card key={formType}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="w-5 h-5" />
                            {formType} – {formTypeConfig.title}
                            <Badge variant="secondary" className="ml-auto">
                              {typeForms.length} form
                              {typeForms.length !== 1 ? "s" : ""}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {typeForms.map((form) => (
                              <div
                                key={form.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">
                                      {form.title}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className={`${getStatusColor(
                                        form.status
                                      )} flex items-center gap-1`}
                                    >
                                      {getStatusIcon(form.status)}
                                      {form.status}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {form.projectTitle &&
                                      `Project: ${form.projectTitle} • `}
                                    Last updated by {form.lastUpdatedByName} on{" "}
                                    {formatDate(form.lastUpdated)}
                                    {form.submissionDate &&
                                      ` • Submitted on ${formatDate(
                                        form.submissionDate
                                      )}`}
                                  </div>
                                </div>
                                <FormActions
                                  form={form}
                                  onFormUpdated={handleFormUpdated}
                                  onNavigateToView={handleViewForm}
                                  onNavigateToEdit={handleEditForm}
                                  size="sm"
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormsOverview;
