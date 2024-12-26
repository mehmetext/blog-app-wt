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
        <DataTableColumnHeader column={column} title="Resim" />
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
        <DataTableColumnHeader column={column} title="Başlık" />
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
        <DataTableColumnHeader column={column} title="Kategori" />
      ),
      minSize: 120,
      cell: ({ row }) => {
        return row.original.category.name;
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Yazar" />
      ),
      minSize: 120,
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
      id: "isFeatured",
      accessorFn: (row) => row.isFeatured,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Öne Çıkan" />
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
        <DataTableColumnHeader column={column} title="İşlemler" />
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
