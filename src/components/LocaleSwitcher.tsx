import { useTranslation } from 'react-i18next';

type Props = {
  locale: string;
  onChange: (locale: string) => void;
  disabled?: boolean;
};

const LocaleSwitcher = ({ locale, onChange, disabled }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="locale-switcher">
      <button type="button" onClick={() => onChange('ja')} disabled={disabled || locale === 'ja'}>
        {t('locale.ja')}
      </button>
      <button type="button" onClick={() => onChange('en')} disabled={disabled || locale === 'en'}>
        {t('locale.en')}
      </button>
    </div>
  );
};

export default LocaleSwitcher;
