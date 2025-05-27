import { createContext } from "react";

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
export type { LoadingContextType };
