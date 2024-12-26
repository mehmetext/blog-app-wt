"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";
import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";
import CategoryDialog from "./components/category-dialog";

export default function categoriesColumns({
  onUpdate,
}: {
  onUpdate: (id: string, data: { name: string }) => Promise<void>;
}): ColumnDef<Category & { _count: { posts: number } }>[] {
  return [
    {
      accessorKey: "name",
      header: "Adı",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.name}</span>
          <Muted className="text-xs">
            <Link
              href={`/${row.original.slug}`}
              target="_blank"
              className="hover:underline"
            >
              /{row.original.slug}
            </Link>
          </Muted>
        </div>
      ),
    },
    {
      id: "posts",
      header: "Gönderi Sayısı",
      cell: ({ row }) => {
        return row.original._count.posts;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
      cell: ({ row }) => {
        return format(row.original.createdAt, "dd.MM.yyyy HH:mm");
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
      cell: ({ row }) => {
        return format(row.original.updatedAt, "dd.MM.yyyy HH:mm");
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        return row.original.deletedAt ? (
          <Badge variant="destructive">Silindi</Badge>
        ) : (
          <Badge variant="outline">Aktif</Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        return (
          <CategoryDialog
            category={row.original}
            onSubmit={async (data) => {
              await onUpdate(row.original.id, data);
            }}
            trigger={
              <Button size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
        );
      },
    },
  ];
}
