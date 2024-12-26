"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category } from "@prisma/client";
import categoriesColumns from "./categories-columns";

export default function CategoriesDataTable({
  categories,
  onUpdate,
}: {
  categories: (Category & { _count: { posts: number } })[];
  onUpdate: (id: string, data: { name: string }) => Promise<void>;
}) {
  return (
    <DataTable columns={categoriesColumns({ onUpdate })} data={categories} />
  );
}
