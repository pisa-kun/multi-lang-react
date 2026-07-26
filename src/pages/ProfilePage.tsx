import { useTranslation } from 'react-i18next';

type Props = {
  isAuthenticated: boolean;
  userId: string | null;
  preferredLocale: string;
};

const ProfilePage = ({ isAuthenticated, userId, preferredLocale }: Props) => {
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <section className="page page-profile">
        <h1>{t('profile.notLoggedIn')}</h1>
        <p>{t('profile.loginRequired')}</p>
      </section>
    );
  }

  return (
    <section className="page page-profile">
      <h1>{t('profile.title')}</h1>
      <p>{t('profile.userId', { userId })}</p>
      <p>{t('profile.locale', { locale: preferredLocale })}</p>
    </section>
  );
};

export default ProfilePage;
