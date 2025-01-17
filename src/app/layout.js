import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { GlobalProvider } from "@/store";
import { GoogleTagManager } from '@next/third-parties/google';
import RootComponent from "@/components/common/RootComponent";

import "@/styles/globals.scss";

export async function generateMetadata() {
  const messages = await getMessages();
  const metadataTranslations = messages.Home;

  return {
    title: metadataTranslations.title,
    description: metadataTranslations.description,
    keywords:"成人动漫, 里番, 本子, 工口, 绅士向, 成人漫画, H本, 成人动画, H游戏, 福利姬",
  };
}

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalProvider>
            <RootComponent locale={locale}>{children}</RootComponent>
          </GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
