import AdminDashboard from '../components/dashboard/AdminDashboard';
import EditorDashboard from '../components/dashboard/EditorDashboard';
import RecentCourses from '../components/dashboard/RecentCourses';
import UserDashboard from '../components/dashboard/UserDashboard';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();

  const renderDashboardContent = () => {
    switch (authenticatedUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'editor':
        return <EditorDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Dashboard</h1>
      <hr />
      <div className="mt-5 space-y-6">
        {/* Role-based dashboard content */}
        {renderDashboardContent()}

        {/* Recent courses for all roles */}
        <RecentCourses />
      </div>
    </Layout>
  );
}
