import * as signalR from "@microsoft/signalr";
import { env } from "@/config/env";
import { getAccessToken } from "./api";
import { SignalRNotificationMessage, SignalRConnectionState } from "@/types/notification";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private connectionState: SignalRConnectionState = { isConnected: false };
  private listeners: Map<string, ((message: SignalRNotificationMessage) => void)[]> = new Map();
  private stateListeners: ((state: SignalRConnectionState) => void)[] = [];

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(env.SIGNALR_HUB_URL, {
          accessTokenFactory: () => {
            try {
              return getAccessToken();
            } catch {
              return "";
            }
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      this.setupEventHandlers();
    } catch (error) {
      console.error("Failed to initialize SignalR connection:", error);
      this.updateConnectionState({ isConnected: false, error: String(error) });
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Handle incoming notifications
    this.connection.on("ReceiveNotification", (message: SignalRNotificationMessage) => {
      console.log("📨 SignalR notification received:", message);
      this.notifyListeners("ReceiveNotification", message);
    });

    // Connection state handlers
    this.connection.onclose((error) => {
      console.log("❌ SignalR connection closed:", error);
      this.updateConnectionState({ 
        isConnected: false, 
        error: error ? String(error) : undefined 
      });
    });

    this.connection.onreconnecting((error) => {
      console.log("🔄 SignalR reconnecting:", error);
      this.updateConnectionState({ 
        isConnected: false, 
        error: error ? String(error) : undefined 
      });
    });

    this.connection.onreconnected((connectionId) => {
      console.log("✅ SignalR reconnected:", connectionId);
      this.updateConnectionState({ 
        isConnected: true, 
        connectionId,
        error: undefined 
      });
    });
  }

  private updateConnectionState(newState: Partial<SignalRConnectionState>) {
    this.connectionState = { ...this.connectionState, ...newState };
    this.stateListeners.forEach(listener => listener(this.connectionState));
  }

  private notifyListeners(event: string, message: SignalRNotificationMessage) {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => listener(message));
  }

  async start(): Promise<void> {
    if (!this.connection) {
      this.initializeConnection();
    }

    if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("✅ SignalR connection started");
        this.updateConnectionState({ 
          isConnected: true, 
          connectionId: this.connection.connectionId || undefined,
          error: undefined 
        });
      } catch (error) {
        console.error("❌ Failed to start SignalR connection:", error);
        this.updateConnectionState({ isConnected: false, error: String(error) });
        throw error;
      }
    }
  }

  async stop(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("🛑 SignalR connection stopped");
        this.updateConnectionState({ isConnected: false, error: undefined });
      } catch (error) {
        console.error("❌ Failed to stop SignalR connection:", error);
      }
    }
  }

  onNotification(callback: (message: SignalRNotificationMessage) => void): () => void {
    const event = "ReceiveNotification";
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  onConnectionStateChange(callback: (state: SignalRConnectionState) => void): () => void {
    this.stateListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.stateListeners.indexOf(callback);
      if (index > -1) {
        this.stateListeners.splice(index, 1);
      }
    };
  }

  getConnectionState(): SignalRConnectionState {
    return { ...this.connectionState };
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected && this.connectionState.isConnected;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
