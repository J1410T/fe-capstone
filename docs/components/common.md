# Common Components

This document describes the reusable common components available in the SRPM application.

## StatusBadge

A unified component for displaying status information with consistent styling and optional icons.

### Usage

```typescript
import { StatusBadge } from "@/components/common";

// Basic usage
<StatusBadge status="Completed" />

// With icon
<StatusBadge status="In Progress" showIcon={true} />

// Custom styling
<StatusBadge 
  status="Overdue" 
  variant="destructive" 
  size="lg" 
  className="custom-class" 
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `string` | - | The status text to display |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "success"` | `"outline"` | Badge variant |
| `className` | `string` | `""` | Additional CSS classes |
| `showIcon` | `boolean` | `false` | Whether to show status icon |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Badge size |

### Supported Statuses

The component automatically applies appropriate colors for common statuses:
- **Completed/Complete**: Green
- **In Progress/Processing**: Blue  
- **Pending/Waiting**: Yellow
- **Overdue/Late**: Red
- **Cancelled/Rejected/Failed**: Gray

## DataCard

A flexible card component for displaying structured data with actions and metadata.

### Usage

```typescript
import { DataCard } from "@/components/common";

// Basic card
<DataCard
  title="Project Title"
  description="Project description"
  status="In Progress"
/>

// Card with actions
<DataCard
  title="Task Management"
  description="Manage project tasks"
  actions={[
    { label: "Edit", onClick: handleEdit, icon: Edit },
    { label: "Delete", onClick: handleDelete, variant: "destructive" }
  ]}
/>

// Card with metadata
<DataCard
  title="Budget Overview"
  metadata={[
    { label: "Total Budget", value: "$50,000" },
    { label: "Spent", value: "$32,000" },
    { label: "Remaining", value: "$18,000" }
  ]}
  variant="detailed"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `description` | `string` | - | Card description |
| `status` | `string` | - | Status badge |
| `badges` | `Array<{label: string, variant?: string}>` | `[]` | Additional badges |
| `icon` | `LucideIcon` | - | Title icon |
| `actions` | `DataCardAction[]` | `[]` | Action buttons |
| `metadata` | `Array<{label: string, value: string \| ReactNode}>` | `[]` | Metadata items |
| `variant` | `"default" \| "compact" \| "detailed"` | `"default"` | Card variant |
| `clickable` | `boolean` | `false` | Whether card is clickable |
| `onClick` | `() => void` | - | Click handler |

## ConfirmDialog

A reusable confirmation dialog for destructive actions.

### Usage

```typescript
import { ConfirmDialog } from "@/components/common";

<ConfirmDialog
  title="Delete Project"
  description="Are you sure you want to delete this project?"
  onConfirm={handleDelete}
  trigger={
    <Button variant="destructive">Delete</Button>
  }
/>

// Auto-generated content
<ConfirmDialog
  itemName="Project Alpha"
  onConfirm={handleDelete}
  trigger={<Button>Delete</Button>}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Auto-generated | Dialog title |
| `description` | `string` | Auto-generated | Dialog description |
| `itemName` | `string` | - | Item name for auto-generation |
| `confirmText` | `string` | Auto-generated | Confirm button text |
| `cancelText` | `string` | `"Cancel"` | Cancel button text |
| `variant` | `"destructive" \| "default"` | `"destructive"` | Button variant |
| `icon` | `"warning" \| "delete" \| "close" \| "none"` | `"warning"` | Dialog icon |
| `onConfirm` | `() => void` | - | Confirm handler |
| `onCancel` | `() => void` | - | Cancel handler |
| `trigger` | `ReactNode` | - | Trigger element |

## FileUpload

A comprehensive file upload component with drag-and-drop support.

### Usage

```typescript
import { FileUpload } from "@/components/common";

const [files, setFiles] = useState<FileUpload[]>([]);

<FileUpload
  files={files}
  onFilesChange={setFiles}
  maxFiles={5}
  label="Upload Documents"
  accept=".pdf,.doc,.docx"
  required={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `FileUpload[]` | - | Current files |
| `onFilesChange` | `(files: FileUpload[]) => void` | - | File change handler |
| `maxFiles` | `number` | `5` | Maximum files allowed |
| `label` | `string` | `"Upload Files"` | Upload label |
| `description` | `string` | Auto-generated | Upload description |
| `accept` | `string` | `"*"` | Accepted file types |
| `required` | `boolean` | `false` | Whether upload is required |

## Best Practices

### Component Composition

```typescript
// Good: Compose components for flexibility
<DataCard
  title="Project Status"
  status="In Progress"
  actions={[
    { label: "View", onClick: handleView },
    { label: "Edit", onClick: handleEdit }
  ]}
>
  <div className="space-y-4">
    <StatusBadge status="Active" showIcon />
    <FileUpload files={files} onFilesChange={setFiles} />
  </div>
</DataCard>

// Avoid: Overly complex single components
<ComplexProjectCard 
  project={project}
  showStatus={true}
  showFiles={true}
  showActions={true}
  // ... many props
/>
```

### Consistent Styling

```typescript
// Good: Use consistent variants and sizes
<StatusBadge status="Completed" variant="outline" size="md" />
<StatusBadge status="Pending" variant="outline" size="md" />

// Avoid: Inconsistent styling
<StatusBadge status="Completed" variant="default" size="lg" />
<StatusBadge status="Pending" variant="secondary" size="sm" />
```

### Accessibility

```typescript
// Good: Proper accessibility attributes
<DataCard
  title="Project Alpha"
  clickable={true}
  onClick={handleClick}
  aria-label="View Project Alpha details"
/>

// Good: Descriptive confirm dialogs
<ConfirmDialog
  title="Delete Project"
  description="This will permanently delete the project and all associated data."
  onConfirm={handleDelete}
  trigger={<Button aria-label="Delete project">Delete</Button>}
/>
```

## Migration Guide

### From Legacy Components

If you're migrating from legacy components:

1. **Replace custom status badges**:
   ```typescript
   // Old
   <Badge className={getStatusColor(status)}>{status}</Badge>
   
   // New
   <StatusBadge status={status} />
   ```

2. **Replace custom cards**:
   ```typescript
   // Old
   <Card>
     <CardHeader>
       <CardTitle>{title}</CardTitle>
     </CardHeader>
     <CardContent>{content}</CardContent>
   </Card>
   
   // New
   <DataCard title={title}>{content}</DataCard>
   ```

3. **Replace custom dialogs**:
   ```typescript
   // Old
   <Dialog>
     <DialogTrigger>Delete</DialogTrigger>
     <DialogContent>
       <DialogTitle>Are you sure?</DialogTitle>
       {/* ... */}
     </DialogContent>
   </Dialog>
   
   // New
   <ConfirmDialog
     onConfirm={handleDelete}
     trigger={<Button>Delete</Button>}
   />
   ```
