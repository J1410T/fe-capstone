// import {
//   createMajor,
//   deleteMajor,
//   getMajorsByField,
//   getMajorsWithPagination,
//   getProjectMajors,
//   updateMajor,
// } from "@/services/resources/major";
// import { MajorFilterRequest, MajorRequest } from "@/types/major";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export function useMajorsByField(fieldId: string) {
//   return useQuery({
//     queryKey: ["major-list", fieldId],
//     queryFn: () => getMajorsByField(fieldId),
//     enabled: !!fieldId && fieldId !== "all",
//   });
// }

// export function useProjectMajors(projectId: string) {
//   return useQuery({
//     queryKey: ["project-majors", projectId],
//     queryFn: () => getProjectMajors(projectId),
//     enabled: !!projectId,
//   });
// }

// export function useMajorsWithPagination(request: MajorFilterRequest) {
//   return useQuery({
//     queryKey: [
//       "majors-pagination",
//       request["page-index"],
//       request["page-size"],
//     ],
//     queryFn: () => getMajorsWithPagination(request),
//     // keepPreviousData: true,
//   });
// }

// export function useCreateMajor() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: MajorRequest) => createMajor(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
//       queryClient.invalidateQueries({ queryKey: ["major-list"] });
//     },
//   });
// }

// export function useUpdateMajor() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: MajorRequest }) =>
//       updateMajor(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
//       queryClient.invalidateQueries({ queryKey: ["major-list"] });
//     },
//   });
// }

// export function useDeleteMajor() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deleteMajor(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
//       queryClient.invalidateQueries({ queryKey: ["major-list"] });
//     },
//   });
// }

import {
  getMajorsByField,
  getProjectMajors,
  getMajorsWithPagination,
  createMajor,
  updateMajor,
  deleteMajor,
} from "@/services/resources/major";
import {
  MajorFilterRequest,
  CreateMajorRequest,
  UpdateMajorRequest,
} from "@/types/major";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMajorsByField(fieldId: string) {
  return useQuery({
    queryKey: ["major-list", fieldId],
    queryFn: () => getMajorsByField(fieldId),
    enabled: !!fieldId && fieldId !== "all",
  });
}

export function useProjectMajors(projectId: string) {
  return useQuery({
    queryKey: ["project-majors", projectId],
    queryFn: () => getProjectMajors(projectId),
    enabled: !!projectId,
  });
}

export function useMajorsWithPagination(request: MajorFilterRequest) {
  return useQuery({
    queryKey: [
      "majors-pagination",
      request["page-index"],
      request["page-size"],
    ],
    queryFn: () => getMajorsWithPagination(request),
    // keepPreviousData: true,
  });
}

export function useCreateMajor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMajorRequest) => createMajor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
      queryClient.invalidateQueries({ queryKey: ["major-list"] });
    },
  });
}

export function useUpdateMajor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMajorRequest }) =>
      updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
      queryClient.invalidateQueries({ queryKey: ["major-list"] });
    },
  });
}

export function useDeleteMajor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors-pagination"] });
      queryClient.invalidateQueries({ queryKey: ["major-list"] });
    },
  });
}
