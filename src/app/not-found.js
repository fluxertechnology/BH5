'use client';

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('Common');
  return (
    <div className='text-center'>
      <h1 className='mt-10 font-semibold'>{t('error')}</h1>
    </div>
  );
}