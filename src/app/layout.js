import DesktopHeader from "@/components/layout/Header/DesktopHeader";
import DesktopFooter from "@/components/layout/Footer/DesktopFooter";
import GlobalComponent from "@/components/common/GlobalComponent";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { GlobalProvider } from "@/store";

import "@/styles/globals.css";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

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
          <GlobalProvider>
            <DesktopHeader locale={locale} />
            {children}
            <DesktopFooter locale={locale} />
            <GlobalComponent />
          </GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}