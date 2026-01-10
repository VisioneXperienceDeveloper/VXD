import { getPublishedPosts } from '@/lib/notion';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const baseUrl = "https://www.visionexperiencedeveloper.com";

  const blogPosts = posts?.map((post) => ({
    url: `${baseUrl}/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogPosts,
  ];
}
