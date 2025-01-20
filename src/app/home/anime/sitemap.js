import { pageUrlConstants } from '@/lib/constants';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;

export default async function sitemap({ id }) {
	const headersList = await headers();
	const datas = await fetch(`${BASE_API}/sitemap/index/anime`).then((res) =>
		res.json()
	);

	const host = headersList.get('host');
	const protocol = headersList.get('x-forwarded-proto');
	const siteUrl = `${protocol}://${host}`;

	return datas.map((data) => ({
		url: `${siteUrl}/home/anime/${data.id}/1`,
	}));
}
