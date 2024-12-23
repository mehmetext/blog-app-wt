"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category, Comment, Post, User } from "@prisma/client";
import { SortingState } from "@tanstack/react-table";
import postsColumns from "./posts-columns";

export default function PostsDataTable({
  posts,
  page,
  limit,
  onPaginationChange,
  onSortingChange,
  sorting,
}: {
  posts: PaginatedResponse<
    Post & {
      category: Category;
      author: User;
      comments: Comment[];
    }
  >;
  page: number;
  limit: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
}) {
  return (
    <DataTable
      columns={postsColumns}
      data={posts.items}
      manualPagination
      pageCount={posts.pageCount}
      pageIndex={page - 1}
      pageSize={limit}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
    />
  );
}
