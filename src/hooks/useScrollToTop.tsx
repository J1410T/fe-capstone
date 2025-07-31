import { useEffect, useState, useCallback, useMemo } from "react";
import { throttle } from "@/utils/core";

/**
 * Custom hook for scroll-to-top functionality
 * Provides scroll position tracking and smooth scroll to top functionality
 */
export const useScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Create scroll handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300); // Show button after scrolling 300px
  }, []);

  // Create throttled version using useMemo
  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 100),
    [handleScroll]
  );

  // Scroll to top function with smooth behavior
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll);

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [throttledHandleScroll, handleScroll]);

  return {
    isVisible,
    scrollToTop,
  };
};

/**
 * Hook to automatically scroll to top on route changes
 * Should be used in layout components or route components
 */
export const useScrollRestoration = () => {
  useEffect(() => {
    // Scroll to top immediately when component mounts (route changes)
    window.scrollTo(0, 0);
  }, []);
};
