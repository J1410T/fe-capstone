import React, { memo } from "react";
import { FormType } from "../constants";
import { BM1Form } from "./forms/BM1Form";
import { BM2Form } from "./forms/BM2Form";
import { BM3Form } from "./forms/BM3Form";
import { BM4Form } from "./forms/BM4Form";
import { BM5Form } from "./forms/BM5Form";

// Use a flexible FormData interface that can accommodate all form types
interface FormData {
  [key: string]: string | number | boolean;
}

interface FormContentProps {
  formType: FormType;
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onSubmit: () => void;
}

export const FormContent: React.FC<FormContentProps> = memo(
  ({ formType, formData, onDataChange, onSubmit }) => {
    const renderForm = () => {
      switch (formType) {
        case "BM1":
          return (
            <BM1Form
              formData={formData}
              onDataChange={onDataChange}
              onSubmit={onSubmit}
            />
          );
        case "BM2":
          return (
            <BM2Form
              formData={
                formData as unknown as Parameters<typeof BM2Form>[0]["formData"]
              }
              onDataChange={
                onDataChange as unknown as Parameters<
                  typeof BM2Form
                >[0]["onDataChange"]
              }
              onSubmit={onSubmit}
            />
          );
        case "BM3":
          return (
            <BM3Form
              formData={
                formData as unknown as Parameters<typeof BM3Form>[0]["formData"]
              }
              onDataChange={
                onDataChange as unknown as Parameters<
                  typeof BM3Form
                >[0]["onDataChange"]
              }
              onSubmit={onSubmit}
            />
          );
        case "BM4":
          return (
            <BM4Form
              formData={
                formData as unknown as Parameters<typeof BM4Form>[0]["formData"]
              }
              onDataChange={
                onDataChange as unknown as Parameters<
                  typeof BM4Form
                >[0]["onDataChange"]
              }
              onSubmit={onSubmit}
            />
          );
        case "BM5":
          return (
            <BM5Form
              formData={
                formData as unknown as Parameters<typeof BM5Form>[0]["formData"]
              }
              onDataChange={
                onDataChange as unknown as Parameters<
                  typeof BM5Form
                >[0]["onDataChange"]
              }
              onSubmit={onSubmit}
            />
          );
        default:
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">Form not found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please select a valid form type.
                </p>
              </div>
            </div>
          );
      }
    };

    return <div className="space-y-6">{renderForm()}</div>;
  }
);
