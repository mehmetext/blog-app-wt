"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";

export default [
  {
    accessorKey: "name",
    header: "Adı",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return row.original.email;
    },
  },
  {
    accessorKey: "postCount",
    header: "Gönderi Sayısı",
    cell: ({ row }) => {
      return row.original._count.Post;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma Tarihi",
    cell: ({ row }) => {
      return format(row.original.createdAt, "dd.MM.yyyy HH:mm");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Güncellenme Tarihi",
    cell: ({ row }) => {
      return format(row.original.updatedAt, "dd.MM.yyyy HH:mm");
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      return row.original.role === "ADMIN" ? (
        <Badge variant="default">Admin</Badge>
      ) : (
        <Badge variant="outline">Kullanıcı</Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "İşlemler",
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
] as ColumnDef<User & { _count: { Post: number } }>[];
