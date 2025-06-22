# UI Style Guide & Design System

This guide ensures consistent UI patterns across the entire application. All components should follow these standardized patterns for borders, colors, spacing, and styling.

## 🎨 Core Principles

1. **Consistency**: Use standardized UI constants for all styling
2. **Accessibility**: Ensure proper focus states and color contrast
3. **Responsiveness**: Mobile-first design with consistent breakpoints
4. **Performance**: Reuse styles and avoid custom CSS where possible

## 📚 UI Constants

All UI styling should use the constants defined in `src/lib/ui-constants.ts`:

### Border Classes
```typescript
// ✅ Use these standardized borders
UI_CONSTANTS.BORDERS.default     // "border border-slate-200"
UI_CONSTANTS.BORDERS.error       // "border border-red-500"
UI_CONSTANTS.BORDERS.success     // "border border-green-500"
UI_CONSTANTS.BORDERS.focus       // "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"

// ❌ Don't use inconsistent borders
className="border-red-300"  // Inconsistent error color
className="border-gray-200" // Use slate instead of gray
```

### Colors & Status
```typescript
// ✅ Use standardized status colors
getStatusBadgeClassName('success')  // Green variants
getStatusBadgeClassName('warning')  // Yellow variants  
getStatusBadgeClassName('error')    // Red variants
getStatusBadgeClassName('info')     // Blue variants
getStatusBadgeClassName('neutral')  // Slate variants
```

### Typography
```typescript
// ✅ Use consistent typography classes
UI_CONSTANTS.TYPOGRAPHY.cardTitle      // "text-lg font-semibold text-slate-900"
UI_CONSTANTS.TYPOGRAPHY.sectionTitle   // "text-base font-semibold text-slate-900"
UI_CONSTANTS.TYPOGRAPHY.label          // "text-sm font-medium text-slate-700"
UI_CONSTANTS.TYPOGRAPHY.error          // "text-sm text-red-600"
UI_CONSTANTS.TYPOGRAPHY.helper         // "text-sm text-slate-500"
```

## 🎛️ Form Components

### Input Fields
```tsx
// ✅ Consistent input styling
<Input
  className={getInputClassName(!!errors.fieldName)}
  placeholder="Enter value..."
/>

// ✅ For custom inputs
<input
  className={cn(
    "base-input-classes",
    getInputClassName(hasError)
  )}
/>
```

### Form Field Structure
```tsx
// ✅ Use standardized form field structure
<div className={UI_CONSTANTS.SPACING.formField}>
  <Label className={UI_CONSTANTS.TYPOGRAPHY.label}>
    Field Name *
  </Label>
  <Input className={getInputClassName(!!error)} />
  {error && (
    <p className={UI_CONSTANTS.TYPOGRAPHY.error}>{error}</p>
  )}
</div>
```

### Select Components
```tsx
// ✅ Consistent select styling
<Select>
  <SelectTrigger className={getSelectClassName(!!error)}>
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    {/* options */}
  </SelectContent>
</Select>
```

## 🃏 Card Components

### Standard Card Layout
```tsx
// ✅ Use consistent card styling
<Card className={getCardClassName('default')}>
  <CardHeader className={UI_CONSTANTS.SPACING.cardHeader}>
    <CardTitle className={UI_CONSTANTS.TYPOGRAPHY.cardTitle}>
      Title
    </CardTitle>
  </CardHeader>
  <CardContent className={UI_CONSTANTS.SPACING.cardContent}>
    {/* content */}
  </CardContent>
</Card>
```

### Card Variants
```tsx
// ✅ Different card variants
<Card className={getCardClassName('default')}>   // Basic card
<Card className={getCardClassName('elevated')}>  // With shadow
<Card className={getCardClassName('hover')}>     // Interactive card
```

## 🔘 Button Components

### Button Variants
```tsx
// ✅ Use standardized button variants
<Button variant="default">Primary Action</Button>      // Emerald
<Button variant="secondary">Secondary Action</Button>  // Slate
<Button variant="success">Success Action</Button>      // Green
<Button variant="destructive">Delete Action</Button>   // Red
<Button variant="warning">Warning Action</Button>      // Yellow
<Button variant="info">Info Action</Button>           // Blue
<Button variant="outline">Outline Button</Button>     // White with border
<Button variant="ghost">Ghost Button</Button>         // Transparent
```

## 🏷️ Status Badges

### Usage
```tsx
// ✅ Consistent status badges
<StatusBadge status="completed" size="md" />
<StatusBadge status="in-progress" size="sm" />
<StatusBadge status="overdue" size="lg" />

// The component automatically maps status strings:
// "completed" → success styling
// "pending" → warning styling  
// "failed" → error styling
// "draft" → info styling
// "inactive" → neutral styling
```

## 🪟 Dialog Components

### Dialog Sizing
```tsx
// ✅ Use consistent dialog sizes
<DialogContent className={getDialogClassName('small')}>     // sm:max-w-md
<DialogContent className={getDialogClassName('default')}>   // sm:max-w-lg  
<DialogContent className={getDialogClassName('large')}>     // sm:max-w-2xl
<DialogContent className={getDialogClassName('extraLarge')}> // sm:max-w-4xl
<DialogContent className={getDialogClassName('fullWidth')}> // sm:max-w-[90vw]
```

