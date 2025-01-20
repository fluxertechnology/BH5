import fs from 'fs';
import path from 'path';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const appPath = path.join(process.cwd(), 'src/app');
	const routes = getRoutesFromDir(appPath);
	return routes.map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		//changeFrequency: 'monthly',
		//priority: 0.8,
	}));
}

const getRoutesFromDir = (dir, basePath = '') => {
	const files = fs.readdirSync(dir);
	let routes = [];
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			routes = routes.concat(
				getRoutesFromDir(filePath, path.join(basePath, file)),
			);
		} else if (
			(file.endsWith('.js') || file.endsWith('.jsx') ||
				file.endsWith('.ts') || file.endsWith('.tsx')) &&
			!['layout', 'not-found'].includes(
				file.replace(/\.(js|jsx|ts|tsx)$/, ''),
			)
		) {
			let route = path.join(basePath, file.replace(/\.(js|jsx|ts|tsx)$/, ''));

			// Normalize to forward slashes
			route = route.replace(/\\/g, '/');

			// Remove '/page' or '/index' suffix
			route = route.replace(/\/(index|page)$/, '');
			if (route === '' || route === 'page' || route === 'index') {
				route = ''; // Set to empty string
			}

			// Handle dynamic routes
			const dynamicSegments = route.match(/\[(.*?)\]/g);
			if (dynamicSegments) {
				dynamicSegments.forEach((segment) => {
					const paramName = segment.replace(/\[|\]/g, ''); // Remove brackets
					route = route.replace(segment, `:${paramName}`); // Replace [id] with :id
				});
				// Add a dynamic route
				routes.push(`${route}/`); // Ensure it ends with a slash
			} else {
				// Ensure the route starts with a slash and remove duplicate slashes
				route = `/${route}`.replace(/\/+/g, '/');
				routes.push(route);
			}
		}
	});

	return routes;
};
