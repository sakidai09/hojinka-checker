import Link from 'next/link'

const BASE_URL = 'https://hojinka-checker.com'

export type Crumb = { name: string; href: string }

type Props = {
  /** トップ（ホーム）は自動で先頭に付く。最後の要素が現在ページ */
  items: Crumb[]
}

export default function Breadcrumbs({ items }: Props) {
  const all: Crumb[] = [{ name: 'ホーム', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.href === '/' ? '' : c.href}`,
    })),
  }

  return (
    <nav aria-label="パンくずリスト" className="mb-4 text-xs text-gray-500">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {all.map((c, i) => {
          const isLast = i === all.length - 1
          return (
            <li key={c.href} className="flex items-center gap-1 min-w-0">
              {isLast ? (
                <span aria-current="page" className="text-gray-700 break-all">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-blue-600 transition-colors">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </nav>
  )
}
