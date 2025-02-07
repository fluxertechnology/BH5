import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GlobalProvider } from '@/store';
import { GoogleTagManager } from '@next/third-parties/google';
import RootComponent from '@/components/common/RootComponent';
import Script from 'next/script';
import StyledComponentsRegistry from '@/components/common/StyledComponenstRegistry';

import '@/styles/globals.scss';
import { headers, cookies } from 'next/headers';

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
	const headerList = await headers();
	const userAgent = headerList.get('user-agent') || 'Android';

	const cookiesList = await cookies();
	const cookiesObj = cookiesList.getAll().reduce((acc, { name, value }) => {
	  acc[name] = value;
	  return acc;
	}, {});

	return (
		<html lang={locale}>
			<body>
				<GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />

				{/* Matomo Tracking Script */}
				<Script id='matomo-tracking' strategy='afterInteractive'>
					{`
            var _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://beastdatab.com/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '1']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
				</Script>

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

				<StyledComponentsRegistry>
					<NextIntlClientProvider locale={locale} messages={messages}>
						<GlobalProvider cookies={cookiesObj}>
							<RootComponent locale={locale} userAgent={userAgent}>
								{children}
							</RootComponent>
						</GlobalProvider>
					</NextIntlClientProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
