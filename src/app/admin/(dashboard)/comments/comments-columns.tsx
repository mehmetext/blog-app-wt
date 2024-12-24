"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-header";
import { Comment, Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";

export default [
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yorum" />
    ),
    minSize: 300,
    cell: ({ row }) => {
      return row.original.content;
    },
  },
  {
    accessorKey: "authorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yazar" />
    ),
    cell: ({ row }) => {
      return row.original.authorName ?? "Anonim";
    },
  },
  {
    id: "postTitle",
    accessorFn: (row) => row.post.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gönderi" />
    ),
    cell: ({ row }) => {
      return row.original.post.title;
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
] as ColumnDef<Comment & { post: Post }>[];
