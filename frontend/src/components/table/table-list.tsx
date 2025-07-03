import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

/**
 * Table data interface
 */
export interface Table {
  id: string;
  number: string;
  name: string;
  capacity: number;
  status: string;
  area: string;
  is_active: boolean;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Response with counts interface
 */
export interface TableResponseWithCounts {
  data: Table[];
  counts: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    inactive: number;
  };
}

interface TableListProps {
  tables: Table[] | TableResponseWithCounts | null;
  isLoading: boolean;
  error: string | null;
  title?: string;
  onTableClick?: (table: Table) => void;
  highlightId?: string;
  showCounts?: boolean;
}

export const TableList: React.FC<TableListProps> = ({
  tables,
  isLoading,
  error,
  title,
  onTableClick,
  highlightId,
  showCounts = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Handle different response formats
  let tableData: Table[] = [];
  let counts = null;

  if (tables) {
    if (Array.isArray(tables)) {
      tableData = tables;
    } else if (tables.data && Array.isArray(tables.data)) {
      tableData = tables.data;
      counts = tables.counts;
    }
  }

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tables found.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}

        {showCounts && counts && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-muted-foreground">
                Available: {counts.available}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-muted-foreground">
                Occupied: {counts.occupied}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-muted-foreground">
                Reserved: {counts.reserved}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
        {tableData.map((table) => (
          <div
            key={table.id}
            className={`p-4 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
              highlightId === table.id
                ? "border-primary bg-accent/50"
                : "border-border"
            }`}
            onClick={() => onTableClick && onTableClick(table)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">
                  Table {table.number}
                  {table.name && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      - {table.name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      !table.is_active
                        ? "bg-muted text-muted-foreground"
                        : table.status === "available"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : table.status === "occupied"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : table.status === "reserved"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {!table.is_active
                      ? "Inactive"
                      : table.status.charAt(0).toUpperCase() +
                        table.status.slice(1)}
                  </span>
                  {table.area && <span>Area: {table.area}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">Capacity: {table.capacity}</div>
                <div className="text-xs text-muted-foreground">
                  {table.is_active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
