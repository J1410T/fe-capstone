import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading, ScrollToTopButton } from "@/components";
import { getAuthResponse } from "@/utils/cookie-manager";
import { useScientificCVByEmail } from "@/hooks/queries/document";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
} | null;

const ViewScientificCV: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<EditorInstance>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Get user email and role from cookie
  const authResponse = getAuthResponse<{
    email: string;
    "selected-role": string;
  }>();
  const userEmail = authResponse?.email || "";
  const selectedRole = authResponse?.["selected-role"] || "";

  const {
    data: scientificCV,
    isLoading,
    error,
    refetch,
  } = useScientificCVByEmail(userEmail, !!userEmail);

  // Force refetch on component mount
  useEffect(() => {
    if (userEmail) {
      setIsRefetching(true);
      const timer = setTimeout(async () => {
        try {
          await refetch();
        } finally {
          setIsRefetching(false);
        }
      }, 100); // Delay nhỏ để đảm bảo component đã mount hoàn toàn

      return () => {
        clearTimeout(timer);
        setIsRefetching(false);
      };
    }
  }, [userEmail, refetch]);

  // Map role to path
  const currentRole =
    selectedRole === "council"
      ? "council"
      : selectedRole === "principal"
      ? "pi"
      : selectedRole === "researcher"
      ? "researcher"
      : ""; // fallback nếu không khớp

  const handleBack = () => {
    if (currentRole) {
      navigate(`/${currentRole}/profile`);
    } else {
      navigate("/"); // fallback nếu không có role
    }
  };

  const handleEdit = () => navigate("/profile/scientific-cv/edit");

  const formStyles = `
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 13px;
      line-height: 1.4;
      color: #333;
      padding: 20px;
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
    }
    table, th, td {
      border: 1px solid #ccc;
      padding: 6px 8px;
    }
  `;

  // Show loading when initially loading or refetching
  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center h-[800px]">
        <div className="text-center">
          <Loading className="w-full max-w-md" />
          {isRefetching && (
            <p className="text-sm text-gray-600 mt-4">
              Refreshing Scientific CV...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error || !scientificCV) {
    return (
      <div className="text-center py-12 text-gray-600">
        <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold">Scientific CV Not Found</h2>
        <p className="mb-4">Unable to load your Scientific CV document.</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-6 py-4 print:bg-white">
      <ScrollToTopButton />

      {/* Header */}
      <div className="bg-white/90 shadow-sm rounded-xl px-6 py-4 border mb-6 flex items-start justify-between gap-6 print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-emerald-100 transition-colors rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-600" />
            View Scientific CV
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Your academic profile document
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border px-6 py-5 mb-6 flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                Created:{" "}
                {scientificCV.data["upload-at"]
                  ? format(
                      new Date(scientificCV.data["upload-at"]),
                      "MMM dd, yyyy"
                    )
                  : "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>
                Last Updated:{" "}
                {scientificCV.data["updated-at"]
                  ? format(
                      new Date(scientificCV.data["updated-at"]),
                      "MMM dd, yyyy"
                    )
                  : "Never"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
              Status:{" "}
              {scientificCV.data.status
                ? String(scientificCV.data.status).charAt(0).toUpperCase() +
                  String(scientificCV.data.status).slice(1)
                : "Created"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Document Type: ScienceCV
            </Badge>
            <Button
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                To download your CV, go to <strong>File → Print</strong>, then
                choose <strong>"Save"</strong> in the print dialog.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* TinyMCE Viewer */}
      <div className="bg-white rounded-xl border shadow-inner overflow-hidden max-w-5xl mx-auto w-full">
        <Editor
          apiKey={apiKey}
          onInit={(_, editor) => (editorRef.current = editor)}
          initialValue={scientificCV.data["content-html"] || ""}
          disabled={true}
          init={{
            height: 800,
            menubar: false,
            toolbar: false,
            plugins: ["table"],
            content_style: formStyles,
          }}
        />
      </div>
    </div>
  );
};

export default ViewScientificCV;
