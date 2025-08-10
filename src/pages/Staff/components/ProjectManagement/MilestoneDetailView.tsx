import React from "react";

interface SelectedMilestone {
  id: string;
  title: string;
  status: string;
}

interface MilestoneDetailViewProps {
  selectedMilestone: SelectedMilestone | null;
}

export const MilestoneDetailView: React.FC<MilestoneDetailViewProps> = ({
  selectedMilestone,
}) => {
  if (!selectedMilestone) return null;

  return (
    <div className="space-y-6 p-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedMilestone.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Milestone Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span>{" "}
                {selectedMilestone.status}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedMilestone.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetailView;
