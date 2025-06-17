# Testing Guide

This document outlines the testing strategy and practices for the SRPM application.

## Testing Stack

### Core Testing Libraries
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom Jest matchers for DOM testing
- **User Event** - User interaction simulation
- **JSdom** - DOM implementation for Node.js

### Coverage Tools
- **@vitest/coverage-v8** - Code coverage reporting
- **@vitest/ui** - Visual test runner interface

## Test Structure

### Directory Organization
```
src/
├── components/
│   ├── common/
│   │   ├── __tests__/
│   │   │   ├── StatusBadge.test.tsx
│   │   │   ├── DataCard.test.tsx
│   │   │   └── ConfirmDialog.test.tsx
│   │   └── ...
│   └── forms/
│       ├── __tests__/
│       │   └── FormField.test.tsx
│       └── ...
├── pages/
│   └── ProjectDetail/
│       └── components/
│           └── __tests__/
│               └── MilestoneTab.integration.test.tsx
├── shared/
│   └── utils/
│       └── __tests__/
│           └── helpers.test.ts
└── test/
    └── setup.ts
```

### Test Types

#### 1. Unit Tests
Test individual components and functions in isolation.

```typescript
// Component unit test example
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders with correct status', () => {
    render(<StatusBadge status="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
```

#### 2. Integration Tests
Test component interactions and data flow.

```typescript
// Integration test example
import { render, screen, fireEvent } from '@testing-library/react';
import MilestoneTab from '../MilestoneTab';

describe('MilestoneTab Integration', () => {
  it('creates milestone and updates list', async () => {
    render(<MilestoneTab />);
    
    fireEvent.click(screen.getByText('Add Milestone'));
    // ... test milestone creation flow
  });
});
```

#### 3. Utility Tests
Test pure functions and utility methods.

```typescript
// Utility test example
import { formatCurrency } from '../helpers';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests once (CI mode)
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run with UI
pnpm test:ui
```

### Specific Test Patterns

```bash
# Run specific test file
pnpm test StatusBadge

# Run tests matching pattern
pnpm test --grep "renders correctly"

# Run tests in specific directory
pnpm test src/components/common

# Run tests with verbose output
pnpm test --reporter=verbose
```

## Writing Tests

### Component Testing Best Practices

#### 1. Test User Interactions
```typescript
it('handles button click', () => {
  const mockClick = vi.fn();
  render(<Button onClick={mockClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(mockClick).toHaveBeenCalledTimes(1);
});
```

#### 2. Test Accessibility
```typescript
it('has proper accessibility attributes', () => {
  render(<FormField label="Name" type="text" />);
  
  const input = screen.getByLabelText('Name');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('type', 'text');
});
```

#### 3. Test Error States
```typescript
it('displays error message', () => {
  render(
    <FormField 
      label="Email" 
      type="email" 
      error="Invalid email" 
    />
  );
  
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

#### 4. Test Loading States
```typescript
it('shows loading spinner', () => {
  render(<DataCard title="Test" isLoading={true} />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### Mocking Strategies

#### 1. Mock External Dependencies
```typescript
// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchProjects: vi.fn().mockResolvedValue([]),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '1' }),
}));
```

#### 2. Mock Context Providers
```typescript
// Mock Auth Context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));
```

#### 3. Mock UI Components
```typescript
// Mock complex components
vi.mock('../ComplexComponent', () => ({
  ComplexComponent: ({ title }: any) => <div>{title}</div>,
}));
```

### Async Testing

#### 1. Testing Async Operations
```typescript
it('loads data asynchronously', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

#### 2. Testing User Events
```typescript
it('handles form submission', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByText('Submit'));
  
  await waitFor(() => {
    expect(screen.getByText('Form submitted')).toBeInTheDocument();
  });
});
```

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Global mocks and setup
```

## Coverage Requirements

### Minimum Coverage Thresholds
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Coverage Reports
```bash
# Generate coverage report
pnpm test:coverage

# View HTML coverage report
open coverage/index.html
```

### Excluded from Coverage
- Configuration files
- Test files
- Type definitions
- Build artifacts
- Node modules

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage
```

## Debugging Tests

### Common Issues

#### 1. Component Not Rendering
```typescript
// Check if component is properly imported
import { ComponentName } from '../ComponentName';

// Verify component props
render(<ComponentName requiredProp="value" />);
```

#### 2. Async Operations Not Completing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});

// Increase timeout if needed
await waitFor(() => {
  // assertion
}, { timeout: 5000 });
```

#### 3. Mock Not Working
```typescript
// Ensure mock is called before import
vi.mock('./module');
import { Component } from './Component';

// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Debug Tools

#### 1. Screen Debug
```typescript
// Print current DOM
screen.debug();

// Print specific element
screen.debug(screen.getByText('Button'));
```

#### 2. Query Debugging
```typescript
// Find why element is not found
screen.getByRole('button', { name: /submit/i });

// Use query variants for optional elements
expect(screen.queryByText('Optional')).not.toBeInTheDocument();
```

## Best Practices

### 1. Test Naming
```typescript
// Good: Descriptive test names
it('displays error message when email is invalid', () => {});

// Avoid: Vague test names
it('works correctly', () => {});
```

### 2. Test Organization
```typescript
describe('ComponentName', () => {
  describe('when user is authenticated', () => {
    it('shows user menu', () => {});
  });
  
  describe('when user is not authenticated', () => {
    it('shows login button', () => {});
  });
});
```

### 3. Test Data
```typescript
// Use factories for test data
const createUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});
```

### 4. Cleanup
```typescript
// Clean up after tests
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

## Performance Testing

### 1. Component Performance
```typescript
it('renders large lists efficiently', () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
  
  const start = performance.now();
  render(<LargeList items={items} />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms threshold
});
```

### 2. Memory Leaks
```typescript
it('cleans up event listeners', () => {
  const { unmount } = render(<ComponentWithListeners />);
  
  // Verify cleanup
  unmount();
  // Check that listeners are removed
});
```
