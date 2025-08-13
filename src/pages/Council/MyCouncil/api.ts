// SINGLE CONSOLIDATED COUNCIL API - All council-related API functions
import { Evaluation, EvaluationStageApi } from "@/types/evaluation-api";

// ==================== INTERFACES ====================

export interface CouncilProject {
  id: string;
  "english-title": string;
  "vietnamese-title"?: string;
  category: string;
  type: string;
  status: string;
  "created-at": string;
  "council-id"?: string;
  principal_investigator?: string;
  description?: string;
  budget?: number;
  duration?: string;
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  "due-date": string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  "project-id": string;
  evaluations?: Evaluation[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  "created-at": string;
  "author-role": string;
  individualEvaluationId: string;
}

export interface IndividualEvaluationFormData {
  name: string;
  content: string;
  stageId: string;
  evaluationId?: string;
  reviewerId?: string;
  rate?: number;
  comment?: string;
}

export interface IndividualEvaluationDetail {
  id: string;
  name: string;
  content: string; // TinyMCE HTML content
  comment: string;
  rate: number;
  "created-at": string;
  "submitted-at": string;
  status: string;
  "is-approved": boolean;
  "is-ai-report": boolean;
  "reviewer-result": string;
  "stage-id": string;
  "reviewer-id": string;
  documents: Document[];
  comments: Comment[];
}

export interface Document {
  id: string;
  title: string;
  content: string; // TinyMCE HTML content
  "created-at": string;
  "updated-at"?: string;
  "individual-evaluation-id": string;
  author: string;
  type: string;
}

export interface CommentData {
  content: string;
  individualEvaluationId: string;
  authorId: string;
  authorName: string;
}

export interface EvaluationCommentData {
  content: string;
  evaluationId: string;
  authorId: string;
  authorName: string;
}

export interface EvaluationComment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  "created-at": string;
  "author-role": string;
  evaluationId: string;
}

export interface CreateEvaluationStageData {
  name: string;
  phrase: string;
  type: string;
  evaluationId: string;
}

// ==================== MOCK DATA ====================

const mockProjects: CouncilProject[] = [
  {
    id: "015a8626-2ccf-4258-a945-2569d3566fc2",
    "english-title": "Philosophy in the Age of Artificial Intelligence",
    "vietnamese-title": "Triết học trong thời đại Trí tuệ nhân tạo",
    category: "Humanities",
    type: "Research",
    status: "active",
    "created-at": "2024-07-15T10:30:00.000Z",
    "council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    principal_investigator: "Dr. Nguyen Van A",
    description:
      "A comprehensive study on the philosophical implications of AI in modern society",
    budget: 150000,
    duration: "24 months",
  },
  {
    id: "a91dfc88-5d99-4ff6-a08e-6beeebe0f8cb",
    "english-title": "Psychological Effects of Remote Work",
    "vietnamese-title": "Tác động tâm lý của làm việc từ xa",
    category: "Psychology",
    type: "Research",
    status: "under review",
    "created-at": "2024-06-20T14:15:30.000Z",
    "council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    principal_investigator: "Dr. Tran Thi B",
    description: "Analysis of psychological impacts on remote workers",
    budget: 120000,
    duration: "18 months",
  },
  {
    id: "47dd86c6-224e-49fb-9dbc-6fbee9a2966a",
    "english-title": "Sustainable Energy Solutions for Urban Development",
    "vietnamese-title": "Giải pháp năng lượng bền vững cho phát triển đô thị",
    category: "Environmental Science",
    type: "Applied Research",
    status: "pending",
    "created-at": "2024-08-01T09:00:00.000Z",
    "council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    principal_investigator: "Dr. Le Van C",
    description: "Developing sustainable energy solutions for modern cities",
    budget: 200000,
    duration: "36 months",
  },
  {
    id: "project-4",
    "english-title": "Machine Learning Applications in Healthcare",
    "vietnamese-title": "Ứng dụng máy học trong y tế",
    category: "Computer Science",
    type: "Innovation",
    status: "approved",
    "created-at": "2024-05-10T16:45:00.000Z",
    "council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    principal_investigator: "Dr. Pham Van D",
    description: "AI-driven healthcare solutions and diagnostics",
    budget: 300000,
    duration: "30 months",
  },
  {
    id: "project-5",
    "english-title": "Digital Transformation in Vietnamese Education",
    "vietnamese-title": "Chuyển đổi số trong giáo dục Việt Nam",
    category: "Education Technology",
    type: "Policy Research",
    status: "submitted",
    "created-at": "2024-07-25T11:20:00.000Z",
    "council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    principal_investigator: "Dr. Hoang Thi E",
    description:
      "Digital transformation strategies for Vietnamese educational institutions",
    budget: 180000,
    duration: "24 months",
  },
  {
    id: "project-6",
    "english-title": "Climate Change Impact on Coastal Agriculture",
    "vietnamese-title": "Tác động biến đổi khí hậu đến nông nghiệp ven biển",
    category: "Environmental Science",
    type: "Research",
    status: "active",
    "created-at": "2024-06-01T08:00:00.000Z",
    "council-id": "e7b2f297-c223-508b-bf27-fe3d225775be",
    principal_investigator: "Dr. Vu Minh F",
    description:
      "Study on climate change effects on coastal agricultural practices",
    budget: 250000,
    duration: "42 months",
  },
];

