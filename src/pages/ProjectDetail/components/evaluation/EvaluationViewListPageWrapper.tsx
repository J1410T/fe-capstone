import React from "react";
import { useParams } from "react-router-dom";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import EvaluationViewListPage from "./EvaluationViewListPage";
import { Loading } from "@/components/ui";

const EvaluationViewListPageWrapper: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: evaluationsResponse,
    isLoading,
    error,
  } = useGetEvaluationsByProjectId(projectId!);

  const evaluations = evaluationsResponse?.["data-list"] || [];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading evaluations: {error.message}</div>;
  }

  return <EvaluationViewListPage evaluations={evaluations} />;
};

export default EvaluationViewListPageWrapper;
