import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',                      // Match the root path
    '/(en|tc)/:path*',        // Match paths with specific locales
    '/sitemap.xml',           // Exclude sitemap from locale middleware
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)', // Match all other paths except those specified
  ],
};
