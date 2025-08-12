import React from "react";
import { formatAIContentForTinyMCE } from "@/utils/ai-content-formatter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, FileText, CheckCircle, Clock } from "lucide-react";

interface AIEvaluationDisplayProps {
  content: string;
  title?: string;
  score?: number | null;
  status?: string;
  submittedAt?: string;
  className?: string;
  compact?: boolean;
  showProjectDetails?: boolean;
}

export const AIEvaluationDisplay: React.FC<AIEvaluationDisplayProps> = ({
  content,
  title = "AI Evaluation",
  score,
  status = "completed",
  submittedAt,
  className = "",
  compact = false,
}) => {
  const formattedContent = formatAIContentForTinyMCE(content);

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (compact) {
    return (
      <div
        className={`bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 ${className}`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Bot className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
              {status && (
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor()}`}
                >
                  {status === "completed" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      {status}
                    </>
                  )}
                </Badge>
              )}
            </div>
            {score && (
              <p className="text-sm text-gray-600 mb-2">
                AI Assessment Score:{" "}
                <span className="font-semibold text-emerald-700">
                  {score}/10
                </span>
              </p>
            )}
            {submittedAt && (
              <p className="text-xs text-gray-500">
                Generated: {new Date(submittedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto">
          <div className="bg-white/80 rounded-lg p-3">
            <div
              className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_strong]:font-medium [&_strong]:text-gray-900 [&_ul]:mb-2 [&_ul]:pl-4 [&_li]:mb-0 [&_em]:italic [&_.quote]:italic [&_.quote]:text-blue-600 [&_.quote]:font-medium"
              dangerouslySetInnerHTML={{
                __html: formattedContent,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Generated Analysis
                </Badge>
                {status && (
                  <Badge variant="outline" className={getStatusColor()}>
                    {status === "completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-1" />
                        {status}
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {score && (
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                AI Score
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {score}
                <span className="text-lg text-gray-500">/10</span>
              </div>
            </div>
          )}
        </div>
        {submittedAt && (
          <div className="mt-3 pt-3 border-t border-emerald-100">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generated on {new Date(submittedAt).toLocaleDateString()} at{" "}
              {new Date(submittedAt).toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Full AI Evaluation Content */}
        <div className="bg-white/80 rounded-lg border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-emerald-100">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Detailed AI Analysis
            </h4>
          </div>
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div
              className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:mb-4 [&_ul]:pl-6 [&_li]:mb-1 [&_em]:italic [&_.quote]:italic [&_.quote]:text-blue-600 [&_.quote]:font-medium"
              dangerouslySetInnerHTML={{
                __html: formattedContent,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEvaluationDisplay;