### Dialog Structure
```tsx
// ✅ Consistent dialog structure
<Dialog>
  <DialogContent className={getDialogClassName('large')}>
    <DialogHeader>
      <DialogTitle className={UI_CONSTANTS.TYPOGRAPHY.cardTitle}>
        Dialog Title
      </DialogTitle>
      <DialogDescription className={UI_CONSTANTS.TYPOGRAPHY.description}>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    
    <form className={UI_CONSTANTS.SPACING.form}>
      {/* form fields */}
    </form>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="default">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 📏 Spacing & Layout

### Container Spacing
```tsx
// ✅ Use consistent spacing
<div className={UI_CONSTANTS.SPACING.form}>      // space-y-6 for forms
<div className={UI_CONSTANTS.SPACING.section}>   // space-y-4 for sections
<div className={UI_CONSTANTS.SPACING.formField}> // space-y-2 for form fields
```

### Card Spacing
```tsx
// ✅ Consistent card padding
<CardHeader className={UI_CONSTANTS.SPACING.cardHeader}> // px-6 py-4
<CardContent className={UI_CONSTANTS.SPACING.cardContent}> // px-6 pb-6
```

## 🎭 Animation Classes

### Consistent Animations
```tsx
// ✅ Use standardized animations
className={UI_CONSTANTS.ANIMATIONS.fadeIn}    // animate-in fade-in-0 duration-200
className={UI_CONSTANTS.ANIMATIONS.slideIn}   // animate-in slide-in-from-bottom-4 duration-200
```

## ⚠️ Common Mistakes to Avoid

### Border Inconsistencies
```tsx
// ❌ Don't use inconsistent border colors
className="border-red-300"     // Use border-red-500 instead
className="border-gray-200"    // Use border-slate-200 instead
className="border-blue-400"    // Use border-blue-500 instead

// ✅ Use consistent borders
className={getInputClassName(hasError)}
className={UI_CONSTANTS.BORDERS.error}
```

### Spacing Inconsistencies  
```tsx
// ❌ Don't use custom spacing
className="space-y-3"    // Use UI_CONSTANTS.SPACING.section
className="px-4 py-2"    // Use UI_CONSTANTS.SPACING.cardHeader

// ✅ Use standardized spacing
className={UI_CONSTANTS.SPACING.formField}
className={UI_CONSTANTS.SPACING.cardContent}
```

### Color Inconsistencies
```tsx
// ❌ Don't use custom colors
className="text-gray-600"     // Use text-slate-600
className="bg-red-100"        // Use UI_CONSTANTS.COLORS.error.bg
className="text-blue-700"     // Use UI_CONSTANTS.COLORS.info.text

// ✅ Use standardized colors
className={UI_CONSTANTS.TYPOGRAPHY.helper}
className={UI_CONSTANTS.COLORS.error.bg}
```

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`  
- Desktop: `> 1024px`

### Mobile-First Classes
```tsx
// ✅ Mobile-first responsive design
className="w-full sm:w-auto lg:w-64"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
className="text-sm sm:text-base lg:text-lg"
```

## 🔧 Helper Functions

Use these helper functions for consistent styling:

```typescript
import { 
  getInputClassName,
  getSelectClassName, 
  getTextareaClassName,
  getStatusBadgeClassName,
  getButtonClassName,
  getCardClassName,
  getDialogClassName,
  UI_CONSTANTS 
} from '@/lib/ui-constants';

// Form elements
const inputClass = getInputClassName(hasError);
const selectClass = getSelectClassName(hasError);  
const textareaClass = getTextareaClassName(hasError);

// Status elements
const badgeClass = getStatusBadgeClassName('success');
const buttonClass = getButtonClassName('primary');

// Layout elements
const cardClass = getCardClassName('elevated');
const dialogClass = getDialogClassName('large');
```

## 🎯 Migration Checklist

When updating existing components:

- [ ] Replace custom border classes with `UI_CONSTANTS.BORDERS.*`
- [ ] Update form fields to use `getInputClassName()`, `getSelectClassName()`, etc.
- [ ] Replace custom typography with `UI_CONSTANTS.TYPOGRAPHY.*`
- [ ] Update spacing to use `UI_CONSTANTS.SPACING.*`
- [ ] Replace status colors with `getStatusBadgeClassName()`
- [ ] Update button variants to use new button system
- [ ] Ensure dialog sizes use `getDialogClassName()`
- [ ] Test responsiveness on all breakpoints
- [ ] Verify accessibility (focus states, contrast)

## 📋 Code Review Checklist

When reviewing UI code:

- [ ] Are UI constants being used instead of custom classes?
- [ ] Is error state styling consistent across all form fields?
- [ ] Are spacing patterns following the design system?
- [ ] Are status colors using the standardized badge system?
- [ ] Is the component responsive and accessible?
- [ ] Are button variants appropriate for their actions?
- [ ] Is typography consistent with the design system?

---

Following this style guide ensures a consistent, professional, and maintainable user interface across the entire application. Always prefer the standardized constants over custom styling. 