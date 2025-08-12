// API Response Types for Evaluations

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
  documents: unknown[] | null;
  "projects-similarity-result": unknown | null;
}
