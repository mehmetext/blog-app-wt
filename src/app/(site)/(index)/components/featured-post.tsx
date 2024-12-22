import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category, Post } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedPostProps {
  post: Post & { category: Category };
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
      <Image
        src={post.coverImage}
        alt={post.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-4">
        <div className="space-y-2">
          <Link
            href={`/${post.category.slug}`}
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "hover:bg-white/90 hover:text-foreground transition-colors"
            )}
          >
            {post.category.name}
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold line-clamp-2">
            <Link href={`/${post.category.slug}/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
        </div>
        <p className="line-clamp-2 text-white/90">{post.content}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-white/75">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>5 yorum</span>
            </div>
          </div>
          <Link
            href={`/${post.category.slug}/${post.slug}`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "hover:bg-white hover:text-foreground transition-colors"
            )}
          >
            <span>Devamını Oku</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
