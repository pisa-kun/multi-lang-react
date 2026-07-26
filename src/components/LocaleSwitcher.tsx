import { useTranslation } from 'react-i18next';

type Props = {
  locale: string;
  onChange: (locale: string) => void;
  disabled?: boolean;
};

const LocaleSwitcher = ({ locale, onChange, disabled }: Props) => {
  const { i18n } = useTranslation();
  const isJapanese = i18n.language?.startsWith('ja');

  return (
    <div className="locale-switcher">
      <button type="button" onClick={() => onChange('ja')} disabled={disabled || locale === 'ja'}>
        {isJapanese ? '日本語' : 'Japanese'}
      </button>
      <button type="button" onClick={() => onChange('en')} disabled={disabled || locale === 'en'}>
        {isJapanese ? '英語' : 'English'}
      </button>
    </div>
  );
};

export default LocaleSwitcher;
