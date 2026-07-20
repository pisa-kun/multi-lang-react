import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { fetchUserSettings, login, saveUserSettings } from './services/api';
import LocaleSwitcher from './components/LocaleSwitcher';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  preferredLocale: string;
};

const defaultLocale = 'ja';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    preferredLocale: defaultLocale,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      i18n.changeLanguage(auth.preferredLocale);
    }
  }, [auth.isAuthenticated, auth.preferredLocale, i18n]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoadingSettings(true);
      fetchUserSettings()
        .then((settings) => {
          setAuth((prev) => ({
            ...prev,
            preferredLocale: settings.preferredLocale,
          }));
          i18n.changeLanguage(settings.preferredLocale);
        })
        .catch(() => {
          setSettingsError('設定の読み込みに失敗しました。');
        })
        .finally(() => {
          setLoadingSettings(false);
        });
    }
  }, [auth.isAuthenticated, i18n]);

  const pageTitle = useMemo(() => {
    if (location.pathname === '/profile') return 'profile.title';
    if (location.pathname === '/') return auth.isAuthenticated ? 'home.title' : 'login.title';
    return 'home.title';
  }, [auth.isAuthenticated, location.pathname]);

  useEffect(() => {
    document.title = i18n.t(pageTitle) as string;
  }, [i18n, pageTitle]);

  const handleLogin = async () => {
    try {
      const result = await login();
      if (result.success) {
        setAuth({ isAuthenticated: true, userId: result.userId, preferredLocale: auth.preferredLocale });
        navigate('/');
      } else {
        setSettingsError('ログインに失敗しました。');
      }
    } catch {
      setSettingsError('ログインに失敗しました。');
    }
  };

  const handleLogout = () => {
    setAuth((prev) => ({ ...prev, isAuthenticated: false, userId: null }));
    navigate('/login');
  };

  const handleLocaleChange = async (locale: string) => {
    if (auth.isAuthenticated) {
      setLoadingSettings(true);
      try {
        const nextSettings = await saveUserSettings({ preferredLocale: locale });
        setAuth((prev) => ({ ...prev, preferredLocale: nextSettings.preferredLocale }));
        i18n.changeLanguage(nextSettings.preferredLocale);
      } catch {
        setSettingsError('設定の保存に失敗しました。');
      } finally {
        setLoadingSettings(false);
      }
    } else {
      setAuth((prev) => ({ ...prev, preferredLocale: locale }));
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Multi-lang Sample</div>
        <LocaleSwitcher locale={auth.preferredLocale} onChange={handleLocaleChange} disabled={loadingSettings} />
      </header>
      <main className="app-main">
        {settingsError && <div className="error-box">{settingsError}</div>}
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={auth.isAuthenticated}
                preferredLocale={auth.preferredLocale}
                loadingSettings={loadingSettings}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                isAuthenticated={auth.isAuthenticated}
                userId={auth.userId}
                preferredLocale={auth.preferredLocale}
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
