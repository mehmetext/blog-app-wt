import { getComments, updateCommentStatus } from "@/actions";
import { H3 } from "@/components/ui/typography";
import commentsNuqs from "@/lib/nuqs/comments";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import AdminContainer from "../components/admin-container";
import CommentsDataTable from "./data-table";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, limit, sortBy, sortDesc } = await commentsNuqs.cache.parse(
    searchParams
  );

  const comments = await getComments({
    page,
    q,
    limit,
    sortBy,
    sortDesc,
  });

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Yorumlar", href: "/admin/comments" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Yorumlar</H3>
      </div>
      <CommentsDataTable
        comments={comments}
        page={page}
        limit={limit}
        onPaginationChange={async (pageIndex, pageSize) => {
          "use server";
          redirect(
            `/admin/comments${commentsNuqs.serializer({
              page: pageIndex + 1,
              limit: pageSize as 10 | 20 | 30 | 40 | 50,
              q,
              sortBy,
              sortDesc,
            })}`
          );
        }}
        sorting={[{ id: sortBy, desc: sortDesc }]}
        onSortingChange={async (sorting) => {
          "use server";
          redirect(
            `/admin/comments${commentsNuqs.serializer({
              sortBy: sorting[0]?.id,
              sortDesc: sorting[0]?.desc,
              page,
              limit,
              q,
            })}`
          );
        }}
        onStatusChange={async (id, status) => {
          "use server";
          await updateCommentStatus(id, status);
          redirect(
            `/admin/comments${commentsNuqs.serializer({
              sortBy,
              sortDesc,
              page,
              limit,
              q,
            })}`
          );
        }}
      />
    </AdminContainer>
  );
}
