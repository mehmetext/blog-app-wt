import { currentUser, getPost } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Edit, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import Comments from "./components/comments";
import ShareButtons from "./components/share-buttons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}) {
  const { postSlug } = await params;

  const post = await getPost(postSlug);

  if (!post) {
    return notFound();
  }

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
  const user = await currentUser();

  if (!post) {
    return notFound();
  }

  return (
    <PageContainer>
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
        <Link
          href={`/${post.category.slug}`}
          className={cn(badgeVariants({ variant: "outline" }))}
        >
          {post.category.name}
        </Link>
        <H1>{post.title}</H1>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author.name}</span>
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
            <span>{post.comments.length} yorum</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative">
        <div className="aspect-video relative overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
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
            {user?.role === "ADMIN" && (
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "icon" })
                )}
              >
                <Edit className="h-4 w-4" />
              </Link>
            )}
            <ShareButtons content={post.title} />
          </div>
        </div>
      </div>

      <Comments post={post} />
    </PageContainer>
  );
}
