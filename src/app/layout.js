import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GlobalProvider } from '@/store';
import { GoogleTagManager } from '@next/third-parties/google';
import RootComponent from '@/components/common/RootComponent';
import Script from 'next/script';

import '@/styles/globals.scss';

export async function generateMetadata() {
	const messages = await getMessages();
	const metadataTranslations = messages.Home;

	return {
		title: metadataTranslations.title,
		description: metadataTranslations.description,
		keywords:
			'成人动漫, 里番, 本子, 工口, 绅士向, 成人漫画, H本, 成人动画, H游戏, 福利姬',
	};
}

export default async function RootLayout({ children }) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body>
				<GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />

				<Script
					id='matomo-tracker'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `
              var _mtm = window._mtm = window._mtm || [];
              _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
              (function() {
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src='https://beastdatab.com/js/container_s2X8bY7d.js'; s.parentNode.insertBefore(g,s);
              })();
          `,
					}}
				/>

				{/* Google Tag Manager NoScript */}
				<noscript>
					<iframe
						src='https://www.googletagmanager.com/ns.html?id=GTM-WN8PS24'
						height='0'
						width='0'
						style={{ display: 'none', visibility: 'hidden' }}
					>
					</iframe>
				</noscript>

				<NextIntlClientProvider locale={locale} messages={messages}>
					<GlobalProvider>
						<RootComponent locale={locale}>{children}</RootComponent>
					</GlobalProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
