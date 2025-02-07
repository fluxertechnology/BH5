'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
	useReportWebVitals((metric) => {
		if (process.env.NODE_ENV !== 'development') {
			return null;
		}
		switch (metric.name) {
			case 'FCP': {
				console.log(
					'[WebVitals]',
					'FCP (First Contentful Paint):',
					metric.value,
					'ms',
				);
				// handle FCP results
				break;
			}
			case 'LCP': {
				console.log(
					'[WebVitals]',
					'LCP (Largest Contentful Paint):',
					metric.value,
					'ms',
				);
				// handle LCP results
				break;
			}
			case 'CLS': {
				console.log(
					'[WebVitals]',
					' CLS (Cumulative Layout Shift):',
					metric.value,
				);
				// handle CLS results
				break;
			}
			case 'FID': {
				console.log(
					'[WebVitals]',
					'FID (First Input Delay):',
					metric.value,
					'ms',
				);
				// handle FID results
				break;
			}
			case 'TTFB': {
				console.log(
					'[WebVitals]',
					'TTFB (Time to First Byte):',
					metric.value,
					'ms',
				);
				// handle TTFB results
				break;
			}
			default:
				break;
		}
	});

	return null; // This component doesn't render anything
}
