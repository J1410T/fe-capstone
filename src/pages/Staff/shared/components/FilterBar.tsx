import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { cn } from "../utils";
import type { FilterConfig } from "../types";

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  values,
  onChange,
  onClear,
  className,
}: FilterBarProps) {
  const activeFiltersCount = Object.values(values).filter(
    (value) => value && value !== "all"
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filters
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs"
          >
            Clear all
            <X className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {filter.label}
            </label>
            <Select
              value={values[filter.key] || "all"}
              onValueChange={(value) => onChange(filter.key, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(values).map(([key, value]) => {
            if (!value || value === "all") return null;

            const filter = filters.find((f) => f.key === key);
            const option = filter?.options.find((o) => o.value === value);

            if (!filter || !option) return null;

            return (
              <Badge key={key} variant="outline" className="text-xs px-2 py-1">
                {filter.label}: {option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => onChange(key, "all")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