const mockMilestones: { [projectId: string]: ProjectMilestone[] } = {
  "015a8626-2ccf-4258-a945-2569d3566fc2": [
    {
      id: "milestone-1",
      title: "Literature Review Completion",
      description: "Complete comprehensive literature review on AI philosophy",
      "due-date": "2024-09-15T00:00:00.000Z",
      status: "completed",
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
    },
    {
      id: "milestone-2",
      title: "Framework Development",
      description: "Develop philosophical framework for AI analysis",
      "due-date": "2024-12-01T00:00:00.000Z",
      status: "in_progress",
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
    },
    {
      id: "milestone-3",
      title: "Case Studies Analysis",
      description: "Analyze real-world AI implementation cases",
      "due-date": "2025-03-15T00:00:00.000Z",
      status: "pending",
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
    },
  ],
  "a91dfc88-5d99-4ff6-a08e-6beeebe0f8cb": [
    {
      id: "milestone-4",
      title: "Survey Design and Validation",
      description: "Design and validate psychological assessment surveys",
      "due-date": "2024-10-01T00:00:00.000Z",
      status: "completed",
      "project-id": "a91dfc88-5d99-4ff6-a08e-6beeebe0f8cb",
    },
    {
      id: "milestone-5",
      title: "Data Collection Phase",
      description: "Collect data from remote workers across industries",
      "due-date": "2025-01-30T00:00:00.000Z",
      status: "in_progress",
      "project-id": "a91dfc88-5d99-4ff6-a08e-6beeebe0f8cb",
    },
  ],
};

// Mock evaluation comments storage
const mockEvaluationComments: { [evaluationId: string]: EvaluationComment[] } =
  {
    "eval-1": [
      {
        id: "eval-comment-1",
        content:
          "This literature review shows excellent depth and comprehensive coverage. The methodology for source selection is particularly strong.",
        author: "Dr. Sarah Johnson",
        timestamp: "2024-08-02T09:30:00.000Z",
        "created-at": "2024-08-02T09:30:00.000Z",
        "author-role": "APPRAISAL_COUNCIL",
        evaluationId: "eval-1",
      },
      {
        id: "eval-comment-2",
        content:
          "Agreed. The integration of AI ethics frameworks with philosophical foundations is innovative. Consider adding more recent publications on machine consciousness.",
        author: "Prof. Michael Chen",
        timestamp: "2024-08-02T14:15:00.000Z",
        "created-at": "2024-08-02T14:15:00.000Z",
        "author-role": "APPRAISAL_COUNCIL",
        evaluationId: "eval-1",
      },
    ],
    "eval-2": [
      {
        id: "eval-comment-3",
        content:
          "The framework development is progressing well, but needs more clarity on validation criteria.",
        author: "Dr. Lisa Wang",
        timestamp: "2024-11-05T11:20:00.000Z",
        "created-at": "2024-11-05T11:20:00.000Z",
        "author-role": "APPRAISAL_COUNCIL",
        evaluationId: "eval-2",
      },
    ],
  };

