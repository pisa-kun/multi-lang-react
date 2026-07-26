import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean;
  preferredLocale: string;
  loadingSettings: boolean;
};

const HomePage = ({ isAuthenticated, preferredLocale, loadingSettings }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <section className="page page-home">
        <h1>{t('home.unauthenticatedTitle')}</h1>
        <p>{t('home.unauthenticatedDescription')}</p>
      </section>
    );
  }

  return (
    <section className="page page-home">
      <h1>{t('home.title')}</h1>
      <p>{t('home.welcome', { locale: preferredLocale })}</p>
      {loadingSettings && <div>{t('home.loadingSettings')}</div>}
      <button type="button" onClick={() => navigate('/profile')}>
        {t('home.viewProfile')}
      </button>
    </section>
  );
};

export default HomePage;
