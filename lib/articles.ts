// サイト内の記事・解説ページの一覧（ナビゲーション・サイトマップ・関連記事の唯一の情報源）
// 日付は各ページに表示している「最終更新日」と、公開日（git の初回追加日）に合わせる。

export type ArticleCategory = '法人化の判断' | '税金・社会保険' | '手続き' | '計算例・データ' | '制度改正'

export type Article = {
  slug: string
  href: string
  title: string
  description: string
  category: ArticleCategory
  /** YYYY-MM-DD */
  publishedAt: string
  /** YYYY-MM-DD */
  updatedAt: string
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  '法人化の判断',
  '税金・社会保険',
  '計算例・データ',
  '制度改正',
  '手続き',
]

export const articles: Article[] = [
  {
    slug: 'timing',
    href: '/articles/timing',
    title: '法人化のベストタイミングとは？判断基準を徹底解説',
    description:
      '個人事業主が法人化すべきタイミングを、売上・所得・消費税の観点から解説。課税所得500万円〜800万円が目安とされる理由や、消費税の免税メリットも紹介します。',
    category: '法人化の判断',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-20',
  },
  {
    slug: 'micro-corp',
    href: '/articles/micro-corp',
    title: 'マイクロ法人とは？個人事業主との二刀流で社会保険料を最適化',
    description:
      'マイクロ法人（ひとり法人）の仕組みと、個人事業主との併用による社会保険料の最適化戦略を解説。メリット・デメリット・注意点をまとめました。',
    category: '法人化の判断',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-20',
  },
  {
    slug: 'tax-comparison',
    href: '/articles/tax-comparison',
    title: '個人事業主と法人の税金を徹底比較｜どちらが得？',
    description:
      '所得税vs法人税、住民税、事業税、消費税の違いを個人事業主と法人で比較。累進課税と法人税率の仕組みを分かりやすく解説します。',
    category: '税金・社会保険',
    publishedAt: '2026-04-10',
    updatedAt: '2026-10-29',
  },
  {
    slug: 'social-insurance',
    href: '/articles/social-insurance',
    title: '個人事業主と法人の社会保険を比較｜国保vs社保の違い',
    description:
      '国民健康保険と健康保険（社会保険）の違い、国民年金と厚生年金の比較を解説。法人化で社会保険料はどう変わるのか、メリット・デメリットをまとめました。',
    category: '税金・社会保険',
    publishedAt: '2026-04-10',
    updatedAt: '2026-10-29',
  },
  {
    slug: 'examples',
    href: '/examples',
    title: '法人化の計算例と結果の読み方',
    description: '売上・経費・役員報酬を変えた3ケースを現行モデルで比較。維持費を含めた判断方法も解説します。',
    category: '計算例・データ',
    publishedAt: '2026-10-10',
    updatedAt: '2026-10-29',
  },
  {
    slug: 'break-even-table',
    href: '/articles/break-even-table',
    title: '事業所得別・法人化の損益分岐表（2026年版）',
    description:
      '事業所得の金額ごとに個人事業主と法人化後の税金・社会保険料の負担を一覧で比べ、どのあたりから法人化が有利になるかの目安を示します。',
    category: '計算例・データ',
    publishedAt: '2026-10-29',
    updatedAt: '2026-10-29',
  },
  {
    slug: '2026-changes',
    href: '/articles/2026-changes',
    title: '2026年（令和8年）の税制・社会保険の変更点と法人化への影響',
    description:
      '2026年（令和8年）に適用される税制改正や社会保険料率の変更点を整理し、個人事業主の法人化の判断にどう影響するかを解説します。',
    category: '制度改正',
    publishedAt: '2026-10-29',
    updatedAt: '2026-10-29',
  },
  {
    slug: 'procedure',
    href: '/articles/procedure',
    title: '法人化の手続きガイド｜設立までの流れと必要書類',
    description:
      '個人事業主が法人化する際の手続きを、株式会社・合同会社それぞれのステップで解説。定款作成から登記申請、届出までの流れと費用をまとめました。',
    category: '手続き',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-20',
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function formatDateJa(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${y}年${m}月${d}日`
}
