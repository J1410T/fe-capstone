export interface Task {
  id: string;
  code?: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  deliveryDate?: Date;
  priority?: string;
  progress: number;
  overdue: number;
  note?: string;
  status: string;

  milestoneId: string;
  createBy: string;
}
