const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://91bblili.com';
  const locales = ['en', 'tc'];
  const urls = [
    '/',
    '/posts',
    '/posts/main',
    '/posts/main/track',
    '/posts/dynamic/:dynamicId',
    '/social',
    '/social/local',
    '/social/profile/:profileId',
    '/vendor',
    '/vendor/category/:category',
    '/vendor/goods/:goodsId',
    '/vendor/sheet/:goodsId/:buyType',
    '/profile',
    '/profile/setInfo',
    '/profile/vip',
    '/profile/vip/common',
    '/profile/vip/sex',
    '/profile/vip/video',
    '/profile/edit',
    '/profile/payment',
    '/profile/transfer',
    '/profile/record',
    '/profile/bundle',
    '/profile/bundle/coupon',
    '/profile/bundle/gift',
    '/profile/payment_record',
    '/profile/share',
    '/profile/switchLanguage',
    '/profile/collect',
    '/profile/collect/comic',
    '/profile/collect/anime',
    '/profile/collect/video',
    '/profile/collect/novel',
    '/profile/collect/photo',
    '/profile/mission',
    '/profile/myorder',
    '/profile/myorderDetail/:orderId',
    '/profile/watch_history',
    '/profile/watch_history/anime',
    '/profile/watch_history/comic',
    '/profile/purchase_record',
    '/profile/purchase_record/comic',
    '/profile/purchase_record/anime',
    '/profile/purchase_record/video',
    '/profile/purchase_record/novel',
    '/profile/purchase_record/photo',
    '/profile/purchase_record/social',
    '/profile/feedback',
    '/login',
    '/login/other/:loginType',
    '/login/recoverPassword',
    '/login/resetPassword',
    '/login/signup',
    '/notice',
    '/notice/:noticeId',
    '/home',
    '/home/games',
    '/home/search',
    '/home/search/result/:search',
    '/home/search/result/:search/SAC',
    '/home/search/result/:search/SAV',
    '/home/search/result/:search/SV',
    '/home/search/result/:search/SX',
    '/home/search/result/:search/ST',
    '/home/video',
    '/home/video/:videoId',
    '/home/anime',
    '/home/anime/:animeId/:animeEp',
    '/home/comic',
    '/home/comic/:comicId',
    '/home/comic/:comicId/:ep',
    '/home/novelsContent/:novelId',
    '/home/novels/:category',
    '/home/photos/:category',
    '/home/photosContent/:photoId',
    '/home/category/leaderboard',
    '/home/category/:tab',
    '/home/label/:type/:label',
    '/home/main',
    '/home/main/novels',
    '/home/main/photos',
    '/home/main/streams',
    '/home/main/videos',
    '/home/main/404',
  ];

  // Generate sitemap XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:xhtml="http://www.w3.org/1999/xhtml" 
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
            xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${locales
        .flatMap(locale =>
          urls.map(url => `
          <url>
            <loc>${baseUrl}/${locale}${url}</loc>
          </url>
        `)
        )
        .join('')}
    </urlset>`;


  // Write the sitemap to the public folder
  const publicPath = path.join(__dirname, '../public', 'sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent.trim());
}

// Execute the function
generateSitemap().catch(err => console.error(err));