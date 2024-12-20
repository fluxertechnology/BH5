import DesktopHeader from "@/components/layout/Header/DesktopHeader";
import DesktopFooter from "@/components/layout/Footer/DesktopFooter";
import MobileHeader from "@/components/layout/Header/MobileHeader";
import MobileFooter from "@/components/layout/Footer/MobileFooter";
import GlobalComponent from "@/components/common/GlobalComponent";
import PopupContainer from "@/components/common/PopupContainerComponent";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { GlobalProvider } from "@/store";
import { GoogleTagManager } from '@next/third-parties/google'

import "@/styles/globals.scss";

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

      <GoogleTagManager gtmId="G-8JGS6Q3L39___" />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalProvider>
            <DesktopHeader locale={locale} />
            <MobileHeader locale={locale} />
            <div className="min-h-screen">{children}</div>
            <DesktopFooter locale={locale} />
            <MobileFooter locale={locale} />
            <GlobalComponent />
            <PopupContainer locale={locale} />
          </GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
