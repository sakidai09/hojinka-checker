import Link from 'next/link'
import type { Metadata } from 'next'
import { compare } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'

export const metadata: Metadata = {
  title: '事業所得別・法人化の損益分岐表（2026年版） | 法人化シミュレーター',
  description:
    '2026年（令和8年）の基礎控除・給与所得控除と令和8年度の社会保険料率で、事業所得300万〜2,000万円の個人事業主と法人化後の年間負担を役員報酬の設定別に比較した早見表です。',
}

const EXPENSES = 1_000_000
const BLUE = 650_000

const baseInput: InputData = {
  revenue: 0,
  expenses: EXPENSES,
  blueFormDeduction: BLUE,
  familyWorkerSalary: 0,
  hasSpouse: false,
  dependents: 0,
  ideco: 0,
  age: 35,
  directorSalary: 0,
  industryTaxRate: 0.05,
  mortgageDeduction: 0,
  medicalExpenses: 0,
  lifeInsuranceDeduction: 0,
  earthquakeInsurance: 0,
  donationDeduction: 0,
  spouseDirectorSalary: 0,
}

// 事業所得（青色申告控除後）から売上を逆算する
const revenueFor = (businessIncome: number) => businessIncome + EXPENSES + BLUE

// 法人化後の利益（青色申告控除前）のうち、役員報酬として受け取る割合
const SALARY_PLANS = [
  { key: 'half', label: '利益の50%', ratio: 0.5 },
  { key: 'most', label: '利益の80%', ratio: 0.8 },
] as const

