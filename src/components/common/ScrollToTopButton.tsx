import React from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface ScrollToTopButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

/**
 * ScrollToTopButton component
 * A floating button that appears when user scrolls down and allows quick return to top
 * Positioned absolutely at bottom right of the screen
 */
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  className,
  size = "icon",
  variant = "default",
}) => {
  const { isVisible, scrollToTop } = useScrollToTop();

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size={size}
      variant={variant}
      className={cn(
        // Fixed positioning at bottom right
        "fixed bottom-4 right-4 z-50",
        // Smooth transitions
        "transition-all duration-300 ease-in-out",
        // Shadow and hover effects
        "shadow-lg hover:shadow-xl",
        // Ensure it's above other content
        "backdrop-blur-sm",
        // Custom positioning as requested: 20% from bottom, 15px from right
        "bottom-[20%] right-[15px]",
        className
      )}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
};
