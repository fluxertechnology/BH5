// middleware.js

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/', // Match the root path
    '/(en|tc)/:path*', // Match paths with specific locales
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)', // Match all other paths except API and static files
  ],
};