const INCOMES = [3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(v => v * 1_000_000)

const man = (n: number) => `${Math.round(n / 10_000).toLocaleString('ja-JP')}万円`
const signedMan = (n: number) => `${n >= 0 ? '+' : '−'}${Math.round(Math.abs(n) / 10_000).toLocaleString('ja-JP')}万円`

function salaryFor(businessIncome: number, ratio: number) {
  // 法人では青色申告特別控除がないため、控除前の利益を基準にする
  const profit = businessIncome + BLUE
  return Math.round((profit * ratio) / 120_000) * 120_000 // 月1万円単位
}

function row(businessIncome: number, family: Partial<InputData>) {
  const plans = SALARY_PLANS.map(p => {
    const salary = salaryFor(businessIncome, p.ratio)
    const r = compare({ ...baseInput, ...family, revenue: revenueFor(businessIncome), directorSalary: salary })
    return { ...p, salary, savings: r.savings, retained: r.corporation.corporate.income - r.corporation.corporate.total, individual: r.individual.total }
  })
  return { businessIncome, individual: plans[0].individual, plans }
}

// 標準報酬の等級や控除の段差で負担差は上下するため、
// 「それ以上の所得では負担差がずっとプラス」になる事業所得（10万円単位）を求める
const BREAK_EVEN_MIN = 1_000_000
function breakEven(ratio: number, family: Partial<InputData>): number | null {
  let lowest: number | null = null
  for (let bi = 30_000_000; bi >= BREAK_EVEN_MIN; bi -= 100_000) {
    const r = compare({
      ...baseInput,
      ...family,
      revenue: revenueFor(bi),
      directorSalary: salaryFor(bi, ratio),
    })
    if (r.savings < 0) break
    lowest = bi
  }
  return lowest
}

const FAMILIES = [
  { key: 'single', title: '単身（35歳・扶養なし）', input: {} },
  { key: 'family', title: '配偶者＋子1人（35歳・配偶者は収入なし）', input: { hasSpouse: true, dependents: 1 } },
]

function Table({ family }: { family: Partial<InputData> }) {
  const rows = INCOMES.map(bi => row(bi, family))
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-2 text-left">事業所得</th>
            <th className="border border-gray-300 px-2 py-2 text-right">個人の年間負担</th>
            {SALARY_PLANS.map(p => (
              <th key={p.key} className="border border-gray-300 px-2 py-2 text-right">
                報酬＝{p.label}
                <br />
                <span className="font-normal text-gray-500">報酬額 / 負担差</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.businessIncome}>
              <td className="border border-gray-300 px-2 py-2 font-medium">{man(r.businessIncome)}</td>
              <td className="border border-gray-300 px-2 py-2 text-right">{man(r.individual)}</td>
              {r.plans.map(p => (
                <td key={p.key} className="border border-gray-300 px-2 py-2 text-right">
                  {man(p.salary)}
                  <br />
                  <span className={p.savings >= 0 ? 'text-green-700 font-bold' : 'text-red-600'}>
                    {signedMan(p.savings)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function BreakEvenTableArticle() {
  const breakEvens = FAMILIES.map(f => ({
    title: f.title,
    values: SALARY_PLANS.map(p => ({ label: p.label, value: breakEven(p.ratio, f.input) })),
  }))
  const example = row(8_000_000, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('break-even-table')!.title, href: '/articles/break-even-table' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">事業所得別・法人化の損益分岐表（2026年版）</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年10月29日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              計算根拠と前提条件
            </Link>
          </p>

          <p>
            「事業所得がいくらになったら法人化すべきか」は、役員報酬をいくらに設定するか、家族構成はどうかで大きく変わります。
            この表は、当サイトのシミュレーターと同じ計算モデルで、事業所得300万円〜2,000万円の個人事業主が法人化した場合の
            <strong>税金・社会保険料の年間負担差</strong>を一覧にしたものです。数値はページ表示時に計算モデルから直接生成しており、
            計算モデルを更新すると表も自動的に更新されます。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">この表の前提</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>税制は2026年（令和8年）分の所得税（基礎控除104万円〜62万円、給与所得控除の最低保障74万円）と住民税</li>
              <li>社会保険は協会けんぽ東京の令和8年度料率（健康保険9.85%、子ども・子育て支援金0.23%）と厚生年金18.3%</li>
              <li>国民健康保険は東京23区（新宿区）の令和8年度料率、国民年金は月額17,920円</li>
              <li>経費100万円、青色申告特別控除65万円、個人事業税率5%、35歳（介護保険料なし）</li>
              <li>法人化後は、青色申告特別控除前の利益（事業所得＋65万円）の50%または80%を役員報酬にする</li>
              <li>税理士報酬・設立費用・消費税は含まない（後述）</li>
            </ul>
            <p className="mt-2">
              「負担差」は<strong>個人事業主の年間負担 − 法人化後の年間負担</strong>です。プラスなら法人化したほうが税・社会保険料の合計が少ないことを示します。
            </p>
          </section>

          {FAMILIES.map(f => (
            <section key={f.key}>
              <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">早見表：{f.title}</h2>
              <Table family={f.input} />
            </section>
          ))}

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">負担差がプラスに転じる事業所得の目安</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">家族構成</th>
                    {SALARY_PLANS.map(p => (
                      <th key={p.key} className="border border-gray-300 px-3 py-2 text-right">報酬＝{p.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {breakEvens.map(b => (
                    <tr key={b.title}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">{b.title}</td>
                      {b.values.map(v => (
                        <td key={v.label} className="border border-gray-300 px-3 py-2 text-right">
                          {v.value === null
                            ? '3,000万円超'
                            : v.value === BREAK_EVEN_MIN
                              ? '100万円以下から'
                              : `${man(v.value)}〜`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              目安は「その金額以上なら、表の前提で負担差がずっとプラスになる事業所得」です。標準報酬月額の等級や基礎控除の段差があるため、
              負担差は所得に対してなめらかには増えず、分岐点付近ではプラスとマイナスを行き来することがあります。
            </p>
            <p className="mt-2">
              よく言われる「所得500万〜800万円が法人化の目安」は、役員報酬の設定や家族構成によって前後します。
              配偶者がいる場合、個人事業主のままだと配偶者も国民年金（年215,040円）と国民健康保険の均等割を負担しますが、
              法人化して代表者の社会保険の扶養に入れば、その分の保険料がかかりません。家族がいる世帯ほど分岐点が下がりやすいのはこのためです。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">表の読み方：事業所得800万円（単身）の例</h2>
            <p>
              事業所得800万円の単身者の場合、個人事業主のままの年間負担は約{man(example.individual)}です。
              {example.plans.map(p => (
                <span key={p.key}>
                  役員報酬を{p.label}（{man(p.salary)}）にすると負担差は{signedMan(p.savings)}、
                  法人に税引後で残る利益は約{man(Math.max(0, p.retained))}です。
                </span>
              ))}
            </p>
            <p className="mt-2">
              役員報酬を低くすると負担差は大きくなりやすい一方、そのお金は会社に残るため、個人が自由に使えるお金ではありません。
              会社に残した利益を後から配当や退職金で受け取る場合には、その時点で別途税金がかかります。
              「負担差が最大になる報酬」が、そのまま「手取りが最大になる報酬」とは限らない点に注意してください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">表に含まれていない費用と注意点</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>法人の維持費：</strong>税理士報酬、会計ソフト、法人口座などの追加費用。負担差からこれらを差し引いて判断します（
                <Link href="/examples" className="text-blue-600 hover:underline">計算例ページ</Link>
                で考え方を解説しています）。
              </li>
              <li><strong>設立費用：</strong>合同会社か株式会社かで異なります。手続きは<Link href="/articles/procedure" className="text-blue-600 hover:underline">法人化の手続きガイド</Link>を参照してください。</li>
              <li><strong>消費税：</strong>インボイス登録の有無や課税売上高によって変わるため、表には含めていません。</li>
              <li><strong>国民健康保険の地域差：</strong>国保の料率は市区町村ごとに異なり、地域によっては表より負担差が数万円〜十数万円変わります。</li>
              <li><strong>役員報酬の変更制限：</strong>役員報酬は原則として事業年度の途中で自由に変更できません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">自分の数字で確認する</h2>
            <p>
              この表は典型的な前提での目安です。経費、iDeCo、住宅ローン控除、配偶者役員報酬などを入れると結果は変わります。
              ご自身の数字で確認するには<Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>をご利用ください。
              2026年の制度変更が損益分岐点に与える影響は
              <Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の税制・社会保険の変更点</Link>
              で解説しています。
            </p>
            <p className="mt-2 text-xs text-gray-500">
              本ページは一般的な情報提供を目的とした概算であり、個別の税務助言ではありません。法人設立や申告の判断は税理士等の専門家にご相談ください。
            </p>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="break-even-table" />
      </main>

      <SiteFooter />
    </div>
  )
}
