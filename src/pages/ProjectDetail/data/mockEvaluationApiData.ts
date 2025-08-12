import { EvaluationApiResponse, Evaluation } from "@/types/evaluation-api";

// Mock evaluation data matching the actual API response structure
export const mockEvaluationsData: EvaluationApiResponse = {
  "page-index": 1,
  "page-size": 10,
  "total-count": 3,
  "total-page": 1,
  "data-list": [
    {
      id: "28eca18c-74f5-40ae-9326-e756f9a5d798",
      code: "EVA-PAI12082025",
      title: "Evaluation Of PAI",
      "total-rate": null,
      comment: null,
      "create-date": "2025-08-12T17:35:44.2660377",
      status: "created",
      "project-id": "015a8626-2ccf-4258-a945-2569d3566fc2",
      "appraisal-council-id": null,
      documents: null,
      "evaluation-stages": [
        {
          id: "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
          name: "Outline Approval",
          "stage-order": 1,
          phrase: "Approval",
          type: "project",
          status: "created",
          "evaluation-id": "28eca18c-74f5-40ae-9326-e756f9a5d798",
          "milestone-id": null,
          "appraisal-council-id": null,
          transactions: null,
          "individual-evaluations": [
            {
              id: "a011f1ed-4b91-4ce0-872c-53216acbee9b",
              name: "AI Review",
              "total-rate": 8.5,
              comment:
                'Based on the provided data for the project titled "Philosophy in the Age of Artificial Intelligence," several key aspects can be evaluated and analyzed for clarity, purpose, and potential impact.\n\n### Title and Description\n\nThe title effectively encapsulates the core theme by merging two significant domains: philosophy and artificial intelligence (AI). The description succinctly outlines the study\'s objectives, emphasizing the exploration of ethical considerations, human identity, and decision-making autonomy within the context of AI. This focus is both timely and relevant, given the rapid advancements in AI technology and its implications for society.',
              "submitted-at": "2025-08-12T17:35:44.4527859",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": true,
              status: "completed",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": null,
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "b022f2ed-5c92-5df1-973d-64327bdcff0c",
              name: "Dr. Sarah Johnson - Philosophy Expert",
              "total-rate": 9.2,
              comment:
                "Excellent philosophical foundation. The research approach is well-structured and addresses key ethical concerns in AI development. The methodology is sound and the expected outcomes are clearly defined.",
              "submitted-at": "2025-08-12T16:20:30.1234567",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": "rev-123-456-789",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "c033f3ed-6d03-6ef2-084e-75438cedd1d",
              name: "Prof. Michael Chen - AI Ethics Specialist",
              "total-rate": 8.8,
              comment:
                "Strong interdisciplinary approach. The project addresses current gaps in AI ethics research. Minor suggestions for expanding the scope of case studies.",
              "submitted-at": "2025-08-12T14:45:15.9876543",
              "is-approved": true,
              "reviewer-result": "approved_with_conditions",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": "rev-987-654-321",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "d044f4ed-7e14-7fg3-195f-86549deed2e",
              name: "Dr. Emily Rodriguez - Computer Science",
              "total-rate": 8.0,
              comment:
                "Good technical understanding of AI systems. The philosophical perspective adds valuable depth to the analysis. Recommend including more recent AI developments.",
              "submitted-at": "2025-08-12T13:30:22.5647382",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": "rev-456-789-012",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "e055f5ed-8f25-8gh4-2a6g-97660efff3f",
              name: "Council Review Panel",
              "total-rate": 8.7,
              comment:
                "Comprehensive evaluation by the appraisal council. The project meets all required criteria and demonstrates strong potential for impact in the field of AI ethics.",
              "submitted-at": "2025-08-12T12:15:10.3456789",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": "rev-789-012-345",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "f066f6ed-9g36-9hi5-3b7h-a8771fggg4g",
              name: "External Review - Industry Expert",
              "total-rate": 7.5,
              comment:
                "Practical relevance is clear, though some aspects could benefit from industry case studies. The theoretical framework is solid.",
              "submitted-at": "2025-08-12T11:00:45.7890123",
              "is-approved": false,
              "reviewer-result": "needs_revision",
              "is-ai-report": false,
              status: "pending",
              "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
              "reviewer-id": "rev-012-345-678",
              documents: null,
              "projects-similarity-result": null,
            },
          ],
        },
      ],
    },
    {
      id: "442b05c7-3aef-43a9-9422-9e0758fb8647",
      code: "EVA-PERW12082025",
      title: "Evaluation Of PERW",
      "total-rate": null,
      comment: null,
      "create-date": "2025-08-12T17:14:00.0132858",
      status: "created",
      "project-id": "a91dfc88-5d99-4ff6-a08e-6beeebe0f8cb",
      "appraisal-council-id": null,
      documents: null,
      "evaluation-stages": [
        {
          id: "3a41b972-7724-4734-8370-596e7462bf25",
          name: "Outline Approval",
          "stage-order": 1,
          phrase: "Approval",
          type: "project",
          status: "created",
          "evaluation-id": "442b05c7-3aef-43a9-9422-9e0758fb8647",
          "milestone-id": null,
          "appraisal-council-id": null,
          transactions: null,
          "individual-evaluations": [
            {
              id: "206924db-3ddf-4d9c-b35d-c3acae9dca8b",
              name: "AI Review",
              "total-rate": 7.8,
              comment:
                'Based on the provided data, it appears you are outlining a research proposal titled "Psychological Effects of Remote Work." This proposal focuses on investigating the mental health implications of remote work, alongside its effects on productivity and work-life balance.',
              "submitted-at": "2025-08-12T17:14:00.1969422",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": true,
              status: "completed",
              "evaluation-stage-id": "3a41b972-7724-4734-8370-596e7462bf25",
              "reviewer-id": null,
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "g077g7ed-ah47-ah6i-4c8i-b9882hhhh5h",
              name: "Dr. Lisa Williams - Psychology Research Lead",
              "total-rate": 8.9,
              comment:
                "Excellent research design for studying remote work psychology. The methodology is well-suited for capturing both quantitative and qualitative insights. Strong potential for practical applications.",
              "submitted-at": "2025-08-12T16:45:20.2468135",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "3a41b972-7724-4734-8370-596e7462bf25",
              "reviewer-id": "rev-234-567-890",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "h088h8ed-bi58-bi7j-5d9j-ca993iiiii6i",
              name: "Prof. David Thompson - Organizational Psychology",
              "total-rate": 8.3,
              comment:
                "The study addresses a critical contemporary issue. Good balance between academic rigor and practical relevance. Recommend expanding the sample size for better generalizability.",
              "submitted-at": "2025-08-12T15:30:15.3579246",
              "is-approved": true,
              "reviewer-result": "approved_with_conditions",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "3a41b972-7724-4734-8370-596e7462bf25",
              "reviewer-id": "rev-345-678-901",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "i099i9ed-cj69-cj8k-6e0k-db004jjjjj7j",
              name: "Dr. Amanda Foster - HR Research Specialist",
              "total-rate": 8.6,
              comment:
                "Strong theoretical foundation with clear practical implications for HR policies. The interdisciplinary approach is commendable and will provide valuable insights for organizations.",
              "submitted-at": "2025-08-12T14:15:30.4680357",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "3a41b972-7724-4734-8370-596e7462bf25",
              "reviewer-id": "rev-456-789-012",
              documents: null,
              "projects-similarity-result": null,
            },
            {
              id: "j100j0ed-dk70-dk9l-7f1l-ec115kkkkkk8k",
              name: "Council Evaluation Board",
              "total-rate": 8.1,
              comment:
                "Comprehensive review by the evaluation board. The research proposal meets academic standards and addresses an important contemporary workplace issue. Minor revisions suggested for methodology section.",
              "submitted-at": "2025-08-12T13:00:45.5791468",
              "is-approved": true,
              "reviewer-result": "approved",
              "is-ai-report": false,
              status: "completed",
              "evaluation-stage-id": "3a41b972-7724-4734-8370-596e7462bf25",
              "reviewer-id": "rev-567-890-123",
              documents: null,
              "projects-similarity-result": null,
            },
          ],
        },
      ],
    },
    {
      id: "a545db83-d3b3-4263-931d-924f11099806",
      code: "EVA-CSTPAI11082025",
      title: "Evaluation With Appraisal Council",
      "total-rate": null,
      comment: null,
      "create-date": "2025-08-11T16:58:32.7753337",
      status: "created",
      "project-id": "47dd86c6-224e-49fb-9dbc-6fbee9a2966a",
      "appraisal-council-id": "d5a1e186-b112-497a-ae16-ed2c114664ad",
      documents: null,
      "evaluation-stages": [],
    },
  ],
};

export const getEvaluationsByProject = async (
  projectId: string
): Promise<Evaluation[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For testing purposes, return all evaluations regardless of project ID
  // In real implementation, this would filter by project ID
  console.log("Mock: Getting evaluations for project:", projectId);
  return mockEvaluationsData["data-list"];
};

export const getEvaluationById = async (
  evaluationId: string
): Promise<Evaluation | undefined> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("Mock: Getting evaluation by ID:", evaluationId);
  const found = mockEvaluationsData["data-list"].find(
    (evaluation) => evaluation.id === evaluationId
  );
  console.log("Mock: Found evaluation:", found);
  return found;
};
