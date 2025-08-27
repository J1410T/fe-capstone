import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTransactionList,
  updateTransaction,
  deleteTransaction,
  createTransaction,
} from "@/services/resources/transaction";
import {
  TransactionListRequest,
  TransactionUpdateRequest,
} from "@/types/transaction";

export function useTransactionList(
  request: TransactionListRequest,
  options?: { enableClientEnrichment?: boolean }
) {
  return useQuery({
    queryKey: [
      "transaction-list",
      request["key-word"],
      request["sort-by"],
      request["page-index"],
      request["page-size"],
      options?.enableClientEnrichment ? "enriched" : "default",
    ],
    queryFn: () => getTransactionList(request, options),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TransactionUpdateRequest) =>
      updateTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-list"] });
      toast.success("Transaction updated successfully");
    },
    onError: (error) => {
      console.error("Update transaction error:", error);
      toast.error("Failed to update transaction");
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-list"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      console.error("Delete transaction error:", error);
      toast.error("Failed to delete transaction");
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate and refetch transaction list
      queryClient.invalidateQueries({ queryKey: ["transaction-list"] });
      toast.success("Transaction request created successfully!");
    },
    onError: (error) => {
      console.error("Create transaction error:", error);
      toast.error("Failed to create transaction request");
    },
  });
}
