# PI Forms Overview System

## Overview

This system provides a comprehensive form management interface for Principal Investigators (PIs) and Researchers, replacing the previous single-form registration page with a full overview and management system.

## Features Implemented

### ✅ 1. Forms Overview Page
- **Table View**: Displays all forms in a structured table with columns for Form Title, Type, Project, Status, Last Updated, Updated By, and Actions
- **Timeline View**: Organizes forms by month/year for chronological viewing
- **Grouped View**: Groups forms by type (BM1, BM2, BM5, etc.) for easier management
- **Search & Filtering**: Filter by status, form type, and search across form titles and projects

### ✅ 2. Form Workflow System
- **BM1 (Research Proposal Registration)**: View only after submission to maintain proposal integrity
- **BM5 (Research Contract)**: Collaborative editing between PI and Staff until finalized
- **BM2, BM3, BM4**: Standard draft → submit → view only workflow
- **Status Management**: Draft, Waiting for PI, Waiting for Staff, Finalized, View Only, Submitted

### ✅ 3. Form Editor Integration
- **Reusable TinyMCE Component**: Enhanced editor with form-specific styling and templates
- **Rich Text Editing**: Full formatting capabilities with tables, images, and structured content
- **Template Loading**: Automatic loading of form templates (BM1.html, BM2.html, etc.)
- **Content Management**: Save drafts, submit forms, and track changes

### ✅ 4. Form Actions & Permissions
- **Role-Based Access**: Different permissions for PI, Staff, and Researchers
- **Smart Actions**: Context-aware View/Edit buttons based on form status and user role
- **Workflow Actions**: Submit, Finalize (BM5 only), Delete (drafts only)
- **Dropdown Menus**: Compact action menus for table views

### ✅ 5. Form Status Information
- **Status Badges**: Color-coded status indicators with icons
- **Workflow Guidance**: Contextual help explaining next steps and permissions
- **Edit History**: Track all changes with timestamps and user information
- **Metadata Display**: Show creation date, last updated, project association

## File Structure

```
src/pages/FormRegister/
├── FormsOverview.tsx          # Main overview page with table/timeline/grouped views
├── FormView.tsx               # Form detail view with read-only editor
├── FormEdit.tsx               # Form editing page with TinyMCE editor
├── FormCreate.tsx             # Form creation page with type selection
├── constants.ts               # Form types, statuses, workflow rules, mock data
├── api.ts                     # Mock API functions for CRUD operations
├── index.tsx                  # Original form registration (kept for compatibility)
└── README.md                  # This documentation

src/components/forms/
├── FormEditor.tsx             # Reusable TinyMCE editor component
├── FormActions.tsx            # Action buttons with workflow logic
└── FormStatusInfo.tsx         # Status display and workflow guidance
```

## Routing Structure

```
/pi/forms                      # Forms overview (table view)
/pi/forms/create              # Create new form
/pi/forms/:formId/view        # View form details
/pi/forms/:formId/edit        # Edit form content

/researcher/forms             # Same structure for researchers
/researcher/forms/create
/researcher/forms/:formId/view
/researcher/forms/:formId/edit
```

## Form Types & Workflows

### BM1 - Research Proposal Registration
- **Roles**: Principal Investigator only
- **Workflow**: Draft → Submitted (View Only)
- **Description**: Initial project proposals that become immutable after submission

### BM2 - Council Meeting Minutes
- **Roles**: Principal Investigator only
- **Workflow**: Draft → Submitted (View Only)
- **Description**: Meeting minutes for council reviews

### BM3 - Project Summary Report
- **Roles**: Principal Investigator, Researcher
- **Workflow**: Draft → Submitted (View Only)
- **Description**: Final project summaries and reports

### BM4 - Progress Report
- **Roles**: Researcher only
- **Workflow**: Draft → Submitted (View Only)
- **Description**: Regular progress updates on research projects

### BM5 - Research Contract
- **Roles**: Principal Investigator, Staff
- **Workflow**: Draft → Waiting for PI ↔ Waiting for Staff → Finalized
- **Description**: Collaborative contract editing between PI and Staff

## Status Definitions

- **Draft**: Form is being created/edited, can be modified
- **Submitted**: Form has been submitted for review, view-only
- **Waiting for PI**: BM5 form waiting for Principal Investigator review
- **Waiting for Staff**: BM5 form waiting for Staff review
- **Finalized**: BM5 form has been finalized, no further edits allowed
- **View Only**: Form is read-only (legacy status)

## Usage Examples

### Creating a New Form
1. Navigate to `/pi/forms`
2. Click "Create Form" button
3. Select form type (BM1, BM2, BM5, etc.)
4. Enter form title and optional project association
5. Click "Create Form" to start editing

### Editing a Form
1. From the forms overview, click "Edit" on any editable form
2. Use the TinyMCE editor to modify content
3. Click "Save Draft" to save without changing status
4. Click "Submit Form" to advance to next workflow stage

### BM5 Collaborative Workflow
1. Staff creates BM5 form → Status: "Waiting for PI"
2. PI edits and saves → Status: "Waiting for Staff"
3. Staff reviews and can either:
   - Edit again → Status: "Waiting for PI"
   - Finalize → Status: "Finalized"

## Mock Data

The system includes comprehensive mock data with:
- 5 sample forms across different types and statuses
- Edit history tracking
- Multiple projects and users
- Various workflow states for testing

## Integration Points

- **Authentication**: Uses existing AuthContext for role-based access
- **Routing**: Integrates with existing React Router configuration
- **UI Components**: Uses established Shadcn/UI component library
- **Status Utilities**: Leverages existing status color and icon utilities
- **Toast Notifications**: Uses Sonner for user feedback

## Future Enhancements

- **Real API Integration**: Replace mock API with actual backend calls
- **File Attachments**: Support for document uploads and attachments
- **Email Notifications**: Notify users when forms require their attention
- **Advanced Search**: Full-text search within form content
- **Export Functionality**: PDF/Word export capabilities
- **Form Templates**: Custom template management system
- **Audit Logging**: Comprehensive change tracking and audit trails
