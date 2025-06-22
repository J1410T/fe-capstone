import { cva, type VariantProps } from "class-variance-authority";
import { UI_CONSTANTS } from "@/lib/ui-constants";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: `${UI_CONSTANTS.BUTTONS.primary} text-white`,
        destructive: `${UI_CONSTANTS.BUTTONS.danger} text-white`,
        outline: `border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-emerald-500`,
        secondary: `${UI_CONSTANTS.BUTTONS.secondary} text-white`,
        ghost: "text-slate-700 hover:bg-slate-100 focus:ring-emerald-500",
        link: "text-emerald-600 underline-offset-4 hover:underline focus:ring-emerald-500",
        success: `${UI_CONSTANTS.BUTTONS.success} text-white`,
        warning: `${UI_CONSTANTS.BUTTONS.warning} text-white`,
        info: `${UI_CONSTANTS.BUTTONS.info} text-white`,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export { buttonVariants, type VariantProps };
export type ButtonVariants = VariantProps<typeof buttonVariants>;
