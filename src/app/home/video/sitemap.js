import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;

export default async function sitemap() {
	const datas = await fetch(`${BASE_API}/sitemap/index/video`).then((res) =>
		res.json()
	);

  const headersList = await headers();
	const host = headersList.get('host');
	const protocol = headersList.get('x-forwarded-proto') || 'http';
	const siteUrl = `${protocol}://${host.split(':')[0]}`;

	return datas.map((data) => ({
		url: `${siteUrl}/home/video/${data.id}`,
	}));
}
