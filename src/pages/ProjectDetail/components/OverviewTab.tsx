import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";

interface OverviewTabProps {
  category: string;
  type: string;
  description: string;
  vietnameseTitle: string;
  abbreviations: string;
  requirementNote: string;
  language: string;
  maximumMember: number;
  logoUrl: string;
  fieldName: string;
  majorName: string;
  tags: string[];
  showEnrollButton?: boolean;
  onEnrollProject?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  category,
  type,
  description,
  vietnameseTitle,
  abbreviations,
  requirementNote,
  language,
  maximumMember,
  fieldName,
  majorName,
  tags = [],
  showEnrollButton,
  onEnrollProject,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Project Overview
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Key information about the research project
              </CardDescription>
            </div>
          </div>
          {showEnrollButton && (
            <Button
              onClick={onEnrollProject}
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Enroll Project</span>
              <span className="sm:hidden">Enroll</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* --- Basic Info --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Vietnamese Title" value={vietnameseTitle} />
          <InfoItem label="Abbreviations" value={abbreviations} />
          <InfoItem label="Category" value={category} />
          <InfoItem label="Type" value={type} />
          <InfoItem label="Major" value={majorName} />
          <InfoItem label="Field" value={fieldName} />
          <InfoItem label="Requirement Note" value={requirementNote} />
          <InfoItem label="Language" value={language} />
          <InfoItem label="Maximum Members" value={maximumMember.toString()} />
        </div>

        <Separator />

        {/* --- Description --- */}
        <div>
          <span className="font-bold text-gray-700">Description:</span>
          <p className="text-sm text-gray-600 leading-relaxed mt-1">
            {description}
          </p>
        </div>

        {/* --- Objectives --- */}
        {/* --- Tags --- */}
        {tags.length > 0 && (
          <div>
            <span className="font-bold text-gray-700">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Reusable field-rendering component
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <span className="font-bold text-gray-700 w-40 shrink-0">{label}:</span>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);
