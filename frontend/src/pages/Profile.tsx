import ProfileSettings from '../components/dashboard/ProfileSettings';
import Layout from '../components/layout';
import { useTranslation } from '../hooks/useTranslation';

export default function Profile() {
  const { t } = useTranslation();

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">{t('navigation.profile')}</h1>
      <hr />
      <div className="mt-5">
        <ProfileSettings />
      </div>
    </Layout>
  );
}
