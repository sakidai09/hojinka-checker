import Link from 'next/link'
import { articles } from '@/lib/articles'

const SITE_LINKS = [
  { href: '/terms', label: '利用規約' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/about', label: 'このサイトについて' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 text-xs text-gray-500">
        <nav aria-label="記事">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            <Link href="/articles" className="hover:text-blue-600 transition-colors">
              法人化お役立ち記事
            </Link>
          </h2>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={a.href} className="text-blue-600 hover:text-blue-800 hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/calculation-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                計算根拠と前提条件
              </Link>
            </li>
          </ul>
        </nav>

        <p className="leading-relaxed">
          本ツールの計算結果は概算です。正確な税額・社会保険料や法人化の判断については、税理士・社会保険労務士などの専門家にご相談ください。
        </p>

        <nav aria-label="サイト情報">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gray-700 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-gray-400">
          © 合同会社GILOS / 法人化シミュレーター
          {process.env.NEXT_PUBLIC_APP_VERSION && <span className="ml-2">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>}
        </p>
      </div>
    </footer>
  )
}
