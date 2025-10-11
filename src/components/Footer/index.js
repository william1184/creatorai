'use client';

import { useTranslations } from 'next-intl';

const AppFooter = () => {
  const t = useTranslations('Footer'); // Assuming you'll add 'Footer' to your translation files
  return (
    <footer className="w-full py-4 text-center text-white text-sm">
      <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
    </footer>
  );
};

export default AppFooter;