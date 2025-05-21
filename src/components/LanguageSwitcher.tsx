
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';

export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      onClick={toggleLanguage}
      className="w-10"
    >
      {language === 'en' ? 'EN' : 'RU'}
    </Button>
  );
};
