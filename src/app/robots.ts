import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/private', '/.env'],
      crawlDelay: 1,
    },
    sitemap: 'https://choristercorner.com/sitemap.xml',
  };
}
