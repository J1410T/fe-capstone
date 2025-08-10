import {
  ProjectDocument,
  ProjectClone,
  PIRequest,
  EnhancedMilestone,
} from "./types";

// Sample document content for TinyMCE
export const sampleDocuments: Record<string, ProjectDocument> = {
  "doc-1": {
    id: "doc-1",
    name: "Project Proposal Document",
    type: "proposal",
    content: `<h2>Advanced Medical Diagnosis System</h2>
    <p>This project aims to develop an AI-powered diagnostic system that can analyze medical images with 95% accuracy.</p>
    <h3>Objectives</h3>
    <ul>
      <li>Develop machine learning algorithms for medical image analysis</li>
      <li>Create user-friendly interface for healthcare professionals</li>
      <li>Ensure compliance with medical data privacy regulations</li>
    </ul>
    <h3>Timeline</h3>
    <p>The project is planned to be completed within 12 months, with major milestones every 3 months.</p>
    <h3>Expected Outcomes</h3>
    <p>The system will significantly improve diagnostic accuracy and reduce the time required for medical image analysis.</p>`,
    uploadedAt: "2025-01-15",
    uploadedBy: "Dr. Sarah Johnson",
    size: "2.3 MB",
  },
  "doc-2": {
    id: "doc-2",
    name: "Technical Specifications",
    type: "supporting",
    content: `<h2>Technical Requirements</h2>
    <p>This document outlines the technical specifications for the medical diagnosis system.</p>
    <h3>System Architecture</h3>
    <p>The system will be built using a microservices architecture with the following components:</p>
    <ul>
      <li><strong>Image Processing Service</strong> - Handles medical image preprocessing and enhancement</li>
      <li><strong>AI Analysis Engine</strong> - Core machine learning models for diagnosis</li>
      <li><strong>User Interface Layer</strong> - Web-based dashboard for healthcare professionals</li>
      <li><strong>Data Storage System</strong> - Secure storage for medical images and results</li>
    </ul>
    <h3>Technology Stack</h3>
    <p>Python, TensorFlow, React, PostgreSQL, Docker, Kubernetes</p>`,
    uploadedAt: "2025-01-20",
    uploadedBy: "Dr. Robert Kim",
    size: "1.8 MB",
  },
  "doc-3": {
    id: "doc-3",
    name: "PI Curriculum Vitae",
    type: "cv",
    content: `<h2>Dr. Sarah Johnson - Curriculum Vitae</h2>
    <h3>Education</h3>
    <p><strong>Ph.D. in Computer Science</strong>, Stanford University (2015)</p>
    <p><strong>M.S. in Artificial Intelligence</strong>, MIT (2012)</p>
    <p><strong>B.S. in Computer Science</strong>, UC Berkeley (2010)</p>
    <h3>Professional Experience</h3>
    <p><strong>Senior Research Scientist</strong>, Medical AI Lab (2018-Present)</p>
    <ul>
      <li>Led development of AI diagnostic tools for radiology</li>
      <li>Published 15+ papers in top-tier conferences</li>
      <li>Secured $2M in research funding</li>
    </ul>
    <p><strong>Research Associate</strong>, Healthcare Innovation Center (2015-2018)</p>
    <ul>
      <li>Developed machine learning algorithms for medical image analysis</li>
      <li>Collaborated with clinical teams on AI implementation</li>
    </ul>
    <h3>Publications</h3>
    <p>Over 25 peer-reviewed publications in medical AI and machine learning, including:</p>
    <ul>
      <li>"Deep Learning for Medical Image Segmentation" - Nature Medicine (2023)</li>
      <li>"AI-Powered Diagnostic Systems in Clinical Practice" - NEJM (2022)</li>
    </ul>`,
    uploadedAt: "2025-01-10",
    uploadedBy: "Dr. Sarah Johnson",
    size: "0.5 MB",
  },
};

