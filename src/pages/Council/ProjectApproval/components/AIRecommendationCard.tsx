import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  BarChart3,
  Maximize2,
} from "lucide-react";
import AIResponseRenderer from "./AIResponseRenderer";

export interface AIRecommendation {
  id: string;
  name: string;
  totalRate: number | null;
  comment: string;
  submittedAt: string;
  isApproved: boolean;
  reviewerResult: unknown | null;
  isAiReport: boolean;
  status: string;
  evaluationStageId: string;
  reviewerId: string | null;
  documents: unknown | null;
  projectsSimilarityResult: unknown | null;
}

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  title?: string;
  onViewDetails?: () => void;
  className?: string;
}

const getRecommendationConfig = (isApproved: boolean, status: string) => {
  if (status === "created" && !isApproved) {
    return {
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      label: "AI Analysis Complete",
    };
  } else if (isApproved) {
    return {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeClass: "bg-green-100 text-green-800 border-green-200",
      label: "AI Recommends Approval",
    };
  } else {
    return {
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      label: "Under AI Review",
    };
  }
};

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  title = "AI Analysis",
  onViewDetails,
  className = "",
}) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const config = getRecommendationConfig(
    recommendation.isApproved,
    recommendation.status
  );
  const IconComponent = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Bot className="h-5 w-5 text-purple-600" />
          {title}
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200 text-xs"
          >
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommendation Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className={`h-5 w-5 ${config.color}`} />
            <Badge
              variant="outline"
              className={`${config.badgeClass} font-medium`}
            >
              {config.label}
            </Badge>
          </div>
          {recommendation.totalRate && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-lg">
                {recommendation.totalRate}/10
              </span>
            </div>
          )}
        </div>

        {/* Status and Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Status</span>
            <span className="font-semibold capitalize">
              {recommendation.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Submitted</span>
            <span className="text-gray-600">
              {new Date(recommendation.submittedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis Summary
          </h4>
          <div className="text-sm text-gray-700 leading-relaxed">
            {/* Show first paragraph as preview */}
            <p className="mb-2">
              {recommendation.comment.split("\n\n")[0].substring(0, 200)}
              {recommendation.comment.length > 200 && "..."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullAnalysis(true)}
              className="text-xs"
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              View Full Analysis
            </Button>
          </div>
        </div>

        {/* Actions */}
        {onViewDetails && (
          <div className="pt-2 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="w-full"
            >
              View Full Analysis
            </Button>
          </div>
        )}
      </CardContent>

      {/* Full Analysis Modal */}
      <Dialog open={showFullAnalysis} onOpenChange={setShowFullAnalysis}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              {title} - Full Analysis
            </DialogTitle>
          </DialogHeader>
          <AIResponseRenderer content={recommendation.comment} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AIRecommendationCard;
