# Time Picker Component

This document describes the custom Time Picker component built using shadcn/ui components.

## Overview

The Time Picker component provides an intuitive interface for selecting time values in 12-hour format. It's built entirely with shadcn/ui components and follows the design system's patterns and styling.

## Features

### 🕐 **Time Selection**
- **12-Hour Format**: Uses AM/PM format for user-friendly time selection
- **Dropdown Selectors**: Separate dropdowns for hour, minute, and period
- **15-Minute Intervals**: Minutes are available in 15-minute increments (00, 15, 30, 45)
- **Hour Range**: 1-12 hours with proper formatting

### 🎯 **Quick Selection**
- **Common Times**: Pre-defined buttons for frequently used meeting times
- **One-Click Selection**: Quick buttons for 9:00 AM, 10:00 AM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM
- **Instant Apply**: Clicking a quick select button immediately sets the time and closes the picker

### 🎨 **User Interface**
- **Popover Design**: Clean popover interface triggered by a button
- **Clock Icon**: Visual clock icon in the trigger button
- **Placeholder Text**: Customizable placeholder when no time is selected
- **Formatted Display**: Shows selected time in readable format (e.g., "2:30 PM")

### ♿ **Accessibility**
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Friendly**: Proper labels and ARIA attributes
- **Focus Management**: Logical tab order and focus indicators

## Component API

### Props

```typescript
interface TimePickerProps {
  value?: string;           // Current time value (e.g., "2:30 PM")
  onChange?: (time: string) => void;  // Callback when time changes
  placeholder?: string;     // Placeholder text (default: "Select time")
  disabled?: boolean;       // Disable the picker
  className?: string;       // Additional CSS classes
}
```

### Usage Example

```tsx
import { TimePicker } from "@/components/ui/time-picker";

function MyForm() {
  const [startTime, setStartTime] = useState("");
  
  return (
    <TimePicker
      value={startTime}
      onChange={setStartTime}
      placeholder="Select start time"
    />
  );
}
```

## Implementation Details

### Built With shadcn/ui Components

1. **Button** - Trigger button and quick select buttons
2. **Popover** - Container for the time selection interface
3. **Select** - Dropdowns for hour, minute, and AM/PM selection
4. **Label** - Accessible labels for form sections

### Time Format Handling

- **Input**: Accepts both 12-hour ("2:30 PM") and 24-hour ("14:30") formats
- **Output**: Always outputs 12-hour format with AM/PM
- **Conversion**: Automatically converts 24-hour input to 12-hour display
- **Validation**: Ensures proper time format and valid values

### State Management

```typescript
const [selectedHour, setSelectedHour] = useState<string>("");
const [selectedMinute, setSelectedMinute] = useState<string>("");
const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");
```

## Visual Design

### Trigger Button
- **Appearance**: Outlined button with clock icon
- **States**: Normal, hover, focus, disabled
- **Content**: Shows selected time or placeholder text
- **Styling**: Consistent with shadcn button variants

### Popover Content
- **Layout**: Grid-based layout for time selectors
- **Sections**: 
  - Time selectors (Hour, Minute, Period)
  - Quick select buttons
- **Spacing**: Proper spacing and visual hierarchy
- **Responsive**: Adapts to different screen sizes

### Quick Select Buttons
- **Grid Layout**: 2-column grid for optimal space usage
- **Button Style**: Small outline buttons with readable text
- **Common Times**: Business hours and common meeting times
- **Instant Feedback**: Immediate selection and popover close

## Integration with Schedule Meeting Form

### Before (HTML Time Input)
```tsx
<Input
  type="time"
  value={formData.startTime}
  onChange={(e) => handleInputChange("startTime", e.target.value)}
/>
```

### After (shadcn Time Picker)
```tsx
<TimePicker
  value={formData.startTime}
  onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
  placeholder="Select start time"
/>
```

## Benefits

### 🎯 **User Experience**
- **Intuitive Interface**: Familiar dropdown-based time selection
- **Quick Options**: Common meeting times for faster selection
- **Visual Feedback**: Clear indication of selected time
- **Mobile Friendly**: Touch-friendly interface on mobile devices

### 🎨 **Design Consistency**
- **shadcn Integration**: Seamlessly integrates with existing design system
- **Theme Support**: Automatically adapts to light/dark themes
- **Consistent Styling**: Matches other form components

### 🔧 **Developer Experience**
- **Type Safety**: Full TypeScript support
- **Easy Integration**: Simple props interface
- **Customizable**: Extensible for different use cases
- **Reusable**: Can be used across different forms

### ♿ **Accessibility**
- **WCAG Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper semantic markup
- **Focus Management**: Logical focus flow

## Future Enhancements

- **Custom Intervals**: Support for different minute intervals (5, 10, 30 minutes)
- **24-Hour Mode**: Optional 24-hour format display
- **Time Validation**: Min/max time constraints
- **Timezone Support**: Multiple timezone handling
- **Keyboard Shortcuts**: Quick time entry via keyboard
- **Time Range Picker**: Select start and end times together
