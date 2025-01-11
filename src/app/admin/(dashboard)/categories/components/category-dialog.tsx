"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import CategoryForm from "./category-form";

interface CategoryDialogProps {
  category?: Category;
  onSubmit: (data: { name: string }) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function CategoryDialog({
  category,
  onSubmit,
  trigger,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          onSubmit={async (data) => {
            await onSubmit(data);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
