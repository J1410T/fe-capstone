# Form Components

This document describes the form components available in the SRPM application for building consistent and accessible forms.

## FormField

A unified form field component that handles different input types with consistent styling and validation.

### Usage

```typescript
import { FormField } from "@/components/forms";

// Text input
<FormField
  type="text"
  label="Project Title"
  value={title}
  onChange={setTitle}
  required={true}
  placeholder="Enter project title"
/>

// Textarea
<FormField
  type="textarea"
  label="Description"
  value={description}
  onChange={setDescription}
  rows={4}
  required={true}
/>

// Select dropdown
<FormField
  type="select"
  label="Priority"
  value={priority}
  onChange={setPriority}
  options={[
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ]}
/>

// Date picker
<FormField
  type="date"
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
  disablePastDates={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"text" \| "email" \| "password" \| "number" \| "textarea" \| "select" \| "date"` | - | Field type |
| `label` | `string` | - | Field label |
| `value` | `string \| Date \| undefined` | - | Field value |
| `onChange` | `(value: any) => void` | - | Change handler |
| `required` | `boolean` | `false` | Whether field is required |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `placeholder` | `string` | - | Placeholder text |
| `description` | `string` | - | Help text |
| `className` | `string` | - | Additional CSS classes |

### Type-Specific Props

#### Text/Email/Password/Number
| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Input placeholder |

#### Textarea
| Prop | Type | Description |
|------|------|-------------|
| `rows` | `number` | Number of rows |
| `placeholder` | `string` | Textarea placeholder |

#### Select
| Prop | Type | Description |
|------|------|-------------|
| `options` | `Array<{value: string, label: string}>` | Select options |
| `placeholder` | `string` | Select placeholder |

#### Date
| Prop | Type | Description |
|------|------|-------------|
| `disablePastDates` | `boolean` | Disable past dates |
| `placeholder` | `string` | Date picker placeholder |

## FormSection

A component for grouping related form fields with consistent styling and optional collapsible behavior.

### Usage

```typescript
import { FormSection } from "@/components/forms";

// Basic section
<FormSection
  title="Project Information"
  description="Basic details about the project"
>
  <FormField type="text" label="Title" value={title} onChange={setTitle} />
  <FormField type="textarea" label="Description" value={desc} onChange={setDesc} />
</FormSection>

// Card variant
<FormSection
  title="Budget Details"
  variant="card"
>
  <FormField type="number" label="Total Budget" value={budget} onChange={setBudget} />
  <FormField type="number" label="Allocated" value={allocated} onChange={setAllocated} />
</FormSection>

// Collapsible section
<FormSection
  title="Advanced Settings"
  collapsible={true}
  defaultExpanded={false}
>
  <FormField type="select" label="Priority" options={priorities} />
  <FormField type="date" label="Deadline" value={deadline} onChange={setDeadline} />
</FormSection>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |
| `description` | `string` | - | Section description |
| `children` | `ReactNode` | - | Section content |
| `variant` | `"simple" \| "card" \| "bordered"` | `"simple"` | Section style |
| `collapsible` | `boolean` | `false` | Whether section can collapse |
| `defaultExpanded` | `boolean` | `true` | Default expanded state |
| `className` | `string` | - | Additional CSS classes |

## Form Patterns

### Complete Form Example

```typescript
import { FormField, FormSection } from "@/components/forms";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";

interface ProjectForm {
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
  budget: number;
}

const ProjectForm = () => {
  const [formData, setFormData] = useState<ProjectForm>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date(),
    budget: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Basic Information"
        description="Enter the basic project details"
        variant="card"
      >
        <FormField
          type="text"
          label="Project Title"
          value={formData.title}
          onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          required={true}
          error={errors.title}
          placeholder="Enter project title"
        />
        
        <FormField
          type="textarea"
          label="Description"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          required={true}
          error={errors.description}
          rows={4}
        />
      </FormSection>

      <FormSection
        title="Project Settings"
        variant="bordered"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Priority"
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" }
            ]}
          />
          
          <FormField
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
            disablePastDates={true}
          />
        </div>
        
        <FormField
          type="number"
          label="Budget"
          value={formData.budget.toString()}
          onChange={(value) => setFormData(prev => ({ ...prev, budget: Number(value) }))}
          placeholder="Enter budget amount"
        />
      </FormSection>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
};
```

### Validation Integration

```typescript
// With React Hook Form
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date(),
});

const FormWithValidation = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            type="text"
            label="Title"
            value={field.value}
            onChange={field.onChange}
            error={errors.title?.message}
            required
          />
        )}
      />
      {/* Other fields... */}
    </form>
  );
};
```

## Best Practices

### Consistent Field Spacing

```typescript
// Good: Use FormSection for consistent spacing
<FormSection title="User Information">
  <FormField type="text" label="Name" />
  <FormField type="email" label="Email" />
  <FormField type="text" label="Phone" />
</FormSection>

// Avoid: Manual spacing
<div className="space-y-4">
  <FormField type="text" label="Name" />
  <div className="mt-6">
    <FormField type="email" label="Email" />
  </div>
</div>
```

### Logical Grouping

```typescript
// Good: Group related fields
<FormSection title="Contact Information">
  <FormField type="email" label="Email" />
  <FormField type="text" label="Phone" />
</FormSection>

<FormSection title="Address">
  <FormField type="text" label="Street" />
  <FormField type="text" label="City" />
  <FormField type="text" label="Postal Code" />
</FormSection>
```

### Responsive Design

```typescript
// Good: Responsive grid layouts
<FormSection title="Project Details">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField type="text" label="Title" />
    <FormField type="select" label="Category" options={categories} />
  </div>
  
  <FormField type="textarea" label="Description" />
</FormSection>
```

### Error Handling

```typescript
// Good: Clear error messages
<FormField
  type="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  error={errors.email}
  description="We'll use this to send project updates"
/>

// Good: Field-level validation feedback
const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
  return "";
};
```

## Accessibility

### Keyboard Navigation
- All form fields support keyboard navigation
- Tab order follows logical flow
- Enter key submits forms appropriately

### Screen Reader Support
- Proper labeling with `label` prop
- Error messages are announced
- Required fields are indicated

### Visual Indicators
- Required fields show asterisk (*)
- Error states use red styling
- Focus states are clearly visible

## Migration Guide

### From Basic HTML Forms

```typescript
// Old HTML form
<div>
  <label htmlFor="title">Title *</label>
  <input 
    id="title" 
    type="text" 
    value={title} 
    onChange={(e) => setTitle(e.target.value)}
    required 
  />
  {errors.title && <span className="error">{errors.title}</span>}
</div>

// New FormField
<FormField
  type="text"
  label="Title"
  value={title}
  onChange={setTitle}
  required={true}
  error={errors.title}
/>
```

### From Custom Form Components

```typescript
// Old custom component
<CustomInput
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  hasError={!!errors.email}
  errorMessage={errors.email}
/>

// New FormField
<FormField
  type="email"
  label="Email"
  value={email}
  onChange={setEmail}
  error={errors.email}
/>
```
