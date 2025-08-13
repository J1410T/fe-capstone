import React from "react";
import { useParams } from "react-router-dom";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import EvaluationStageViewPage from "./EvaluationStageViewPage";
import { Loading } from "@/components/ui";

const EvaluationStageViewPageWrapper: React.FC = () => {
  const { projectId, stageId } = useParams<{
    projectId: string;
    stageId: string;
  }>();

  const { data: evaluationsResponse, isLoading } = useGetEvaluationsByProjectId(
    projectId || ""
  );

  if (isLoading) {
    return <Loading />;
  }

  // Find the stage across all evaluations
  let foundStage = undefined;
  let foundEvaluationId = undefined;

  if (evaluationsResponse?.["data-list"] && stageId) {
    for (const evaluation of evaluationsResponse["data-list"]) {
      foundStage = evaluation["evaluation-stages"].find(
        (s) => s.id === stageId
      );
      if (foundStage) {
        foundEvaluationId = evaluation.id;
        break;
      }
    }
  }

  return (
    <EvaluationStageViewPage
      stage={foundStage}
      evaluationId={foundEvaluationId}
    />
  );
};

export default EvaluationStageViewPageWrapper;
