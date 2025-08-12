import React from "react";
import { GraduationCap, Shield } from "lucide-react";

export const ApprovalHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Council Evaluation
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <GraduationCap className="h-4 w-4" />
            <span>Review and evaluate research project proposals</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
    </div>
  );
};
