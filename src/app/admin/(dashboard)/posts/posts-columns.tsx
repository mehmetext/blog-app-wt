"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-header";
import { Category, Comment, Post, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

export default [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Başlık" />
    ),
    cell: ({ row }) => {
      return (
        <Link
          target="_blank"
          href={`/${row.original.category.slug}/${row.original.slug}`}
          className="hover:underline"
        >
          {row.original.title}
        </Link>
      );
    },
  },
  {
    id: "category",
    accessorFn: (row) => row.category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
    cell: ({ row }) => {
      return row.original.category.name;
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yazar" />
    ),
    cell: ({ row }) => {
      return row.original.author.name;
    },
  },
  {
    accessorKey: "comments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yorumlar" />
    ),
    cell: ({ row }) => {
      return row.original.comments.length;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Oluşturulma Tarihi" />
    ),
    cell: ({ row }) => {
      return format(row.original.createdAt, "dd.MM.yyyy HH:mm");
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Güncellenme Tarihi" />
    ),
    cell: ({ row }) => {
      return format(row.original.updatedAt, "dd.MM.yyyy HH:mm");
    },
  },
  {
    accessorKey: "deletedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
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
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="İşlemler" />
    ),
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
] as ColumnDef<
  Post & { category: Category; author: User; comments: Comment[] }
>[];
