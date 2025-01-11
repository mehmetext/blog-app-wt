"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-header";
import { Switch } from "@/components/ui/switch";
import { Category, Comment, Post, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function postsColumns({
  onFeaturedChange,
}: {
  onFeaturedChange: (id: string, isFeatured: boolean) => Promise<void>;
}): ColumnDef<
  Post & { category: Category; author: User; comments: Comment[] }
>[] {
  return [
    {
      accessorKey: "coverImage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      minSize: 100,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.coverImage}
            alt={row.original.title}
            width={100}
            height={100}
            className="rounded-md"
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      minSize: 200,
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
        <DataTableColumnHeader column={column} title="Category" />
      ),
      minSize: 120,
      cell: ({ row }) => {
        return row.original.category.name;
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      minSize: 120,
      cell: ({ row }) => {
        return row.original.author.name;
      },
    },
    {
      accessorKey: "comments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comments" />
      ),
      cell: ({ row }) => {
        return row.original.comments.length;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        return format(row.original.createdAt, "dd.MM.yyyy HH:mm");
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => {
        return format(row.original.updatedAt, "dd.MM.yyyy HH:mm");
      },
    },
    {
      accessorKey: "deletedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return row.original.deletedAt ? (
          <Badge variant="destructive">Deleted</Badge>
        ) : (
          <Badge variant="outline">Active</Badge>
        );
      },
    },
    {
      id: "isFeatured",
      accessorFn: (row) => row.isFeatured,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Featured" />
      ),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.original.isFeatured}
            onCheckedChange={() =>
              onFeaturedChange(row.original.id, !row.original.isFeatured)
            }
          />
        );
      },
    },
    {
      accessorKey: "actions",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/posts/${row.original.id}/edit`}>
            <Button size="icon">
              <Edit />
            </Button>
          </Link>
        );
      },
    },
  ];
}
