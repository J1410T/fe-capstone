import React from "react";
import { CheckCircle, FileText, Users, Eye } from "lucide-react";
import { cn } from "@/utils";

interface StepperHeaderProps {
  currentStep: number;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Invite Members",
    description: "Add Members",
    icon: Users,
  },
  {
    number: 2,
    title: "Project Summary",
    description: "Register Form",
    icon: FileText,
  },
  {
    number: 3,
    title: "Review & Submit",
    description: "Final Review",
    icon: Eye,
  },
];

export const StepperHeader: React.FC<StepperHeaderProps> = ({
  currentStep,
}) => {
  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-8 md:space-x-12">
          {steps.map((step, stepIdx) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <li key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
                      {
                        "bg-blue-600 border-blue-600 text-white": isCurrent,
                        "bg-green-600 border-green-600 text-white": isCompleted,
                        "bg-white border-gray-300 text-gray-400": isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="mt-3 text-center">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        {
                          "text-blue-600": isCurrent,
                          "text-green-600": isCompleted,
                          "text-gray-500": isUpcoming,
                        }
                      )}
                    >
                      {step.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs mt-1 transition-colors duration-200",
                        {
                          "text-blue-500": isCurrent,
                          "text-green-500": isCompleted,
                          "text-gray-400": isUpcoming,
                        }
                      )}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {stepIdx < steps.length - 1 && (
                  <div className="flex-1 ml-8 mr-8 hidden md:block">
                    <div
                      className={cn("h-0.5 transition-colors duration-200", {
                        "bg-green-600": step.number < currentStep,
                        "bg-gray-300": step.number >= currentStep,
                      })}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Progress Bar */}
      <div className="mt-6 md:hidden">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
};
