import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean;
  userId: string | null;
  preferredLocale: string;
};

const ProfilePage = ({ isAuthenticated, userId, preferredLocale }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <button type="button" onClick={() => navigate('/')}>
        {t('profile.backToHome')}
      </button>
    </section>
  );
};

export default ProfilePage;
