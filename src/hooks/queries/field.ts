import { getAllField } from "@/services/resources/field";
import { useQuery } from "@tanstack/react-query";

export function useFieldList() {
  return useQuery({
    queryKey: ["field-list"],
    queryFn: getAllField,
  });
}
