import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EvaluationStageApi } from "@/types/evaluation-api";
import { getEvaluationsByProject } from "../../data/mockEvaluationApiData";
import EvaluationStageViewPage from "./EvaluationStageViewPage";
import { Loading } from "@/components/ui";

const EvaluationStageViewPageWrapper: React.FC = () => {
  const { projectId, stageId } = useParams<{
    projectId: string;
    stageId: string;
  }>();
  const [stage, setStage] = useState<EvaluationStageApi | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId && stageId) {
      console.log("Looking for stage:", stageId, "in project:", projectId);
      getEvaluationsByProject(projectId)
        .then((evaluations) => {
          // Find the stage across all evaluations
          let foundStage: EvaluationStageApi | undefined;
          for (const evaluation of evaluations) {
            foundStage = evaluation["evaluation-stages"].find(
              (s) => s.id === stageId
            );
            if (foundStage) {
              console.log("Found stage:", foundStage.name, "in evaluation:", evaluation.id);
              break;
            }
          }
          setStage(foundStage);
        })
        .catch((error) => {
          console.error("Error fetching evaluation stage:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [projectId, stageId]);

  if (loading) {
    return <Loading />;
  }

  return <EvaluationStageViewPage stage={stage} />;
};

export default EvaluationStageViewPageWrapper;
