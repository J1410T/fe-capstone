# Scientific Curriculum Vitae (Scientific CV) Feature

## Overview

The Scientific CV feature allows users to create, view, edit, and delete their Scientific Curriculum Vitae directly from their Profile Page. This feature uses the BM2 document type and integrates with the existing DocumentForm system using TinyMCE editor.

## ✅ Implementation Complete

### 🔘 New Button: "Create Scientific CV"

- **Location**: Profile Page, positioned at the top of the right column
- **Visibility**: Only shown if the user has not yet created a Scientific CV
- **Label**: "Create Scientific CV"
- **Icon**: Plus icon for clear call-to-action

### 📄 Full-Page Form Behavior

- **Route**: `/profile/scientific-cv/create` - dedicated full-page form
- **Layout**: Occupies entire page layout, similar to a standard document editor
- **Editor**: TinyMCE editor with full formatting capabilities and proper padding/spacing
- **Template**: Automatically loads BM2.html template (Scientific CV template in Vietnamese)
- **Document Type**: Automatically set to "BM2" (Scientific CV type)
- **Navigation**: Redirects back to Profile page after successful creation

### ✅ Success State

- **Notification**: Success toast notification upon creation
- **Display**: Shows "📘 Scientific CV Created" with creation/update dates
- **Status Badge**: Displays current status with checkmark icon

### 👁 Available Actions (when CV exists)

- **View Scientific CV**: Opens full-page view (`/profile/scientific-cv/view`) with formatted content
- **Edit**: Opens full-page editor (`/profile/scientific-cv/edit`) pre-filled with current content
- **Delete**: Shows confirmation dialog before deletion (stays on Profile page)

### 🛡️ Security & Validation

- **One CV per user**: System enforces single Scientific CV per user
- **Role-based access**: Only authenticated users can manage their CV
- **Data validation**: Proper error handling and loading states
- **Confirmation dialogs**: Delete action requires explicit confirmation

## 📁 Files Created/Modified

### New Files Created:

1. **`src/hooks/queries/useDocuments.ts`**

   - Document management hooks (create, read, update, delete)
   - Scientific CV specific query hook
   - Proper caching and invalidation strategies

2. **`src/components/profile/ScientificCV.tsx`**

   - Main Scientific CV component for Profile page
   - Handles all CV states (none, created, loading)
   - Navigation to full-page routes

3. **`src/pages/Profile/ScientificCV/CreateScientificCV.tsx`**

   - Full-page Scientific CV creation form
   - TinyMCE editor with BM2 template
   - Professional document editor layout

4. **`src/pages/Profile/ScientificCV/ViewScientificCV.tsx`**

   - Full-page Scientific CV viewer
   - Print/download functionality
   - Action buttons for edit/delete

5. **`src/pages/Profile/ScientificCV/EditScientificCV.tsx`**
   - Full-page Scientific CV editor
   - Pre-filled with existing content
   - Save changes functionality

### Modified Files:

1. **`src/pages/Profile/index.tsx`**

   - Added ScientificCV component import
   - Integrated CV section at top of right column

2. **`src/hooks/queries/index.ts`**

   - Added document hooks export

3. **`src/routes/config.tsx`**
   - Added Scientific CV routes (`/profile/scientific-cv/create`, `/profile/scientific-cv/view`, `/profile/scientific-cv/edit`)
   - Protected routes with AuthGuard for authenticated users

## 🔧 Technical Implementation

### Data Flow:

1. **Check CV existence**: `useScientificCV(userId)` hook
2. **Create CV**: `useCreateDocument()` with type "BM2"
3. **Update CV**: `useUpdateDocument()` with content changes
4. **Delete CV**: `useDeleteDocument()` with confirmation

### Template System:

- Uses existing BM2.html template from `/src/components/forms/`
- Extracts styles and body content automatically
- Applies proper formatting for Scientific CV structure

### State Management:

- TanStack Query for server state management
- Automatic cache invalidation on mutations
- Optimistic updates for better UX

## 🎨 UI/UX Features

### Visual Design:

- **Consistent styling** with existing Profile page design
- **Emerald color scheme** matching application theme
- **Responsive layout** works on all screen sizes
- **Clear visual hierarchy** with proper spacing and typography

### User Experience:

- **Loading states** with spinners during operations
- **Error handling** with user-friendly messages
- **Success feedback** with toast notifications
- **Confirmation dialogs** for destructive actions

### Accessibility:

- **Keyboard navigation** support
- **Screen reader friendly** with proper ARIA labels
- **Focus management** in dialogs
- **Color contrast** meets accessibility standards

## 🧪 Testing Recommendations

### Manual Testing:

1. **Create CV**: Verify button appears when no CV exists
2. **Template Loading**: Confirm BM2 template loads correctly
3. **Save Functionality**: Test content saves and persists
4. **View CV**: Verify formatted content displays properly
5. **Edit CV**: Confirm pre-filled editor works
6. **Delete CV**: Test confirmation dialog and deletion
7. **One CV Limit**: Verify only one CV can be created

### Edge Cases:

- **Network errors** during save/load operations
- **Large content** handling in editor
- **Template loading failures** fallback behavior
- **Concurrent user sessions** data consistency

## 🚀 Future Enhancements

### Potential Improvements:

1. **PDF Export**: Add ability to export CV as PDF
2. **Version History**: Track CV changes over time
3. **Template Variations**: Multiple CV template options
4. **Sharing**: Generate shareable CV links
5. **Import/Export**: Import from external CV formats

### Integration Opportunities:

1. **Project Applications**: Auto-populate from CV data
2. **Profile Sync**: Sync basic info with profile data
3. **Search Integration**: Make CVs searchable by staff
4. **Approval Workflow**: Add CV review process

## 📋 Usage Instructions

### For Users:

1. **Navigate** to Profile page
2. **Click** "Create Scientific CV" button (if no CV exists)
3. **Fill out** the CV form using the TinyMCE editor
4. **Save** the CV content
5. **Use** View/Edit/Delete buttons to manage the CV

### For Developers:

1. **Import** ScientificCV component where needed
2. **Use** document hooks for CV operations
3. **Extend** DocumentFormEditor for other document types
4. **Follow** established patterns for new document features

## 🔗 Dependencies

### Required Packages:

- `@tanstack/react-query` - Server state management
- `@tinymce/tinymce-react` - Rich text editor
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `date-fns` - Date formatting

### Environment Variables:

- `VITE_TINYMCE_API_KEY` - TinyMCE API key for editor functionality

This implementation provides a complete, production-ready Scientific CV feature that integrates seamlessly with the existing application architecture and design system.
