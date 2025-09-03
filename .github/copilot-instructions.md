# FPTU Science Research Project Management (SRPM) - AI Development Guide

This is a **React + TypeScript** university research project management system with role-based access control and comprehensive evaluation workflows.

## Architecture Overview

### Key User Roles & Permission Patterns
- **Chairman/Council Members**: Can edit evaluations, assign councils, create stages
- **Principal Investigator (PI)**: Project owners with full project control  
- **Staff**: Administrative oversight, can edit proposals and assign councils
- **Team Members**: Researchers assigned to projects

**Role Checking Pattern**: Always check user permissions before rendering edit buttons:
```tsx
{isChairman && (
  <Button onClick={handleEditEvaluation}>Edit Evaluation</Button>
)}
```

### Service Architecture
- **API Layer**: `src/services/resources/` - Axios-based services with consistent error handling
- **Query Layer**: `src/hooks/queries/` - TanStack Query for data fetching and caching
- **Auth Pattern**: Token-based auth with role checking via `checkIsChaimainInCouncil()`

### Component Library Standards
- **shadcn/ui** for all form components: `Input`, `Label`, `Textarea`, `Select`
- **Lucide React** for icons
- **Tailwind CSS** with semantic color classes (`text-slate-900`, `bg-green-50`)

## Development Patterns

### Form Handling
Use shadcn components with proper spacing and validation:
```tsx
<div className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="field">Field Name <span className="text-red-500">*</span></Label>
    <Input id="field" value={value} onChange={handleChange} />
  </div>
</div>
```

### Modal Patterns
Follow consistent modal structure with loading states:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-green-500" />
        Title
      </DialogTitle>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button variant="outline" disabled={loading}>Cancel</Button>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### State Management
- **Local State**: React useState for UI state
- **Server State**: TanStack Query for API data
- **Session Storage**: Used for temporary data like `project_${id}` and `current_council`

### API Integration Patterns
```tsx
// Always include proper error handling
try {
  const response = await updateEvaluation(data);
  // Update local state optimistically
  setEvaluations(prev => prev.map(eval => 
    eval.id === id ? { ...eval, ...updates } : eval
  ));
  setSuccessMessage("Updated successfully!");
} catch (error) {
  console.error("Update failed:", error);
  setErrorMessage("Failed to update. Please try again.");
}
```

## Key Integration Points

### Evaluation System
- **Evaluations** have councils assigned and contain **Evaluation Stages**
- **Stages** can be assigned to different councils (cross-council visibility)
- **Individual Evaluations** are created within stages by council members

### Data Flow Patterns
1. Check session storage for cached data first
2. Fallback to API calls if cache miss
3. Load related data (councils, members) in parallel when possible
4. Update local state optimistically after successful API calls

### Council Assignment
- Both evaluations and stages can have councils assigned
- Use `loadEvaluationCouncils()` and `loadStageCouncils()` patterns
- Display council members with role hierarchy (Chairman first, then members)

## Build & Development

- **Build**: `npm run build` (Vite + TypeScript)
- **Dev**: `pnpm dev` on port 5173
- **Icons**: Lucide React (`import { Icon } from "lucide-react"`)

## Common Patterns to Follow

### Success/Error Messaging
```tsx
{(successMessage || errorMessage) && (
  <div className={`border rounded-lg p-4 ${
    errorMessage ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
  }`}>
    <p className={errorMessage ? "text-red-800" : "text-green-800"}>
      {errorMessage || successMessage}
    </p>
  </div>
)}
```

### Number Input Handling
```tsx
// For numeric inputs that shouldn't show "0" by default
const [formData, setFormData] = useState({
  "total-rate": "" as string | number, // Start with empty string
});

// Validation
const totalRateNum = parseFloat(formData["total-rate"] as string);
if (isNaN(totalRateNum) || totalRateNum < 0 || totalRateNum > 10) {
  setErrorMessage("Must be a valid number between 0 and 10");
}
```

### Council Display Pattern
Show council info with member avatars, chairman with crown icon, and member count for large councils.

Always prioritize user experience with proper loading states, error handling, and role-based access control.
