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
import { useAppraisalCouncilsListBasic } from "@/hooks/queries/appraisal-council";
import type { AppraisalCouncil } from "@/types/appraisal-council";

// Mock data for research topics
const proposedTopics = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostics",
    type: "Information Technology", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-05-15",
    applicants: 3,
    status: "Waiting for PI",
    councilApprovals: 4,
    totalCouncilMembers: 5,
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    type: "Environment", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-05-10",
    applicants: 2,
    status: "Waiting for PI",
    councilApprovals: 3,
    totalCouncilMembers: 5,
  },
  {
    id: 3,
    title: "Biodiversity Conservation",
    type: "Biology", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-05-05",
    applicants: 1,
    status: "PI Assigned",
    councilApprovals: 5,
    totalCouncilMembers: 5,
  },
  {
    id: 4,
    title: "Quantum Computing Applications",
    type: "Physics", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-05-01",
    applicants: 0,
    status: "Waiting for PI",
    councilApprovals: 2,
    totalCouncilMembers: 5,
  },
  {
    id: 5,
    title: "Genetic Engineering Ethics",
    type: "Biotechnology", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-04-25",
    applicants: 2,
    status: "Waiting for PI",
    councilApprovals: 3,
    totalCouncilMembers: 5,
  },
  {
    id: 6,
    title: "Smart City Infrastructure",
    type: "Civil Engineering", // Major field
    category: "Applied Science", // Fixed category
    createdAt: "2023-04-20",
    applicants: 1,
    status: "Waiting for PI",
    councilApprovals: 1,
    totalCouncilMembers: 5,
  },
  {
    id: 7,
    title: "Climate Change Modeling",
    type: "Environmental Science", // Major field
    category: "Basic Science", // Fixed category
    createdAt: "2023-04-15",
    applicants: 2,
    status: "PI Assigned",
    councilApprovals: 4,
    totalCouncilMembers: 5,
  },
];

const ProjectApproval: React.FC = () => {
  const [searchTerm] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState<string>("all");

  // Fetch appraisal councils
  const { data: councilsResponse } = useAppraisalCouncilsListBasic({
    "key-word": "",
    "page-index": 1,
    "page-size": 100,
  });

  const availableCouncils = useMemo(() => {
    return councilsResponse?.["data-list"] || [];
  }, [councilsResponse]);

  // Auto-select first council if available and no council is selected
  useEffect(() => {
    if (availableCouncils.length > 0 && selectedCouncil === "all") {
      setSelectedCouncil(availableCouncils[0].id);
    }
  }, [availableCouncils, selectedCouncil]);

  const onCouncilChange = (value: string) => {
    setSelectedCouncil(value);
  };

  // Filter topics based on search term and selected council
  const filteredTopics = proposedTopics.filter((topic) => {
    const matchesSearch = topic.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCouncil = selectedCouncil === "all" || true; // For now, show all topics regardless of council
    return matchesSearch && matchesCouncil;
  });

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 space-y-8">
        <ApprovalHeader />

        {/* Enhanced Search and Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 ">
              Select Appraisal Council
              <Select value={selectedCouncil} onValueChange={onCouncilChange}>
                <SelectTrigger className="w-[300px] h-[90px] bg-white/50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Select Appraisal Council" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Councils</SelectItem>
                  {availableCouncils.map((council: AppraisalCouncil) => (
                    <SelectItem key={council.id} value={council.id}>
                      {council.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TopicsList topics={filteredTopics} />
      </div>
    </div>
  );
};

export default ProjectApproval;
