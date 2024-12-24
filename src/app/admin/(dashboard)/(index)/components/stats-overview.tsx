import { getCategories, getUsers } from "@/actions";

import { getPosts } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H3, Muted } from "@/components/ui/typography";
import { FileText, FolderTree, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export default async function StatsOverview() {
  const posts = await getPosts({});
  const categories = await getCategories();
  const users = await getUsers();

  const stats = [
    {
      title: "Total Posts",
      value: 10,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Comments",
      value: 10,
      icon: MessageSquare,
      href: "/admin/comments",
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <H3>{stat.value}</H3>
            <Muted>
              <Link href={stat.href} className="text-xs hover:underline">
                View all
              </Link>
            </Muted>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
