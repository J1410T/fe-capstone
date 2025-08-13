// TinyMCE Components
export { UnifiedTinyMCE as TinyMCEEditor } from "./UnifiedTinyMCE";
export { TinyMCEViewerComponent as TinyMCEViewer } from "./TinyMCEViewer";

// Legacy exports for backward compatibility
export { UnifiedTinyMCE as DocumentTinyMCE } from "./UnifiedTinyMCE";
export { UnifiedTinyMCE as ScientificCVEditor } from "./UnifiedTinyMCE";
export { UnifiedTinyMCE as FormTinyMCE } from "./UnifiedTinyMCE";

// Re-export types for convenience
export type { Editor as TinyMCEEditorType } from "tinymce";
export type { TinyMCERef as ScientificCVEditorRef } from "./UnifiedTinyMCE";
