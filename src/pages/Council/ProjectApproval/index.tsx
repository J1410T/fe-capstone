import React, { useState, useEffect, useMemo } from "react";
import { ApprovalHeader } from "./components";
import { TopicsList } from "./TopicsList";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyAppraisalCouncils } from "@/hooks/queries/appraisal-council";
import type { AppraisalCouncil } from "@/types/appraisal-council";

const ProjectApproval: React.FC = () => {
  const [selectedCouncil, setSelectedCouncil] = useState<string>("");

  // Fetch appraisal councils
  const { data: councilsResponse } = useMyAppraisalCouncils({
    "page-index": 1,
    "page-size": 100,
  });

  const availableCouncils = useMemo(() => {
    return councilsResponse?.["data-list"] || [];
  }, [councilsResponse]);

  // Auto-select first council if available and no council is selected
  useEffect(() => {
    if (availableCouncils.length > 0 && !selectedCouncil) {
      setSelectedCouncil(availableCouncils[0].id);
    }
  }, [availableCouncils, selectedCouncil]);

  const onCouncilChange = (value: string) => {
    setSelectedCouncil(value);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 space-y-8">
        <ApprovalHeader />

        {/* Enhanced Search and Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Controls */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Select Appraisal Council
                </label>
              </div>
              <Select value={selectedCouncil} onValueChange={onCouncilChange}>
                <SelectTrigger className="w-[320px] h-[50px] bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Choose an appraisal council" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                  {availableCouncils.map((council: AppraisalCouncil) => (
                    <SelectItem
                      key={council.id}
                      value={council.id}
                      className="rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {council.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TopicsList selectedCouncil={selectedCouncil} />
      </div>
    </div>
  );
};

export default ProjectApproval;