// Enhanced milestones with evaluation data and documents
export const mockEnhancedMilestones: Record<string, EnhancedMilestone[]> = {
  "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d": [
    {
      id: "milestone-1",
      title: "Project Proposal and Initial Research",
      scheduledDate: "2025-01-15",
      status: "completed",
      description:
        "Complete project proposal submission and conduct initial literature review",
      documents: [sampleDocuments["doc-1"], sampleDocuments["doc-3"]],
      evaluationStage: "completed",
      evaluators: ["Dr. Emily Davis", "Prof. Michael Chen"],
      evaluationData: {
        score: 8.5,
        comments:
          "Excellent proposal with clear objectives and methodology. Strong technical foundation.",
        submittedAt: "2025-02-01",
        status: "approved",
        documents: [
          {
            id: "eval-doc-1",
            name: "Milestone 1 Evaluation Report",
            type: "evaluation",
            content: `<h2>Milestone 1 Evaluation Report</h2>
            <h3>Project: Advanced Medical Diagnosis System</h3>
            <p><strong>Evaluation Date:</strong> February 1, 2025</p>
            <p><strong>Evaluators:</strong> Dr. Emily Davis, Prof. Michael Chen</p>

            <h3>Evaluation Criteria</h3>
            <ul>
              <li><strong>Technical Merit:</strong> 9/10 - Excellent technical approach with innovative AI methodologies</li>
              <li><strong>Feasibility:</strong> 8/10 - Realistic timeline and resource allocation</li>
              <li><strong>Innovation:</strong> 8/10 - Novel application of machine learning in medical diagnosis</li>
              <li><strong>Team Capability:</strong> 9/10 - Strong team with relevant expertise</li>
            </ul>

            <h3>Detailed Comments</h3>
            <p>The project proposal demonstrates exceptional technical merit with a clear understanding of the challenges in medical AI. The proposed methodology is sound and the team has the necessary expertise to execute the project successfully.</p>

            <h3>Recommendations</h3>
            <ul>
              <li>Consider expanding the dataset to include more diverse medical conditions</li>
              <li>Establish partnerships with additional medical institutions</li>
              <li>Develop a comprehensive validation framework</li>
            </ul>

            <h3>Final Decision</h3>
            <p><strong>Status:</strong> APPROVED</p>
            <p><strong>Overall Score:</strong> 8.5/10</p>`,
            uploadedAt: "2025-02-01",
            uploadedBy: "Dr. Emily Davis",
            size: "1.2 MB",
          },
        ],
      },
      evaluationStageDocuments: [
        {
          id: "stage-doc-1",
          name: "Evaluation Rubric - Milestone 1",
          type: "supporting",
          content: `<h2>Evaluation Rubric - Project Proposal Stage</h2>
          <h3>Scoring Guidelines</h3>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr><th>Criteria</th><th>Weight</th><th>Excellent (9-10)</th><th>Good (7-8)</th><th>Fair (5-6)</th><th>Poor (1-4)</th></tr>
            <tr><td>Technical Merit</td><td>30%</td><td>Innovative, sound methodology</td><td>Good technical approach</td><td>Basic technical understanding</td><td>Weak technical foundation</td></tr>
            <tr><td>Feasibility</td><td>25%</td><td>Realistic and well-planned</td><td>Generally feasible</td><td>Some concerns about feasibility</td><td>Unrealistic expectations</td></tr>
            <tr><td>Innovation</td><td>25%</td><td>Highly innovative approach</td><td>Some innovative elements</td><td>Limited innovation</td><td>No significant innovation</td></tr>
            <tr><td>Team Capability</td><td>20%</td><td>Excellent team composition</td><td>Good team skills</td><td>Adequate team</td><td>Insufficient expertise</td></tr>
          </table>`,
          uploadedAt: "2025-01-10",
          uploadedBy: "Evaluation Committee",
          size: "0.8 MB",
        },
      ],
    },
    {
      id: "milestone-2",
      title: "System Design and Architecture",
      scheduledDate: "2025-03-15",
      status: "ongoing",
      description:
        "Design system architecture and create technical specifications",
      documents: [sampleDocuments["doc-2"]],
      evaluationStage: "in_progress",
      evaluators: ["Dr. Lisa Wang", "Prof. James Wilson"],
      evaluationData: {
        status: "pending",
        documents: [],
      },
      evaluationStageDocuments: [
        {
          id: "stage-doc-2",
          name: "Design Review Checklist",
          type: "supporting",
          content: `<h2>System Design Review Checklist</h2>
          <h3>Architecture Review Points</h3>
          <ul>
            <li>System scalability and performance requirements</li>
            <li>Security and privacy considerations</li>
            <li>Integration with existing medical systems</li>
            <li>Data flow and processing architecture</li>
            <li>User interface design principles</li>
            <li>Testing and validation strategies</li>
          </ul>`,
          uploadedAt: "2025-03-01",
          uploadedBy: "Technical Review Board",
          size: "0.5 MB",
        },
      ],
    },
    {
      id: "milestone-3",
      title: "Prototype Development",
      scheduledDate: "2025-05-15",
      status: "upcoming",
      description: "Develop initial prototype and conduct preliminary testing",
      documents: [],
      evaluationStage: "not_started",
      evaluators: ["Dr. Maria Garcia", "Prof. David Lee"],
      evaluationStageDocuments: [
        {
          id: "stage-doc-3",
          name: "Prototype Evaluation Framework",
          type: "supporting",
          content: `<h2>Prototype Evaluation Framework</h2>
          <h3>Testing Criteria</h3>
          <p>The prototype will be evaluated based on the following criteria:</p>
          <ul>
            <li>Functional completeness</li>
            <li>Performance benchmarks</li>
            <li>User experience quality</li>
            <li>Technical implementation quality</li>
            <li>Documentation completeness</li>
          </ul>`,
          uploadedAt: "2025-04-01",
          uploadedBy: "Evaluation Committee",
          size: "0.6 MB",
        },
      ],
    },
  ],
  "37262efd-0640-45bb-a5a6-148c54d9b7f6": [
    {
      id: "milestone-4",
      title: "Research Phase Completion",
      scheduledDate: "2025-02-01",
      status: "completed",
      description: "Complete comprehensive research and analysis phase",
      documents: [],
      evaluationStage: "completed",
      evaluators: ["Prof. Anna Rodriguez"],
      evaluationData: {
        score: 9.2,
        comments:
          "Outstanding research quality with innovative approaches and thorough analysis.",
        submittedAt: "2025-02-15",
        status: "approved",
        documents: [
          {
            id: "eval-doc-2",
            name: "Research Phase Evaluation",
            type: "evaluation",
            content: `<h2>Research Phase Evaluation Report</h2>
            <p><strong>Project:</strong> Smart Learning Management Platform</p>
            <p><strong>Overall Score:</strong> 9.2/10</p>
            <p>Exceptional research quality with comprehensive literature review and innovative methodological approaches.</p>`,
            uploadedAt: "2025-02-15",
            uploadedBy: "Prof. Anna Rodriguez",
            size: "2.1 MB",
          },
        ],
      },
      evaluationStageDocuments: [],
    },
    {
      id: "milestone-5",
      title: "Development Phase",
      scheduledDate: "2025-04-01",
      status: "ongoing",
      description: "Implementation and development of the learning platform",
      documents: [],
      evaluationStage: "in_progress",
      evaluators: ["Dr. Thomas Brown", "Prof. Jennifer Kim"],
      evaluationData: {
        status: "pending",
        documents: [],
      },
      evaluationStageDocuments: [],
    },
  ],
};

