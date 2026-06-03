import type { MetadataRoute } from 'next'
import { issues, siteSettings } from '@/lib/site-data'
import { getPosts } from '@/lib/db'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/about', '/community', '/privacy-policy', '/terms-conditions', '/contact', '/signin', '/signup']

  return [
    ...staticPages.map((page) => ({
      url: `${siteSettings.canonicalUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    })),
    ...issues.map((issue) => ({
      url: `${siteSettings.canonicalUrl}/issues/${issue.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: issue.severity === 'Critical' ? 0.95 : 0.78,
    })),
    ...getPosts().map((post) => ({
      url: `${siteSettings.canonicalUrl}/posts/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'daily' as const,
      priority: 0.82,
    })),
  ]
}
