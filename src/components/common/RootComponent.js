'use client';

import DesktopHeader from '@/components/layout/Header/DesktopHeader';
import DesktopFooter from '@/components/layout/Footer/DesktopFooter';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import MobileFooter from '@/components/layout/Footer/MobileFooter';
import GlobalComponent from '@/components/common/GlobalComponent';
import PopupDialog from '@/components/login/PopupComponent';
import { useEffect, useState } from 'react';
import { useGlobalContext, useGlobalDispatch } from '@/store';
import { openPopup } from '@/store/actions/user';

const RootComponent = ({ children, locale }) => {
	const { state } = useGlobalContext();

	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient) return;
		const routes = [
			'/posts/main/notice',
			'/posts/main/add/tags',
			'/posts/main/add',
			'/vendor/sheet/:goodsId/:buyType',
			'/profile/mission',
			'/profile/vip/common',
			'/profile/vip/sex',
			'/profile/vip/video',
			'/profile/edit',
			'/profile/edit/avatar',
			'/profile/payment',
			'/profile/direct_buy_vip',
			'/profile/transfer',
			'/profile/record',
			'/profile/bundle',
			'/profile/bundle/coupon',
			'/profile/bundle/gift',
			'/profile/payment_record/with_draw',
			'/profile/payment_record/with_draw/history/:type',
			'/profile/payment_record',
			'/profile/collect',
			'/profile/collect/comic',
			'/profile/collect/anime',
			'/profile/collect/video',
			'/profile/collect/novel',
			'/profile/collect/photo',
			'/profile/invites',
			'/profile/myorder',
			'/profile/myorderDetail/:orderId',
			'/profile/watch_history',
			'/profile/watch_history/anime',
			'/profile/watch_history/comic',
			'/profile/purchase_record',
			'/profile/purchase_record/comic',
			'/profile/purchase_record/anime',
			'/profile/purchase_record/video',
			'/profile/purchase_record/novel',
			'/profile/purchase_record/photo',
			'/profile/purchase_record/social',
			'/profile/feedback',
			'/home/comic/:comicId/:ep',
		];

		const routeToRegex = (route) => {
			return new RegExp(
				'^' +
					route
						.replace(/:\w+/g, '([^/]+)')
						.replace(/\//g, '\\/') +
					'$',
			);
		};

		const findMatchingRoute = (pathname) => {
			for (const route of routes) {
				const regex = routeToRegex(route);
				if (regex.test(pathname)) {
					return {
						matchedRoute: route,
						params: extractParams(regex, pathname, route),
					};
				}
			}
			return { matchedRoute: null, params: null };
		};

		const extractParams = (regex, pathname, route) => {
			const match = pathname.match(regex);
			const paramNames = [...route.matchAll(/:(\w+)/g)].map((m) => m[1]);
			const paramValues = match ? match.slice(1) : [];
			return paramNames.reduce((acc, name, i) => {
				acc[name] = paramValues[i];
				return acc;
			}, {});
		};

		const result = findMatchingRoute(state.router.location.pathname);
		if (result.matchedRoute) {
			setTimeout(() => {
				useGlobalDispatch(openPopup('login'));
			});
		}
	}, [state.router.location.pathname, isClient]);

	if (!isClient) {
		return null;
	}

	return (
		<>
			<DesktopHeader locale={locale} />
			<MobileHeader locale={locale} />
			<div className='min-h-screen'>{children}</div>
			<DesktopFooter locale={locale} />
			<MobileFooter locale={locale} />
			<GlobalComponent />
			<PopupDialog locale={locale} />
		</>
	);
};

export default RootComponent;
