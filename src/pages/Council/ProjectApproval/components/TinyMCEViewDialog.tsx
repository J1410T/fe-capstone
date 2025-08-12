import React from "react";
import { ResponsiveTinyMCEViewer } from "@/components/ui/responsive-tinymce-viewer";
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
  height?: number | string;
}

export const TinyMCEViewDialog: React.FC<TinyMCEViewDialogProps> = ({
  isOpen,
  onClose,
  title = "Document Viewer",
  content,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-auto bg-white rounded-lg border">
          <ResponsiveTinyMCEViewer
            content={content}
            height="100%"
            className="h-full border-0"
            maxHeight="100%"
            autoResize={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TinyMCEViewDialog;
