"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Row, Table } from "@tanstack/react-table";
import { MoreVertical, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  operations?: {
    label: string;
    icon: React.ComponentType;
    onClick: (rows: Row<TData>[]) => Promise<void>;
  }[];
}

export function DataTableViewOptions<TData>({
  table,
  operations,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex justify-end gap-2">
      {operations && operations.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical />
              İşlemler ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {operations?.map((operation) => (
              <DropdownMenuItem
                key={operation.label}
                onClick={() => {
                  operation.onClick(table.getFilteredSelectedRowModel().rows);
                  table.resetRowSelection();
                }}
                className="justify-between"
              >
                {operation.label}
                <operation.icon />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 />
            Görünüm
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Sütunları Gizle/Göster</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
