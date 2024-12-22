import AdminContainer from "../components/admin-container";

export default function AdminDashboardPage() {
  return (
    <AdminContainer breadcrumb={[{ label: "Admin Paneli", href: "/admin" }]}>
      <p>Admin Dashboard</p>
    </AdminContainer>
  );
}
