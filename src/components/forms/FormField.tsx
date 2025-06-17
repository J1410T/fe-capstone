import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { type BaseFormProps, type SelectOption } from "@/components/types";

type InputType = "text" | "email" | "password" | "number";

interface InputFieldProps extends BaseFormProps {
  type: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFormProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFormProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
}

interface DateFieldProps extends BaseFormProps {
  type: "date";
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  disablePastDates?: boolean;
}

type FormFieldProps =
  | InputFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | DateFieldProps;

/**
 * Unified FormField component
 * Consolidates all form field implementations across the codebase
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, required, error, className, disabled, description } = props;

  const renderField = () => {
    switch (props.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            className={cn(error && "border-red-500")}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            disabled={disabled}
            className={cn(error && "border-red-500")}
          />
        );

      case "select":
        return (
          <Select
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={cn(error && "border-red-500")}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <DatePicker
            date={props.value}
            onDateChange={props.onChange}
            placeholder={props.placeholder}
            disabled={disabled}
            disablePastDates={props.disablePastDates}
            className={cn(error && "border-red-500")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Export alias for backward compatibility
export { FormField as UnifiedFormField };