const mockEvaluations: { [milestoneId: string]: Evaluation[] } = {
  "milestone-1": [
    {
      id: "eval-1",
      title: "Literature Review Assessment",
      code: "EVAL-2024-001",
      status: "completed",
      "create-date": "2024-08-01T10:00:00.000Z",
      "total-rate": 8.25,
      comment: "Overall positive evaluation of literature review",
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
      "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
      documents: [],
      "evaluation-stages": [
        {
          id: "stage-1",
          name: "Initial Review",
          phrase: "Preliminary Assessment",
          "stage-order": 1,
          status: "completed",
          type: "review",
          "evaluation-id": "eval-1",
          "milestone-id": "milestone-1",
          "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
          transactions: null,
          "individual-evaluations": [
            {
              id: "individual-1",
              name: "Expert Review - Literature Analysis",
              comment:
                "<p>The literature review demonstrates comprehensive coverage of contemporary AI philosophy. The researcher has effectively synthesized works from major philosophers and AI ethicists. The methodology for selecting sources is sound and the critical analysis shows depth of understanding.</p><p><strong>Strengths:</strong></p><ul><li>Comprehensive source selection covering both Western and Eastern philosophical traditions</li><li>Critical analysis of key concepts in AI consciousness and moral agency</li><li>Clear identification of research gaps</li></ul><p><strong>Areas for improvement:</strong></p><ul><li>Could benefit from more recent publications (2024)</li><li>Missing some key works on AI phenomenology</li></ul>",
              "submitted-at": "2024-08-15T14:30:00.000Z",
              status: "completed",
              "is-approved": true,
              "is-ai-report": false,
              "total-rate": 8.5,
              "reviewer-result": "approved",
              "evaluation-stage-id": "stage-1",
              "reviewer-id": "reviewer-1",
              "reviewer-name": "Dr. Sarah Johnson",
              "reviewer-email": "sarah.johnson@university.edu",
              "reviewer-avatar": null,
              documents: [],
              "projects-similarity-result": null,
            },
            {
              id: "individual-2",
              name: "AI Analysis Report",
              comment:
                "<p>This AI-generated analysis evaluates the literature review against established academic standards and identifies key patterns in the research approach.</p><p><strong>Automated Assessment Results:</strong></p><ul><li>Source diversity index: 92/100</li><li>Citation accuracy: 98%</li><li>Conceptual coverage: 87%</li><li>Critical analysis depth: 85%</li></ul><p><strong>Recommendations:</strong></p><ol><li>Include more interdisciplinary perspectives from cognitive science</li><li>Expand coverage of practical AI applications in philosophy</li><li>Consider recent developments in large language models and their philosophical implications</li></ol>",
              "submitted-at": "2024-08-14T09:15:00.000Z",
              status: "completed",
              "is-approved": true,
              "is-ai-report": true,
              "total-rate": 8.0,
              "reviewer-result": "approved",
              "evaluation-stage-id": "stage-1",
              "reviewer-id": null,
              "reviewer-name": null,
              "reviewer-email": null,
              "reviewer-avatar": null,
              documents: [],
              "projects-similarity-result": null,
            },
          ],
        },
      ],
    },
  ],
  "milestone-2": [
    {
      id: "eval-2",
      title: "Framework Development Review",
      code: "EVAL-2024-002",
      status: "in_progress",
      "create-date": "2024-11-01T10:00:00.000Z",
      "total-rate": null,
      comment: null,
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
      "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
      documents: [],
      "evaluation-stages": [
        {
          id: "stage-2",
          name: "Framework Assessment",
          phrase: "Methodological Review",
          "stage-order": 1,
          status: "in_progress",
          type: "assessment",
          "evaluation-id": "eval-2",
          "milestone-id": "milestone-2",
          "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
          transactions: null,
          "individual-evaluations": [
            {
              id: "individual-3",
              name: "Methodological Review",
              comment:
                "<p>The proposed philosophical framework shows innovative approach to analyzing AI consciousness and moral agency. The integration of phenomenological and analytical traditions is particularly noteworthy.</p><p><strong>Framework Strengths:</strong></p><ul><li>Novel integration of Eastern and Western philosophical traditions</li><li>Clear operational definitions for key concepts</li><li>Practical applicability to real-world AI systems</li></ul><p><strong>Current Concerns:</strong></p><ul><li>Some theoretical gaps in the consciousness model</li><li>Need for clearer validation criteria</li><li>Missing consideration of embodied cognition perspectives</li></ul>",
              "submitted-at": "2024-11-15T16:20:00.000Z",
              status: "in_progress",
              "is-approved": false,
              "is-ai-report": false,
              "total-rate": 7.5,
              "reviewer-result": "needs_revision",
              "evaluation-stage-id": "stage-2",
              "reviewer-id": "reviewer-2",
              "reviewer-name": "Prof. Michael Chen",
              "reviewer-email": "michael.chen@institute.org",
              "reviewer-avatar": null,
              documents: [],
              "projects-similarity-result": null,
            },
          ],
        },
      ],
    },
  ],
};

