import React, { useState } from "react";
import { ApprovalHeader } from "./components";
import { TopicsList } from "./TopicsList";
import { Search } from "lucide-react";
import { Input } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const onTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const onCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const onStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  // Filter topics based on search term, type, category and status
  const filteredTopics = proposedTopics.filter((topic) => {
    const matchesSearch = topic.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || topic.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || topic.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || topic.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Fixed categories for filter (Applied Science and Basic Science)
  const categories = ["all", "Applied Science", "Basic Science"];
  // Fixed statuses for filter
  const statuses = ["all", "Waiting for PI", "PI Assigned"];
  // Fixed types for filter
  const types = [
    "all",
    "Information Technology",
    "Environment",
    "Biology",
    "Physics",
    "Biotechnology",
    "Civil Engineering",
    "Environmental Science",
  ];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 space-y-8">
        <ApprovalHeader />

        {/* Enhanced Search and Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search research topics..."
                className="pl-10 h-11 bg-white/50 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-[160px] h-11 bg-white/50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Fields" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[160px] h-11 bg-white/50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[160px] h-11 bg-white/50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
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
