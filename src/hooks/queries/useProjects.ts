import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryApi } from "@/services/query-client";
import { DocumentForm } from "@/types/document";

// Query keys for documents
export const documentQueryKeys = {
  all: ["documents"] as const,
  lists: () => [...documentQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...documentQueryKeys.lists(), { filters }] as const,
  details: () => [...documentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...documentQueryKeys.details(), id] as const,
  byUser: (userId: string) =>
    [...documentQueryKeys.all, "user", userId] as const,
  byType: (type: string) => [...documentQueryKeys.all, "type", type] as const,
  scientificCV: (userId: string) =>
    [...documentQueryKeys.all, "scientific-cv", userId] as const,
};

// Types for document operations
export interface CreateDocumentData {
  name: string;
  type: string;
  contentHtml: string;
  isTemplate?: boolean;
  projectId?: string | null;
  evaluationId?: string | null;
  individualEvaluationId?: string | null;
  transactionId?: string | null;
}

export interface UpdateDocumentData {
  name?: string;
  contentHtml?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface DocumentFilters {
  type?: string;
  status?: string;
  uploaderId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}

/**
 * Hook to fetch user's Scientific CV
 */
export const useScientificCV = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: documentQueryKeys.scientificCV(userId),
    queryFn: () =>
      queryApi.get<DocumentForm>(`/documents/scientific-cv/${userId}`),
    enabled: enabled && !!userId,
    throwOnError: false, // Don't throw error if CV doesn't exist
  });
};

/**
 * Hook to fetch documents with optional filters
 */
export const useDocuments = (filters?: DocumentFilters) => {
  return useQuery({
    queryKey: documentQueryKeys.list(filters),
    queryFn: () => queryApi.getPaginated<DocumentForm>("/documents", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single document by ID
 */
export const useDocument = (id: string, enabled = true) => {
  return useQuery({
    queryKey: documentQueryKeys.detail(id),
    queryFn: () => queryApi.get<DocumentForm>(`/document/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

// hooks/useDocumentByType.ts
export const useDocumentByType = (
  type: string,
  isTemplate = false,
  enabled = true
) => {
  return useQuery({
    queryKey: documentQueryKeys.list({ type, "is-template": isTemplate }),
    queryFn: async () => {
      const res = await queryApi.getPaginated<DocumentForm>("/documents", {
        type,
        "is-template": isTemplate,
      });

      return {
        data: Array.isArray(res.data) ? res.data : [],
        pagination: res.pagination || {},
      };
    },
    enabled,
    retry: false,
    throwOnError: false,
  });
};

/**
 * Hook to create a new document
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentData) =>
      queryApi.post<DocumentForm, CreateDocumentData>("/documents", data),
    onSuccess: (newDocument) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });

      // If it's a Scientific CV, invalidate the specific query
      if (newDocument.type === "BM2") {
        queryClient.invalidateQueries({
          queryKey: documentQueryKeys.scientificCV(
            newDocument.uploaderId || newDocument["uploader-id"]
          ),
        });
      }

      // Add the new document to cache
      queryClient.setQueryData(
        documentQueryKeys.detail(newDocument.id),
        newDocument
      );

      toast.success("Document created successfully!", {
        description: `${newDocument.name} has been created.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create document:", error);
      toast.error("Failed to create document", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update an existing document
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentData }) =>
      queryApi.put<DocumentForm>(`/documents/${id}`, data),
    onSuccess: (updatedDocument) => {
      // Update the document in cache
      queryClient.setQueryData(
        documentQueryKeys.detail(updatedDocument.id),
        updatedDocument
      );

      // Invalidate documents list to refresh
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });

      // If it's a Scientific CV, invalidate the specific query
      if (updatedDocument.type === "BM2") {
        queryClient.invalidateQueries({
          queryKey: documentQueryKeys.scientificCV(
            updatedDocument.uploaderId || updatedDocument["uploader-id"]
          ),
        });
      }

      toast.success("Document updated successfully!", {
        description: `${updatedDocument.name} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document");
    },
  });
};

/**
 * Hook to delete a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/documents/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove the document from cache
      queryClient.removeQueries({
        queryKey: documentQueryKeys.detail(deletedId),
      });

      // Invalidate documents list to refresh
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });

      toast.success("Document deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    },
  });
};
