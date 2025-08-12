import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Evaluation } from "@/types/evaluation-api";
import { getEvaluationsByProject } from "../../data/mockEvaluationApiData";
import EvaluationViewListPage from "./EvaluationViewListPage";
import { Loading } from "@/components/ui";

const EvaluationViewListPageWrapper: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      getEvaluationsByProject(projectId)
        .then(setEvaluations)
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  if (loading) {
    return <Loading />;
  }

  return <EvaluationViewListPage evaluations={evaluations} />;
};

export default EvaluationViewListPageWrapper;
