import {
  EvaluationStage,
  EvaluationSummary,
  IndividualEvaluation,
  ProjectEvaluation,
} from "@/types/task";

// Mock individual evaluations
export const mockIndividualEvaluations: IndividualEvaluation[] = [
  {
    id: "eval-1",
    totalRate: 8.5,
    comment:
      "Excellent research proposal with strong methodology and clear objectives. The team demonstrates good understanding of the problem domain and has a realistic timeline for completion.",
    submittedAt: "2024-01-15T10:30:00Z",
    isApproved: true,
    reviewerResult: true,
    isAIReport: false,
    status: "submitted",
    evaluationStageId: "stage-1",
    reviewerId: "reviewer-1",
    projectId: "proj-1",
    milestoneId: "milestone-1",
    evaluator: "Dr. Sarah Johnson",
    documentId: "doc-eval-1",
  },
  {
    id: "eval-2",
    totalRate: 9.2,
    comment:
      "Outstanding proposal with innovative approach. The AI-driven methodology is well-designed and the expected outcomes are clearly defined. Strong potential for significant impact.",
    submittedAt: "2024-01-16T14:20:00Z",
    isApproved: true,
    reviewerResult: true,
    isAIReport: true,
    status: "submitted",
    evaluationStageId: "stage-1",
    reviewerId: "ai-system",
    projectId: "proj-1",
    milestoneId: "milestone-1",
    evaluator: "AI Evaluation System",
    documentId: "doc-eval-2",
  },
  {
    id: "eval-3",
    totalRate: 7.8,
    comment:
      "Good research proposal with solid foundation. Some concerns about the timeline and resource allocation. Recommend minor revisions to the methodology section.",
    submittedAt: "2024-01-17T09:45:00Z",
    isApproved: false,
    reviewerResult: true,
    isAIReport: false,
    status: "submitted",
    evaluationStageId: "stage-1",
    reviewerId: "reviewer-2",
    projectId: "proj-1",
    milestoneId: "milestone-1",
    evaluator: "Prof. Michael Chen",
    documentId: "doc-eval-3",
  },
  {
    id: "eval-4",
    totalRate: 8.0,
    comment:
      "Satisfactory progress on the first milestone. The team has delivered most of the planned objectives with good quality results. Some delays in the implementation phase but overall on track.",
    submittedAt: "2024-02-20T11:15:00Z",
    isApproved: true,
    reviewerResult: true,
    isAIReport: false,
    status: "submitted",
    evaluationStageId: "stage-2",
    reviewerId: "reviewer-1",
    projectId: "proj-1",
    milestoneId: "milestone-2",
    evaluator: "Dr. Sarah Johnson",
    documentId: "doc-eval-4",
  },
  {
    id: "eval-5",
    totalRate: 0,
    comment: "",
    submittedAt: "",
    isApproved: false,
    reviewerResult: false,
    isAIReport: false,
    status: "pending",
    evaluationStageId: "stage-2",
    reviewerId: "reviewer-3",
    projectId: "proj-1",
    milestoneId: "milestone-2",
    evaluator: "Dr. Emily Rodriguez",
  },
  {
    id: "eval-6",
    totalRate: 0,
    comment: "",
    submittedAt: "",
    isApproved: false,
    reviewerResult: false,
    isAIReport: false,
    status: "in_progress",
    evaluationStageId: "stage-3",
    reviewerId: "reviewer-1",
    projectId: "proj-1",
    milestoneId: "milestone-3",
    evaluator: "Dr. Sarah Johnson",
  },
];

// Mock evaluation stages
export const mockEvaluationStages: EvaluationStage[] = [
  {
    id: "stage-1",
    title: "EV Stage 1",
    description: "Initial evaluation stage for proposal review",
    evaluationId: "evaluation-1",
    order: 1,
    createdAt: "2024-01-10T08:00:00Z",
    status: "completed",
    individualEvaluations: mockIndividualEvaluations.filter(
      (e) => e.evaluationStageId === "stage-1"
    ),
  },
  {
    id: "stage-2",
    title: "EV Stage 2",
    description: "Second evaluation stage for milestone review",
    evaluationId: "evaluation-1",
    order: 2,
    createdAt: "2024-02-15T08:00:00Z",
    status: "active",
    individualEvaluations: mockIndividualEvaluations.filter(
      (e) => e.evaluationStageId === "stage-2"
    ),
  },
  {
    id: "stage-3",
    title: "EV Stage 3",
    description: "Third evaluation stage for progress assessment",
    evaluationId: "evaluation-2",
    order: 1,
    createdAt: "2024-03-01T08:00:00Z",
    status: "active",
    individualEvaluations: mockIndividualEvaluations.filter(
      (e) => e.evaluationStageId === "stage-3"
    ),
  },
];

