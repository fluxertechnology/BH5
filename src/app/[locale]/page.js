'use client';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div>
      <h1>{t('title')}</h1> {/* Call the hook with the dictionary key */}
    </div>
  );
}