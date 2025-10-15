import { Globe } from 'react-feather';

import { useTranslation } from '../../hooks/useTranslation';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function LanguageSelector({
  className = '',
  variant = 'dark',
}: LanguageSelectorProps) {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-gray-600' : 'text-white';
  const borderColor = isLight
    ? 'border-gray-300'
    : 'border-white border-opacity-30';
  const bgColor = isLight ? 'bg-white' : 'bg-transparent';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe size={16} className={textColor} />
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={`${bgColor} ${textColor} border ${borderColor} rounded px-2 py-1 text-sm focus:outline-none focus:border-opacity-60`}
      >
        <option value="es" className="bg-gray-800 text-white">
          🇪🇸 {t('language.spanish')}
        </option>
        <option value="en" className="bg-gray-800 text-white">
          🇺🇸 {t('language.english')}
        </option>
      </select>
    </div>
  );
}
