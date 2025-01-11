import { Badge } from "@/components/ui/badge";
import { Category, Comment, Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";

interface RecentPostsProps {
  posts: (Post & {
    category: Category;
    author: User;
    comments: Comment[];
  })[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{post.category.name}</Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>
          <Link
            target="_blank"
            href={`/${post.category.slug}/${post.slug}`}
            className="hover:underline font-semibold"
          >
            {post.title}
          </Link>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {post.content}
          </p>
        </div>
      ))}
    </div>
  );
}
