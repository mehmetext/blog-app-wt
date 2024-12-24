import { getCategories, getPosts } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderTree, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import AdminContainer from "../components/admin-container";
import { RecentPosts } from "./components/recent-posts";

export default async function AdminDashboardPage() {
  const posts = await getPosts({ limit: 5 });
  const categories = await getCategories();

  const stats = [
    {
      title: "Total Posts",
      value: 10,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      title: "Categories",
      value: 10,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      title: "Users",
      value: 10,
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
    <AdminContainer breadcrumb={[{ label: "Admin Panel", href: "/admin" }]}>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Link
                  href={stat.href}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  View all
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentPosts posts={posts.items} />
          </CardContent>
        </Card>
      </div>
    </AdminContainer>
  );
}
