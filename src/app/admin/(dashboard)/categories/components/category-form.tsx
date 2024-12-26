"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Kategori adı en az 2 karakter olmalıdır")
    .max(50, "Kategori adı en fazla 50 karakter olabilir"),
});

type CategoryFormInput = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormInput) => Promise<void>;
}

export default function CategoryForm({
  category,
  onSubmit,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const handleSubmit = async (data: CategoryFormInput) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      router.refresh();
      toast.success(
        category ? "Kategori güncellendi" : "Kategori başarıyla oluşturuldu"
      );
    } catch {
      toast.error(
        category
          ? "Kategori güncellenirken bir hata oluştu"
          : "Kategori oluşturulurken bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Adı</FormLabel>
              <FormControl>
                <Input placeholder="Kategori adı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? category
              ? "Güncelleniyor..."
              : "Oluşturuluyor..."
            : category
            ? "Güncelle"
            : "Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
