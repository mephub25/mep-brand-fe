import AdminLayout from "../../../components/admin/AdminLayout";

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Welcome Admin</h1>
      <p className="mt-4">This is your dashboard overview.</p>
    </AdminLayout>
  );
};

export default Dashboard;
