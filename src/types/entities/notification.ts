export interface Notification {
  id: string;
  title: string;
  type: string;
  isSystemSend: boolean;
  isRead: boolean;
  createDate: Date;
  status: string;

  transactionId?: string;
  individualEvaluationId?: string;
  evaluationStageId?: string;
  evaluationId?: string;
  councilMemberId?: string;
  documentId?: string;
  memberTaskId?: string;
  taskId?: string;
  projectMemberId?: string;
  systemConfigurationId?: string;
}
