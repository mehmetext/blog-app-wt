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
                  content: "İçerik",
                  authorName: "Yazar Adı",
                  postTitle: "Gönderi Başlığı",
                  createdAt: "Oluşturulma Tarihi",
                  updatedAt: "Güncellenme Tarihi",
                  status: "Durum",
                  actions: "İşlemler",
                  title: "Başlık",
                  category: "Kategori",
                  author: "Yazar",
                  comments: "Yorumlar",
                  coverImage: "Resim",
                  deletedAt: "Silinme Tarihi",
                  isFeatured: "Öne Çıkan",
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
