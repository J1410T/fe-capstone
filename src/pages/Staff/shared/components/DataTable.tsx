import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn, debounce, getPaginationInfo } from "../utils";
import {
  TABLE_STYLES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "../constants";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

export function DataTable<TData>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFields = [],
  sortable = true,
  pagination = true,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
  emptyMessage = "No data available",
  loading = false,
  onRowClick,
  globalFilter: externalGlobalFilter,
  onGlobalFilterChange: externalOnGlobalFilterChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");

  // Use external global filter if provided, otherwise use internal
  const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
  const onGlobalFilterChange =
    externalOnGlobalFilterChange ?? setInternalGlobalFilter;

  // Debounced search function
  const debouncedSearch = useMemo(() => {
    const searchFn = onGlobalFilterChange || (() => {});
    return debounce(searchFn as (...args: unknown[]) => unknown, 300);
  }, [onGlobalFilterChange]);

  const handleSearchChange = (value: string) => {
    if (externalOnGlobalFilterChange) {
      debouncedSearch(value);
    } else {
      setInternalGlobalFilter(value);
    }
  };

  // Custom global filter function
  const globalFilterFn = (
    row: Row<TData>,
    _columnId: string,
    filterValue: string
  ) => {
    if (!filterValue) return true;

    const searchValue = filterValue.toLowerCase();
    const rowData = row.original;

    // If specific search fields are provided, search only in those fields
    if (searchFields.length > 0) {
      return searchFields.some((field) => {
        const value = field
          .split(".")
          .reduce(
            (obj: Record<string, unknown>, key) =>
              obj?.[key] as Record<string, unknown>,
            rowData as Record<string, unknown>
          );
        return value?.toString().toLowerCase().includes(searchValue);
      });
    }

    // Otherwise, search in all string values
    const searchInObject = (obj: unknown): boolean => {
      if (typeof obj === "string") {
        return obj.toLowerCase().includes(searchValue);
      }
      if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).some((value) => searchInObject(value));
      }
      return false;
    };

    return searchInObject(rowData);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const paginationInfo = getPaginationInfo(
    table.getState().pagination.pageIndex + 1,
    table.getState().pagination.pageSize,
    table.getFilteredRowModel().rows.length
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {searchable && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className={TABLE_STYLES.container}>
        <Table>
          <TableHeader className={TABLE_STYLES.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      TABLE_STYLES.headerCell,
                      header.column.getCanSort() &&
                        sortable &&
                        "cursor-pointer select-none"
                    )}
                    onClick={
                      header.column.getCanSort() && sortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && sortable && (
                        <div className="flex flex-col">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="w-4 h-4" />
                          ) : (
                            <ArrowUpDown className="w-4 h-4 opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={TABLE_STYLES.emptyState}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    TABLE_STYLES.row,
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={TABLE_STYLES.cell}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={TABLE_STYLES.emptyState}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className={TABLE_STYLES.pagination}>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              Showing {paginationInfo.startItem} to {paginationInfo.endItem} of{" "}
              {table.getFilteredRowModel().rows.length} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
