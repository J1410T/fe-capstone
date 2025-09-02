import React, { createContext, useContext, useEffect } from "react";
import { useSignalR, RealtimeNotification } from "@/hooks/useSignalR";
import { useAuth } from "@/contexts/AuthContext";

interface SignalRContextType {
  isConnected: boolean;
  notifications: RealtimeNotification[] | undefined;
  clearNotifications: () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within SignalRProvider");
  }
  return context;
};

interface SignalRProviderProps {
  children: React.ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({
  children,
}) => {
  const { user } = useAuth(); // Adjust according to your auth implementation
  const { isConnected, notifications, joinUserGroup, clearNotifications } =
    useSignalR();

  // Join user-specific group when authenticated
  useEffect(() => {
    if (isConnected && user?.id) {
      joinUserGroup(user.id);
    }
  }, [isConnected, user?.id, joinUserGroup]);

  const contextValue = {
    isConnected,
    notifications,
    clearNotifications,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};