// ==================== API FUNCTIONS ====================

// Delay function for simulating network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Project APIs
export const getAllProjects = async (): Promise<CouncilProject[]> => {
  await delay(500);
  return mockProjects;
};

export const getProjectsByCouncil = async (
  councilId: string
): Promise<CouncilProject[]> => {
  await delay(300);
  return mockProjects.filter((project) => project["council-id"] === councilId);
};

export const getProjectById = async (
  projectId: string
): Promise<CouncilProject | null> => {
  await delay(200);
  return mockProjects.find((project) => project.id === projectId) || null;
};

// Milestone APIs
export const getProjectMilestones = async (
  projectId: string
): Promise<ProjectMilestone[]> => {
  await delay(400);
  return mockMilestones[projectId] || [];
};

export const getMilestoneById = async (
  milestoneId: string
): Promise<ProjectMilestone | null> => {
  await delay(200);
  for (const milestones of Object.values(mockMilestones)) {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) return milestone;
  }
  return null;
};

// Evaluation APIs
export const getMilestoneEvaluations = async (
  milestoneId: string
): Promise<Evaluation[]> => {
  await delay(300);
  console.log(`API: Getting evaluations for milestone ${milestoneId}`);
  console.log("Available milestone evaluations:", Object.keys(mockEvaluations));
  const result = mockEvaluations[milestoneId] || [];
  console.log(
    `API: Returning ${result.length} evaluations for milestone ${milestoneId}`
  );
  return result;
};

export const getEvaluationDetail = async (
  evaluationId: string
): Promise<Evaluation | null> => {
  await delay(400);
  for (const evaluations of Object.values(mockEvaluations)) {
    const evaluation = evaluations.find((e) => e.id === evaluationId);
    if (evaluation) return evaluation;
  }
  return null;
};

export const createEvaluation = async (
  milestoneId: string,
  data: {
    title: string;
    code: string;
  }
): Promise<Evaluation> => {
  await delay(600);

  const newEvaluation: Evaluation = {
    id: `eval-${Date.now()}`,
    title: data.title,
    code: data.code,
    status: "created",
    "create-date": new Date().toISOString(),
    "total-rate": null,
    comment: null,
    "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
    "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    documents: [],
    "evaluation-stages": [],
  };

  // Add to mock data
  if (!mockEvaluations[milestoneId]) {
    mockEvaluations[milestoneId] = [];
  }
  mockEvaluations[milestoneId].push(newEvaluation);

  return newEvaluation;
};

// Individual Evaluation APIs
export const createIndividualEvaluation = async (
  data: IndividualEvaluationFormData
): Promise<IndividualEvaluationDetail> => {
  await delay(500);

  const newIndividualEvaluation: IndividualEvaluationDetail = {
    id: `individual-${Date.now()}`,
    name: data.name,
    content: data.content,
    comment: data.comment || "",
    rate: data.rate || 0,
    "created-at": new Date().toISOString(),
    "submitted-at": new Date().toISOString(),
    status: "draft",
    "is-approved": false,
    "is-ai-report": false,
    "reviewer-result": "pending",
    "stage-id": data.stageId,
    "reviewer-id": data.reviewerId || "",
    documents: [],
    comments: [],
  };

  return newIndividualEvaluation;
};

