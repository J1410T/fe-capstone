import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  MeetingHeader,
  MeetingDetailsCard,
  DocumentsCard,
  ChairmanActionsCard,
} from "./components";

// Mock data for meeting minutes
const meetingData = {
  id: "1",
  title: "Project Evaluation Meeting: AI-Driven Medical Diagnostics",
  date: "2023-07-15",
  time: "10:00 AM - 12:00 PM",
  location: "Virtual (Zoom)",
  projectCode: "PRJ-2023-001",
  projectTitle: "AI-Driven Medical Diagnostics",
  type: "Proposal",
  attendees: [
    { id: 1, name: "Dr. Robert Chen", role: "Chairman", present: true },
    { id: 2, name: "Dr. Emily Johnson", role: "Member", present: true },
    { id: 3, name: "Dr. Michael Smith", role: "Member", present: true },
    { id: 4, name: "Dr. Sarah Williams", role: "Member", present: false },
    { id: 5, name: "AI-Bot", role: "Automated Evaluator", present: true },
  ],
  evaluations: [
    {
      id: 1,
      evaluator: "Dr. Emily Johnson",
      score: 42,
      maxScore: 50,
      recommendation: "Approve with Revisions",
      submitted: true,
    },
    {
      id: 2,
      evaluator: "Dr. Michael Smith",
      score: 45,
      maxScore: 50,
      recommendation: "Approve",
      submitted: true,
    },
    {
      id: 3,
      evaluator: "Dr. Sarah Williams",
      score: 0,
      maxScore: 50,
      recommendation: "",
      submitted: false,
    },
    {
      id: 4,
      evaluator: "AI-Bot",
      score: 40,
      maxScore: 50,
      recommendation: "Approve with Revisions",
      submitted: true,
    },
  ],
  documents: [
    { name: "Project Proposal (BM01)", url: "#" },
    { name: "Evaluation Form (BM04)", url: "#" },
  ],
};

const MeetingMinutes: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // In a real application, you would fetch the meeting data based on the ID
  const meeting = meetingData;

  // State for form values
  const [discussion, setDiscussion] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");
  // const [finalRecommendation, setFinalRecommendation] = useState<string>(
  //   "approve_with_revisions"
  // );
  const [nextSteps, setNextSteps] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if user is chairman
  const isChairman =
    user?.role === UserRole.APPRAISAL_COUNCIL &&
    meeting.attendees.some(
      (a) => a.name === user.name && a.role === "Chairman"
    );

  // Calculate average score
  const submittedEvaluations = meeting.evaluations.filter((e) => e.submitted);
  const totalScore = submittedEvaluations.reduce(
    (sum, evaluation) => sum + evaluation.score,
    0
  );
  const averageScore =
    submittedEvaluations.length > 0
      ? Math.round(totalScore / submittedEvaluations.length)
      : 0;
  const maxPossibleScore =
    submittedEvaluations.length > 0 ? submittedEvaluations[0].maxScore : 0;
  const scorePercentage =
    maxPossibleScore > 0
      ? Math.round((averageScore / maxPossibleScore) * 100)
      : 0;

  // Handle save draft
  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Meeting minutes draft saved successfully");
    }, 1000);
  };

  // Handle submit minutes
  const handleSubmitMinutes = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Meeting minutes submitted successfully");
      navigate("/council/meetings");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <MeetingHeader title="Meeting Minutes" description={meeting.title} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MeetingDetailsCard
          meeting={meeting}
          discussion={discussion}
          conclusion={conclusion}
          nextSteps={nextSteps}
          onDiscussionChange={setDiscussion}
          onConclusionChange={setConclusion}
          onNextStepsChange={setNextSteps}
          isChairman={isChairman}
          averageScore={averageScore}
          maxPossibleScore={maxPossibleScore}
          scorePercentage={scorePercentage}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
          onSaveDraft={handleSaveDraft}
          onSubmitMinutes={handleSubmitMinutes}
        />

        <div className="space-y-6">
          <DocumentsCard documents={meeting.documents} />
          {isChairman && <ChairmanActionsCard />}
        </div>
      </div>
    </div>
  );
};

export default MeetingMinutes;
