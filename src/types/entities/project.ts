export interface Project {
  id: string;
  logoURL?: string;
  pictureURL?: string;
  englishTitle: string;
  vietnameseTitle: string;
  duration: number;
  startDate?: Date;
  endDate?: Date;
  abbreviations?: string;
  description?: string;
  requirementNote?: string;
  budget: number;
  progress: number;
  maximumMember: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;

  hostInstitutionId?: string;
  createBy: string;
}
