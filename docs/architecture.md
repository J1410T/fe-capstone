# System Architecture

## Overview

The SRPM frontend is built using a modern React architecture with TypeScript, following component-based design principles and clean code practices.

## Architecture Patterns

### Component Architecture

```
┌─────────────────────────────────────────┐
│                Pages                    │
│  ┌─────────────────────────────────────┐│
│  │            Layouts                  ││
│  │  ┌─────────────────────────────────┐││
│  │  │         Components              │││
│  │  │  ┌─────────────────────────────┐│││
│  │  │  │        UI Components        ││││
│  │  │  └─────────────────────────────┘│││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Layer Responsibilities

1. **UI Components** (`src/components/ui/`)
   - Primitive components from Shadcn/UI
   - Basic styling and behavior
   - No business logic

2. **Common Components** (`src/components/common/`)
   - Reusable business components
   - StatusBadge, DataCard, ConfirmDialog
   - Shared across multiple pages

3. **Page Components** (`src/components/page-components/`)
   - Page-specific components
   - Complex business logic
   - Data fetching and state management

4. **Layouts** (`src/layouts/`)
   - Page structure and navigation
   - Role-based layout switching
   - Header, sidebar, footer components

5. **Pages** (`src/pages/`)
   - Route components
   - Page-level state management
   - Component composition

## State Management

### Context-Based State
- **AuthContext**: User authentication and authorization
- **ThemeContext**: UI theme and preferences
- **NotificationContext**: Global notifications

### Local State
- Component-level state using `useState`
- Form state using React Hook Form
- Complex state using `useReducer`

### Server State
- API data fetching with Tanstack Query
- Caching and synchronization
- Background updates

## Data Flow

```
API ←→ Tanstack Query ←→ Components ←→ UI
                ↓
            Local Storage
```

1. **API Layer**: RESTful API communication
2. **Query Layer**: Data fetching, caching, and synchronization
3. **Component Layer**: Business logic and state management
4. **UI Layer**: Presentation and user interaction

## File Organization

### Barrel Exports
All major directories use barrel exports (`index.ts`) for clean imports:

```typescript
// Instead of
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Use
import { Button, Card } from "@/components/ui";
```

### Shared Utilities
Consolidated utility functions in `src/shared/utils/`:
- Date and time utilities
- String manipulation
- Validation functions
- Status and badge utilities

### Type Definitions
Centralized TypeScript types:
- Global types in `src/types/`
- Component-specific types co-located
- Shared utility types in `src/shared/utils/types.ts`

## Component Patterns

### Composition Pattern
```typescript
// Flexible component composition
<DataCard
  title="Project Status"
  status="In Progress"
  actions={[
    { label: "Edit", onClick: handleEdit },
    { label: "Delete", onClick: handleDelete }
  ]}
>
  <ProjectDetails />
</DataCard>
```

### Render Props Pattern
```typescript
// Flexible rendering with render props
<FormField
  type="select"
  options={options}
  render={({ field, error }) => (
    <CustomSelect {...field} error={error} />
  )}
/>
```

### Hook Pattern
```typescript
// Custom hooks for reusable logic
const useProjectData = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId)
  });
};
```

## Performance Considerations

### Code Splitting
- Route-based code splitting
- Lazy loading of heavy components
- Dynamic imports for large libraries

### Memoization
- `React.memo` for expensive components
- `useMemo` for expensive calculations
- `useCallback` for stable function references

### Bundle Optimization
- Tree shaking for unused code
- Vite's built-in optimizations
- Proper import strategies

## Security Considerations

### Authentication
- JWT token management
- Role-based access control
- Protected routes

### Data Validation
- Input sanitization
- Type checking with TypeScript
- Form validation with React Hook Form

### XSS Prevention
- Proper HTML escaping
- Content Security Policy
- Safe rendering practices

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Utility function testing
- Hook testing

### Integration Testing
- Page-level testing
- API integration testing
- User flow testing

### E2E Testing
- Critical user journeys
- Cross-browser testing
- Accessibility testing

## Deployment Architecture

### Build Process
1. TypeScript compilation
2. Vite bundling and optimization
3. Asset optimization
4. Static file generation

### Environment Configuration
- Development environment
- Staging environment
- Production environment
- Environment-specific configurations

### CDN and Caching
- Static asset delivery
- Browser caching strategies
- Service worker implementation
