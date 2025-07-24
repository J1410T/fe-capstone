import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Tag } from "lucide-react";
import { useFieldList } from "@/hooks/queries/field";
import { useMajorsByField } from "@/hooks/queries/major";
import { FormHostRegister } from "@/types/form";

interface ReviewFormProps {
  formData: FormHostRegister;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  formData,
  onPrevStep,
  onSubmit,
  isLoading = false,
}) => {
  const { data: fields } = useFieldList();
  const { data: majors } = useMajorsByField(formData.field);

  const getFieldName = (fieldId: string) => {
    const field = Array.isArray(fields) && fields.find((f) => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  const getMajorName = (majorId: string) => {
    const major = majors?.find((m) => m.id === majorId);
    return major ? major.name : majorId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Review your project details before submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                English Title
              </p>
              <p className="text-base">{formData.englishTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Vietnamese Title
              </p>
              <p className="text-base">{formData.vietnameseTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Abbreviations
              </p>
              <p className="text-base">{formData.abbreviations || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-base">{formData.duration} months</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Maximum Members
              </p>
              <p className="text-base">{formData.maximumMember}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Language
              </p>
              <p className="text-base">{formData.language}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Category
              </p>
              <p className="text-base">{formData.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-base">{formData.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Field</p>
              <p className="text-base">{getFieldName(formData.field)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Major</p>
              <p className="text-base">{getMajorName(formData.major)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-base whitespace-pre-line">
                {formData.description}
              </p>
            </div>
            {formData.requirementNote && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Requirement Note
                </p>
                <p className="text-base whitespace-pre-line">
                  {formData.requirementNote}
                </p>
              </div>
            )}
            {formData.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Project Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button type="submit" onClick={onSubmit} disabled={isLoading}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {isLoading ? "Submitting..." : "Submit Project"}
        </Button>
      </CardFooter>
    </Card>
  );
};
