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

// Evaluation System Types
export interface EvaluationCriteria {
  id: string;
  name: string;
  score: number; // 0-10
  maxScore: number;
  weight: number; // percentage
  comments?: string;
}

export interface CouncilEvaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  submittedAt?: string;
  dueDate?: string;
  totalScore: number;
  maxTotalScore: number;
  recommendation: "approve" | "reject" | "revise" | "pending";
  overallComments?: string;
  criteria: EvaluationCriteria[];
  lastUpdated: string;
  evaluationContent?: string; // TinyMCE content for detailed evaluation
}

export interface EvaluationOverview {
  id: string;
  proposalId: number;
  totalEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  overdueEvaluations: number;
  averageScore: number;
  maxPossibleScore: number;
  overallRecommendation: "approve" | "reject" | "revise" | "pending";
  evaluations: CouncilEvaluation[];
  lastUpdated: string;
}

export interface EvaluationStage {
  id: string;
  name: string;
  description: string;
  order: number;
  status: "not_started" | "in_progress" | "completed";
  evaluations: CouncilEvaluation[];
  dueDate?: string;
}

// Enhanced Team Member with detailed information
export interface EnhancedTeamMember extends TeamResearcher {
  id: string;
  profileData?: ProfileData;
  cv?: string;
  detailedInfo?: {
    personalInfo: PersonalInformation;
    contactInfo: ContactInformation;
    academicInfo: AcademicTitle;
    workInfo: WorkUnit;
    educationHistory: EducationRecord[];
    researchExperience?: string;
    publications?: string[];
    awards?: string[];
  };
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
  // Enhanced evaluation system
  evaluationOverview?: EvaluationOverview;
  enhancedTeamMembers?: EnhancedTeamMember[];
}
