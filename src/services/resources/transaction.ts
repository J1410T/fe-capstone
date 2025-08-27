import { axiosClient, getAccessToken } from "../api";
import {
  TransactionListRequest,
  TransactionListResponse,
  TransactionUpdateRequest,
  TransactionDetail,
} from "@/types/transaction";
import { getUserRoleById } from "./auth";
import { getProjectDetail } from "./project";

// Default avatar URL for fallback
const DEFAULT_AVATAR_URL =
  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";

/**
 * Enriches transaction data with fallback values for missing person/project information
 * This handles cases where the server doesn't populate related data or avatar URLs are invalid
 */
const enrichTransactionData = async (
  transaction: TransactionDetail
): Promise<TransactionDetail> => {
  const enrichedTransaction = { ...transaction };

  // Handle request person data enrichment
  if (transaction["request-person-id"] && !transaction["request-person"]) {
    try {
      const userRole = await getUserRoleById(transaction["request-person-id"]);
      enrichedTransaction["request-person"] = {
        "account-id": userRole["account-id"],
        "full-name": userRole["full-name"],
        email: userRole.email,
        "avatar-url": userRole["avatar-url"] || DEFAULT_AVATAR_URL,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch request person data for ID: ${transaction["request-person-id"]}`,
        error
      );
    }
  }

  // Handle handle person data enrichment
  if (transaction["handle-person-id"] && !transaction["handle-person"]) {
    try {
      const userRole = await getUserRoleById(transaction["handle-person-id"]);
      enrichedTransaction["handle-person"] = {
        "account-id": userRole["account-id"],
        "full-name": userRole["full-name"],
        email: userRole.email,
        "avatar-url": userRole["avatar-url"] || DEFAULT_AVATAR_URL,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch handle person data for ID: ${transaction["handle-person-id"]}`,
        error
      );
    }
  }

  // Handle project data enrichment
  if (transaction["project-id"] && !transaction.project) {
    try {
      const projectResponse = await getProjectDetail(transaction["project-id"]);
      const projectDetail = projectResponse.data["project-detail"];
      enrichedTransaction.project = {
        "english-title": projectDetail["english-title"],
        "vietnamese-title": projectDetail["vietnamese-title"],
        category: projectDetail.category,
        type: projectDetail.type,
        genre: projectDetail.genre,
        status: projectDetail.status,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch project data for ID: ${transaction["project-id"]}`,
        error
      );
    }
  }

  // Ensure avatar URLs have fallbacks
  if (
    enrichedTransaction["request-person"] &&
    !enrichedTransaction["request-person"]["avatar-url"]
  ) {
    enrichedTransaction["request-person"]["avatar-url"] = DEFAULT_AVATAR_URL;
  }
  if (
    enrichedTransaction["handle-person"] &&
    !enrichedTransaction["handle-person"]["avatar-url"]
  ) {
    enrichedTransaction["handle-person"]["avatar-url"] = DEFAULT_AVATAR_URL;
  }

  return enrichedTransaction;
};

export const getTransactionList = async (
  request: TransactionListRequest,
  options?: { enableClientEnrichment?: boolean }
): Promise<TransactionListResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<TransactionListResponse>(
      "/transaction/list",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    // If client-side enrichment is enabled, enrich the data
    if (options?.enableClientEnrichment) {
      const enrichedDataList = await Promise.all(
        res.data["data-list"].map(async (transaction) => {
          try {
            return await enrichTransactionData(transaction);
          } catch (error) {
            console.warn("Failed to enrich transaction data:", error);
            // Return original transaction with avatar fallbacks
            return {
              ...transaction,
              "request-person": transaction["request-person"]
                ? {
                    ...transaction["request-person"],
                    "avatar-url":
                      transaction["request-person"]["avatar-url"] ||
                      DEFAULT_AVATAR_URL,
                  }
                : null,
              "handle-person": transaction["handle-person"]
                ? {
                    ...transaction["handle-person"],
                    "avatar-url":
                      transaction["handle-person"]["avatar-url"] ||
                      DEFAULT_AVATAR_URL,
                  }
                : null,
            };
          }
        })
      );

      return {
        ...res.data,
        "data-list": enrichedDataList,
      };
    }

    // Default behavior: just ensure avatar fallbacks for existing data
    const dataListWithFallbacks = res.data["data-list"].map((transaction) => ({
      ...transaction,
      "request-person": transaction["request-person"]
        ? {
            ...transaction["request-person"],
            "avatar-url":
              transaction["request-person"]["avatar-url"] || DEFAULT_AVATAR_URL,
          }
        : null,
      "handle-person": transaction["handle-person"]
        ? {
            ...transaction["handle-person"],
            "avatar-url":
              transaction["handle-person"]["avatar-url"] || DEFAULT_AVATAR_URL,
          }
        : null,
    }));

    return {
      ...res.data,
      "data-list": dataListWithFallbacks,
    };
  } catch (error) {
    console.error("getTransactionList error:", error);
    throw error;
  }
};

export const updateTransaction = async (
  request: TransactionUpdateRequest
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axiosClient.put("/transaction", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });
  } catch (error) {
    console.error("updateTransaction error:", error);
    throw error;
  }
};

export const deleteTransaction = async (
  transactionId: string
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axiosClient.delete(`/transaction/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteTransaction error:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData: {
  title: string;
  type: string;
  "receiver-account": string;
  "receiver-name": string;
  "receiver-bank-name": string;
  "transfer-content": string;
  "total-money": number;
  "pay-method": string;
  status: string;
  "project-id"?: string;
  "evaluation-stage-id"?: string;
}): Promise<{ id: string }> => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.post("/transaction", transactionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("createTransaction error:", error);
    throw error;
  }
};
