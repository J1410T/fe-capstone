import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTinyMCEViewer } from "@/components/ui/responsive-tinymce-viewer";
import {
  ArrowLeft,
  User,
  Calendar,
  Star,
  FileText,
  CheckCircle,
} from "lucide-react";

interface IndividualEvaluationDetail {
  id: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluationType: string;
  status: "completed" | "pending" | "in-progress";
  score: number | null;
  totalRate: number | null;
  submittedAt: string | null;
  createdAt: string;
  recommendation: string;
  evaluationContent: string;
  comments: string;
  stageId: string;
  stageName: string;
  proposalId: string;
  proposalTitle: string;
}

// Mock data for individual evaluation
const mockEvaluationDetail: IndividualEvaluationDetail = {
  id: "eval-1",
  evaluatorName: "Prof. Dr. Emily Davis",
  evaluatorRole: "Technical Reviewer",
  evaluationType: "Technical Review",
  status: "completed",
  score: 8.5,
  totalRate: 8.5,
  submittedAt: "2025-08-12T10:30:00.000Z",
  createdAt: "2025-08-11T14:05:12.000Z",
  recommendation: "Approve with Minor Revisions",
  evaluationContent: `
    <h2>Technical Evaluation Report</h2>
    
    <h3>Executive Summary</h3>
    <p>This evaluation assesses the technical feasibility and implementation approach of the proposed AI-driven medical diagnostics system. The project demonstrates strong technical foundations with innovative approaches to medical imaging analysis.</p>
    
    <h3>Technical Assessment</h3>
    
    <h4>1. Technical Approach (Score: 9/10)</h4>
    <p><strong>Strengths:</strong></p>
    <ul>
      <li>Well-structured use of convolutional neural networks (CNNs) for medical image analysis</li>
      <li>Appropriate choice of deep learning frameworks (TensorFlow/PyTorch)</li>
      <li>Comprehensive data preprocessing pipeline</li>
      <li>Robust validation methodology using cross-validation</li>
    </ul>
    
    <p><strong>Areas for Improvement:</strong></p>
    <ul>
      <li>Consider implementing attention mechanisms for better feature extraction</li>
      <li>Include discussion on handling class imbalance in medical datasets</li>
    </ul>
    
    <h4>2. System Architecture (Score: 8/10)</h4>
    <p>The proposed system architecture is well-designed with clear separation of concerns:</p>
    <ul>
      <li><strong>Data Layer:</strong> Efficient DICOM image processing pipeline</li>
      <li><strong>Model Layer:</strong> Ensemble of specialized CNN models</li>
      <li><strong>API Layer:</strong> RESTful services with proper authentication</li>
      <li><strong>UI Layer:</strong> Intuitive web-based interface for radiologists</li>
    </ul>
    
    <h4>3. Implementation Plan (Score: 8/10)</h4>
    <p>The 24-month timeline is realistic with well-defined milestones:</p>
    <ol>
      <li><strong>Phase 1 (Months 1-6):</strong> Data collection and preprocessing</li>
      <li><strong>Phase 2 (Months 7-18):</strong> Model development and training</li>
      <li><strong>Phase 3 (Months 19-24):</strong> Testing, validation, and deployment</li>
    </ol>
    
    <h3>Technical Risks and Mitigation</h3>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="padding: 8px; background-color: #f5f5f5;">Risk</th>
        <th style="padding: 8px; background-color: #f5f5f5;">Impact</th>
        <th style="padding: 8px; background-color: #f5f5f5;">Mitigation Strategy</th>
      </tr>
      <tr>
        <td style="padding: 8px;">Data Quality Issues</td>
        <td style="padding: 8px;">High</td>
        <td style="padding: 8px;">Implement robust data validation and augmentation techniques</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Model Overfitting</td>
        <td style="padding: 8px;">Medium</td>
        <td style="padding: 8px;">Use regularization, dropout, and extensive validation datasets</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Computational Resources</td>
        <td style="padding: 8px;">Medium</td>
        <td style="padding: 8px;">Cloud-based GPU resources and model optimization</td>
      </tr>
    </table>
    
    <h3>Compliance and Standards</h3>
    <p>The project demonstrates awareness of medical software standards:</p>
    <ul>
      <li>HIPAA compliance for patient data protection</li>
      <li>FDA guidelines for medical device software</li>
      <li>ISO 13485 quality management standards</li>
      <li>DICOM standards for medical imaging</li>
    </ul>
    
    <h3>Innovation and Originality</h3>
    <p>The project incorporates several innovative elements:</p>
    <ul>
      <li>Multi-modal fusion of different imaging techniques</li>
      <li>Real-time inference with sub-second response times</li>
      <li>Explainable AI features for clinical decision support</li>
      <li>Integration with existing hospital information systems</li>
    </ul>
    
    <h3>Recommendations</h3>
    <ol>
      <li><strong>Minor Revision Required:</strong> Include more detailed discussion on data privacy and security measures</li>
      <li><strong>Enhancement Suggestion:</strong> Consider adding federated learning capabilities for multi-institutional collaboration</li>
      <li><strong>Validation Improvement:</strong> Expand clinical validation to include multiple medical centers</li>
      <li><strong>User Experience:</strong> Conduct usability studies with practicing radiologists</li>
    </ol>
    
    <h3>Conclusion</h3>
    <p>This is a technically sound project with strong potential for clinical impact. The proposed approach is innovative and well-grounded in current state-of-the-art techniques. With minor revisions to address data security concerns and expanded validation plans, this project is recommended for approval.</p>
  `,
  comments: `
    <p><strong>Additional Technical Notes:</strong></p>
    <ul>
      <li>The team has demonstrated strong technical expertise in both AI/ML and medical imaging domains</li>
      <li>Collaboration with medical professionals is clearly established</li>
      <li>Budget allocation appears appropriate for the scope of work</li>
      <li>Consider establishing an advisory board with practicing radiologists</li>
    </ul>
    
    <p><strong>Follow-up Actions:</strong></p>
    <ol>
      <li>Provide detailed data security and privacy protection plan</li>
      <li>Submit preliminary results from pilot testing phase</li>
      <li>Establish partnerships with additional medical institutions for validation</li>
    </ol>
  `,
  stageId: "a44bebc5-0324-4e3e-987e-4014cee7fef8",
  stageName: "Initial Review",
  proposalId: "1",
  proposalTitle: "Advanced AI Diagnostic System for Medical Imaging",
};

