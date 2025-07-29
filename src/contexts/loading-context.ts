import { createContext, useContext } from "react";

// Define loading context interface
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  startLoading: () => void;
}

// Create loading context
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    console.warn(
      "useLoading is being used outside of a LoadingProvider. Using default values."
    );
    return {
      isLoading: false,
      setIsLoading: () => {},
      startLoading: () => {},
    };
  }
  return context;
};

export type { LoadingContextType };
