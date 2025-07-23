import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "../utils";
import { FORM_STYLES, DIALOG_STYLES } from "../constants";
import type { FormField, FormConfig } from "../types";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: FormConfig;
  data: Record<string, unknown>;
  errors: Record<string, string>;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: string, value: unknown) => void;
  mode?: "create" | "edit";
}

export function FormDialog({
  open,
  onOpenChange,
  config,
  data,
  errors,
  loading = false,
  onSubmit,
  onCancel,
  onChange,
  mode = "create",
}: FormDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    const value = (data[field.name] as string) || "";

    const baseInputProps = {
      id: field.name,
      value,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(field.name, e.target.value),
      placeholder: field.placeholder,
      className: cn(
        FORM_STYLES.input,
        hasError && "border-red-500 focus:border-red-500"
      ),
      disabled: loading,
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...baseInputProps} rows={4} />;

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(newValue) => onChange(field.name, newValue)}
            disabled={loading}
          >
            <SelectTrigger
              className={cn(hasError && "border-red-500 focus:border-red-500")}
            >
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            {...baseInputProps}
            type="number"
            onChange={(e) => onChange(field.name, Number(e.target.value))}
          />
        );

      case "date":
        return <Input {...baseInputProps} type="date" />;

      case "email":
        return <Input {...baseInputProps} type="email" />;

      default:
        return <Input {...baseInputProps} type="text" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_STYLES.content}>
        <form onSubmit={handleSubmit}>
          <DialogHeader className={DIALOG_STYLES.header}>
            <DialogTitle className={DIALOG_STYLES.title}>
              {config.title}
            </DialogTitle>
            {config.description && (
              <DialogDescription className={DIALOG_STYLES.description}>
                {config.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className={FORM_STYLES.container}>
            {config.fields.map((field) => (
              <div key={field.name} className={FORM_STYLES.field}>
                <Label
                  htmlFor={field.name}
                  className={cn(
                    FORM_STYLES.label,
                    field.required &&
                      "after:content-['*'] after:text-red-500 after:ml-1"
                  )}
                >
                  {field.label}
                </Label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className={FORM_STYLES.error}>{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className={DIALOG_STYLES.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {config.cancelLabel || "Cancel"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : config.submitLabel || (mode === "create" ? "Create" : "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