export const IndividualEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();

  // In a real app, you would fetch evaluation data based on evaluationId
  // For now, using mock data
  const evaluation = mockEvaluationDetail;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-50 text-green-700 border-green-200";
    if (score >= 6) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("Approve"))
      return "bg-green-50 text-green-700 border-green-200";
    if (recommendation.includes("Revision"))
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (recommendation.includes("Reject"))
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-4 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/council/project-approval/proposal/${evaluation.proposalId}`
              )
            }
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposal
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Individual Evaluation Detail
            </h1>
            <p className="text-gray-600 mt-1">{evaluation.proposalTitle}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Evaluation Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Evaluation Overview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Comprehensive evaluation details and summary
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getStatusColor(evaluation.status)}
                >
                  {evaluation.status}
                </Badge>
                {evaluation.status === "completed" && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Evaluator
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation.evaluatorName}
                </p>
                <p className="text-xs text-gray-600">
                  {evaluation.evaluatorRole}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    Total Rate
                  </span>
                </div>
                {evaluation.totalRate !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {evaluation.totalRate}/10
                    </span>
                    <Badge
                      variant="outline"
                      className={getScoreColor(evaluation.totalRate)}
                    >
                      {evaluation.totalRate >= 8
                        ? "Excellent"
                        : evaluation.totalRate >= 6
                        ? "Good"
                        : "Needs Improvement"}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Not rated</span>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    Type
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation.evaluationType}
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                    Submitted
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation.submittedAt
                    ? new Date(evaluation.submittedAt).toLocaleDateString()
                    : "Not submitted"}
                </p>
              </div>
            </div>

            {evaluation.recommendation && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Recommendation:
                  </span>
                  <Badge
                    variant="outline"
                    className={getRecommendationColor(
                      evaluation.recommendation
                    )}
                  >
                    {evaluation.recommendation}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Evaluation Document */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detailed Evaluation Document
                  </h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive technical evaluation and analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <ResponsiveTinyMCEViewer
                  content={evaluation.evaluationContent}
                  height="auto"
                  className="border-0"
                  maxHeight="60vh"
                  autoResize={true}
                />
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {evaluation.comments && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Additional Comments
                    </h3>
                    <p className="text-sm text-gray-600">
                      Supplementary notes and recommendations from the evaluator
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <ResponsiveTinyMCEViewer
                    content={evaluation.comments}
                    height="auto"
                    className="border-0"
                    maxHeight="40vh"
                    autoResize={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualEvaluationDetailPage;
