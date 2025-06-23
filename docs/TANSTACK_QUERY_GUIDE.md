# TanStack Query Implementation Guide

## Overview

This guide covers the implementation of TanStack Query in the SRPM project for better server state management.

## 🚀 Features Implemented

### Core Setup
- Query Client Configuration with optimized defaults
- Provider Integration with dev tools
- Global error handling with toast notifications
- Full TypeScript support

### Custom Hooks

#### Authentication
- `useMe()` - Get current user information
- `useLogin()` - User login with automatic redirection  
- `useLogout()` - User logout with cache clearing

#### Projects
- `useProjects()` - Paginated project listing with filters
- `useProject()` - Single project details
- `useCreateProject()` - Create new project
- `useUpdateProject()` - Update project
- `useDeleteProject()` - Delete project

#### Tasks
- `useTasks()` - Paginated task listing with filters
- `useTask()` - Single task details
- `useCreateTask()` - Create new task
- `useUpdateTask()` - Update task
- `useDeleteTask()` - Delete task

## Usage Examples

### Basic Query
```typescript
import { useProjects } from '@/hooks/queries';

const ProjectsList = () => {
  const { data, isLoading, error } = useProjects({
    page: 1,
    limit: 10,
    status: 'Active'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div>
      {data?.data.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};
```

### Mutation Usage
```typescript
import { useCreateProject } from '@/hooks/queries';

const CreateProjectForm = () => {
  const createProject = useCreateProject();

  const handleSubmit = (formData) => {
    createProject.mutate({
      name: formData.name,
      type: formData.type,
      objective: formData.objective,
      description: formData.description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button 
        type="submit"
        disabled={createProject.isPending}
      >
        {createProject.isPending ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};
```

## Benefits

1. **Automatic Caching** - Reduces API calls significantly
2. **Background Updates** - Data stays fresh automatically
3. **Error Handling** - Consistent error management
4. **Loading States** - Built-in loading state management
5. **Optimistic Updates** - Better user experience
6. **Request Deduplication** - Prevents duplicate requests

## File Structure

```
src/
├── api/
│   └── query-client.ts         # Enhanced API client
├── contexts/
│   └── QueryProvider.tsx      # TanStack Query provider
├── hooks/
│   └── queries/
│       ├── useAuth.ts         # Authentication hooks
│       ├── useProjects.ts     # Project hooks
│       └── useTasks.ts        # Task hooks
├── lib/
│   └── react-query.ts         # Query client configuration
└── examples/
    └── QueryExample.tsx       # Usage examples
```

This implementation provides a solid foundation for efficient data management in the SRPM application. 