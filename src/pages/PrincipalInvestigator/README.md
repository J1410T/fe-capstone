# Principal Investigator (PI) Management System

A comprehensive web application system for Principal Investigators to manage research projects, built with React, TypeScript, ShadCN UI, and Tailwind CSS.

## 🎯 Overview

This system provides Principal Investigators with a complete suite of tools to manage their research projects, from initial registration to final reporting and contract management.

## 📋 Features Implemented

### ✅ 1. Profile Page (BM02)

- **Route**: `/pi/profile`
- **Form**: BM02 - Scientific Resume
- **Features**:
  - Personal information management
  - Education history
  - Work experience
  - Publications list
  - Awards and achievements
  - Research interests and skills
  - File upload for CV and certificates
  - Create/Update functionality

### ✅ 2. Project Detail Page

- **Route**: `/pi/project/:projectId`
- **Features**:
  - Project overview with tabs
  - "Register for Project" button for PIs
  - Project progress tracking
  - Team, tasks, documents, and budget tabs

### ✅ 3. Project Registration (BM01)

- **Route**: `/pi/project-registration`
- **Form**: BM01 - Project Registration
- **Features**:
  - Project name, type (Basic/Application)
  - Objective and description
  - Related projects
  - Time-based restrictions (Quarter 1: Application only, Quarter 2: Basic only)
  - Form validation and submission

### ✅ 4. Research Group Management

- **Route**: `/pi/research-group`
- **Features**:
  - Team member listing
  - Email invitation system
  - Role management (Leader, Secretary, Normal)
  - Member statistics
  - Permission-based actions

### ✅ 5. Milestone and Task Management

- **Route**: `/pi/milestones`
- **Features**:
  - Create milestones with deadlines
  - Task creation within milestones
  - Task assignment to team members
  - Progress tracking and evaluation
  - Status management (To Do, In Progress, Completed)
  - Leader evaluation and confirmation

### ✅ 6. Progress Reports (BM06)

- **Route**: `/pi/progress-reports`
- **Form**: BM06 - Progress Report
- **Features**:
  - Report creation and submission
  - File upload for reports
  - Status tracking (Processing, Approved, Rejected)
  - Feedback system
  - Report history

### ✅ 7. Budget Management (BM05 + BM06)

- **Route**: `/pi/budget`
- **Forms**: BM05 (Budget Request) + BM06 (Expense Report)
- **Features**:
  - Expense tracking by category
  - Receipt upload
  - Budget allocation visualization
  - Approval status tracking
  - Budget utilization charts

### ✅ 8. Dashboard

- **Route**: `/pi/dashboard`
- **Features**:
  - Project overview and statistics
  - Milestone progress charts
  - Recent activity
  - Upcoming deadlines
  - Quarter-based project creation alerts

### ✅ 9. Meeting Schedule / Online Meeting

- **Route**: `/pi/meetings`
- **Features**:
  - Meeting schedule display with upcoming and past meetings
  - Online meeting links and in-person location details
  - Meeting documents with download functionality
  - Attendee management and role display
  - Pre-meeting notifications (15-minute reminders)
  - Meeting statistics and calendar view
  - Join meeting functionality for online sessions

## 🚧 Features To Be Implemented

### 📑 10. Summary Report (BM09)

- **Route**: `/pi/summary-report` (planned)
- **Form**: BM09 + BM08 (if seminar)
- **Features**:
  - Final project summary
  - Seminar report upload (BM08)

### ✅ 11. Acceptance & Council Minutes

- **Route**: `/pi/acceptance` (planned)
- **Features**:
  - View-only status interface
  - Council forms (BM10, BM11, BM12) display
  - Contract signing workflow

### 💰 12. Contract & Payment

- **Route**: `/pi/contract` (planned)
- **Features**:
  - Contract signing (BM05)
  - Payment tracking by project type:
    - Application: 30% - 30% - 30% - 10%
    - Basic: 100% after acceptance

## 🔐 Role Management & Time Limits

### Time-Based Restrictions

- **Quarter 1**: Only Application projects can be created
- **Quarter 2**: Only Basic projects can be created
- **Quarter 3-4**: Project creation blocked

### Role Permissions

- **Principal Investigator**: Full access to all features
- **Team Members**: Limited access based on assignments

## 🛠 Technical Implementation

### Architecture

```
src/pages/PrincipalInvestigator/
├── shared/
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Utility functions
│   └── components/       # Reusable components
├── Profile/              # BM02 - Scientific Resume
├── ProjectRegistration/  # BM01 - Project Registration
├── ResearchGroup/        # Team management
├── Milestones/          # Milestone & task management
├── ProgressReports/     # BM06 - Progress reports
├── Budget/              # BM05 + BM06 - Budget management
├── Dashboard/           # Main PI dashboard
└── PiProjectDetail/     # Project detail view
```

### Key Technologies

- **React 18** with TypeScript
- **ShadCN UI** components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Recharts** for data visualization
- **Lucide React** for icons

### Form Codes

- **BM01**: Project Registration Form
- **BM02**: Scientific Resume Form
- **BM05**: Budget Request Form
- **BM06**: Progress Report / Expense Report Form
- **BM08**: Seminar Report Form (if applicable)
- **BM09**: Summary Report Form
- **BM10, BM11, BM12**: Council Evaluation Forms

## 🚀 Usage

### Navigation

All PI features are accessible under the `/pi` route:

- Dashboard: `/pi/dashboard`
- Projects: `/pi/projects`
- Project Registration: `/pi/project-registration`
- Profile: `/pi/profile`
- Research Group: `/pi/research-group`
- Milestones: `/pi/milestones`
- Meetings: `/pi/meetings`
- Progress Reports: `/pi/progress-reports`
- Budget: `/pi/budget`

### Authentication

- Only users with `PRINCIPAL_INVESTIGATOR` role can access PI features
- Role-based permissions enforced throughout the system

### File Uploads

- Supports PDF, DOC, XLS, TXT, JPG, PNG formats
- Maximum file size: 10MB per file
- Validation and error handling included

## 📱 Responsive Design

- Mobile-first approach
- Responsive tables and charts
- Touch-friendly interface
- Optimized for tablets and desktop

## 🔄 State Management

- React hooks for local state
- Context API for authentication
- Simulated API calls with loading states
- Toast notifications for user feedback

## 🎨 UI/UX Features

- Clean, professional design
- Consistent color scheme (blue/green theme)
- Status badges and progress indicators
- Interactive charts and visualizations
- Form validation with error messages
- Loading states and feedback

This system provides a complete solution for Principal Investigators to manage their research projects efficiently while maintaining compliance with institutional requirements and forms.
