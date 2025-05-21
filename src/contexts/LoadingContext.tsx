import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { PageLoading } from "@/components/ui/loaders";

// Loading component - using the PageLoading component
export const Loading = PageLoading;

// Loading context type
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  startLoading: () => void;
}

// Create loading context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Loading provider props
type LoadingProviderProps = {
  children: ReactNode;
};

// Loading provider component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  // Initialize isLoading = true to show loading on page reload
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  // Function to start loading
  const startLoading = () => {
    setIsLoading(true);
    setContent(null);
  };

  // React to path or navigation type changes
  useEffect(() => {
    // 1. Start loading when URL or navigationType changes
    startLoading();

    // 2. Prepare content in memory but don't display yet
    const prepareContentTimer = setTimeout(() => {
      setContent(children);
    }, 100);

    // 3. Wait 1.5s before hiding loading and showing content
    const hideLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(prepareContentTimer);
      clearTimeout(hideLoadingTimer);
    };
  }, [location.pathname, navigationType, children]);

  // Check loading state when component mounts
  useEffect(() => {
    // Ensure loading shows immediately when component mounts (page reload)
    startLoading();

    // Simulate content preparation to display after loading
    const initialContentTimer = setTimeout(() => {
      setContent(children);
    }, 100);

    // Keep loading for 1.5s to ensure effect is visible
    const initialLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(initialContentTimer);
      clearTimeout(initialLoadingTimer);
    };
  }, []); // Only run when component mounts for the first time

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading }}>
      {/* Show loading when isLoading = true */}
      {isLoading && <Loading />}

      {/* Only show content when loading is complete */}
      {!isLoading && content ? content : null}
    </LoadingContext.Provider>
  );
};
