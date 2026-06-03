import type { MetadataRoute } from 'next'
import { siteSettings } from '@/lib/site-data'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${siteSettings.canonicalUrl}/sitemap.xml`,
  }
}
