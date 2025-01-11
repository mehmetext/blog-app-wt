"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category, Comment, CommentStatus, Post } from "@prisma/client";
import { SortingState } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import commentsColumns from "./comments-columns";

export default function CommentsDataTable({
  comments,
  page,
  limit,
  onPaginationChange,
  onSortingChange,
  sorting,
  onStatusChange,
  onBatchStatusChange,
}: {
  comments: PaginatedResponse<
    Comment & { post: Post & { category: Category } }
  >;
  page: number;
  limit: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
  onStatusChange: (id: string, status: CommentStatus) => Promise<void>;
  onBatchStatusChange: (ids: string[], status: CommentStatus) => Promise<void>;
}) {
  return (
    <DataTable
      columns={commentsColumns({ onStatusChange })}
      data={comments.items}
      manualPagination
      pageCount={comments.pageCount}
      pageIndex={page - 1}
      pageSize={limit}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
      operations={[
        {
          label: "Approve Selected",
          icon: Check,
          onClick: async (rows) => {
            await onBatchStatusChange(
              rows.map((row) => row.original.id),
              "APPROVED"
            );
          },
        },
        {
          label: "Reject Selected",
          icon: X,
          onClick: async (rows) => {
            await onBatchStatusChange(
              rows.map((row) => row.original.id),
              "REJECTED"
            );
          },
        },
      ]}
    />
  );
}
