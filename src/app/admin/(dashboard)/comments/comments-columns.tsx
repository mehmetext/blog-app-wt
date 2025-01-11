"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Comment, CommentStatus, Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Check, Clock, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";

export default function commentsColumns({
  onStatusChange,
}: {
  onStatusChange: (id: string, status: CommentStatus) => Promise<void>;
}): ColumnDef<Comment & { post: Post & { category: Category } }>[] {
  return [
    {
      id: "select",
      size: 10,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "content",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment" />
      ),
      minSize: 300,
      cell: ({ row }) => {
        return row.original.content;
      },
    },
    {
      accessorKey: "authorName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      cell: ({ row }) => {
        return row.original.authorName ?? "Anonymous";
      },
    },
    {
      id: "postTitle",
      accessorFn: (row) => row.post.title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Post" />
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
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
        <DataTableColumnHeader column={column} title="Actions" />
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
              <DropdownMenuItem
                className="justify-between"
                onClick={async () => {
                  await onStatusChange(row.original.id, "APPROVED");
                }}
              >
                Approve
                <Check />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="justify-between"
                onClick={async () => {
                  await onStatusChange(row.original.id, "REJECTED");
                }}
              >
                Reject
                <X />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