// Mock data for hierarchical structure with enhanced features
export const mockProjectClones: Record<string, ProjectClone[]> = {
  "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d": [
    {
      id: "clone-1",
      name: "Clone A - Medical AI Research",
      status: "active",
      council: "AI Research Council",
      createdAt: "2025-01-10",
      proposals: [
        {
          id: "prop-1",
          title: "Advanced Medical Diagnosis System",
          pi: "Dr. Sarah Johnson",
          status: "approved",
          submittedAt: "2025-01-15",
          objectives:
            "Develop AI-powered diagnostic tools for medical image analysis with 95% accuracy",
          members: [
            "Dr. Sarah Johnson",
            "Dr. Mike Chen",
            "Alice Wang",
            "Bob Smith",
          ],
          timeline: "12 months",
          documents: [sampleDocuments["doc-1"], sampleDocuments["doc-3"]],
        },
        {
          id: "prop-2",
          title: "Medical Image Analysis Platform",
          pi: "Dr. Robert Kim",
          status: "under_review",
          submittedAt: "2025-01-20",
          objectives:
            "Create comprehensive platform for medical image processing and analysis",
          members: ["Dr. Robert Kim", "Jane Doe"],
          timeline: "8 months",
          documents: [sampleDocuments["doc-2"]],
        },
      ],
      evaluations: [
        {
          id: "eval-1",
          milestone: "Milestone 1 - Project Proposal",
          reviewer: "Dr. Emily Davis",
          score: 8.5,
          status: "completed",
          submittedAt: "2025-02-01",
          comments:
            "Excellent progress on initial research phase with strong methodology and clear objectives.",
          documents: [],
        },
      ],
      documents: [sampleDocuments["doc-1"], sampleDocuments["doc-2"]],
    },
    {
      id: "clone-2",
      name: "Clone B - Clinical Implementation",
      status: "pending",
      createdAt: "2025-01-25",
      proposals: [
        {
          id: "prop-3",
          title: "Clinical Trial Management System",
          pi: "Dr. Lisa Brown",
          status: "submitted",
          submittedAt: "2025-01-28",
          objectives:
            "Develop system for managing clinical trials and patient data",
          members: ["Dr. Lisa Brown", "Mark Johnson"],
          timeline: "10 months",
          documents: [],
        },
      ],
      evaluations: [],
      documents: [],
    },
  ],
  "37262efd-0640-45bb-a5a6-148c54d9b7f6": [
    {
      id: "clone-3",
      name: "Clone A - AI Learning Platform",
      status: "approved",
      council: "Education Technology Council",
      createdAt: "2025-01-05",
      proposals: [
        {
          id: "prop-4",
          title: "Adaptive Learning System",
          pi: "Dr. James Wilson",
          status: "approved",
          submittedAt: "2025-01-08",
          objectives:
            "Create adaptive learning platform using AI to personalize education",
          members: ["Dr. James Wilson", "Sarah Lee", "Tom Wilson"],
          timeline: "14 months",
          documents: [],
        },
      ],
      evaluations: [
        {
          id: "eval-2",
          milestone: "Final Review",
          reviewer: "Dr. Maria Garcia",
          score: 9.2,
          status: "completed",
          submittedAt: "2025-02-15",
          comments:
            "Outstanding implementation with innovative features and excellent user experience.",
          documents: [],
        },
      ],
      documents: [],
    },
  ],
};

export const mockPIRequests: PIRequest[] = [
  {
    id: "req-1",
    projectId: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    cloneId: "clone-1",
    requestType: "council_assignment",
    status: "pending",
    submittedAt: "2025-01-30",
    description:
      "Request for specialized AI ethics council assignment to review ethical implications of medical AI system",
    documents: [sampleDocuments["doc-3"]],
  },
  {
    id: "req-2",
    projectId: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
    requestType: "deadline_extension",
    status: "approved",
    submittedAt: "2025-01-25",
    description:
      "Extension needed due to additional research requirements and expanded scope of the learning platform",
    documents: [],
  },
];
