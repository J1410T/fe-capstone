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
  objectives: string[];
  showEnrollButton?: boolean;
  onEnrollProject?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  category,
  type,
  description,
  objectives,
  showEnrollButton = false,
  onEnrollProject,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Project Overview
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Key information about the research project
            </CardDescription>
          </div>
          {showEnrollButton && (
            <Button
              onClick={onEnrollProject}
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer w-full sm:w-auto text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Enroll Project</span>
              <span className="sm:hidden">Enroll</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        {/* Category and Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
              Category:{" "}
              <span className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {category}
              </span>
            </h3>
            {/* <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {category}
            </p> */}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
              Type:{" "}
              <span className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {type}
              </span>
            </h3>
            {/* <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {type}
            </p> */}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
            Description
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <Separator className="my-4 sm:my-6" />

        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
            Research Objectives
          </h3>
          <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
            {objectives.map((objective, index) => (
              <li
                key={index}
                className="text-sm sm:text-base text-gray-600 leading-relaxed"
              >
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
