import React from "react";
import { TinyMCEViewer } from "@/components/ui/tinymce-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-hidden">
          <TinyMCEViewer
            content={content}
            height={height}
            className="h-full border-0 rounded-lg shadow-inner"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TinyMCEViewDialog;