export const getIndividualEvaluationDetail = async (
  individualEvalId: string
): Promise<IndividualEvaluationDetail | null> => {
  await delay(400);

  // Return mock individual evaluation detail with documents and comments
  const mockIndividualEval: IndividualEvaluationDetail = {
    id: individualEvalId,
    name: "Expert Review - Literature Analysis",
    content:
      "<h2>Evaluation Overview</h2><p>This comprehensive evaluation assesses the quality and depth of the literature review conducted for this research project.</p><h3>Key Findings</h3><ul><li>Comprehensive coverage of relevant sources</li><li>Critical analysis demonstrates understanding</li><li>Proper methodology for source selection</li></ul><h3>Recommendations</h3><p>The literature review shows <strong>excellent</strong> foundation for the research. Minor improvements could include more recent publications from 2024.</p>",
    comment: "Overall excellent work with comprehensive analysis.",
    rate: 8.5,
    "created-at": "2024-08-14T09:00:00.000Z",
    "submitted-at": "2024-08-15T14:30:00.000Z",
    status: "completed",
    "is-approved": true,
    "is-ai-report": false,
    "reviewer-result": "approved",
    "stage-id": "stage-1",
    "reviewer-id": "reviewer-1",
    documents: [
      {
        id: "doc-1",
        title: "Literature Review Analysis",
        content:
          "<h1>Literature Review Analysis Document</h1><p>This document contains the detailed analysis of the literature review...</p>",
        "created-at": "2024-08-15T10:00:00.000Z",
        "individual-evaluation-id": individualEvalId,
        author: "Dr. Smith",
        type: "tinymce",
      },
    ],
    comments: [
      {
        id: "comment-1",
        content: "Great analysis! The depth of review is impressive.",
        author: "Dr. Smith",
        timestamp: "2024-08-15T15:00:00.000Z",
        "created-at": "2024-08-15T15:00:00.000Z",
        "author-role": "STAFF",
        individualEvaluationId: individualEvalId,
      },
      {
        id: "comment-2",
        content: "Agreed, though consider adding more recent sources.",
        author: "Prof. Johnson",
        timestamp: "2024-08-15T16:30:00.000Z",
        "created-at": "2024-08-15T16:30:00.000Z",
        "author-role": "APPRAISAL_COUNCIL",
        individualEvaluationId: individualEvalId,
      },
    ],
  };

  return mockIndividualEval;
};

export const updateIndividualEvaluation = async (
  individualEvalId: string,
  data: {
    content?: string;
    comment?: string;
    rate?: number;
    status?: string;
  }
): Promise<IndividualEvaluationDetail> => {
  await delay(600);

  // In real implementation, this would update the individual evaluation
  const existing = await getIndividualEvaluationDetail(individualEvalId);
  if (!existing) {
    throw new Error("Individual evaluation not found");
  }

  return {
    ...existing,
    ...data,
    "updated-at": new Date().toISOString(),
  } as IndividualEvaluationDetail;
};

export const submitIndividualEvaluation = async (
  individualEvalId: string,
  data: {
    rate: number;
    comment: string;
    isApproved: boolean;
  }
): Promise<void> => {
  await delay(500);
  console.log("Submitting individual evaluation:", individualEvalId, data);
  // In real implementation, this would submit the evaluation for approval
};

// Comment APIs
export const addComment = async (data: CommentData): Promise<Comment> => {
  await delay(300);

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    content: data.content,
    author: data.authorName,
    timestamp: new Date().toISOString(),
    "created-at": new Date().toISOString(),
    "author-role": "STAFF",
    individualEvaluationId: data.individualEvaluationId,
  };

  return newComment;
};

// Evaluation Comment APIs
export const getEvaluationComments = async (
  evaluationId: string
): Promise<EvaluationComment[]> => {
  await delay(300);
  return mockEvaluationComments[evaluationId] || [];
};

