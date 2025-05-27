import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Send } from "lucide-react";
import { MeetingInfo } from "./MeetingInfo";
import { ProjectInfo } from "./ProjectInfo";
import { AttendeesList } from "./AttendeesList";
import { EvaluationsList } from "./EvaluationsList";
import { MinutesForm } from "./MinutesForm";
import { ScoreSummary } from "./ScoreSummary";

interface Meeting {
  date: string;
  time: string;
  location: string;
  projectTitle: string;
  projectCode: string;
  type: string;
  attendees: Array<{
    id: number;
    name: string;
    role: string;
    present: boolean;
  }>;
  evaluations: Array<{
    id: number;
    evaluator: string;
    score: number;
    maxScore: number;
    recommendation: string;
    submitted: boolean;
  }>;
}

interface MeetingDetailsCardProps {
  meeting: Meeting;
  discussion: string;
  conclusion: string;
  nextSteps: string;
  onDiscussionChange: (value: string) => void;
  onConclusionChange: (value: string) => void;
  onNextStepsChange: (value: string) => void;
  isChairman: boolean;
  averageScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  isSaving: boolean;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onSubmitMinutes: () => void;
}

export const MeetingDetailsCard: React.FC<MeetingDetailsCardProps> = ({
  meeting,
  discussion,
  conclusion,
  nextSteps,
  onDiscussionChange,
  onConclusionChange,
  onNextStepsChange,
  isChairman,
  averageScore,
  maxPossibleScore,
  scorePercentage,
  isSaving,
  isSubmitting,
  onSaveDraft,
  onSubmitMinutes,
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Meeting Details</CardTitle>
        <CardDescription>Record of council evaluation meeting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MeetingInfo
            date={meeting.date}
            time={meeting.time}
            location={meeting.location}
          />
          <ProjectInfo
            projectTitle={meeting.projectTitle}
            projectCode={meeting.projectCode}
            type={meeting.type}
          />
        </div>

        <Separator />

        <AttendeesList attendees={meeting.attendees} />

        <Separator />

        <EvaluationsList evaluations={meeting.evaluations} />

        <Separator />

        <MinutesForm
          discussion={discussion}
          conclusion={conclusion}
          nextSteps={nextSteps}
          onDiscussionChange={onDiscussionChange}
          onConclusionChange={onConclusionChange}
          onNextStepsChange={onNextStepsChange}
          isDisabled={!isChairman}
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t p-6">
        <ScoreSummary
          averageScore={averageScore}
          maxPossibleScore={maxPossibleScore}
          scorePercentage={scorePercentage}
        />
        {isChairman && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={onSubmitMinutes}
              disabled={isSaving || isSubmitting || !discussion || !conclusion}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Minutes"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
