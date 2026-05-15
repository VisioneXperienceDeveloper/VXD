import { MetadataRoute } from 'next';
import { routing } from '@/shared/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.visionexperiencedeveloper.com";
  const locales = routing.locales;

  // Generate page entries for all locales
  const pages = [
    '',
    '/about',
    '/projects',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const localizedPages = locales.flatMap((locale) => 
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );

  return [
    // Root URL
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Localized pages
    ...localizedPages,
  ];
}
