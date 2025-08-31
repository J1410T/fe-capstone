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
import { useMajorsWithPagination } from "@/hooks/queries/major";
import { FormHostRegister } from "@/types/form";
import { MajorItem } from "@/types/major";

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
  const { data: majorsResponse } = useMajorsWithPagination({
    "page-index": 0,
    "page-size": 1000, // Large page size to get all majors
  });

  // Filter majors based on selected fields for display
  const allMajors = React.useMemo(() => {
    const allMajorsData = majorsResponse?.["data-list"] || [];
    if (!allMajorsData) return [];
    return allMajorsData.filter((major: MajorItem) =>
      formData.field.includes(major.field?.id || "")
    );
  }, [majorsResponse, formData.field]);

  const getFieldNames = (fieldIds: string[]) => {
    if (!Array.isArray(fields)) return fieldIds.join(", ");
    return fieldIds
      .map((id) => {
        const field = fields.find((f) => f.id === id);
        return field ? field.name : id;
      })
      .join(", ");
  };

  const getMajorNames = (majorIds: string[]) => {
    return majorIds
      .map((id) => {
        const major = allMajors.find((m) => m.id === id);
        return major ? major.name : id;
      })
      .join(", ");
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
              <p className="text-sm font-medium text-muted-foreground">
                Fields
              </p>
              <p className="text-base">{getFieldNames(formData.field)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Majors
              </p>
              <p className="text-base">{getMajorNames(formData.major)}</p>
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
            {formData.logoUrl && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Image URL
                </p>
                <p className="text-base mb-2">{formData.logoUrl}</p>
                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center hidden">
                    <span className="text-xs text-gray-500">Invalid URL</span>
                  </div>
                </div>
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
