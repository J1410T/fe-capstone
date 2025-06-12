import { UserRole } from "@/contexts/AuthContext";

// Form types and their role-based visibility
export const FORM_TYPES: Record<
  string,
  { id: string; title: string; roles: UserRole[] }
> = {
  BM1: {
    id: "BM1",
    title: "Evaluation and appraisal of the outline",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
  },
  BM2: {
    id: "BM2",
    title:
      "Minutes of the meeting of the council to review the outline of the scientific research topic",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
  },
  BM3: {
    id: "BM3",
    title: "Project summary report",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR, UserRole.MEMBER],
  },
  BM4: {
    id: "BM4",
    title: "Report on the progress of the scientific research topic",
    roles: [UserRole.MEMBER],
  },
  BM5: {
    id: "BM5",
    title:
      "Proposed changes during the implementation of the scientific research topic",
    roles: [UserRole.MEMBER],
  },
};

export type FormType = keyof typeof FORM_TYPES;

export interface FormData {
  [key: string]: string | number | boolean;
}