export const addEvaluationComment = async (
  data: EvaluationCommentData
): Promise<EvaluationComment> => {
  await delay(300);

  const newComment: EvaluationComment = {
    id: `eval-comment-${Date.now()}`,
    content: data.content,
    author: data.authorName,
    timestamp: new Date().toISOString(),
    "created-at": new Date().toISOString(),
    "author-role": "APPRAISAL_COUNCIL",
    evaluationId: data.evaluationId,
  };

  // Add to mock storage
  if (!mockEvaluationComments[data.evaluationId]) {
    mockEvaluationComments[data.evaluationId] = [];
  }
  mockEvaluationComments[data.evaluationId].push(newComment);

  return newComment;
};

// Evaluation Stage APIs
export const createEvaluationStage = async (
  data: CreateEvaluationStageData
): Promise<EvaluationStageApi> => {
  await delay(500);

  const newStage = {
    id: `stage-${Date.now()}`,
    name: data.name,
    phrase: data.phrase,
    "stage-order": 99, // Will be set properly in real implementation
    status: "created",
    type: data.type,
    "evaluation-id": data.evaluationId,
    "milestone-id": null,
    "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
    transactions: null,
    "individual-evaluations": [],
  };

  // In real implementation, this would update the evaluation in the database
  // For now, we'll just return the new stage
  return newStage;
};

// Statistics APIs
export const getCouncilStatistics = async (councilId?: string) => {
  await delay(400);

  const filteredProjects = councilId
    ? mockProjects.filter((p) => p["council-id"] === councilId)
    : mockProjects;

  return {
    totalProjects: filteredProjects.length,
    activeProjects: filteredProjects.filter((p) => p.status === "active")
      .length,
    completedEvaluations: 5,
    pendingEvaluations: 3,
    avgProjectBudget:
      filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0) /
      filteredProjects.length,
    projectsByStatus: {
      active: filteredProjects.filter((p) => p.status === "active").length,
      pending: filteredProjects.filter((p) => p.status === "pending").length,
      approved: filteredProjects.filter((p) => p.status === "approved").length,
      "under review": filteredProjects.filter(
        (p) => p.status === "under review"
      ).length,
      submitted: filteredProjects.filter((p) => p.status === "submitted")
        .length,
    },
    projectsByCategory: filteredProjects.reduce(
      (acc: { [key: string]: number }, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      },
      {}
    ),
    recentActivity: [
      {
        id: "1",
        type: "evaluation_completed",
        description: "Literature Review Assessment completed",
        timestamp: "2024-08-15T14:30:00.000Z",
        projectId: "015a8626-2ccf-4258-a945-2569d3566fc2",
      },
      {
        id: "2",
        type: "project_submitted",
        description: "New project submitted for review",
        timestamp: "2024-08-10T09:15:00.000Z",
        projectId: "project-5",
      },
      {
        id: "3",
        type: "milestone_updated",
        description: "Framework Development milestone updated",
        timestamp: "2024-08-08T16:45:00.000Z",
        projectId: "015a8626-2ccf-4258-a945-2569d3566fc2",
      },
    ],
  };
};

// Test API function for comprehensive testing
export const testAllApiFunctions = async () => {
  const results = {
    projects: await getAllProjects(),
    projectsByCouncil: await getProjectsByCouncil(
      "d5a1e186-b112-497a-ae16-ed2c114664ad"
    ),
    milestones: await getProjectMilestones(
      "015a8626-2ccf-4258-a945-2569d3566fc2"
    ),
    evaluations: await getMilestoneEvaluations("milestone-1"),
    statistics: await getCouncilStatistics(),
  };

  return results;
};

// Export consolidated API
export const councilApi = {
  // Projects
  getAllProjects,
  getProjectsByCouncil,
  getProjectById,

  // Milestones
  getProjectMilestones,
  getMilestoneById,

  // Evaluations
  getMilestoneEvaluations,
  getEvaluationDetail,
  createEvaluation,
  createIndividualEvaluation,

  // Individual Evaluations
  getIndividualEvaluationDetail,
  updateIndividualEvaluation,
  submitIndividualEvaluation,

  // Comments
  addComment,

  // Evaluation Comments
  getEvaluationComments,
  addEvaluationComment,

  // Evaluation Stages
  createEvaluationStage,

  // Statistics
  getCouncilStatistics,

  // Testing
  testAllApiFunctions,
};

export default councilApi;
