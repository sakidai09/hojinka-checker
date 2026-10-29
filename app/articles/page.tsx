import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import { ARTICLE_CATEGORIES, articles, formatDateJa } from '@/lib/articles'

export const metadata: Metadata = {
  title: '記事一覧｜法人化の判断・税金・社会保険・手続き | 法人化シミュレーター',
  description:
    '個人事業主の法人化に関する解説記事の一覧です。法人化のタイミング、税金と社会保険の比較、計算例、制度改正、設立手続きをカテゴリ別にまとめています。',
  alternates: { canonical: '/articles' },
}

export default function ArticlesIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }]} />
        <h1 className="text-xl font-bold text-gray-900 mb-2">記事一覧</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          法人化を検討している個人事業主・フリーランス向けの解説記事です。シミュレーターの結果を読み解く参考にしてください。
        </p>

        <div className="space-y-8">
          {ARTICLE_CATEGORIES.map((category) => {
            const items = articles.filter((a) => a.category === category)
            if (items.length === 0) return null
            return (
              <section key={category}>
                <h2 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">{category}</h2>
                <ul className="space-y-3">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={a.href}
                        className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition-colors"
                      >
                        <span className="block text-sm font-bold text-blue-700">{a.title}</span>
                        <span className="block mt-2 text-xs text-gray-600 leading-relaxed">{a.description}</span>
                        <span className="block mt-2 text-[11px] text-gray-400">
                          更新日: <time dateTime={a.updatedAt}>{formatDateJa(a.updatedAt)}</time>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm"
          >
            シミュレーターで試してみる
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
