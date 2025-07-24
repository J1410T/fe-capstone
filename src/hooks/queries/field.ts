import {
  createField,
  deleteField,
  getAllField,
  updateField,
} from "@/services/resources/field";
import { FieldRequest } from "@/types/field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFieldList() {
  return useQuery({
    queryKey: ["field-list"],
    queryFn: getAllField,
  });
}

export function useCreateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldRequest) => createField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field-list"] });
    },
  });
}

export function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FieldRequest }) =>
      updateField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field-list"] });
    },
  });
}

export function useDeleteField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteField(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field-list"] });
    },
  });
}
