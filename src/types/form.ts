export interface FormHostRegister {
  englishTitle: string;
  vietnameseTitle: string;
  abbreviations: string;
  duration: string;
  description: string;
  requirementNote: string;
  maximumMember: string;
  language: string;
  category: string;
  type: string;
  field: string[];
  major: string[];
  tags: string[];
  logoUrl: string;
}

// Form types and interfaces
export enum FormStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  VIEW_ONLY = "view_only",
}

export const FORM_TYPES: Record<string, { title: string }> = {
  project_proposal: { title: "Project Proposal" },
  progress_report: { title: "Progress Report" },
  final_report: { title: "Final Report" },
};

export interface FormMetadata {
  id: string;
  title: string;
  formType: string;
  content: string;
  status: FormStatus;
  lastUpdated: string;
  lastUpdatedByName: string;
  submissionDate?: string;
  projectTitle?: string;
}

// PI Project Registration Form Types
// export interface FormPIRegister {
//   // Step 1: Project Registration
//   englishTitle: string;
//   vietnameseTitle: string;
//   abbreviations: string;
//   duration: string;
//   language: string;
//   category: string;
//   type: string;
//   field: string[];
//   major: string[];
//   tags: string[];
//   maximumMember: string;
//   requirementNote: string; // Add requirement note field

//   // Step 2: Project Summary
//   description: string;
//   objective: string;
//   methodology: string;
//   expectedOutcome: string;

//   // Step 3: Team Members (handled separately)
//   // Step 4: Review (computed from other steps)
// }

// export interface FormPIRegisterErrors {
//   // Step 1 errors
//   englishTitle?: string;
//   vietnameseTitle?: string;
//   duration?: string;
//   language?: string;
//   category?: string;
//   type?: string;
//   field?: string;
//   major?: string;
//   maximumMember?: string;

//   // Step 2 errors
//   description?: string;
//   objective?: string;
//   methodology?: string;
//   expectedOutcome?: string;
// }

// export interface PIProjectRegistrationStep {
//   step: number;
//   title: string;
//   description: string;
//   isCompleted: boolean;
//   isActive: boolean;
// }

// export interface PIProjectDraft {
//   id?: string;
//   formData: FormPIRegister;
//   currentStep: number;
//   lastSaved: string;
//   status: "draft" | "submitted";
// }
