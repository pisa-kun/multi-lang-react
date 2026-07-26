import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type Props = {
  onLogin: () => void;
};

const LoginPage = ({ onLogin }: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section className="page page-login">
      <h1>{t('login.title')}</h1>
      <p>{t('login.description')}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onLogin();
        }}
      >
        <label>
          {t('login.username')}
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          {t('login.password')}
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">{t('login.button')}</button>
        <button type="button" onClick={onLogin}>{t('login.next')}</button>
      </form>
    </section>
  );
};

export default LoginPage;
