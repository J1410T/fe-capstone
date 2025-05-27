import { createContext } from "react";
import { AuthContextType } from "./auth-types";

// Create auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
