import React from "react";

interface SelectedEvaluationStage {
  id: string;
  name: string;
  status: string;
}

interface EvaluationStageDetailViewProps {
  selectedEvaluationStage: SelectedEvaluationStage | null;
}

export const EvaluationStageDetailView: React.FC<EvaluationStageDetailViewProps> = ({
  selectedEvaluationStage,
}) => {
  if (!selectedEvaluationStage) return null;

  return (
    <div className="space-y-6 p-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedEvaluationStage.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Stage Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span>{" "}
                {selectedEvaluationStage.status}
              </div>
              <div>
                <span className="font-medium">ID:</span>{" "}
                {selectedEvaluationStage.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationStageDetailView;
