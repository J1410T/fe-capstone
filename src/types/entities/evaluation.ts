export interface Evaluation {
  id: string;
  totalRate: number;
  createDate: Date;
  comment?: string;
  isApproved: boolean;
  status: string;

  councilId: string;
  projectId: string;
  milestoneId?: string;
  finalDocId?: string;
}
