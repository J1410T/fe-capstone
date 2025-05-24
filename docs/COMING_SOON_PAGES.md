# Coming Soon Pages Implementation

This document explains how the "Coming Soon" pages are implemented in the application to handle unimplemented features gracefully.

## Overview

The Coming Soon system ensures that users don't encounter authentication errors or get logged out when accessing pages that haven't been implemented yet. Instead, they see a friendly "Coming Soon" message with appropriate navigation options.

## Components

### 1. Base ComingSoon Component (`src/components/common/ComingSoon.tsx`)

A reusable component that displays a consistent "Coming Soon" message with:
- Customizable title and description
- Optional back button with configurable path
- Estimated completion time
- Consistent styling with the application theme

### 2. Role-Specific Coming Soon Pages

#### AdminComingSoon (`src/pages/Admin/ComingSoon.tsx`)
- Handles admin-specific features that aren't implemented yet
- Automatically determines the appropriate message based on the current path
- Redirects back to the admin dashboard

#### GeneralComingSoon (`src/pages/ComingSoon.tsx`)
- Handles general features for all user roles
- Determines the appropriate back path based on user role
- Provides role-specific messaging

#### ProjectsComingSoon (`src/pages/Projects/ComingSoon.tsx`)
- Handles project-related features
- Provides specific messaging for different project functionalities

#### FormsComingSoon (`src/pages/Forms/ComingSoon.tsx`)
- Handles form-related features
- Provides specific messaging for different form types

## Route Configuration

The routes are configured to use Coming Soon pages for unimplemented features:

### Admin Routes
- `/staff/projects/create` → AdminComingSoon
- `/staff/projects/templates` → AdminComingSoon
- `/staff/users/roles` → AdminComingSoon
- `/staff/approvals/budget` → AdminComingSoon
- `/staff/system/backup` → AdminComingSoon
- And more...

### Member Routes
- `/member/projects` → GeneralComingSoon
- `/member/profile` → GeneralComingSoon
- `/member/forms/*` → FormsComingSoon
- `/member/project/*` → ProjectsComingSoon

### Council Routes
- `/council/meetings` → GeneralComingSoon
- `/council/approvals` → GeneralComingSoon

### Catch-All Route
- `*` → GeneralComingSoon (for authenticated users)

## Benefits

1. **No Authentication Issues**: Users stay logged in when accessing unimplemented pages
2. **Better User Experience**: Clear messaging about feature availability
3. **Consistent Navigation**: Users can easily navigate back to working areas
4. **Role-Aware**: Different messages and navigation based on user role
5. **Maintainable**: Easy to update or replace with actual implementations

## Usage

### Adding a New Coming Soon Page

1. Create a route in `src/routes/config.tsx`:
```tsx
{
  path: "new-feature",
  element: <GeneralComingSoon />,
}
```

2. For specific messaging, create a custom component:
```tsx
const CustomComingSoon = () => (
  <ComingSoon
    title="Custom Feature"
    description="This feature is being developed..."
    estimatedTime="Next month"
    backPath="/dashboard"
  />
);
```

### Replacing with Actual Implementation

Simply replace the Coming Soon component with the actual page component in the route configuration:

```tsx
// Before
{
  path: "new-feature",
  element: <GeneralComingSoon />,
}

// After
{
  path: "new-feature",
  element: <NewFeaturePage />,
}
```

## Error Handling

The system also includes an `ErrorFallback` component for handling unexpected errors gracefully, ensuring users don't lose their session due to JavaScript errors.

## Future Enhancements

- Add progress indicators for features under development
- Implement user feedback collection for feature requests
- Add email notifications when features become available
- Create an admin interface to manage Coming Soon messages
