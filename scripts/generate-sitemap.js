const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://91bblili.com';
  const customUrls = []; // Root URL

  const getRoutesFromDir = (dir, basePath = '') => {
    const files = fs.readdirSync(dir);
    let routes = [];

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        routes = routes.concat(getRoutesFromDir(filePath, path.join(basePath, file)));
      } else if (
        (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
        !['layout', 'not-found'].includes(file.replace(/\.(js|jsx|ts|tsx)$/, ''))
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
          dynamicSegments.forEach(segment => {
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

  const dynamicRoutes = getRoutesFromDir(path.join(__dirname, '../src/app'));

  const allUrls = [...customUrls, ...dynamicRoutes];

  // Generate sitemap XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:xhtml="http://www.w3.org/1999/xhtml" 
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
            xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${allUrls.map(url => {
    // Ensure the URL is correctly formatted
    const fullUrl = `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
    return `
          <url>
            <loc>${fullUrl}</loc>
          </url>
        `;
  }).join('')}
    </urlset>`;

  const publicPath = path.join(__dirname, '../public', 'sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent.trim());
}

// Execute the function
generateSitemap().catch(err => console.error(err));