import React from "react";

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              currentStep >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            1
          </div>
          <span className="hidden md:inline">Project Information</span>
        </div>
        <div className="w-8 h-1 bg-muted self-center">
          <div
            className={`h-1 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}
            style={{ width: "100%" }}
          ></div>
        </div>

        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              currentStep >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            2
          </div>
          <span className="hidden md:inline">Review & Submit</span>
        </div>
      </div>
    </div>
  );
};
