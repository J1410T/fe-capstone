export type DocumentForm = {
  id: string;
  name: string;
  type: string;
  "is-template": boolean;
  "content-html": string;
  "updated-at": string;
  "upload-at": string;
  status: "created" | "pending" | "approved" | "rejected" | string;
  "uploader-id": string;
  "project-id": string | null;
  "evaluation-id": string | null;
  "individual-evaluation-id": string | null;
  "transaction-id": string | null;
};

export type DocumentProject = {
  id: string;
  name: string;
  type: string;
  dateInDoc: string;
  "updated-at": string;
  "upload-at": string;
  "content-html": string;
  "uploader-id": string;
  "project-id": string;
  "evaluation-id": string;
  "individual-evaluation-id": string;
  "transaction-id": string;
  status: string;
  uploaderId: string;
  projectId: string;
  evaluationId: string;
  individualEvaluationId: string;
  transactionId: string;
  documentFields: DocumentField[];
};

export type DocumentField = {
  id: string;
  indexInDoc: number;
  chapter: string;
  chapterAlign: string;
  chapterStyle: string;
  title: string;
  titleAlign: string;
  titleStyle: string;
  subtitle: string;
  subTitleAlign: string;
  subTitleStyle: string;
  updatedAt: string;
  createdAt: string;
  documentId: string;
  fieldContents: FieldContent[];
};

export type FieldContent = {
  id: string;
  indexInField: number;
  title: string;
  titleAlign: string;
  titleStyle: string;
  content: string;
  contentAlign: string;
  contentStyle: string;
  updatedAt: string;
  createdAt: string;
  documentFieldId: string;
  contentTables: ContentTable[];
};

export type ContentTable = {
  id: string;
  columnIndex: number;
  rowIndex: number;
  columnTitle: string;
  columnTitleAlign: string;
  columnTitleStyle: string;
  subColumnTitle: string;
  subColumnTitleAlign: string;
  subColumnTitleStyle: string;
  cellContent: string;
  cellContentAlign: string;
  cellContentStyle: string;
  updatedAt: string;
  createdAt: string;
  fieldContentId: string;
};
export interface DocumentListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": DocumentForm[];
}

export interface CreateDocumentRequest {
  name: string;
  type: string;
  status: string;
  "is-template": boolean;
  "content-html": string;
  "project-id": string | null;
}

export interface CreateDocumentResponse {
  id: string;
}

export interface GetDocumentByProjectIdRequest {
  "is-template": boolean;
  status?: string;
  "page-index": number;
  "page-size": number;
  "project-id": string;
}

export interface DocumentWithUserRole extends DocumentForm {
  "account-id"?: string;
  "full-name"?: string;
  "avatar-url"?: string;
}

export interface DocumentListWithUserRoleResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": DocumentWithUserRole[];
}

export interface UpdateDocumentRequest {
  id: string;
  name: string;
  type: string;
  "is-template": boolean;
  "content-html": string;
  status?: string;
  "project-id"?: string | null;
  "individual-evaluation-id"?: string | null;
}
export interface UpdateDocumentResponse {
  message: string;
}

export interface CreateDocumentByIndividualEvaluationRequest {
  name: string;
  type: string;
  "is-template": boolean;
  status: string;
  "content-html": string;
  "individual-evaluation-id": string;
}

export interface CreateDocumentByIndividualEvaluationResponse {
  id: string;
}

export interface CreateMilestoneByDocumentProjectRequest {
  "section-title": string;
  description: string;
  objective: string;
  "cost-estimate": string;
  "time-estimate": string;
  "project-id": string;
  "document-content": string;
  "creator-id": string;
}

export interface CreateMilestoneByDocumentProjectResponse {
  id: string;
}

export interface DocumentInEvaluation {
  id: string;
  name: string;
  type: string;
  "is-template": boolean;
  "content-html": string;
  "updated-at": string;
  "upload-at": string;
  status: string;
  "editor-id": string | null;
  "uploader-id": string;
  "project-id": string | null;
  "evaluation-id": string | null;
  "individual-evaluation-id": string;
  "transaction-id": string | null;
  signatures: unknown | null;
}
