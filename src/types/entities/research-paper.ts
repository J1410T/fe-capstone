export interface ResearchPaper {
  id: string;
  refLink: string;
  title?: string;
  content?: string;
  viewed: number;
  providerName?: string;
  addedDate: Date;
  projectId: string;
  principalInvestigatorId: string;
}
