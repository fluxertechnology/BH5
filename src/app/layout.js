
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { GlobalProvider } from "@/store";
import { GoogleTagManager } from '@next/third-parties/google'
import RootComponent from "@/components/common/RootComponent";

import "@/styles/globals.scss";


export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

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

      <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalProvider>
            <RootComponent locale={locale}>{children}</RootComponent>
          </GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
