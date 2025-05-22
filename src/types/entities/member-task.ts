export interface MemberTask {
  id: string;
  memberId: string;
  taskId: string;
  joinedAt: Date;
  deliveryDate?: Date;
  progress: number;
  overdue: number;
  note?: string;
  status: string;
}
