import { getPost } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { H1, Lead } from "@/components/ui/typography";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, MessageCircle, User } from "lucide-react";
import Image from "next/image";

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}) {
  const { postSlug } = await params;
  const post = await getPost(postSlug);

  return (
    <PageContainer>
      <article className="mx-auto max-w-3xl space-y-8">
        <BreadcrumbNav
          items={[
            {
              label: post.category.name,
              href: `/${post.category.slug}`,
            },
            { label: post.title, href: `/${post.slug}` },
          ]}
        />

        <div className="space-y-4">
          <Badge variant="outline">{post.category.name}</Badge>
          <H1>{post.title}</H1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Yazar Adı</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>5 yorum</span>
            </div>
          </div>
        </div>

        <div className="aspect-video relative overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Card>
          <CardContent className="prose prose-stone dark:prose-invert max-w-none p-6">
            <Lead className="mb-8">{post.content}</Lead>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptates, quod, voluptatum, quae voluptatibus quas
              exercitationem quibusdam voluptatem quidem quos quia? Quis,
              voluptatum. Quisquam, voluptates. Quisquam, voluptates.
            </p>
            {/* Buraya daha fazla içerik eklenebilir */}
          </CardContent>
        </Card>
      </article>
    </PageContainer>
  );
}
