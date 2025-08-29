// hooks/useDocumentsByFilter.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  deleteDocumentById,
  getDocumentsByFilter,
  getAllDocumentTemplates,
  getScientificCVByEmail,
  updateDocument,
  getDocumentByProjectId,
  getDocumentByProjectIdWithUserRole,
  createDocumentByIndividualEvaluation,
  createMilestoneByDocumentProject,
} from "@/services/resources/document";
import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  GetDocumentByProjectIdRequest,
  CreateDocumentByIndividualEvaluationResponse,
  CreateDocumentByIndividualEvaluationRequest,
  CreateMilestoneByDocumentProjectRequest,
  CreateMilestoneByDocumentProjectResponse,
} from "@/types/document";

// Hook mới để lấy tất cả document templates trong 1 lần gọi
export function useAllDocumentTemplates(
  pageIndex: number = 1,
  pageSize: number = 50,
  status?: string
) {
  return useQuery({
    queryKey: ["all-document-templates", pageIndex, pageSize, status],
    queryFn: () => getAllDocumentTemplates(pageIndex, pageSize, status),
    enabled: true,
    staleTime: Infinity, // Không bao giờ stale
    gcTime: Infinity, // Không bao giờ garbage collect
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false, // Không refetch theo interval
    retry: false, // Không retry khi fail
  });
}

export function useDocumentsByFilter(
  type: string,
  isTemplate: boolean = true,
  pageIndex: number = 1,
  pageSize: number = 10,
  enabled: boolean = true,
  status?: string
) {
  return useQuery({
    queryKey: ["document", type, isTemplate, pageIndex, pageSize, status],
    queryFn: () =>
      getDocumentsByFilter(type, isTemplate, pageIndex, pageSize, status),
    enabled: !!type && enabled,
  });
}

// export function useUpdateDocument() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: UpdateDocumentRequest) => updateDocument(data),
//     onSuccess: (_, variables) => {
//       // Invalidate relevant queries after successful update
//       queryClient.invalidateQueries({ queryKey: ["document"] });
//       queryClient.invalidateQueries({
//         queryKey: ["document-by-project-id-with-user-role"],
//       });
//       // Invalidate project query to refresh documents list
//       if (variables["project-id"]) {
//         queryClient.invalidateQueries({
//           queryKey: ["project", variables["project-id"]],
//         });
//       }
//     },
//   });
// }

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDocumentRequest) => updateDocument(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after successful update
      queryClient.invalidateQueries({ queryKey: ["document"] });

      // Fix: Use correct query key pattern that matches useDocumentByProjectIdWithUserRole
      queryClient.invalidateQueries({
        queryKey: ["document", "project", "with-user-role"],
      });

      // Also invalidate the specific project's document queries
      if (variables["project-id"]) {
        queryClient.invalidateQueries({
          queryKey: ["document", "project", variables["project-id"]],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "document",
            "project",
            "with-user-role",
            variables["project-id"],
          ],
        });
        // Invalidate project query to refresh documents list
        queryClient.invalidateQueries({
          queryKey: ["project", variables["project-id"]],
        });
      }
    },
    onError: (error, variables) => {
      console.error("Failed to update document:", error);
      console.error("Variables:", variables);
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) => createDocument(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after successful creation
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });

      // Only invalidate project query if project-id exists
      if (variables["project-id"]) {
        queryClient.invalidateQueries({
          queryKey: ["project", variables["project-id"]],
        });
      }
    },
  });
}

export function useScientificCVByEmail(email: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["scientificCV", email],
    queryFn: () => getScientificCVByEmail(email),
    enabled: !!email && enabled,
    refetchOnMount: true,
    staleTime: 0,
  });
}

export function useDeleteDocumentById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocumentById(documentId),
    onSuccess: (_, documentId) => {
      // Invalidate project queries to refresh documents list
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
      // Invalidate document queries
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });
      // Invalidate scientificCV queries to refresh the CV data
      queryClient.invalidateQueries({
        queryKey: ["scientificCV"],
      });
      console.log(`Document ${documentId} deleted successfully!`);
    },
    onError: (error) => {
      console.error("Failed to delete document:", error);
    },
  });
}

export function useDocumentByProjectId(
  request: GetDocumentByProjectIdRequest,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [
      "document",
      "project",
      request["project-id"],
      request["page-index"],
      request["page-size"],
      // request.status,
    ],
    queryFn: () => getDocumentByProjectId(request),
    enabled: !!request["project-id"] && enabled,
  });
}

export function useDocumentByProjectIdWithUserRole(
  request: GetDocumentByProjectIdRequest,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [
      "document",
      "project",
      "with-user-role",
      request["project-id"],
      request["page-index"],
      request["page-size"],
      request.status,
    ],
    queryFn: () => getDocumentByProjectIdWithUserRole(request),
    enabled: !!request["project-id"] && enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since user role data doesn't change frequently
  });
}

export const useCreateDocumentByIndividualEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDocumentByIndividualEvaluationResponse,
    Error,
    CreateDocumentByIndividualEvaluationRequest
  >({
    mutationFn: (request: CreateDocumentByIndividualEvaluationRequest) =>
      createDocumentByIndividualEvaluation(request),
    onSuccess: (data, variables) => {
      console.log(
        "Document created by individual evaluation successfully:",
        data.id
      );

      // Invalidate relevant queries after successful creation
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });

      // Invalidate individual evaluation queries if needed
      if (variables["individual-evaluation-id"]) {
        queryClient.invalidateQueries({
          queryKey: [
            "individual-evaluation",
            variables["individual-evaluation-id"],
          ],
        });
      }
    },
    onError: (error) => {
      console.error(
        "Failed to create document by individual evaluation:",
        error
      );
    },
  });
};

export const useCreateMilestoneByDocumentProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateMilestoneByDocumentProjectResponse,
    Error,
    CreateMilestoneByDocumentProjectRequest
  >({
    mutationFn: (request: CreateMilestoneByDocumentProjectRequest) =>
      createMilestoneByDocumentProject(request),
    onSuccess: (data, variables) => {
      console.log(
        "Milestone created by document project successfully:",
        data.id
      );

      // Invalidate relevant queries after successful creation
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones"],
      });

      // Invalidate project query if project-id exists
      if (variables["project-id"]) {
        queryClient.invalidateQueries({
          queryKey: ["project", variables["project-id"]],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to create milestone by document project:", error);
    },
  });
};
