// hooks/useDocumentsByFilter.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  deleteDocumentById,
  getDocumentsByFilter,
  getScientificCVByEmail,
  updateDocument,
  getDocumentByProjectId,
  getDocumentByProjectIdWithUserRole,
} from "@/services/resources/document";
import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  GetDocumentByProjectIdRequest,
} from "@/types/document";

export function useDocumentsByFilter(
  type: string,
  isTemplate: boolean = true,
  pageIndex: number = 1,
  pageSize: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["document", type, isTemplate, pageIndex, pageSize],
    queryFn: () => getDocumentsByFilter(type, isTemplate, pageIndex, pageSize),
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
