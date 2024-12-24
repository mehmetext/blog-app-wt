"use client";

import { createComment } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Comment, Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Comments({
  post,
}: {
  post: Post & { category: Category; author: User; comments: Comment[] };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorumlar ({post.comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Yorum Formu */}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            await createComment({
              content,
              authorName: name,
              postId: post.id,
            });
            router.refresh();
            setIsLoading(false);
            setContent("");
            setName("");
          }}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="İsminiz (opsiyonel)"
          />
          <div className="flex gap-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              name="content"
              placeholder="Yorumunuz..."
              required
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </form>

        {/* Yorumlar Listesi */}
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-4 space-y-2 bg-muted/40"
            >
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium">{comment.authorName}</span>
                <span>
                  {formatDistanceToNow(comment.createdAt, {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
