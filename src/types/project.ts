import { Member } from "./auth";
import { Transaction } from "./transaction";
import { DocumentProject } from "./document";
import { IndividualEvaluation, Milestone } from "./task";
import { Evaluation } from "./evaluation";
import { ProjectMajorItem } from "./major";

// Filter types
export type StatusFilter = "all" | "created" | "done";
export type FieldFilter = "all" | string;
export type MajorFilter = "all" | string;
export type CategoryFilter = "all" | "basic" | "application/implementation";
export type TypeFilter = "all" | "school level" | "cooperate";
export type SortOption = "latest" | "oldest" | "a-z" | "z-a";

// API interfaces
export interface ProjectFilterRequest {
  title?: string;
  category?: string;
  type?: string;
  "major-id"?: string;
  "field-id"?: string;
  "tag-names"?: string[];
  "sort-by": string;
  desc: boolean;
  "page-index": number;
  "page-size": number;
  statuses?: string[];
  genres?: string[];
}

export interface ProjectFilterResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": ProjectItem[];
}

export interface ProjectItem {
  id: string;
  "logo-url": string | null;
  "picture-url": string | null;
  code: string | null;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string | null;
  duration: number | null;
  "start-date": string | null;
  "end-date": string | null;
  description: string | null;
  "requirement-note": string | null;
  budget: number | null;
  progress: number | null;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genres: string;
  "created-at": string;
  "updated-at": string | null;
  status: string;
  "creator-id": string;
  creator: Member | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  evaluations: Evaluation[] | null;
  "individual-evaluations": IndividualEvaluation[] | null;
  majors: ProjectMajor[] | null;
  "project-tags": ProjectTag[] | null;
  documents: DocumentProject[] | null;
  transactions: Transaction[] | null;
}

export interface ProjectMajor {
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
  };
}

export interface ProjectTag {
  name: string;
}

// Component prop interfaces
export interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  selectedField: FieldFilter;
  onFieldChange: (value: FieldFilter) => void;
  selectedMajor: MajorFilter;
  onMajorChange: (value: MajorFilter) => void;
  selectedSort: SortOption;
  onSortChange: (value: SortOption) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  selectedType: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface ProjectCardProps {
  id: string;
  title: string;
  vietnameseTitle?: string;
  progress: number | null;
  status: string;
  category?: string;
  type?: string;
  description?: string;
  tags?: string[];
  onViewDetails?: (projectId: string) => void;
  getStatusColor?: (status: string) => string;
  logoUrl?: string;
  major?: ProjectMajor[];
  field?: ProjectMajor["field"];
  genres?: string;
}

export interface CreateProjectRequest {
  "english-title": string;
  "vietnamese-title": string;
  abbreviations?: string;
  duration: number;
  description: string;
  "requirement-note"?: string;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
}
export interface CreateProjectMajorRequest {
  "project-id": string;
  "major-id": string;
}

export interface CreateProjectMajorRequest {
  "project-id": string;
  "major-id": string;
}

export interface CreateProjectMajorResponse {
  "project-id": string;
  "major-id": string;
  project: ProjectItem | null;
  major: ProjectMajor | null;
}

export interface ProjectDetailResponse {
  "project-detail": {
    id: string;
    "logo-url": string | null;
    "picture-url": string | null;
    code?: string;
    "english-title": string;
    "vietnamese-title": string;
    abbreviations?: string | null;
    duration?: number | null;
    "start-date": string | null;
    "end-date": string | null;
    description: string | null;
    "requirement-note": string | null;
    budget?: number | null;
    progress: number;
    "maximum-member"?: number;
    language: string;
    category: string;
    type: string;
    genre: string;
    "created-at": string;
    "updated-at": string | null;
    status: string;
    "creator-id": string;
    creator?: Member | null;
    members?: Member[] | null;
    milestones?: Milestone[] | null;
    evaluations?: Evaluation[] | null;
    majors?: ProjectMajor[] | null;
    "project-tags"?: ProjectTag[] | null;
    documents?: DocumentProject[] | null;
    transactions?: Transaction[] | null;
  };
  "is-member": boolean;
  "role-in-project": string[];
}

export type MyProjectResponse = {
  id: string;
  "english-title": string;
  "vietnamese-title": string;
  category: string;
  type: string;
  genre: string;
  status: string;
  "created-at": string;
  progress: number;
  description: string | null;
  "requirement-note": string | null;
  "picture-url": string | null;
  language: string;
};

export interface CreateProjectRequest {
  "english-title": string;
  "vietnamese-title": string;
  abbreviations?: string;
  duration: number;
  description: string;
  "requirement-note"?: string;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
}

