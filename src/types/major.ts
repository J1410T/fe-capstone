// export type MajorItem = {
//   id: string;
//   name: string;
//   field: null;
// };

// export interface ProjectMajorFilterResponse {
//   "page-index": number;
//   "page-size": number;
//   "total-count": number;
//   "total-page": number;
//   "data-list": ProjectMajorItem[];
// }

// export interface ProjectMajorItem {
//   "project-id": string;
//   "major-id": string;
//   project: {
//     code: string;
//     "english-title": string;
//     "vietnamese-title": string;
//   };
//   major: {
//     id: string;
//     name: string;
//     field: {
//       id: string;
//       name: string;
//     };
//   };
// }

// export interface MajorRequest {
//   name: string;
//   "field-id": string;
// }

// export interface MajorResponse {
//   id: string;
//   name: string;
//   field: {
//     id: string;
//     name: string;
//   } | null;
// }

// export interface MajorFilterRequest {
//   "page-index": number;
//   "page-size": number;
// }

export interface MajorItem {
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
  } | null;
}

export interface MajorFilterRequest {
  "page-index": number;
  "page-size": number;
}

export interface MajorFilterResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": MajorItem[];
}

export interface CreateMajorRequest {
  name: string;
  "field-id": string;
}

export interface UpdateMajorRequest {
  name: string;
  "field-id": string;
}

export interface CreateMajorResponse {
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
  } | null;
}

export interface UpdateMajorResponse {
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
  } | null;
}

// Keep existing types for backward compatibility
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
