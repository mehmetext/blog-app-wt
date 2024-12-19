import { getPost } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar,
  Copy,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Twitter,
  User,
} from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";
import Comments from "./components/comments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}) {
  const { postSlug } = await params;

  const post = await getPost(postSlug);

  return {
    title: `${post.title} - Blog App`,
  };
}

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

        <div className="flex flex-col gap-8 relative">
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
              <Markdown>{post.content}</Markdown>
            </CardContent>
          </Card>

          <div className="lg:absolute right-[calc(100%+1rem)] top-0 bottom-0">
            <div className="sticky top-1/4 flex flex-row lg:flex-col gap-4">
              <Button size="icon" variant="ghost">
                <Twitter />
              </Button>
              <Button size="icon" variant="ghost">
                <Facebook />
              </Button>
              <Button size="icon" variant="ghost">
                <Linkedin />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram />
              </Button>
              <Button size="icon" variant="ghost">
                <Mail />
              </Button>
              <Button size="icon" variant="ghost">
                <Copy />
              </Button>
            </div>
          </div>
        </div>

        <Comments />
      </article>
    </PageContainer>
  );
}
