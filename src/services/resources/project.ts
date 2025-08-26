import {
  CreateProjectMajorRequest,
  CreateProjectMajorResponse,
  CreateProjectRequest,
  CreateProjectTagRequest,
  UpdateProjectRequest,
  EnrollProjectResponse,
  MyProjectResponse,
  ProjectDetailResponse,
  ProjectFilterRequest,
  ProjectFilterResponse,
  StaffProjectFilterRequest,
  StaffProjectFilterResponse,
  // ProjectItem,
  ProjectTag,
  SortOption,
  ProjectItem,
  ProjectWithProposals,
  CheckUserEnrollmentResponse,
  ProjectListWithMeetingTaskRequest,
  ProjectFilterMeetingTaskResponse,
  // RolePrincipalInvestigatorInfo,
} from "@/types/project";
import { axiosClient, getAccessToken } from "../api";
import { getAllRoles, getUserRoleByProjectIdAndRoleId } from "./auth";
import { getMilestonesByProjectId } from "./milestone";
import { getTasksByMilestoneId } from "./task";
// import { getProjectMajors } from "./major";
// import { getAllRoles } from "./auth";

export const getProjectListFilter = async (
  params?: Partial<ProjectFilterRequest>
) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectFilterResponse>(
      `/project/filter`,
      {
        ...params,
        genres: ["normal", "propose"],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("params project filter:", params);
    return res.data;
  } catch (error) {
    console.error("getProjectListFilter error:", error);
    throw error;
  }
};

// export const buildFilterParams = (filters: {
//   searchTerm: string;
//   selectedStatus: string;
//   selectedField: string;
//   selectedMajor: string;
//   selectedCategory: string;
//   selectedType: string;
//   selectedSort: SortOption;
//   tags: string[];
//   currentPage: number;
//   pageSize: number;
// }): ProjectFilterRequest => {
//   const {
//     searchTerm,
//     selectedStatus,
//     selectedField,
//     selectedMajor,
//     selectedCategory,
//     selectedType,
//     selectedSort,
//     tags,
//     currentPage,
//     pageSize,
//   } = filters;

//   // Build sort parameters
//   const getSortParams = (sort: SortOption) => {
//     switch (sort) {
//       case "latest":
//         return { "sort-by": "createdate", desc: true };
//       case "oldest":
//         return { "sort-by": "createdate", desc: false };
//       case "a-z":
//         return { "sort-by": "englishtitle", desc: false };
//       case "z-a":
//         return { "sort-by": "englishtitle", desc: true };
//       default:
//         return { "sort-by": "createdate", desc: true };
//     }
//   };

//   const sortParams = getSortParams(selectedSort);
//   const params: ProjectFilterRequest = {
//     ...sortParams,
//     "page-index": currentPage,
//     "page-size": pageSize,
//   };

//   // Only add non-"all" filters
//   if (searchTerm.trim()) {
//     params.title = searchTerm.trim();
//   }

//   if (selectedStatus !== "all") {
//     params.status = selectedStatus;
//   }

//   if (selectedCategory !== "all") {
//     params.category = selectedCategory;
//   }

//   if (selectedType !== "all") {
//     params.type = selectedType;
//   }

//   if (selectedField !== "all") {
//     params["field-id"] = selectedField;
//   }

//   if (selectedMajor !== "all") {
//     params["major-id"] = selectedMajor;
//   }

//   if (tags.length > 0) {
//     params["tag-names"] = tags;
//   }

//   return params;
// };

export const buildFilterParams = (filters: {
  searchTerm: string;
  selectedStatus: string;
  selectedField: string;
  selectedMajor: string;
  selectedCategory: string;
  selectedType: string;
  selectedSort: SortOption;
  tags: string[];
  currentPage: number;
  pageSize: number;
}): ProjectFilterRequest => {
  const {
    searchTerm,
    selectedStatus,
    selectedField,
    selectedMajor,
    selectedCategory,
    selectedType,
    selectedSort,
    tags,
    currentPage,
    pageSize,
  } = filters;

  // Build sort parameters
  const getSortParams = (sort: SortOption) => {
    switch (sort) {
      case "latest":
        return { "sort-by": "createdate", desc: true };
      case "oldest":
        return { "sort-by": "createdate", desc: false };
      case "a-z":
        return { "sort-by": "englishtitle", desc: false };
      case "z-a":
        return { "sort-by": "englishtitle", desc: true };
      default:
        return { "sort-by": "createdate", desc: true };
    }
  };

  const sortParams = getSortParams(selectedSort);
  const params: ProjectFilterRequest = {
    ...sortParams,
    "page-index": currentPage,
    "page-size": pageSize,
    genres: ["normal", "propose"],
  };

  // Only add non-"all" filters
  if (searchTerm.trim()) {
    params.title = searchTerm.trim();
  }

  // Handle status filter - if "all", include both created and completed
  if (selectedStatus !== "all") {
    params.statuses = [selectedStatus];
  } else {
    params.statuses = ["created", "completed"];
  }

  if (selectedCategory !== "all") {
    params.category = selectedCategory;
  }

  if (selectedType !== "all") {
    params.type = selectedType;
  }

  if (selectedField !== "all") {
    params["field-id"] = selectedField;
  }

  if (selectedMajor !== "all") {
    params["major-id"] = selectedMajor;
  }

  if (tags.length > 0) {
    params["tag-names"] = tags;
  }

  return params;
};

