// Enhanced mock data for PI requests with comprehensive project registration details
import { PIRequest, ProjectDocument } from "./types";

// Enhanced CV documents
const cvDocuments: Record<string, ProjectDocument> = {
  "cv-sarah": {
    id: "cv-sarah",
    name: "Dr. Sarah Johnson - Scientific CV",
    type: "cv",
    content: `<h1>Dr. Sarah Johnson - Scientific Curriculum Vitae</h1>
    <h2>Personal Information</h2>
    <p><strong>Position:</strong> Associate Professor, Department of Computer Science</p>
    <p><strong>Institution:</strong> University Research Center</p>
    <p><strong>Email:</strong> sarah.johnson@university.edu</p>
    <p><strong>Phone:</strong> +1-555-0123</p>
    
    <h2>Education</h2>
    <ul>
      <li><strong>Ph.D. in Computer Science</strong>, Stanford University (2015)
        <br>Dissertation: "Machine Learning Approaches for Medical Image Analysis"</li>
      <li><strong>M.S. in Artificial Intelligence</strong>, MIT (2012)</li>
      <li><strong>B.S. in Computer Science</strong>, UC Berkeley (2010), Summa Cum Laude</li>
    </ul>
    
    <h2>Professional Experience</h2>
    <h3>Associate Professor (2020-Present)</h3>
    <p>Department of Computer Science, University Research Center</p>
    <ul>
      <li>Lead research in medical AI and machine learning applications</li>
      <li>Principal Investigator on $2.5M NIH grant for medical diagnosis systems</li>
      <li>Supervise 8 PhD students and 12 Master's students</li>
    </ul>
    
    <h3>Assistant Professor (2018-2020)</h3>
    <p>Department of Computer Science, University Research Center</p>
    
    <h3>Senior Research Scientist (2015-2018)</h3>
    <p>Medical AI Lab, Healthcare Innovation Center</p>
    
    <h2>Research Interests</h2>
    <ul>
      <li>Medical Image Analysis and Computer Vision</li>
      <li>Machine Learning for Healthcare Applications</li>
      <li>AI Ethics and Responsible AI Development</li>
      <li>Deep Learning for Medical Diagnosis</li>
    </ul>
    
    <h2>Selected Publications (Last 5 Years)</h2>
    <ol>
      <li>Johnson, S., et al. (2024). "Deep Learning for Medical Image Segmentation: A Comprehensive Review." <em>Nature Medicine</em>, 30(4), 123-145.</li>
      <li>Johnson, S., Chen, M. (2023). "AI-Powered Diagnostic Systems in Clinical Practice: Challenges and Opportunities." <em>New England Journal of Medicine</em>, 389(8), 234-248.</li>
      <li>Johnson, S., et al. (2023). "Ethical Considerations in Medical AI Development." <em>Science</em>, 380(6642), 456-461.</li>
      <li>Johnson, S., Wang, L. (2022). "Federated Learning for Medical Data: Privacy-Preserving Approaches." <em>Nature Biotechnology</em>, 40(12), 1789-1798.</li>
      <li>Johnson, S., et al. (2022). "Automated Diagnosis of Skin Cancer Using Deep Convolutional Networks." <em>The Lancet Digital Health</em>, 4(3), e123-e134.</li>
    </ol>
    
    <h2>Grants and Funding</h2>
    <ul>
      <li><strong>NIH R01 Grant</strong> (2022-2027): "AI-Powered Medical Diagnosis Systems" - $2,500,000 (PI)</li>
      <li><strong>NSF CAREER Award</strong> (2021-2026): "Ethical AI in Healthcare" - $750,000 (PI)</li>
      <li><strong>Google Research Award</strong> (2023): "Federated Learning for Medical Applications" - $100,000 (PI)</li>
    </ul>
    
    <h2>Awards and Honors</h2>
    <ul>
      <li>IEEE Fellow (2024)</li>
      <li>Outstanding Young Researcher Award, International Conference on Medical AI (2023)</li>
      <li>Best Paper Award, MICCAI 2022</li>
      <li>NSF CAREER Award (2021)</li>
    </ul>`,
    uploadedAt: "2025-01-10",
    uploadedBy: "Dr. Sarah Johnson",
    size: "2.1 MB",
  },
  "cv-michael": {
    id: "cv-michael",
    name: "Dr. Michael Chen - Scientific CV",
    type: "cv",
    content: `<h1>Dr. Michael Chen - Scientific Curriculum Vitae</h1>
    <h2>Personal Information</h2>
    <p><strong>Position:</strong> Professor, Department of Biomedical Engineering</p>
    <p><strong>Institution:</strong> University Research Center</p>
    <p><strong>Email:</strong> michael.chen@university.edu</p>
    
    <h2>Education</h2>
    <ul>
      <li><strong>Ph.D. in Biomedical Engineering</strong>, Johns Hopkins University (2010)</li>
      <li><strong>M.S. in Electrical Engineering</strong>, Stanford University (2007)</li>
      <li><strong>B.S. in Bioengineering</strong>, UC San Diego (2005)</li>
    </ul>
    
    <h2>Research Expertise</h2>
    <ul>
      <li>Medical Device Development</li>
      <li>Biomedical Signal Processing</li>
      <li>Clinical Trial Design and Management</li>
      <li>Regulatory Affairs for Medical Devices</li>
    </ul>
    
    <h2>Selected Publications</h2>
    <ol>
      <li>Chen, M., et al. (2024). "Clinical Validation of AI-Based Diagnostic Tools." <em>Journal of Medical Engineering</em>, 45(2), 78-92.</li>
      <li>Chen, M., Johnson, S. (2023). "Integration of AI Systems in Clinical Workflows." <em>IEEE Transactions on Biomedical Engineering</em>, 70(8), 2234-2245.</li>
    </ol>`,
    uploadedAt: "2025-01-12",
    uploadedBy: "Dr. Michael Chen",
    size: "1.8 MB",
  },
  "cv-alice": {
    id: "cv-alice",
    name: "Alice Wang - Academic CV",
    type: "cv",
    content: `<h1>Alice Wang - Academic Curriculum Vitae</h1>
    <h2>Personal Information</h2>
    <p><strong>Position:</strong> PhD Student, Department of Computer Science</p>
    <p><strong>Institution:</strong> University Research Center</p>
    <p><strong>Email:</strong> alice.wang@university.edu</p>
    
    <h2>Education</h2>
    <ul>
      <li><strong>PhD in Computer Science</strong>, University Research Center (2022-Present)
        <br>Advisor: Dr. Sarah Johnson</li>
      <li><strong>M.S. in Computer Science</strong>, Carnegie Mellon University (2022)</li>
      <li><strong>B.S. in Computer Science</strong>, MIT (2020), Magna Cum Laude</li>
    </ul>
    
    <h2>Research Focus</h2>
    <ul>
      <li>Deep Learning for Medical Image Analysis</li>
      <li>Computer Vision Applications in Healthcare</li>
      <li>Neural Network Optimization</li>
    </ul>
    
    <h2>Publications</h2>
    <ol>
      <li>Wang, A., Johnson, S. (2024). "Efficient Neural Networks for Medical Image Classification." <em>MICCAI 2024</em> (accepted).</li>
      <li>Wang, A., et al. (2023). "Data Augmentation Techniques for Medical AI." <em>IEEE ISBI 2023</em>, pp. 123-127.</li>
    </ol>`,
    uploadedAt: "2025-01-15",
    uploadedBy: "Alice Wang",
    size: "0.9 MB",
  },
  "cv-bob": {
    id: "cv-bob",
    name: "Bob Smith - Professional CV",
    type: "cv",
    content: `<h1>Bob Smith - Professional Curriculum Vitae</h1>
    <h2>Personal Information</h2>
    <p><strong>Position:</strong> Senior Research Engineer</p>
    <p><strong>Institution:</strong> University Research Center</p>
    <p><strong>Email:</strong> bob.smith@university.edu</p>
    
    <h2>Education</h2>
    <ul>
      <li><strong>M.S. in Software Engineering</strong>, University of Washington (2018)</li>
      <li><strong>B.S. in Computer Science</strong>, University of California, Davis (2016)</li>
    </ul>
    
    <h2>Professional Experience</h2>
    <ul>
      <li><strong>Senior Research Engineer</strong> (2020-Present): Medical AI systems development</li>
      <li><strong>Software Engineer</strong> (2018-2020): Healthcare technology solutions</li>
    </ul>
    
    <h2>Technical Skills</h2>
    <ul>
      <li>Python, TensorFlow, PyTorch</li>
      <li>Medical imaging software development</li>
      <li>Cloud computing and deployment</li>
      <li>Software architecture and system design</li>
    </ul>`,
    uploadedAt: "2025-01-18",
    uploadedBy: "Bob Smith",
    size: "0.7 MB",
  },
  "cv-james": {
    id: "cv-james",
    name: "Prof. James Wilson - Scientific CV",
    type: "cv",
    content: `<h1>Prof. James Wilson - Scientific Curriculum Vitae</h1>
    <h2>Personal Information</h2>
    <p><strong>Position:</strong> Professor, Department of Education Technology</p>
    <p><strong>Institution:</strong> University Research Center</p>
    <p><strong>Email:</strong> james.wilson@university.edu</p>
    
    <h2>Education</h2>
    <ul>
      <li><strong>Ph.D. in Educational Technology</strong>, Harvard University (2008)</li>
      <li><strong>M.Ed. in Curriculum and Instruction</strong>, Stanford University (2005)</li>
      <li><strong>B.A. in Computer Science</strong>, MIT (2003)</li>
    </ul>
    
    <h2>Research Interests</h2>
    <ul>
      <li>Adaptive Learning Systems</li>
      <li>AI in Education</li>
      <li>Learning Analytics</li>
      <li>Educational Technology Integration</li>
    </ul>`,
    uploadedAt: "2025-01-22",
    uploadedBy: "Prof. James Wilson",
    size: "1.5 MB",
  },
  "cv-lisa": {
    id: "cv-lisa",
    name: "Dr. Lisa Brown - Scientific CV",
    type: "cv",
    content: `<h1>Dr. Lisa Brown - Scientific Curriculum Vitae</h1>
    <h2>Education</h2>
    <ul>
      <li><strong>Ph.D. in Educational Psychology</strong>, University of Michigan (2012)</li>
      <li><strong>M.A. in Psychology</strong>, Northwestern University (2009)</li>
    </ul>
    <h2>Research Focus</h2>
    <ul>
      <li>Learning Psychology</li>
      <li>Cognitive Load Theory</li>
      <li>Educational Assessment</li>
    </ul>`,
    uploadedAt: "2025-01-24",
    uploadedBy: "Dr. Lisa Brown",
    size: "1.2 MB",
  },
};

