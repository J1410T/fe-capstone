import React from "react";
import { Shield } from "lucide-react";

export const ApprovalHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 text-emerald-600 ">
          <Shield className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Project Approval
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Review and evaluate research project proposals</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
    </div>
  );
};
