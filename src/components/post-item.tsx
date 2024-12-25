import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Category, Comment, Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostItemProps {
  post: Post & { category: Category; author: User; comments: Comment[] };
}

export function PostItem({ post }: PostItemProps) {
  return (
    <div>
      <Card className="group overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <Link
              href={`/${post.category.slug}`}
              className={cn(badgeVariants({ variant: "outline" }))}
            >
              {post.category.name}
            </Link>
            <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/${post.category.slug}/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
          </div>
          <p className="text-muted-foreground line-clamp-2">{post.content}</p>
          <div className="w-full flex items-center justify-between gap-4 text-sm text-muted-foreground">
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
              <span>{post.comments.length} yorum</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Link
            href={`/${post.category.slug}/${post.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full shadow-none border-none rounded-none"
            )}
          >
            <span>Devamını Oku</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
