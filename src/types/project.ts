import { ItemResponse } from ".";
import { Member } from "./auth";
import { Transaction } from "./budget";
import { DocumentProject } from "./document";
import { Evaluation, IndividualEvaluation, Milestone } from "./task";

export type ProjectistResponse = ItemResponse<Project>;

export type ProjectDetail = {
  id: string;
  "logo-url": string;
  "picture-url": string;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string;
  duration: null;
  "start-date": string;
  "end-date": string;
  description: string;
  "requirement-note": string;
  budget: number;
  progress: number;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genre: string;
  "created-at": string;
  "updated-at": string;
  status: string;
  "creator-id": string;
};

export type ProjectResponse = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  dataList: Project[];
};

export type Project = {
  id: string;
  logoUrl: string;
  pictureUrl: string;
  code: string;
  englishTitle: string;
  vietnameseTitle: string;
  abbreviations: string;
  duration: number;
  startDate: string;
  endDate: string;
  description: string;
  requirementNote: string;
  budget: number;
  progress: number;
  maximumMember: number;
  language: string;
  category: string;
  type: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  creatorId: string;
  creator: Member | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  evaluations: Evaluation[] | null;
  individualEvaluations: IndividualEvaluation[] | null;
  majors: Major[] | null;
  projectTags: ProjectTag[] | null;
  documents: DocumentProject[] | null;
  transactions: Transaction[] | null;
};

export type Major = {
  name: string;
  field: {
    name: string;
  };
};

export type ProjectTag = {
  name: string;
};
