'use client';

import DesktopHeader from '@/components/layout/Header/DesktopHeader';
import DesktopFooter from '@/components/layout/Footer/DesktopFooter';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import MobileFooter from '@/components/layout/Footer/MobileFooter';
import GlobalComponent from '@/components/common/GlobalComponent';
import PopupDialog from '@/components/login/PopupComponent';
import { useEffect, useState } from 'react';

const RootComponent = ({ children, locale }) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

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
