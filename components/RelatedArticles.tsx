import Link from 'next/link'
import { articles, formatDateJa } from '@/lib/articles'

type Props = {
  /** 現在のページの slug（一覧から除外する） */
  currentSlug?: string
  /** 表示件数の上限 */
  limit?: number
}

export default function RelatedArticles({ currentSlug, limit = 6 }: Props) {
  const current = articles.find((a) => a.slug === currentSlug)
  const others = articles.filter((a) => a.slug !== currentSlug)
  // 同じカテゴリの記事を先に並べる
  const sorted = current
    ? [...others.filter((a) => a.category === current.category), ...others.filter((a) => a.category !== current.category)]
    : others
  const items = sorted.slice(0, limit)

  if (items.length === 0) return null

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-3">関連記事</h2>
      <ul className="divide-y divide-gray-100">
        {items.map((a) => (
          <li key={a.slug} className="py-3 first:pt-0 last:pb-0">
            <Link href={a.href} className="block group">
              <span className="text-[11px] text-gray-500">{a.category}</span>
              <span className="block text-sm text-blue-600 group-hover:text-blue-800 group-hover:underline">
                {a.title}
              </span>
              <span className="block text-[11px] text-gray-400 mt-0.5">更新日: {formatDateJa(a.updatedAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-xs">
        <Link href="/articles" className="text-blue-600 hover:underline">
          記事一覧を見る
        </Link>
      </p>
    </section>
  )
}
