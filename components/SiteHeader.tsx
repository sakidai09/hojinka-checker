import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { href: '/', label: 'シミュレーター' },
  { href: '/articles', label: '記事一覧' },
  { href: '/examples', label: '計算例' },
  { href: '/calculation-policy', label: '計算根拠' },
  { href: '/about', label: '運営者情報' },
]

type Props = {
  /** ロゴ下に差し込む任意の要素（トップページのキャッチコピーなど） */
  children?: ReactNode
}

export default function SiteHeader({ children }: Props) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-lg mx-auto px-4 py-3 space-y-2">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image
            src="/logo.png"
            alt="法人化シミュレーター ロゴ"
            width={28}
            height={28}
            className="object-contain"
            priority
          />
          <span className="text-base font-bold text-gray-900">法人化シミュレーター</span>
        </Link>
        {children}
        <nav aria-label="サイトメニュー">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
