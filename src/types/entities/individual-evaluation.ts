export interface IndividualEvaluation {
  id: string;
  totalRate: number;
  comment?: string;
  submittedAt: Date;
  isApproved: boolean;
  status: string;

  evaluationStageId: string;
  reviewerId: string;
  projectId?: string;
  milestoneId?: string;
}
