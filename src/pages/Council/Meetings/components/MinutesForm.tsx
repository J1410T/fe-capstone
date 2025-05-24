import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MinutesFormProps {
  discussion: string;
  conclusion: string;
  nextSteps: string;
  onDiscussionChange: (value: string) => void;
  onConclusionChange: (value: string) => void;
  onNextStepsChange: (value: string) => void;
  isDisabled: boolean;
}

export const MinutesForm: React.FC<MinutesFormProps> = ({
  discussion,
  conclusion,
  nextSteps,
  onDiscussionChange,
  onConclusionChange,
  onNextStepsChange,
  isDisabled,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="discussion" className="font-medium">
          Discussion Summary
        </Label>
        <Textarea
          id="discussion"
          placeholder="Enter discussion points..."
          className="min-h-[100px]"
          value={discussion}
          onChange={(e) => onDiscussionChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusion" className="font-medium">
          Conclusion
        </Label>
        <Textarea
          id="conclusion"
          placeholder="Enter meeting conclusion..."
          className="min-h-[100px]"
          value={conclusion}
          onChange={(e) => onConclusionChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextSteps" className="font-medium">
          Next Steps
        </Label>
        <Textarea
          id="nextSteps"
          placeholder="Enter next steps..."
          className="min-h-[100px]"
          value={nextSteps}
          onChange={(e) => onNextStepsChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
