import fs from 'fs';
import path from 'path';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const appPath = path.join(process.cwd(), 'src/app');

export async function GET() {
	const sitemaps = getSitemapFromDir(appPath);

	const sitemapIndexXML = await buildSitemapIndex(sitemaps);

	return new Response(sitemapIndexXML, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}

async function buildSitemapIndex(sitemaps) {
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const sitemapURL of sitemaps) {
		xml += '<sitemap>';
		xml += `<loc>${siteUrl}${sitemapURL}</loc>`;
		xml += '</sitemap>';
	}

	xml += '</sitemapindex>';
	return xml;
}

const getSitemapFromDir = (dir, basePath = '') => {
	const files = fs.readdirSync(dir);
	let routes = [];
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			routes = routes.concat(
				getSitemapFromDir(filePath, path.join(basePath, file)),
			);
		} else if (
			(file.endsWith('sitemap.js'))
		) {
			const dirName = path.dirname(filePath);
			const parentDir = dirName.replace(appPath, '');
			routes.push(
				`${parentDir}/${file.replace('.js', '')}.xml`,
			);
		}
	});

	return routes;
};
