import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/site-data'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: canonicalUrl('/sitemap.xml'),
  }
}
