import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Construction,
  ArrowLeft,
  Clock,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComingSoonProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backPath?: string;
  estimatedTime?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming Soon",
  description = "This page is currently under development and will be available soon.",
  showBackButton = true,
  backPath,
  estimatedTime,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4" />
            <span>We're working hard to bring you this feature</span>
          </div>
          
          {estimatedTime && (
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated completion: {estimatedTime}</span>
            </div>
          )}

          <div className="pt-4">
            {showBackButton && (
              <Button onClick={handleGoBack} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Thank you for your patience while we improve your experience.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
