// UI Constants and Standardized Patterns
// This file centralizes all UI styling patterns to ensure consistency

export const UI_CONSTANTS = {
  // Border Classes
  BORDERS: {
    default: "border border-slate-200",
    error: "border border-red-500",
    success: "border border-green-500",
    warning: "border border-yellow-500",
    info: "border border-blue-500",
    focus: "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50",
  },

  // Border Radius
  RADIUS: {
    sm: "rounded-md",
    default: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  },

  // Colors
  COLORS: {
    error: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700",
    },
    success: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    neutral: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      button: "bg-slate-600 hover:bg-slate-700",
    },
  },

  // Shadow
  SHADOWS: {
    sm: "shadow-sm",
    default: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },

  // Spacing
  SPACING: {
    card: "p-6",
    cardHeader: "px-6 py-4",
    cardContent: "px-6 pb-6",
    form: "space-y-6",
    formField: "space-y-2",
    section: "space-y-4",
  },

  // Typography
  TYPOGRAPHY: {
    cardTitle: "text-lg font-semibold text-slate-900",
    sectionTitle: "text-base font-semibold text-slate-900",
    label: "text-sm font-medium text-slate-700",
    error: "text-sm text-red-600",
    helper: "text-sm text-slate-500",
    description: "text-sm text-slate-600",
  },

  // Form Elements
  FORM: {
    input: {
      default:
        "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50",
      error:
        "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50",
      success:
        "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/50",
    },
    select: {
      default:
        "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50",
      error:
        "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50",
    },
    textarea: {
      default:
        "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 resize-none",
      error:
        "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 resize-none",
    },
  },

  // Buttons
  BUTTONS: {
    primary: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    secondary: "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },

  // Status Badges
  STATUS_BADGES: {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  },

  // Dialogs/Modals
  DIALOGS: {
    small: "sm:max-w-md",
    default: "sm:max-w-lg",
    large: "sm:max-w-2xl",
    extraLarge: "sm:max-w-4xl",
    fullWidth: "sm:max-w-[90vw]",
  },

  // Cards
  CARDS: {
    default: "bg-white border border-slate-200 rounded-lg shadow-sm",
    elevated: "bg-white border border-slate-200 rounded-lg shadow-md",
    hover:
      "bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",
  },

  // Animations
  ANIMATIONS: {
    fadeIn: "animate-in fade-in-0 duration-200",
    fadeOut: "animate-out fade-out-0 duration-200",
    slideIn: "animate-in slide-in-from-bottom-4 duration-200",
    slideOut: "animate-out slide-out-to-bottom-4 duration-200",
  },
} as const;

// Helper functions for consistent styling
export const getInputClassName = (
  hasError?: boolean,
  variant: "default" | "success" = "default"
) => {
  if (hasError) return UI_CONSTANTS.FORM.input.error;
  if (variant === "success") return UI_CONSTANTS.FORM.input.success;
  return UI_CONSTANTS.FORM.input.default;
};

export const getSelectClassName = (hasError?: boolean) => {
  return hasError
    ? UI_CONSTANTS.FORM.select.error
    : UI_CONSTANTS.FORM.select.default;
};

export const getTextareaClassName = (hasError?: boolean) => {
  return hasError
    ? UI_CONSTANTS.FORM.textarea.error
    : UI_CONSTANTS.FORM.textarea.default;
};

export const getStatusBadgeClassName = (
  status: "success" | "warning" | "error" | "info" | "neutral"
) => {
  return UI_CONSTANTS.STATUS_BADGES[status];
};

export const getButtonClassName = (
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
) => {
  return UI_CONSTANTS.BUTTONS[variant];
};

export const getCardClassName = (
  variant: "default" | "elevated" | "hover" = "default"
) => {
  return UI_CONSTANTS.CARDS[variant];
};

export const getDialogClassName = (
  size: "small" | "default" | "large" | "extraLarge" | "fullWidth" = "default"
) => {
  return UI_CONSTANTS.DIALOGS[size];
};
