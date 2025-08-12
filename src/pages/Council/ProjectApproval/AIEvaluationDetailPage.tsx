import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIEvaluationDisplay } from "@/components/ui/ai-evaluation-display";
import {
  ArrowLeft,
  Bot,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

interface AIEvaluationData {
  id: string;
  name: string;
  "total-rate": number | null;
  comment: string;
  "submitted-at": string;
  "is-approved": boolean;
  "reviewer-result": unknown | null;
  "is-ai-report": boolean;
  status: string;
  "evaluation-stage-id": string;
  "reviewer-id": string | null;
  documents: unknown | null;
  "projects-similarity-result": unknown | null;
}

interface APIResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": AIEvaluationData[];
}

// Mock API response data
const mockAIEvaluationResponse: APIResponse = {
  "page-index": 1,
  "page-size": 1,
  "total-count": 1,
  "total-page": 1,
  "data-list": [
    {
      id: "e2105b84-b602-4ab8-917e-24f1e8439433",
      name: "AI Review",
      "total-rate": null,
      comment: `The project titled "Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy" presents a compelling initiative aimed at enhancing the management of certification processes within an educational context, specifically tailored for aviation training.

### Project Overview

**Title:** Build an Online Certification Management System with Digital Signature Integration for an Aviation Academy  
**Description:** This system serves as a comprehensive tool to streamline the implementation and management of projects, beginning from registration through to certification issuance. The platform will facilitate students in easily searching, registering for, and tracking their projects, while also assisting instructors in managing, evaluating, and providing feedback to students efficiently.

### Key Elements

1. **Target Audience:** 
   - The primary users are students and instructors at an aviation academy. Students will benefit from a user-friendly interface that simplifies the certification process, while instructors will have tools to manage and evaluate student projects effectively.

2. **Functionality:**
   - The system will incorporate digital signature integration, enhancing the legitimacy and security of the issued certifications. This feature is crucial in ensuring that the documentation is tamper-proof and recognized within the aviation industry.

3. **Team Composition:**
   - The maximum number of team members for the project is set at six, indicating a collaborative approach that leverages diverse skills and expertise.

4. **Project Type:** 
   - Classified as a cooperative project, emphasizing teamwork and shared responsibilities in the development and implementation phases.

5. **Category and Genre:**
   - The project falls under the application/implementation category and is framed as a proposal, suggesting it is in the planning stage and seeks approval or support for execution.

### Conclusion

The proposed Online Certification Management System is a forward-thinking solution that addresses significant needs within the aviation education sector. By incorporating features that enhance usability for students and operational efficiency for instructors, it stands to contribute positively to the landscape of aviation training programs.
The integration of digital signatures further adds value, ensuring that the certifications issued are secure and credible.

**Next Steps:**
- Detailed planning and resource allocation should be initiated to move from the proposal stage to implementation.
- Engaging stakeholders for feedback and refining the system's functionalities based on their needs will be crucial for the project's success.

This project, if executed effectively, could serve as a model for similar educational initiatives across various fields.`,
      "submitted-at": "2025-08-11T14:05:12.0316727",
      "is-approved": false,
      "reviewer-result": null,
      "is-ai-report": true,
      status: "created",
      "evaluation-stage-id": "a44bebc5-0324-4e3e-987e-4014cee7fef8",
      "reviewer-id": null,
      documents: null,
      "projects-similarity-result": null,
    },
  ],
};

export const AIEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { evaluationId } = useParams<{ evaluationId: string }>();

  // In a real app, you would fetch this data from the API using evaluationId
  // For demo purposes, using mock data
  const aiEvaluation =
    mockAIEvaluationResponse["data-list"].find(
      (evaluation) => evaluation.id === evaluationId
    ) || mockAIEvaluationResponse["data-list"][0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Evaluation Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed view of AI-generated evaluation
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
        </div>

        {/* AI Evaluation Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {aiEvaluation.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1 text-xs"
                >
                  AI Generated
                </Badge>
                <Badge
                  variant="outline"
                  className={`font-medium px-3 py-1 text-xs ${getStatusColor(
                    aiEvaluation.status
                  )}`}
                >
                  {aiEvaluation.status}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Submitted{" "}
                    {new Date(
                      aiEvaluation["submitted-at"]
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Evaluation ID
                </span>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {aiEvaluation.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <Star className="h-8 w-8 text-purple-600" />
              <div>
                <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                  Total Rate
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {aiEvaluation["total-rate"]
                    ? `${aiEvaluation["total-rate"]}/10`
                    : "Not Rated"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
              {aiEvaluation["is-approved"] ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-orange-600" />
              )}
              <div>
                <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                  Approval Status
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {aiEvaluation["is-approved"] ? "Approved" : "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Analysis Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <AIEvaluationDisplay
              content={aiEvaluation.comment}
              title="AI Analysis & Commentary"
              score={aiEvaluation["total-rate"]}
              status={aiEvaluation.status}
              submittedAt={aiEvaluation["submitted-at"]}
              showProjectDetails={true}
              className="w-full"
              compact={false}
            />
          </div>

          {/* Technical Details */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Technical Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Stage ID:</span>
                <p className="text-gray-600 font-mono break-all">
                  {aiEvaluation["evaluation-stage-id"]}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reviewer ID:</span>
                <p className="text-gray-600">
                  {aiEvaluation["reviewer-id"] || "System Generated"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Documents:</span>
                <p className="text-gray-600">
                  {aiEvaluation.documents ? "Available" : "None"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Similarity Check:
                </span>
                <p className="text-gray-600">
                  {aiEvaluation["projects-similarity-result"]
                    ? "Completed"
                    : "Not Performed"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
