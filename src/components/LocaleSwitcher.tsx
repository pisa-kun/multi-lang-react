import { useTranslation } from 'react-i18next';

type Props = {
  locale: string;
  onChange: (locale: string) => void;
  disabled?: boolean;
};

const LocaleSwitcher = ({ locale, onChange, disabled }: Props) => {
  const { t, i18n } = useTranslation();
  const isJapanese = i18n.language?.startsWith('ja');

  return (
    <div className="locale-switcher">
      <button type="button" onClick={() => onChange('ja')} disabled={disabled || locale === 'ja'}>
        {isJapanese ? t('locale.ja') : 'Japanese'}
      </button>
      <button type="button" onClick={() => onChange('en')} disabled={disabled || locale === 'en'}>
        {isJapanese ? t('locale.en') : 'English'}
      </button>
    </div>
  );
};

export default LocaleSwitcher;
