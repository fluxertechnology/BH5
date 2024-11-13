'use client';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div>
      <h1>{t('description')}</h1> 
    </div>
  );
}