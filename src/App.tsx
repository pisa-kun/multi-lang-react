import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { fetchUserSettings, login, saveUserSettings } from './services/api';
import LocaleSwitcher from './components/LocaleSwitcher';
import {
  DEFAULT_LOCALE,
  getLocaleFromQuery,
  normalizeLocale,
  readStoredLocale,
  writeStoredLocale,
} from './utils/locale';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  preferredLocale: string;
};

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    preferredLocale: DEFAULT_LOCALE,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLocale = normalizeLocale(getLocaleFromQuery(location.search) ?? readStoredLocale());

  useEffect(() => {
    if (auth.preferredLocale !== currentLocale) {
      setAuth((prev) => ({ ...prev, preferredLocale: currentLocale }));
    }
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
    writeStoredLocale(currentLocale);
  }, [auth.preferredLocale, currentLocale, i18n]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentLang = params.get('lang');

    if (currentLang) {
      const nextLocale = normalizeLocale(currentLang);
      if (nextLocale !== currentLocale) {
        writeStoredLocale(nextLocale);
      }
    }

    if (!currentLang && currentLocale !== DEFAULT_LOCALE) {
      params.set('lang', currentLocale);
      const nextSearch = params.toString();
      navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
    }
  }, [currentLocale, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoadingSettings(true);
      fetchUserSettings()
        .then((settings) => {
          const nextLocale = normalizeLocale(settings.preferredLocale);
          setAuth((prev) => ({ ...prev, preferredLocale: nextLocale }));
          if (i18n.language !== nextLocale) {
            i18n.changeLanguage(nextLocale);
          }
          writeStoredLocale(nextLocale);
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
        setAuth((prev) => ({ ...prev, isAuthenticated: true, userId: result.userId, preferredLocale: currentLocale }));
        const nextSearch = new URLSearchParams(location.search);
        nextSearch.set('lang', currentLocale);
        const search = nextSearch.toString();
        navigate(`${location.pathname === '/login' ? '/' : location.pathname}${search ? `?${search}` : ''}`);
      } else {
        setSettingsError('ログインに失敗しました。');
      }
    } catch {
      setSettingsError('ログインに失敗しました。');
    }
  };

  const handleLogout = () => {
    setAuth((prev) => ({ ...prev, isAuthenticated: false, userId: null }));
    const nextSearch = new URLSearchParams(location.search);
    nextSearch.set('lang', currentLocale);
    const search = nextSearch.toString();
    navigate(`/login${search ? `?${search}` : ''}`);
  };

  const handleLocaleChange = async (locale: string) => {
    const nextLocale = normalizeLocale(locale);
    const nextSearch = new URLSearchParams(location.search);
    nextSearch.set('lang', nextLocale);
    const search = nextSearch.toString();

    if (auth.isAuthenticated) {
      setLoadingSettings(true);
      try {
        const nextSettings = await saveUserSettings({ preferredLocale: nextLocale });
        setAuth((prev) => ({ ...prev, preferredLocale: nextSettings.preferredLocale }));
        i18n.changeLanguage(nextSettings.preferredLocale);
        writeStoredLocale(nextLocale);
        navigate(`${location.pathname}${search ? `?${search}` : ''}`);
      } catch {
        setSettingsError('設定の保存に失敗しました。');
      } finally {
        setLoadingSettings(false);
      }
    } else {
      setAuth((prev) => ({ ...prev, preferredLocale: nextLocale }));
      i18n.changeLanguage(nextLocale);
      writeStoredLocale(nextLocale);
      navigate(`${location.pathname}${search ? `?${search}` : ''}`);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Multi-lang Sample</div>
        <div className="app-header-actions">
          {auth.isAuthenticated && location.pathname !== '/login' && (
            <button type="button" onClick={handleLogout} className="header-action-button">
              {i18n.t('common.signOut')}
            </button>
          )}
          <LocaleSwitcher locale={auth.preferredLocale} onChange={handleLocaleChange} disabled={loadingSettings} />
        </div>
      </header>
      <main className="app-main">
        {settingsError && <div className="error-box">{settingsError}</div>}
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage isAuthenticated={auth.isAuthenticated} userId={auth.userId} preferredLocale={auth.preferredLocale} />}
          />
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={auth.isAuthenticated}
                preferredLocale={auth.preferredLocale}
                loadingSettings={loadingSettings}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
