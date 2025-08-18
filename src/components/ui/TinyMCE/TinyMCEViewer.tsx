import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEViewerProps {
  content: string;
  height?: number;
  className?: string;
  apiKey?: string;
  useTinyMCE?: boolean; // Option to use actual TinyMCE or simple HTML viewer
}

export const TinyMCEViewerComponent: React.FC<TinyMCEViewerProps> = ({
  content,
  height,
  className = "",
  apiKey,
  useTinyMCE = true,
}) => {
  const defaultApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const editorApiKey = apiKey || defaultApiKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number>(400);

  // Calculate responsive height based on container
  useEffect(() => {
    if (!height && containerRef.current) {
      const updateHeight = () => {
        const containerHeight = containerRef.current?.clientHeight || 400;
        setDynamicHeight(Math.max(containerHeight - 20, 300)); // Subtract padding, minimum 300px
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);

      // Use ResizeObserver if available for better responsiveness
      let resizeObserver: ResizeObserver | null = null;
      if (containerRef.current && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        window.removeEventListener("resize", updateHeight);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }
  }, [height]);

  const editorHeight = height || dynamicHeight;

  // Simple HTML viewer (faster, no TinyMCE dependency)
  if (!useTinyMCE) {
    return (
      <div
        ref={containerRef}
        className={`prose prose-lg max-w-none border border-gray-200 rounded-lg p-6 bg-white overflow-auto ${className}`}
        style={{
          height: height ? `${height}px` : "100%",
          minHeight: height || "100%",
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "14px",
          lineHeight: "1.4",
          color: "#333",
        }}
      >
        <style>
          {`
            .image-frame {
              width: 150px;
              height: 180px;
              border: 2px dashed #999;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              margin: 10px 0;
            }
            .image-frame img {
              max-width: 100%;
              max-height: 100%;
              object-fit: cover;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1em;
            }
            table, th, td {
              border: 1px solid #ccc;
            }
            th, td {
              padding: 8px;
            }
          `}
        </style>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  // Full TinyMCE viewer (better rendering, supports all TinyMCE content)
  return (
    <div
      ref={containerRef}
      className={`border rounded-lg overflow-hidden ${className}`}
      style={{ height: height ? `${height}px` : "100%" }}
    >
      <Editor
        apiKey={editorApiKey}
        value={content}
        init={{
          height: editorHeight,
          menubar: false,
          toolbar: false,
          statusbar: false,
          branding: false,
          promotion: false,
          resize: false,
          elementpath: false,
          content_style: `
            body {
              font-family: 'Times New Roman', serif;
              padding: 24px;
              color: #222;
              background: #fff;
              font-size: 14px;
              line-height: 1.4;
            }
            .image-frame {
              width: 150px;
              height: 180px;
              border: 2px dashed #999;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              margin: 10px 0;
            }
            .image-frame img {
              max-width: 100%;
              max-height: 100%;
              object-fit: cover;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1em;
            }
            table, th, td {
              border: 1px solid #ccc;
            }
            th, td {
              padding: 8px;
            }
          `,
        }}
        disabled={true}
      />
    </div>
  );
};

export default TinyMCEViewerComponent;
