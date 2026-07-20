import { useTranslation } from 'react-i18next';

type Props = {
  isAuthenticated: boolean;
  preferredLocale: string;
  loadingSettings: boolean;
  onLogout: () => void;
};

const HomePage = ({ isAuthenticated, preferredLocale, loadingSettings, onLogout }: Props) => {
  const { t } = useTranslation();

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
      <button onClick={onLogout}>{t('home.logout')}</button>
    </section>
  );
};

export default HomePage;