export const createProject = async (
  data: CreateProjectRequest
): Promise<string> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<string>(`/project`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createProject error:", error);
    throw error;
  }
};

export const createProjectMajor = async (
  data: CreateProjectMajorRequest
): Promise<CreateProjectMajorResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<CreateProjectMajorResponse>(
      `/project-major`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("createProjectMajor error:", error);
    throw error;
  }
};

export const createProjectTag = async (
  data: CreateProjectTagRequest
): Promise<ProjectTag[]> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectTag[]>(`/project-tag`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createProjectTag error:", error);
    throw error;
  }
};

export const getProjectDetail = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<ProjectDetailResponse>(`/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getMyProjectList = async (params?: {
  Statuses?: string;
  Genres?: string;
}) => {
  const accessToken = getAccessToken();

  return await axiosClient.get<MyProjectResponse[]>(`/project/my-project`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  });
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectRequest,
  status?: string
): Promise<ProjectDetailResponse> => {
  try {
    const accessToken = getAccessToken();
    const url = status
      ? `/project/${projectId}?status=${status}`
      : `/project/${projectId}`;
    const res = await axiosClient.put<ProjectDetailResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("updateProject error:", error);
    throw error;
  }
};

export const enrollProjectAsPrincipal = async (
  projectId: string
): Promise<EnrollProjectResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<EnrollProjectResponse>(
      `/project/enroll-as-principal/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("enrollProjectAsPrincipal error:", error);
    throw error;
  }
};

export const getProjectByHostInstitution = async (): Promise<ProjectItem[]> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get(`/project/host`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getProjectByHostInstitution full response:", res);
    console.log("getProjectByHostInstitution response data:", res.data);

    // Handle different possible response structures
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (res.data && Array.isArray(res.data["data-list"])) {
      return res.data["data-list"];
    } else {
      console.warn("Unexpected response structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error("getProjectByHostInstitution error:", error);
    throw error;
  }
};

// New API function for project filtering (Staff Management)
export const getStaffProjectFilter = async (
  request: StaffProjectFilterRequest
): Promise<StaffProjectFilterResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<StaffProjectFilterResponse>(
      `/project/filter`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getStaffProjectFilter error:", error);
    throw error;
  }
};

export const getProjecList = async (
  request: ProjectListWithMeetingTaskRequest
) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectFilterResponse>(
      `/project/filter`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getProjecListWithMeetingsTask error:", error);
    throw error;
  }
};

export const getProjecListWithMeetingsTask = async (
  request: ProjectListWithMeetingTaskRequest
): Promise<ProjectFilterMeetingTaskResponse> => {
  try {
    // 1. Lấy danh sách project
    const projectResponse = await getProjecList(request);

    // 2. Duyệt qua từng project
    const updatedProjects = await Promise.all(
      projectResponse["data-list"].map(async (project) => {
        try {
          // 3. Lấy milestones của project
          const milestoneRes = await getMilestonesByProjectId(project.id);
          const milestones = milestoneRes.data;

          // 4. Tìm milestone có title = "meeting"
          const meetingMilestone = milestones.find(
            (m) => m.title?.trim().toLowerCase() === "meeting"
          );

          if (!meetingMilestone) {
            return { ...project, tasks: null, milestoneID: "" };
          }

          // 5. Lấy danh sách tasks theo milestone
          const tasksRes = await getTasksByMilestoneId(meetingMilestone.id);
          const tasks = tasksRes.data["data-list"];

          return { ...project, tasks, milestoneID: meetingMilestone.id };
        } catch (err) {
          console.error(`Error when processing project ${project.id}:`, err);
          return { ...project, tasks: null, milestoneID: "" };
        }
      })
    );

    // 6. Trả kết quả cuối
    return {
      ...projectResponse,
      "data-list": updatedProjects,
    };
  } catch (error) {
    console.error("getProjecListWithMeetingsTask error:", error);
    throw error;
  }
};

export const getProjectsByCouncilId = async (
  councilId: string,
  statuses: string[] = [] // truyền mảng status, mặc định rỗng
) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<ProjectWithProposals[]>(
      `/appraisal-council/list-project/${councilId}`,
      statuses, // body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
          Accept: "*/*",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("getProjectsByCouncilId error:", error);
    throw error;
  }
};

