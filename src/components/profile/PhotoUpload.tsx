import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoSelect: (photoUrl: string) => void;
  currentPhoto?: string;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelect,
  currentPhoto,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    // Create a FileReader to convert the image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onPhotoSelect(result);
        toast.success("Photo uploaded successfully!");
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      toast.error("Failed to upload photo");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        className={`
          w-[90px] h-[120px] border-2 border-dashed border-gray-400 
          flex flex-col items-center justify-center cursor-pointer
          hover:border-emerald-500 hover:bg-emerald-50 transition-colors
          relative overflow-hidden bg-white
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
        style={{ fontSize: "14px" }}
      >
        {currentPhoto ? (
          <>
            <img
              src={currentPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0 bg-white hover:bg-gray-100"
                  onClick={handleClick}
                  disabled={isUploading}
                >
                  <Camera className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0 bg-white hover:bg-red-100 text-red-600"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 text-center p-2">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs leading-tight">Ảnh 3x4</span>
                <span className="text-xs text-gray-400 mt-1">Click to upload</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-500 text-center max-w-[90px]">
        <p>Click to upload photo</p>
        <p className="text-gray-400">Max 5MB</p>
      </div>
    </div>
  );
};
