import { getPosts } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminContainer from "../components/admin-container";
import { RecentPosts } from "./components/recent-posts";
import StatsOverview from "./components/stats-overview";

export default async function AdminDashboardPage() {
  const posts = await getPosts({ limit: 5 });

  return (
    <AdminContainer breadcrumb={[{ label: "Admin Panel", href: "/admin" }]}>
      <div className="space-y-6">
        <StatsOverview />

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
