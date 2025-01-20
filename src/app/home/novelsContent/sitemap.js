import { pageUrlConstants } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap({ id }) {
	const datas = await fetch(`${BASE_API}/sitemap/index/novel`).then((res) =>
		res.json()
	);

	return datas.map((data) => ({
		url: `${siteUrl}/home/novelsContent/${data.id}`,
	}));
}

