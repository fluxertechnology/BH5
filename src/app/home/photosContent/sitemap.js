import { pageUrlConstants } from '@/lib/constants';

const BASE_API = 'https://admin_bh5.kcpty.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap({ id }) {
	const datas = await fetch(`${BASE_API}/sitemap/index/photo`).then((res) =>
		res.json()
	);

	return datas.map((data) => ({
		url: `${siteUrl}/home/photosContent/${data.id}`,
	}));
}