// Enhanced PI Requests with comprehensive project registration details
const enhancedPIRequests: PIRequest[] = [
  {
    id: "req-1",
    projectId: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    cloneId: "clone-1",
    requestType: "council_assignment",
    status: "pending",
    submittedAt: "2025-01-30",
    description:
      "Request for specialized AI ethics council assignment to review ethical implications of medical AI system",
    documents: [],
    projectRegistrationDetails: {
      projectTitle: "Advanced Medical Diagnosis System using AI",
      principalInvestigator: {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        phone: "+1-555-0123",
        department: "Computer Science",
        position: "Associate Professor",
        cv: cvDocuments["cv-sarah"],
      },
      teamMembers: [
        {
          name: "Dr. Michael Chen",
          role: "Co-Investigator",
          email: "michael.chen@university.edu",
          department: "Biomedical Engineering",
          cv: cvDocuments["cv-michael"],
        },
        {
          name: "Alice Wang",
          role: "PhD Student",
          email: "alice.wang@university.edu",
          department: "Computer Science",
          cv: cvDocuments["cv-alice"],
        },
        {
          name: "Bob Smith",
          role: "Research Engineer",
          email: "bob.smith@university.edu",
          department: "Computer Science",
          cv: cvDocuments["cv-bob"],
        },
      ],
      projectDocuments: [
        {
          id: "project-proposal-full",
          name: "Complete Project Proposal Document",
          type: "proposal",
          content: `<h1>Advanced Medical Diagnosis System using AI</h1>
          <h2>Project Summary</h2>
          <p>This project aims to develop a comprehensive AI-powered diagnostic system that can analyze medical images with 95% accuracy, significantly improving diagnostic speed and accuracy in clinical settings.</p>

          <h2>Objectives</h2>
          <ol>
            <li>Develop state-of-the-art machine learning algorithms for medical image analysis</li>
            <li>Create an intuitive user interface for healthcare professionals</li>
            <li>Ensure compliance with medical data privacy regulations (HIPAA, GDPR)</li>
            <li>Conduct comprehensive clinical validation studies</li>
            <li>Establish partnerships with leading medical institutions</li>
          </ol>

          <h2>Technical Approach</h2>
          <h3>Machine Learning Architecture</h3>
          <p>We will employ a multi-modal deep learning approach combining:</p>
          <ul>
            <li>Convolutional Neural Networks (CNNs) for image feature extraction</li>
            <li>Vision Transformers for global context understanding</li>
            <li>Ensemble methods for improved robustness</li>
            <li>Federated learning for privacy-preserving training</li>
          </ul>

          <h3>Data Sources</h3>
          <p>Our training dataset will include:</p>
          <ul>
            <li>100,000+ anonymized medical images from partner hospitals</li>
            <li>Multi-modal data including X-rays, CT scans, MRIs</li>
            <li>Expert annotations from board-certified radiologists</li>
            <li>Longitudinal patient data for outcome validation</li>
          </ul>

          <h2>Timeline</h2>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr><th>Phase</th><th>Duration</th><th>Deliverables</th></tr>
            <tr><td>Phase 1: Data Collection & Preprocessing</td><td>Months 1-3</td><td>Curated dataset, preprocessing pipeline</td></tr>
            <tr><td>Phase 2: Model Development</td><td>Months 4-8</td><td>Trained models, validation results</td></tr>
            <tr><td>Phase 3: Clinical Integration</td><td>Months 9-11</td><td>Clinical prototype, user interface</td></tr>
            <tr><td>Phase 4: Validation & Deployment</td><td>Months 12-15</td><td>Clinical validation, deployment plan</td></tr>
          </table>

          <h2>Expected Impact</h2>
          <p>This system will:</p>
          <ul>
            <li>Reduce diagnostic errors by 40%</li>
            <li>Decrease time to diagnosis by 60%</li>
            <li>Improve patient outcomes through early detection</li>
            <li>Reduce healthcare costs by $2M annually per hospital</li>
          </ul>

          <h2>Budget Summary</h2>
          <p><strong>Total Project Cost:</strong> $2,500,000 over 15 months</p>
          <ul>
            <li>Personnel (60%): $1,500,000</li>
            <li>Equipment & Computing (25%): $625,000</li>
            <li>Data Acquisition (10%): $250,000</li>
            <li>Administrative (5%): $125,000</li>
          </ul>`,
          uploadedAt: "2025-01-20",
          uploadedBy: "Dr. Sarah Johnson",
          size: "3.2 MB",
        },
      ],
    },
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
    projectRegistrationDetails: {
      projectTitle: "Smart Learning Management Platform",
      principalInvestigator: {
        name: "Prof. James Wilson",
        email: "james.wilson@university.edu",
        phone: "+1-555-0456",
        department: "Education Technology",
        position: "Professor",
        cv: cvDocuments["cv-james"],
      },
      teamMembers: [
        {
          name: "Dr. Lisa Brown",
          role: "Co-Investigator",
          email: "lisa.brown@university.edu",
          department: "Psychology",
          cv: cvDocuments["cv-lisa"],
        },
      ],
      projectDocuments: [
        {
          id: "learning-platform-proposal",
          name: "Smart Learning Platform Proposal",
          type: "proposal",
          content: `<h1>Smart Learning Management Platform</h1>
          <h2>Project Overview</h2>
          <p>Development of an AI-powered adaptive learning platform that personalizes education based on individual learning patterns and preferences.</p>

          <h2>Key Features</h2>
          <ul>
            <li>Adaptive content delivery</li>
            <li>Real-time learning analytics</li>
            <li>Personalized learning paths</li>
            <li>Intelligent tutoring system</li>
          </ul>

          <h2>Technical Implementation</h2>
          <p>The platform will utilize machine learning algorithms to analyze student behavior and adapt content delivery accordingly.</p>

          <h2>Expected Outcomes</h2>
          <ul>
            <li>Improved learning outcomes by 30%</li>
            <li>Increased student engagement</li>
            <li>Reduced time to competency</li>
            <li>Personalized learning experiences</li>
          </ul>`,
          uploadedAt: "2025-01-23",
          uploadedBy: "Prof. James Wilson",
          size: "2.8 MB",
        },
      ],
    },
  },
];

export { cvDocuments, enhancedPIRequests };