// Mock project evaluations
export const mockProjectEvaluations: ProjectEvaluation[] = [
  {
    id: "evaluation-1",
    title: "Milestone Evaluation",
    type: "milestone",
    description: "Comprehensive evaluation of milestone deliverables",
    projectId: "proj-1",
    milestoneId: "milestone-1",
    createdAt: "2024-01-10T08:00:00Z",
    dueDate: "2024-01-30T23:59:59Z",
    status: "active",
    stages: mockEvaluationStages.filter(
      (s) => s.evaluationId === "evaluation-1"
    ),
  },
  {
    id: "evaluation-2",
    title: "Mid-term Progress Review",
    type: "midterm",
    description: "Mid-term evaluation of project progress and outcomes",
    projectId: "proj-1",
    createdAt: "2024-03-01T08:00:00Z",
    dueDate: "2024-03-15T23:59:59Z",
    status: "active",
    stages: mockEvaluationStages.filter(
      (s) => s.evaluationId === "evaluation-2"
    ),
  },
];

// Mock evaluation summary
export const mockEvaluationSummary: EvaluationSummary = {
  totalEvaluations: mockProjectEvaluations.length,
  totalStages: mockEvaluationStages.length,
  completedEvaluations: mockIndividualEvaluations.filter(
    (e) => e.status === "submitted"
  ).length,
  pendingEvaluations: mockIndividualEvaluations.filter(
    (e) => e.status === "pending" || e.status === "in_progress"
  ).length,
  averageScore:
    mockIndividualEvaluations
      .filter((e) => e.status === "submitted" && e.totalRate > 0)
      .reduce((sum, e) => sum + e.totalRate, 0) /
    mockIndividualEvaluations.filter(
      (e) => e.status === "submitted" && e.totalRate > 0
    ).length,
  overallStatus: "in_progress",
  evaluationsByType: {
    milestone: 1,
    midterm: 1,
    summary: 0,
    final: 0,
    proposal: 0,
  },
};

// Helper functions for API integration
export const getProjectEvaluationsByProject = (
  projectId: string
): Promise<ProjectEvaluation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, return mock data for any project ID
      const updatedEvaluations = mockProjectEvaluations.map((evaluation) => ({
        ...evaluation,
        projectId: projectId,
        stages: evaluation.stages.map((stage) => ({
          ...stage,
          individualEvaluations: stage.individualEvaluations.map(
            (individual) => ({
              ...individual,
              projectId: projectId,
            })
          ),
        })),
      }));
      resolve(updatedEvaluations);
    }, 500);
  });
};

export const getEvaluationSummaryByProject = (
  projectId: string
): Promise<EvaluationSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return project-specific evaluation summary
      const projectSpecificSummary = {
        ...mockEvaluationSummary,
        projectId: projectId,
      };
      resolve(projectSpecificSummary);
    }, 300);
  });
};

// Legacy function for backward compatibility
export const getEvaluationStagesByProject = (
  projectId: string
): Promise<EvaluationStage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedStages = mockEvaluationStages.map((stage) => ({
        ...stage,
        individualEvaluations: stage.individualEvaluations.map(
          (evaluation) => ({
            ...evaluation,
            projectId: projectId,
          })
        ),
      }));
      resolve(updatedStages);
    }, 500);
  });
};

export const getIndividualEvaluation = (
  evaluationId: string
): Promise<IndividualEvaluation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const evaluation = mockIndividualEvaluations.find(
        (e) => e.id === evaluationId
      );
      resolve(evaluation || null);
    }, 200);
  });
};

export const getEvaluationStage = (
  stageId: string
): Promise<EvaluationStage | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stage = mockEvaluationStages.find((s) => s.id === stageId);
      resolve(stage || null);
    }, 200);
  });
};

// API integration points for future implementation
export const evaluationApiEndpoints = {
  getStagesByProject: (projectId: string) =>
    `/api/projects/${projectId}/evaluation-stages`,
  getSummaryByProject: (projectId: string) =>
    `/api/projects/${projectId}/evaluation-summary`,
  getIndividualEvaluation: (evaluationId: string) =>
    `/api/evaluations/${evaluationId}`,
  createEvaluation: () => `/api/evaluations`,
  updateEvaluation: (evaluationId: string) =>
    `/api/evaluations/${evaluationId}`,
  deleteEvaluation: (evaluationId: string) =>
    `/api/evaluations/${evaluationId}`,
};
