export type MajorItem = {
  id: string;
  name: string;
  field: null;
};

export interface ProjectMajorFilterResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": ProjectMajorItem[];
}

export interface ProjectMajorItem {
  "project-id": string;
  "major-id": string;
  project: {
    code: string;
    "english-title": string;
    "vietnamese-title": string;
  };
  major: {
    id: string;
    name: string;
    field: {
      id: string;
      name: string;
    };
  };
}
