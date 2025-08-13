export interface CreateFirstEvaluationRequest {
  projectId: string;
}

export interface CreateFirstEvaluationResponse {
  evaluationId: string;
}

export interface EvaluationApiResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": Evaluation[];
}

export interface Evaluation {
  id: string;
  code: string;
  title: string;
  "total-rate": number | null;
  comment: string | null;
  "create-date": string;
  status: string;
  "project-id": string;
  "appraisal-council-id": string | null;
  documents: unknown[] | null;
  "evaluation-stages": EvaluationStageApi[];
}

export interface EvaluationStageApiResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": EvaluationStageApi[];
}

export interface EvaluationStageApi {
  id: string;
  name: string;
  "stage-order": number;
  phrase: string;
  type: string;
  status: string;
  "evaluation-id": string;
  "milestone-id": string | null;
  "appraisal-council-id": string | null;
  transactions: unknown[] | null;
  "individual-evaluations": IndividualEvaluationApi[] | null;
}

export interface IndividualEvaluationApiResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": IndividualEvaluationApi[];
}

export interface IndividualEvaluationApi {
  id: string;
  name: string;
  "total-rate": number | null;
  comment: string | null;
  "submitted-at": string;
  "is-approved": boolean;
  "reviewer-result": unknown | null;
  "is-ai-report": boolean;
  status: string;
  "evaluation-stage-id": string;
  "reviewer-id": string | null;
  "reviewer-name": string | null;
  "reviewer-email": string | null;
  "reviewer-avatar": string | null;
  documents: unknown[] | null;
  "projects-similarity-result": unknown | null;
}

export interface GetEvaluationsByProjectIdRequest {
  "project-id": string;
  "page-index": number;
  "page-size": number;
}

export interface GetEvaluationStagesByEvaluationIdRequest {
  "evaluation-id": string;
  "page-index": number;
  "page-size": number;
}

export type EvaluationStage = {
  id: string;
  name: string;
  type: string;
  phrase: string;
  stageOrder: number; // Added stageOrder property
  evaluationId?: string; // Made evaluationId optional
  individualEvaluations: IndividualEvaluation[];
  title: string; // Added title property
  description?: string; // Added optional description property
  status: string; // Added status property
  createdAt?: string; // Added createdAt property
  order?: number; // Added order property
};

export type IndividualEvaluation = {
  id: string;
  totalRate: number;
  comment: string;
  submittedAt: string;
  isApproved: boolean;
  reviewerResult: boolean;
  isAIReport: boolean;
  status: string;
  evaluationStageId: string;
  reviewerId: string;
  reviewerName?: string | null; // Reviewer name
  reviewerEmail?: string | null; // Reviewer email
  reviewerAvatar?: string | null; // Reviewer avatar
  projectId: string;
  milestoneId: string;
  evaluator?: string; // Evaluator name for display
  documentId?: string; // Associated document ID
};

export type EvaluationType =
  | "milestone"
  | "midterm"
  | "summary"
  | "final"
  | "proposal";

export type ProjectEvaluation = {
  id: string;
  title: string;
  type: EvaluationType;
  description?: string;
  projectId: string;
  milestoneId?: string;
  createdAt: string;
  dueDate?: string;
  status: "active" | "completed" | "cancelled" | "pending";
  stages: EvaluationStage[];
};

export type EvaluationSummary = {
  totalEvaluations: number;
  totalStages: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  averageScore?: number;
  overallStatus: "not_started" | "in_progress" | "completed";
  evaluationsByType: Record<EvaluationType, number>;
};

export interface GetIndividualEvaluationsByStageIdRequest {
  "evaluation-stage-id": string;
  "page-index": number;
  "page-size": number;
}

export interface GetIndividualEvaluationByIdRequest {
  id: string;
}

export interface GetIndividualEvaluationByIdResponse {
  data: IndividualEvaluationApi;
}

export interface CreateIndividualEvaluationRequest {
  name: string;
  "total-rate": number;
  comment: string;
  "reviewer-result": boolean;
  "is-ai-report": boolean;
  status: string;
  "evaluation-stage-id": string;
  "reviewer-id": string;
}

export interface CreateIndividualEvaluationResponse {
  id: string;
}
