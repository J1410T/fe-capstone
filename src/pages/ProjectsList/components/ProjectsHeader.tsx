import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMajorsByField } from "@/hooks/queries/major";
import { useFieldList } from "@/hooks/queries/field";
import { ProjectsHeaderProps } from "@/types/project";

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedField,
  onFieldChange,
  selectedMajor,
  onMajorChange,
  selectedSort,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  tags,
  onTagsChange,
  onSearch,
}) => {
  const [tagInput, setTagInput] = useState("");

  // Fetch fields and majors
  const { data: fields, isLoading: fieldsLoading } = useFieldList();
  const { data: majors, isLoading: majorsLoading } =
    useMajorsByField(selectedField);

  const handleTagKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        onTagsChange([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFieldChange = (value: string) => {
    onFieldChange(value);
    // Reset major selection when field changes
    onMajorChange("all");
  };

  const handleSearchClick = () => {
    onSearch();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Projects</h1>
        <p className="text-muted-foreground">
          View all research projects available at your institution
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <Select value={selectedField} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            {fieldsLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              Array.isArray(fields) &&
              fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          value={selectedMajor}
          onValueChange={onMajorChange}
          disabled={selectedField === "all" || majorsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Major" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Majors</SelectItem>
            {majorsLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              majors?.map((major) => (
                <SelectItem key={major.id} value={major.id}>
                  {major.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="application/implementation">
              Application
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="school level">School Level</SelectItem>
            <SelectItem value="cooperate">Cooperate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="a-z">A-Z</SelectItem>
            <SelectItem value="z-a">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter tags and press Enter..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyPress}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-emerald-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Button
          onClick={handleSearchClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};
