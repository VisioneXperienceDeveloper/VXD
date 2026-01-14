import { getPublishedPosts } from '@/lib/services/posts.service';
import { routing } from '@/i18n/routing';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const koreanPosts = await getPublishedPosts({ locale: 'ko' });
  const englishPosts = await getPublishedPosts({ locale: 'en' });
  const baseUrl = "https://www.visionexperiencedeveloper.com";
  const locales = routing.locales;

  // Generate home page entries for all locales
  const homePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Map post language to locale
  const getLocaleFromLanguage = (language?: string): string => {
    if (language === 'EN') return 'en';
    if (language === 'KR') return 'ko';
    return routing.defaultLocale; // fallback to default locale
  };

  // Generate blog post entries based on post's language
  const koreanBlogPosts = koreanPosts?.map((post) => ({
    url: `${baseUrl}/${getLocaleFromLanguage(post.language)}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  const englishBlogPosts = englishPosts?.map((post) => ({
    url: `${baseUrl}/${getLocaleFromLanguage(post.language)}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  return [
    // Root URL
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Localized home pages
    ...homePages,
    // Localized blog posts
    ...koreanBlogPosts,
    ...englishBlogPosts,
  ];
}
