'use client';

import { useTranslations } from 'next-intl';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function HomePage() {
  const t = useTranslations('Home');
  const { isDesktop, isTablet, isMobile,isTouchDevice } = useMediaQuery();

  return (
    <div>
      <h1>{t('description')}</h1>
      <div>
      {isDesktop && <p>You are on a desktop!</p>}
      {isTablet && <p>You are on a tablet!</p>}
      {isMobile && <p>You are on a mobile device!</p>}
      {isTouchDevice && <p>This device has a touchscreen!</p>}
      </div>
    </div>
  );
}