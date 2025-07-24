import { Member } from "./auth";
import { Transaction } from "./budget";
import { DocumentProject } from "./document";
import { Evaluation, IndividualEvaluation, Milestone } from "./task";

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
  status?: string;
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
  genre: string;
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

export interface ProjectTag {
  id?: string;
  name: string;
  "project-id"?: string;
}
