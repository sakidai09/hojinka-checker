import type { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

const baseUrl = 'https://hojinka-checker.com'

// 静的ページの最終更新日（内容を更新したときにここも更新する）
const staticPages: { path: string; updatedAt: string; changeFrequency: 'monthly' | 'yearly'; priority: number }[] = [
  { path: '', updatedAt: '2026-10-29', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/articles', updatedAt: '2026-10-29', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/calculation-policy', updatedAt: '2026-10-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', updatedAt: '2026-04-20', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/terms', updatedAt: '2026-04-10', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', updatedAt: '2026-04-20', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/contact', updatedAt: '2026-04-10', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((p) => ({
      url: `${baseUrl}${p.path}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...articles.map((a) => ({
      url: `${baseUrl}${a.href}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
