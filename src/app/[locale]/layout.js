import Navbar from '../../components/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing'; 
import './../globals.css'; 

async function getMessages(locale) {
  try {
    const messages = (await import(`../../locales/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params; 
  const validLocales = routing.locales;

  if (!validLocales.includes(locale)) {
    console.error('Invalid locale:', locale);
    notFound();
  }

  const messages = await getMessages(locale);

  // Load metadata translations
  const metadataTranslations = messages.Home;

  // Set metadata
  const metadata = {
    title: metadataTranslations.title,
    description: metadataTranslations.description,
  };

  return (
    <html lang={locale}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}