"use client";

import { PaginatedResponse } from "@/actions";
import { DataTable } from "@/components/ui/data-table";
import { Category, Comment, Post, User } from "@prisma/client";
import postsColumns from "./posts-columns";

export default function PostsDataTable({
  posts,
  page,
  limit,
  onPaginationChange,
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
    />
  );
}
