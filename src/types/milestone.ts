import { Member } from "./auth";
import { Evaluation } from "./evaluation";
import { ProjectTask } from "./task";

export type Milestone = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  objective: string | null;
  cost: number;
  "start-date": string | null;
  "end-date": string | null;
  type: string;
  "created-at": string;
  status: string;
  "project-id": string;
  "creator-id": string;
  project: string | null;
  creator: Member | null;
  evaluations: Evaluation[] | null;
  tasks: ProjectTask[] | null;
};

export type CreateMilestoneRequest = {
  title: string;
  description?: string;
  objective?: string;
  "start-date"?: string;
  "end-date"?: string;
  type: string;
  "project-id": string;
  "creator-id": string;
};

export type UpdateMilestoneRequest = {
  title: string;
  description?: string;
  objective?: string;
  "start-date"?: string;
  "end-date"?: string;
  type: string;
  "project-id": string;
  "creator-id": string;
};
