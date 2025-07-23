// Profile Data Types
export interface PersonalInformation {
  fullName: string;
  birthYear: string;
  gender: string;
  placeOfBirth: string;
  nativePlace: string;
}

export interface ContactInformation {
  contactPhone: string;
  contactEmail: string;
}

export interface AcademicTitle {
  academicTitle: string;
  academicTitleYear: string;
  academicTitleInstitution: string;
}

export interface WorkUnit {
  workUnitName: string;
  workUnitAddress: string;
  workUnitPhone: string;
  workUnitEmail: string;
}

export interface EducationRecord {
  level: "Bachelor" | "Master" | "Doctorate" | "Postdoctoral";
  institution: string;
  major: string;
  graduationYear: string;
}

export interface ProfileData {
  personalInformation: PersonalInformation;
  contactInformation: ContactInformation;
  academicTitle: AcademicTitle;
  workUnit: WorkUnit;
  educationHistory: EducationRecord[];
}

// Evaluation Data Types
export interface ResearchTitle {
  vietnamese: string;
  english: string;
}

export interface ImplementationTime {
  durationMonths: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

export interface PrincipalInvestigator {
  name: string;
  academicTitle: string;
  dateOfBirth: string;
  gender: string;
  specialization: string;
  scientificTitle: string;
  phone: string;
  email: string;
  workUnit: string;
  workAddress: string;
}

export interface Secretary {
  name: string;
  dateOfBirth: string;
  gender: string;
  specialization: string;
  scientificTitle: string;
  phone: string;
  email: string;
  workUnit: string;
  workAddress: string;
}

export interface TeamResearcher {
  name: string;
  academicTitle: string;
  workUnit: string;
  contribution: string;
  workDuration: string;
  documents?: Document[];
}

export interface Document {
  id: string;
  title: string;
  type: string;
  description?: string;
  uploadedDate: string;
  fileSize?: string;
}

export interface HostInstitution {
  name: string;
  address: string;
}

export interface EvaluationData {
  researchTitle: ResearchTitle;
  implementationTime: ImplementationTime;
  principalInvestigator: PrincipalInvestigator;
  secretary: Secretary;
  teamResearchers: TeamResearcher[];
  hostInstitution: HostInstitution;
  proposalDocuments?: Document[];
}

// Combined Applicant Data (represents proposals submitted to PI)
export interface ApplicantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  institution: string;
  experience: string;
  publications: number;
  degrees: string[];
  status: string;
  appliedFor: number;
  appliedDate: string;
  // Proposal-specific information
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
  profileData: ProfileData;
  evaluationData: EvaluationData;
}
