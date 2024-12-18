import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import Posts from "./components/posts";

export default function Home() {
  return (
    <PageContainer>
      <BreadcrumbNav />
      <Posts />
    </PageContainer>
  );
}
