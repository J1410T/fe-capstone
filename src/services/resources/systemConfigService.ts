import { axiosClient, getAccessToken } from "../api";

export interface ConfigItem {
  id: string;
  "config-key": string;
  "config-value": string;
  "config-type": string;
  description: string | null;
  "last-update": string;
  "create-date": string;
}

export interface UpdateConfigRequest {
  "config-key": string;
  "config-value": string;
  "config-type": string;
  description?: string;
  "last-update"?: string;
}

class SystemConfigService {
  async getAllConfigs(): Promise<ConfigItem[]> {
    try {
      const token = getAccessToken();
      const response = await axiosClient.get("/system-configuration", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getAllConfigs:", error);
      throw error;
    }
  }

  async updateConfig(
    id: string,
    config: UpdateConfigRequest
  ): Promise<ConfigItem> {
    try {
      const token = getAccessToken();

      // Add current date for last-update (date only, no time)
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const updatePayload = {
        id,
        ...config,
        "last-update": currentDate,
      };

      const response = await axiosClient.put(
        "/system-configuration",
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateConfig:", error);
      throw error;
    }
  }
}

export const systemConfigService = new SystemConfigService();
