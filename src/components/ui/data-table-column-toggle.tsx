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
              Actions ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              // Get the header group that contains this column
              const headerGroup = table.getHeaderGroups()[0];
              const header = headerGroup.headers.find(
                (h) => h.column.id === column.id
              );

              // Get the rendered header content
              let columnLabel = column.id;
              if (header) {
                const rendered = header.column.columnDef.header;
                if (typeof rendered === "string") {
                  columnLabel = rendered;
                } else if (typeof rendered === "function") {
                  try {
                    const element = rendered({
                      column: header.column,
                      header,
                      table,
                    });
                    if (
                      element &&
                      typeof element === "object" &&
                      "props" in element
                    ) {
                      columnLabel = element.props.title || column.id;
                    }
                  } catch {
                    // If rendering fails, fall back to column ID
                    columnLabel = column.id;
                  }
                }
              }

              // Fallback translations for common column IDs
              if (columnLabel === column.id) {
                const translations: Record<string, string> = {
                  content: "Content",
                  authorName: "Author Name",
                  postTitle: "Post Title",
                  createdAt: "Created At",
                  updatedAt: "Updated At",
                  status: "Status",
                  actions: "Actions",
                  title: "Title",
                  category: "Category",
                  author: "Author",
                  comments: "Comments",
                  coverImage: "Image",
                  deletedAt: "Deleted At",
                  isFeatured: "Featured",
                };
                columnLabel = translations[column.id] || columnLabel;
              }

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabel}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
