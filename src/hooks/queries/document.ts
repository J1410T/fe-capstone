// hooks/useDocumentsByFilter.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  getDocumentsByFilter,
  getScientificCVByEmail,
  updateDocument,
} from "@/services/resources/document";
import { CreateDocumentRequest, UpdateDocumentRequest } from "@/types/document";

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
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) => createDocument(data),
    onSuccess: (_, variables) => {
      // Invalidate project query to refresh documents list
      queryClient.invalidateQueries({
        queryKey: ["project", variables["project-id"]],
      });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDocumentRequest) => updateDocument(data),
    onSuccess: () => {
      // Invalidate project query to refresh documents list
      queryClient.invalidateQueries({
        queryKey: ["scientificCV"],
      });
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
