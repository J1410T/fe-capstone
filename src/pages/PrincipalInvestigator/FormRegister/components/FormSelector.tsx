import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORM_TYPES, FormType } from "../index";

interface FormSelectorProps {
  selectedForm: FormType;
  onFormChange: (form: FormType) => void;
  availableForms: FormType[];
}

export const FormSelector: React.FC<FormSelectorProps> = memo(
  ({ selectedForm, onFormChange, availableForms }) => {
    if (availableForms.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        <Label
          htmlFor="form-select"
          className="text-base font-medium text-gray-900"
        >
          Select Form Type
        </Label>
        <Select value={selectedForm} onValueChange={onFormChange}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select a form type" />
          </SelectTrigger>
          <SelectContent>
            {availableForms.map((formKey) => (
              <SelectItem key={formKey} value={formKey} className="py-3">
                <div className="flex flex-col items-start space-y-1">
                  <span className="font-semibold text-gray-900">{formKey}</span>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {FORM_TYPES[formKey].title}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
