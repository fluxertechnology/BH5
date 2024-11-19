import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers'; // Import the cookies function

export default getRequestConfig(async () => {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies(); 
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value; // Access the cookie value safely
  const locales = ['en', 'tc'];
  const locale = locales.includes(cookieLocale) ? cookieLocale : 'tc'; // Default to 'en'

  return {
    locale,
    messages: (await import(`./../locales/${locale}.json`)).default
  };
});