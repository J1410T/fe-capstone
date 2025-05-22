export interface Milestone {
  id: string;
  code?: string;
  name: string;
  description?: string;
  objective?: string;
  cost: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  status: string;

  projectId: string;
  createBy: string;
}