// Project Filter Request for Staff Management
export interface StaffProjectFilterRequest {
  title?: string;
  genres: ("propose" | "normal")[];
  statuses: (
    | "created"
    | "inprogress"
    | "completed"
    | "cancelled"
    | "approved"
  )[];
  "page-index": number;
  "page-size": number;
  "sort-by": "createdate" | "englishtitle";
  desc: boolean;
  "include-creator": boolean;
  "include-members": boolean;
}

// Creator information in project response
export interface ProjectCreator {
  id: string;
  code: string;
  "group-name": string | null;
  "is-official": boolean;
  "expire-date": string;
  "created-at": string;
  status: string;
  "account-id": string;
  "full-name": string;
  email: string;
  "avatar-url": string;
  "role-id": string;
  name: string;
  "project-id": string | null;
  "appraisal-council-id": string | null;
}

// Project item in filter response
export interface ProjectFilterItem {
  id: string;
  "logo-url": string | null;
  "picture-url": string | null;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string | null;
  duration: number | null;
  "start-date": string | null;
  "end-date": string | null;
  description: string | null;
  "requirement-note": string | null;
  budget: number;
  progress: number;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genre: "propose" | "normal";
  "created-at": string;
  "updated-at": string | null;
  status: "created" | "in_progress" | "completed" | "cancelled";
  "creator-id": string;
  creator: ProjectCreator;
  members: unknown[];
  milestones: unknown[] | null;
  evaluations: unknown[] | null;
  "project-similarity": unknown | null;
  majors: ProjectMajor[];
  "project-tags": ProjectTag[];
  documents: unknown[] | null;
  transactions: unknown[] | null;
}

// Project Filter Response for Staff Management
export interface StaffProjectFilterResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": ProjectFilterItem[];
}

export interface CreateProjectResponse {
  id: string;
}

export interface CreateProjectMajorRequest {
  "project-id": string;
  "major-id": string;
}

export interface CreateProjectMajorResponse {
  "project-id": string;
  "major-id": string;
  project: ProjectItem | null;
  major: ProjectMajor | null;
}

export interface CreateProjectTagRequest {
  names: string[];
  "project-id": string;
}

export interface UpdateProjectRequest {
  "english-title": string;
  "vietnamese-title": string;
  abbreviations?: string | null;
  duration?: number | null;
  "start-date"?: string | null;
  "end-date"?: string | null;
  description?: string | null;
  "requirement-note"?: string | null;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genre: string;
  status?: string;
}

export interface ProjectTag {
  id?: string;
  name: string;
  "project-id"?: string;
}

export interface EnrollProjectResponse {
  id: string;
  "logo-url": string | null;
  "picture-url": string | null;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string | null;
  duration: number | null;
  "start-date": string | null;
  "end-date": string | null;
  description: string | null;
  "requirement-note": string | null;
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
  creator: Member | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  evaluations: Evaluation[] | null;
  "project-similarity": unknown | null;
  majors: ProjectMajor[];
  "project-tags": ProjectTag[] | null;
  documents: DocumentProject[] | null;
  transactions: Transaction[] | null;
}

export interface Proposal {
  id: string;
  "logo-url": string | null;
  "picture-url": string | null;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string | null;
  duration: number;
  "start-date": string | null;
  "end-date": string | null;
  description: string | null;
  "requirement-note": string | null;
  budget: number;
  progress: number;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genre: string;
  "created-at": string;
  "updated-at": string | null;
  status: string;
  "creator-id": string;
  creator: Member | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  evaluations: Evaluation[] | null;
  "project-similarity": unknown | null;
  majors: ProjectMajorItem[] | null;
  "project-tags": ProjectTag[] | null;
  documents: DocumentProject[] | null;
  transactions: Transaction[] | null;
}

export interface ProjectWithProposals {
  id: string;
  "logo-url": string | null;
  "picture-url": string | null;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  abbreviations: string | null;
  duration: number;
  "start-date": string | null;
  "end-date": string | null;
  description: string | null;
  "requirement-note": string | null;
  budget: number;
  progress: number;
  "maximum-member": number;
  language: string;
  category: string;
  type: string;
  genre: string;
  "created-at": string;
  "updated-at": string | null;
  status: string;
  "creator-id": string;
  proposals: Proposal[];
}

export interface RolePrincipalInvestigatorInfo extends Proposal {
  "pi-account-id"?: string;
  "pi-full-name"?: string;
  "pi-avatar-url"?: string;
  "pi-email"?: string;
}

export interface TopicsListProps {
  selectedCouncil: string; // Changed from topics: Topic[]
}
