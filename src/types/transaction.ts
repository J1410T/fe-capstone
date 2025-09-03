// Transaction API Types
export interface TransactionListRequest {
  "key-word"?: string;
  "sort-by": number; // 0 = RequestDate, 2 = Title
  "page-index": number;
  "page-size": number;
}

export interface TransactionUpdateRequest {
  id: string;
  "receiver-account": string;
  "receiver-name": string;
  "receiver-bank-name": string;
  title: string;
  type: string;
  "fee-cost": number;
  "total-money": number;
  "pay-method": string;
  status: string;
  "project-id": string | null;
  "evaluation-stage-id": string | null;
}

export interface TransactionApproveRequest {
  id: string;
  "evidence-image": string;
  code: string;
  title: string;
  type: string;
  "sender-account": string;
  "sender-name": string;
  "sender-bank-name": string;
  "receiver-account": string;
  "receiver-name": string;
  "receiver-bank-name": string;
  "transfer-content": string;
  "request-date": string;
  "handle-date": string;
  "fee-cost": number;
  "total-money": number;
  "pay-method": string;
  status: string;
  "request-person-id": string;
  "handle-person-id": string;
  "project-id": string;
  "evaluation-stage-id": string;
}

export interface TransactionPerson {
  "account-id": string;
  "full-name": string;
  email: string;
  "avatar-url": string | null;
}

export interface TransactionProject {
  "english-title": string;
  "vietnamese-title": string;
  category: string;
  type: string;
  genre: string;
  status: string;
}

export interface TransactionDetail {
  id: string;
  "evidence-image": string | null;
  code: string;
  title: string;
  type: string;
  "sender-account": string | null;
  "sender-name": string | null;
  "sender-bank-name": string | null;
  "receiver-account": string;
  "receiver-name": string;
  "receiver-bank-name": string;
  "transfer-content": string | null;
  "request-date": string;
  "handle-date": string | null;
  "fee-cost": number;
  "total-money": number;
  "pay-method": string;
  status: string;
  "request-person-id": string;
  "request-person": TransactionPerson | null;
  "handle-person-id": string | null;
  "handle-person": TransactionPerson | null;
  "project-id": string | null;
  project: TransactionProject | null;
  "evaluation-stage-id": string | null;
  documents: null;
}

export interface TransactionListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": TransactionDetail[];
}

// Legacy Transaction type for backward compatibility
export type Transaction = {
  code: string;
  title: string;
  description: string;
  type: string;
  status: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  creatorId: string;
};
