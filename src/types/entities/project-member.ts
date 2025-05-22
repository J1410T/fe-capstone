export interface ProjectMember {
  id: string;
  projectId: string;
  memberId: string;
  roleInProject: string;
  durationWorking: number;
  joinedAt: Date;
  status: string;
}
