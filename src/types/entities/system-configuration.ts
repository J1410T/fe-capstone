export interface SystemConfiguration {
  id: string;
  configKey?: string;
  configValue?: string;
  configType: string;
  description?: string;
  lastUpdate: Date;
  createDate: Date;
  staffId: string;
}
