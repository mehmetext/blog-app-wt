import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Comment, Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Send } from "lucide-react";

export default function Comments({
  post,
}: {
  post: Post & { category: Category; author: User; comments: Comment[] };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorumlar ({post.comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Yorum Formu */}
        <form className="space-y-4">
          <Input placeholder="İsminiz (opsiyonel)" />
          <div className="flex gap-2">
            <Textarea placeholder="Yorumunuz..." required />
            <Button type="submit" size="icon">
              <Send />
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
                  {formatDistanceToNow(new Date(), {
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
