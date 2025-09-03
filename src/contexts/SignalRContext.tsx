import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { signalRService } from "@/services/signalr";
import {
  SignalRConnectionState,
  SignalRNotificationMessage,
} from "@/types/notification";

interface SignalRContextType {
  connectionState: SignalRConnectionState;
  isConnected: boolean;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
  onNotification: (
    callback: (message: SignalRNotificationMessage) => void
  ) => () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({
  children,
}) => {
  const [connectionState, setConnectionState] =
    useState<SignalRConnectionState>({
      isConnected: false,
    });

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribe = signalRService.onConnectionStateChange((state) => {
      setConnectionState(state);
    });

    // Initialize connection state
    setConnectionState(signalRService.getConnectionState());

    // Auto-start connection when provider mounts
    const initializeConnection = async () => {
      try {
        if (!signalRService.isConnected()) {
          await signalRService.start();
        }
      } catch (error) {
        console.error("Failed to auto-start SignalR connection:", error);
      }
    };

    initializeConnection();

    return () => {
      unsubscribe();
    };
  }, []);

  const startConnection = async () => {
    try {
      await signalRService.start();
    } catch (error) {
      console.error("Failed to start SignalR connection:", error);
      throw error;
    }
  };

  const stopConnection = async () => {
    try {
      await signalRService.stop();
    } catch (error) {
      console.error("Failed to stop SignalR connection:", error);
      throw error;
    }
  };

  const onNotification = (
    callback: (message: SignalRNotificationMessage) => void
  ) => {
    return signalRService.onNotification(callback);
  };

  const contextValue: SignalRContextType = {
    connectionState,
    isConnected: connectionState.isConnected,
    startConnection,
    stopConnection,
    onNotification,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};

// Hook for easy access to connection status
export const useSignalRConnection = () => {
  const { connectionState, isConnected } = useSignalR();
  return { connectionState, isConnected };
};

// Hook for listening to notifications
export const useSignalRNotifications = (
  callback: (message: SignalRNotificationMessage) => void
) => {
  const { onNotification } = useSignalR();

  useEffect(() => {
    console.log("🔗 Setting up SignalR notification listener");
    const unsubscribe = onNotification((message) => {
      console.log("📨 SignalR notification received in hook:", message);
      callback(message);
    });

    return () => {
      console.log("🔌 Cleaning up SignalR notification listener");
      unsubscribe();
    };
  }, [callback, onNotification]);
};
