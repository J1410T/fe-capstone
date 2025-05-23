import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, FileText } from "lucide-react";

interface FundingRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (request: {
    title: string;
    description: string;
    amount: number;
    reason: string;
    documents?: { name: string; url: string; size: string }[];
  }) => void;
}

export const FundingRequestForm: React.FC<FundingRequestFormProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    reason: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        amount: "",
        reason: "",
      });
      setDocuments([]);
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      } else if (amount > 100000) {
        newErrors.amount = "Amount cannot exceed $100,000";
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate file upload and API call
    setTimeout(() => {
      const mockDocuments = documents.map(file => ({
        name: file.name,
        url: "#", // In real app, this would be the uploaded file URL
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      }));

      onCreate({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        documents: mockDocuments.length > 0 ? mockDocuments : undefined,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      // Allow common document types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`);
        return false;
      }
      return true;
    });

    setDocuments(prev => [...prev, ...validFiles].slice(0, 5)); // Limit to 5 files
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-slate-200">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create Funding Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Request Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title for your funding request..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`${errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about what you need funding for..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] resize-none ${errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
              Requested Amount (USD) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <Input
                id="amount"
                type="number"
                min="0"
                max="100000"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`pl-8 ${errors.amount ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="text-xs text-slate-500">
              Maximum request amount is $100,000
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-slate-700">
              Justification/Reason *
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why this funding is necessary and how it will benefit your research..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className={`min-h-[100px] resize-none ${errors.reason ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Supporting Documents (Optional)
            </Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-sm text-slate-600 mb-2">
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload files
                  </label>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-slate-500">
                  PDF, DOC, XLS, TXT, JPG, PNG up to 10MB each (max 5 files)
                </p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Uploaded Files */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Uploaded Files:</p>
                <div className="space-y-2">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? "Creating..." : "Create Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
