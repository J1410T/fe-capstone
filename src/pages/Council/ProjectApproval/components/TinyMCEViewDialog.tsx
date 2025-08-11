import React from "react";
import { TinyMCEViewer } from "@/components/ui/tinymce-viewer";
import CustomModal from "./CustomModal";

interface TinyMCEViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string;
  height?: number;
}

export const TinyMCEViewDialog: React.FC<TinyMCEViewDialogProps> = ({
  isOpen,
  onClose,
  title = "Document Viewer",
  content,
  height = 600,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="98vw"
      height="98vh"
      className="p-0"
    >
      <div className="h-full overflow-hidden">
        <TinyMCEViewer
          content={content}
          height={height}
          className="h-full border-0 rounded-lg shadow-inner"
        />
      </div>
    </CustomModal>
  );
};

export default TinyMCEViewDialog;
