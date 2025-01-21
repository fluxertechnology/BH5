import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;

export default async function sitemap({ id }) {
	const headersList = await headers();
	const datas = await fetch(`${BASE_API}/sitemap/index/dynamic_user`).then((
		res,
	) => res.json());

	const host = headersList.get('host');
	const protocol = headersList.get('x-forwarded-proto') || 'http';
	const siteUrl = `${protocol}://${host.split(':')[0]}`;

	return datas.map((data) => ({
		url: `${siteUrl}/posts/main/profile/${data.uid}`,
	}));
}
