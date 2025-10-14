import ProfileSettings from '../components/dashboard/ProfileSettings';
import Layout from '../components/layout';

export default function Profile() {
  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Mi Perfil</h1>
      <hr />
      <div className="mt-5">
        <ProfileSettings />
      </div>
    </Layout>
  );
}
