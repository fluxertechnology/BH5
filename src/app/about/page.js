'use client';

import { useTranslations } from 'next-intl';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function HomePage() {
  const t = useTranslations('Home');
  const { isDesktop, isTablet, isMobile,isTouchDevice } = useMediaQuery();

  const getRoutesFromDir = (dir, basePath = '') => {
    const files = fs.readdirSync(dir);
    let routes = [];

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // If it's a directory, recurse into it
        routes = routes.concat(getRoutesFromDir(filePath, path.join(basePath, file)));
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        // If it's a page file, add the route
        const route = path.join(basePath, file.replace(/\.(js|jsx|ts|tsx)$/, ''));
        routes.push(route);
      }
    });

    return routes;
  };

  const dynamicRoutes = getRoutesFromDir(path.join(__dirname, '../src/app'));

  console.log(dynamicRoutes,'dynamicRoutes');

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