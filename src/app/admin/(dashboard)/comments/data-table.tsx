"use client";

import { DataTable } from "@/components/ui/data-table";
import { Comment, Post } from "@prisma/client";
import { SortingState } from "@tanstack/react-table";
import commentsColumns from "./comments-columns";

export default function CommentsDataTable({
  comments,
  page,
  limit,
  onPaginationChange,
  onSortingChange,
  sorting,
}: {
  comments: PaginatedResponse<Comment & { post: Post }>;
  page: number;
  limit: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
}) {
  return (
    <DataTable
      columns={commentsColumns}
      data={comments.items}
      manualPagination
      pageCount={comments.pageCount}
      pageIndex={page - 1}
      pageSize={limit}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
    />
  );
}
