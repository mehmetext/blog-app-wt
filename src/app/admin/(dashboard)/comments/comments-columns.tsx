"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Comment, Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Check, Clock, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";

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
      return (
        <Link
          href={`/${row.original.post.category.slug}/${row.original.post.slug}`}
          target="_blank"
          className="hover:underline"
        >
          {row.original.post.title}
        </Link>
      );
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "APPROVED"
              ? "default"
              : row.original.status === "REJECTED"
              ? "destructive"
              : "outline"
          }
          className="size-6 p-0 [&>svg]:size-3 justify-center"
        >
          {row.original.status === "APPROVED" ? (
            <Check />
          ) : row.original.status === "REJECTED" ? (
            <X />
          ) : (
            <Clock />
          )}
        </Badge>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                console.log(row.original.id);
              }}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Check />
              Onayla
            </DropdownMenuItem>
            <DropdownMenuItem>
              <X />
              Reddet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
] as ColumnDef<Comment & { post: Post & { category: Category } }>[];