export const getProjectsByCouncilIdWithPI = async (
  councilId: string,
  statuses: string[] = []
): Promise<ProjectWithProposals[]> => {
  try {
    // 1. Lấy danh sách project theo councilId
    const projectResponse = await getProjectsByCouncilId(councilId, statuses);

    // 2. Lấy roleId của Principal Investigator
    const allRoles = await getAllRoles();
    const RoleIdPI = allRoles.find(
      (role) => role.name === "Principal Investigator"
    )?.id;

    if (!RoleIdPI) {
      throw new Error("Role Principal Investigator not found");
    }

    // 3. Map qua từng project
    const projectsWithPI: ProjectWithProposals[] = await Promise.all(
      projectResponse.map(async (project) => {
        // Với mỗi proposal trong project → gắn thêm thông tin PI
        const proposalsWithPI = await Promise.all(
          project.proposals.map(async (proposal) => {
            try {
              const piResponse = await getUserRoleByProjectIdAndRoleId(
                proposal.id,
                RoleIdPI
              );

              const piInfo = piResponse.data["data-list"]?.[0];

              return {
                ...proposal,
                ...(piInfo && {
                  "pi-account-id": piInfo["account-id"],
                  "pi-full-name": piInfo["full-name"],
                  "pi-avatar-url": piInfo["avatar-url"],
                  "pi-email": piInfo["email"],
                }),
              };
            } catch (err) {
              console.error(
                `Error fetching PI for proposal ${proposal.id}:`,
                err
              );
              return proposal; // fallback giữ nguyên proposal
            }
          })
        );

        return {
          ...project,
          proposals: proposalsWithPI,
        };
      })
    );

    return projectsWithPI;
  } catch (err) {
    console.error("Error in getProjectsByCouncilIdWithPI:", err);
    return [];
  }
};

// export const getProjectsByCouncilIdWithPI = async (
//   councilId: string,
//   statuses: string[] = []
// ): Promise<RolePrincipalInvestigatorInfo[]> => {
//   try {
//     // 1. Lấy danh sách project theo councilId
//     const projectResponse = await getProjectsByCouncilId(councilId, statuses);

//     // 2. Lấy roleId của Principal Investigator
//     const allRoles = await getAllRoles();
//     const RoleIdPI = allRoles.find(
//       (role) => role.name === "Principal Investigator"
//     )?.id;

//     if (!RoleIdPI) {
//       throw new Error("Role Principal Investigator not found");
//     }

//     // 3. Map qua từng project
//     const projectsWithPI: RolePrincipalInvestigatorInfo[] = await Promise.all(
//       projectResponse.map(async (project) => {
//         const proposalsWithPI = await Promise.all(
//           project.proposals.map(async (proposal) => {
//             try {
//               // Lấy thông tin PI
//               const piResponse = await getUserRoleByProjectIdAndRoleId(
//                 proposal.id,
//                 RoleIdPI
//               );
//               const piInfo = piResponse.data["data-list"]?.[0];

//               // Lấy project-tags
//               let projectTags = null;
//               try {
//                 const tagsRes = await getProjectTagsByProjectId(proposal.id);
//                 projectTags = tagsRes.data ?? tagsRes; // tuỳ axiosClient return data
//               } catch (err) {
//                 console.warn("getProjectTagsByProjectId error:", err);
//               }

//               // Lấy majors
//               let majors = null;
//               try {
//                 const majorsRes = await getProjectMajors(proposal.id);
//                 majors = majorsRes?.["data-list"] ?? majorsRes;
//               } catch (err) {
//                 console.warn("getProjectMajors error:", err);
//               }

//               return {
//                 ...proposal,
//                 ...(piInfo && {
//                   "pi-account-id": piInfo["account-id"],
//                   "pi-full-name": piInfo["full-name"],
//                   "pi-avatar-url": piInfo["avatar-url"],
//                   "pi-email": piInfo["email"],
//                 }),
//                 "project-tags": projectTags,
//                 majors: majors,
//               };
//             } catch (err) {
//               console.error(`Error processing proposal ${proposal.id}:`, err);
//               return proposal;
//             }
//           })
//         );

//         return {
//           ...project,
//           proposals: proposalsWithPI,
//         };
//       })
//     );

//     return projectsWithPI;
//   } catch (err) {
//     console.error("Error in getProjectsByCouncilIdWithPI:", err);
//     return [];
//   }
// };

export const getProjectById = async (
  projectId: string
): Promise<ProjectWithProposals> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<ProjectWithProposals>(
      `/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getProjectById error:", error);
    throw error;
  }
};

export const approveProject = async (proposalProjectId: string) => {
  try {
    const accessToken = getAccessToken();
    await axiosClient.post<string>(`/project/${proposalProjectId}/approve`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("approveProject error:", error);
    throw error;
  }
};

export const getProjectTagsByProjectId = async (projectId: string) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<ProjectTag[]>(
    `/project-tag/project/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const checkUserEnrollment = async (projectId: string) => {
  const accessToken = getAccessToken();

  return await axiosClient.get<CheckUserEnrollmentResponse>(
    `/project/check-enrollment/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    }
  );
};
