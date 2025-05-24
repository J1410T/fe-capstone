# Schedule Meeting Feature

This document describes the Schedule Meeting functionality for Council members.

## Overview

The Schedule Meeting feature allows Council chairmen to create new meetings for project evaluations and other council activities. The feature includes a comprehensive form for setting up meeting details, scheduling, and managing attendees.

## Features

### 1. Meeting Creation Form
- **Meeting Details**: Title, project code, and description
- **Date & Time**: Date picker and time selection for start/end times
- **Meeting Type**: Dropdown for different types of meetings
- **Location**: Virtual or physical meeting locations
- **Meeting Link**: URL for virtual meetings
- **Attendees**: Add/remove attendee management

### 2. Form Validation
- **Required Fields**: Title, date, start time, end time, type, and project code
- **Real-time Validation**: Form submission disabled until all required fields are filled
- **Input Validation**: Proper format checking for dates, times, and URLs

### 3. User Experience
- **Intuitive Interface**: Clean, organized form layout
- **Visual Feedback**: Icons and clear labeling for each section
- **Responsive Design**: Works on desktop and mobile devices
- **Navigation**: Easy back navigation to meetings list

## Form Fields

### Basic Information
- **Meeting Title** (Required): Descriptive title for the meeting
- **Project Code** (Required): Associated project identifier

### Scheduling
- **Date** (Required): Meeting date using date picker
- **Start Time** (Required): Meeting start time
- **End Time** (Required): Meeting end time

### Meeting Details
- **Meeting Type** (Required): 
  - Proposal Evaluation
  - Milestone Evaluation
  - Final Review
  - General Meeting

### Location & Access
- **Location**: Dropdown with options:
  - Virtual (Zoom)
  - Virtual (Google Meet)
  - Virtual (Microsoft Teams)
  - Conference Room A
  - Conference Room B
- **Meeting Link**: URL for virtual meetings

### Additional Information
- **Description**: Meeting agenda and objectives
- **Attendees**: List of meeting participants with add/remove functionality

## User Interface

### Layout
- **Header Section**: Page title and back navigation
- **Form Card**: Organized form with clear sections
- **Action Buttons**: Cancel and Submit buttons

### Visual Elements
- **Icons**: Calendar, clock, map pin, and user icons for visual clarity
- **Color Coding**: Consistent with application theme
- **Responsive Grid**: Adapts to different screen sizes

### Interactive Elements
- **Attendee Management**: Add attendees with Enter key or button click
- **Attendee Tags**: Visual representation of added attendees with remove option
- **Form Validation**: Real-time feedback on required fields

## Technical Implementation

### Component Structure
```typescript
interface MeetingFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  projectCode: string;
  location: string;
  meetingLink: string;
  description: string;
  attendees: string[];
}
```

### Key Features
- **State Management**: React useState for form data
- **Form Validation**: Real-time validation with submit button control
- **Navigation**: React Router for page transitions
- **Loading States**: Submit button shows loading state during submission

### Form Submission
1. **Validation**: Check all required fields are filled
2. **API Call**: Submit meeting data to backend (simulated)
3. **Feedback**: Success/error messages to user
4. **Navigation**: Redirect to meetings list on success

## User Workflow

### Access
1. Navigate to Council Meetings page
2. Click "Schedule Meeting" button (Chairman only)
3. Fill out the meeting form
4. Submit to create the meeting

### Form Completion
1. **Basic Info**: Enter title and project code
2. **Scheduling**: Select date and time range
3. **Type**: Choose meeting type from dropdown
4. **Location**: Select meeting location/platform
5. **Details**: Add description and attendees
6. **Submit**: Create the meeting

### Validation Flow
- Required fields are marked with asterisks (*)
- Submit button is disabled until all required fields are filled
- Real-time feedback on form completion status

## Benefits

1. **Streamlined Process**: Easy meeting creation workflow
2. **Comprehensive Details**: All necessary meeting information in one form
3. **Flexible Scheduling**: Support for various meeting types and locations
4. **Attendee Management**: Easy addition and removal of participants
5. **User-Friendly**: Intuitive interface with clear visual cues

## Future Enhancements

- **Calendar Integration**: Sync with external calendar systems
- **Email Notifications**: Automatic meeting invitations
- **Recurring Meetings**: Support for recurring meeting schedules
- **Template System**: Pre-filled forms for common meeting types
- **Conflict Detection**: Check for scheduling conflicts
- **Meeting Reminders**: Automated reminder system
