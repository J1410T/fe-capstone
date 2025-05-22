import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";

// Mock data for a specific evaluation
const evaluationDetails = {
  id: 1,
  projectTitle: "AI-Driven Medical Diagnostics",
  projectCode: "PRJ-2023-001",
  submittedDate: "2023-06-15",
  dueDate: "2023-06-30",
  type: "Proposal",
  status: "Pending",
};

// Evaluation criteria for proposals
const proposalCriteria = [
  {
    id: 1,
    name: "Scientific Merit",
    description: "Evaluate the scientific quality and innovation of the proposal",
    maxScore: 10,
  },
  {
    id: 2,
    name: "Methodology",
    description: "Assess the appropriateness and rigor of the research methods",
    maxScore: 10,
  },
  {
    id: 3,
    name: "Feasibility",
    description: "Evaluate if the project can be completed with the proposed resources and timeline",
    maxScore: 10,
  },
  {
    id: 4,
    name: "Impact",
    description: "Assess the potential scientific and societal impact of the research",
    maxScore: 10,
  },
  {
    id: 5,
    name: "Budget Appropriateness",
    description: "Evaluate if the requested budget is justified and appropriate",
    maxScore: 10,
  },
];

// Evaluation criteria for milestones
const milestoneCriteria = [
  {
    id: 1,
    name: "Progress Assessment",
    description: "Evaluate the progress made against the original objectives",
    maxScore: 10,
  },
  {
    id: 2,
    name: "Quality of Results",
    description: "Assess the quality and significance of the results achieved",
    maxScore: 10,
  },
  {
    id: 3,
    name: "Resource Utilization",
    description: "Evaluate how effectively resources have been utilized",
    maxScore: 10,
  },
  {
    id: 4,
    name: "Adherence to Timeline",
    description: "Assess if the project is on track according to the proposed timeline",
    maxScore: 10,
  },
  {
    id: 5,
    name: "Future Plan",
    description: "Evaluate the quality and feasibility of the plan for the next phase",
    maxScore: 10,
  },
];

const EvaluationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real application, you would fetch the evaluation details based on the ID
  const evaluation = evaluationDetails;
  
  // Determine which criteria to use based on evaluation type
  const criteria = evaluation.type === "Proposal" ? proposalCriteria : milestoneCriteria;
  
  // State for form values
  const [scores, setScores] = useState<Record<number, number>>(
    Object.fromEntries(criteria.map(c => [c.id, 5]))
  );
  const [comments, setComments] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("approve");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = criteria.length * 10;
  const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Handle score change
  const handleScoreChange = (criteriaId: number, value: number[]) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: value[0]
    }));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Evaluation draft saved successfully");
    }, 1000);
  };

  // Handle submit evaluation
  const handleSubmitEvaluation = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Evaluation submitted successfully");
      navigate("/council/evaluations");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => navigate(`/council/evaluation/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Details
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Evaluation Form: {evaluation.projectTitle}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{evaluation.projectCode}</span>
          <span>•</span>
          <Badge
            variant="outline"
            className={
              evaluation.type === "Proposal"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-purple-100 text-purple-800 border-purple-200"
            }
          >
            {evaluation.type}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
          <CardDescription>
            Rate each criterion on a scale of 1-10
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`criterion-${criterion.id}`} className="font-medium">
                  {criterion.name}
                </Label>
                <span className="text-sm font-medium">
                  {scores[criterion.id]}/10
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {criterion.description}
              </p>
              <Slider
                id={`criterion-${criterion.id}`}
                min={1}
                max={10}
                step={1}
                value={[scores[criterion.id]]}
                onValueChange={(value) => handleScoreChange(criterion.id, value)}
              />
            </div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="comments" className="font-medium">
              Comments and Feedback
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Provide detailed feedback and suggestions for the research team
            </p>
            <Textarea
              id="comments"
              placeholder="Enter your comments here..."
              className="min-h-[150px]"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation" className="font-medium">
              Recommendation
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select your final recommendation for this {evaluation.type.toLowerCase()}
            </p>
            <Select
              value={recommendation}
              onValueChange={setRecommendation}
            >
              <SelectTrigger id="recommendation">
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="approve_with_revisions">Approve with Revisions</SelectItem>
                <SelectItem value="revise_and_resubmit">Revise and Resubmit</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t p-6">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium">Total Score</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{totalScore}/{maxPossibleScore}</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {scorePercentage}%
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isSaving || isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EvaluationForm;
