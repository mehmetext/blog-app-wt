"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";
import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

export default [
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
        <Button
          size="icon"
          onClick={() => {
            console.log(row.original.id);
          }}
        >
          <Edit />
        </Button>
      );
    },
  },
] as ColumnDef<Category>[];
