import type { MetadataRoute } from 'next';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/partners`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    ...routes.map((r) => ({ url: `${SITE_URL}/route/${r.id}`, changeFrequency: 'weekly' as const, priority: 0.9 }))
  ];
}
