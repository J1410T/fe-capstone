import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  FileText,
  Plus,
  Edit,
  Copy,
  Eye,
  Download,
  Upload,
  Settings,
  Search,
} from "lucide-react";
import { UI_CONSTANTS } from "@/lib/ui-constants";

// Mock data for forms
const formTemplates = [
  {
    id: 1,
    name: "Budget Request Form",
    description: "Standard form for requesting project budget allocations",
    category: "Budget",
    status: "active",
    lastModified: "2024-01-15",
    usageCount: 45,
  },
  {
    id: 2,
    name: "Equipment Purchase Form",
    description: "Form for requesting equipment purchases",
    category: "Procurement",
    status: "active",
    lastModified: "2024-01-12",
    usageCount: 23,
  },
  {
    id: 3,
    name: "Travel Authorization Form",
    description: "Form for travel expense authorization",
    category: "Travel",
    status: "draft",
    lastModified: "2024-01-10",
    usageCount: 12,
  },
  {
    id: 4,
    name: "Personnel Request Form",
    description: "Form for requesting additional personnel",
    category: "HR",
    status: "active",
    lastModified: "2024-01-08",
    usageCount: 8,
  },
];

const DocumentFormsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredForms = formTemplates.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      form.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const FormCard = ({ form }: { form: (typeof formTemplates)[0] }) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <Card
        className={`${UI_CONSTANTS.BORDERS.default} ${UI_CONSTANTS.RADIUS.default} hover:shadow-md transition-shadow`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">
                {form.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {form.description}
              </p>
            </div>
            <Badge
              className={statusColors[form.status as keyof typeof statusColors]}
            >
              {form.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{form.category}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Modified:</span>
              <span>{form.lastModified}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usage Count:</span>
              <span className="font-medium">{form.usageCount}</span>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateFormDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Form Template</DialogTitle>
          <DialogDescription>
            Create a new BM form template that can be used across the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">Form Name</Label>
            <Input id="form-name" placeholder="Enter form name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              placeholder="Enter form description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            BM Forms Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage Budget Management forms and templates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="templates"
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Form Builder</span>
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Submissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>

          {filteredForms.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No forms found matching your criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Advanced form builder coming soon...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Drag-and-drop interface for creating custom forms
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Form submissions management coming soon...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  View and manage all form submissions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateFormDialog />
    </div>
  );
};

export default DocumentFormsManagement;
