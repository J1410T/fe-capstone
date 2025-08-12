import React from "react";

interface TinyMCEViewerProps {
  content: string;
  height?: number;
}

export const TinyMCEViewer: React.FC<TinyMCEViewerProps> = ({
  content,
  height = 400,
}) => {
  return (
    <div
      className="prose prose-lg max-w-none border border-gray-200 rounded-lg p-6 bg-white"
      style={{ minHeight: height }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TinyMCEViewer;
