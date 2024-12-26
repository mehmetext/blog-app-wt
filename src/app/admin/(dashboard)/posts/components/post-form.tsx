"use client";

import { createPost, updatePost } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Başlık en az 3 karakter olmalıdır")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  content: z
    .string()
    .min(10, "İçerik en az 10 karakter olmalıdır")
    .max(10000, "İçerik en fazla 10000 karakter olabilir"),
  categoryId: z.string().min(1, "Kategori seçmelisiniz"),
  coverImage: z
    .string()
    .url("Geçerli bir URL girmelisiniz")
    .min(1, "Kapak görseli URL'si girmelisiniz"),
});

export type PostFormInput = z.infer<typeof postSchema>;

interface PostFormProps {
  categories: Category[];
  post?: Post;
}

export default function PostForm({ categories, post }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<PostFormInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      categoryId: post?.categoryId ?? "",
      coverImage: post?.coverImage ?? "",
    },
  });

  const onSubmit = async (data: PostFormInput) => {
    try {
      setIsLoading(true);
      if (post) {
        await updatePost(post.id, data);
        toast.success("Gönderi başarıyla güncellendi");
      } else {
        await createPost(data);
        toast.success("Gönderi başarıyla oluşturuldu");
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      toast.error(
        post
          ? "Gönderi güncellenirken bir hata oluştu"
          : "Gönderi oluşturulurken bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="Gönderi başlığı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapak Görseli URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İçerik</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Gönderi içeriği"
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? post
                  ? "Güncelleniyor..."
                  : "Oluşturuluyor..."
                : post
                ? "Güncelle"
                : "Oluştur"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
