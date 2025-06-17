import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X } from "lucide-react";
import { formatFileSize, generateId } from "@/shared/utils/helpers";
import type { FileUpload } from "@/shared/utils/types";

interface FileUploadProps {
  files: FileUpload[];
  onFilesChange: (files: FileUpload[]) => void;
  maxFiles?: number;
  label?: string;
  description?: string;
  accept?: string;
  required?: boolean;
}

export const FileUploadComponent: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  label = "Upload Files",
  description = "Drag and drop files here or click to browse",
  accept = "*",
  required = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: FileUpload[] = selectedFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));

    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    onFilesChange(updatedFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    const newFiles: FileUpload[] = droppedFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));

    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-xs text-gray-500 mb-4">
            Maximum {maxFiles} files allowed
          </p>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Choose Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files:</Label>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export alias for easier importing
export { FileUploadComponent as FileUpload };
