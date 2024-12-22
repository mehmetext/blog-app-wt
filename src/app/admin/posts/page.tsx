import AdminContainer from "../components/admin-container";

export default function AdminPostsPage() {
  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Gönderiler", href: "/admin/posts" },
      ]}
    >
      <p>Gönderiler</p>
    </AdminContainer>
  );
}
