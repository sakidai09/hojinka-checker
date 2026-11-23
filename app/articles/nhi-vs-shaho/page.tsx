import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { calcIndividual, calcCorporate } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'

const SLUG = 'nhi-vs-shaho'
const TITLE = '国民健康保険と社会保険の負担を所得別に比較（2026年度・東京23区）'

export const metadata: Metadata = {
  title: `${TITLE} | 法人化シミュレーター`,
  description:
    '所得200万〜2,000万円で、個人事業主の国民健康保険・国民年金と、法人役員の健康保険・厚生年金（本人負担／本人＋会社負担）を、単身35歳・単身45歳・夫婦＋子1人の3パターンで比較した早見表です。国保の上限113万円に達する所得、標準報酬の上限、地域差や軽減制度の注意点も解説します。',
}

// ===== 計算の前提 =====
// 個人事業主側: 経費・青色申告特別控除を0にして売上＝事業所得とし、表の「所得」がそのまま国保の基準になる所得になるようにする
// 法人側: 役員報酬（額面）を表の「所得」と同額にする
const baseInput: InputData = {
  revenue: 0,
  expenses: 0,
  blueFormDeduction: 0,
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

const INCOMES = [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000].map(v => v * 10_000)

const FAMILIES = [
  { key: 'single35', title: '単身・35歳', note: '介護保険料なし', input: { age: 35 } },
  { key: 'single45', title: '単身・45歳', note: '介護保険料あり（40〜64歳）', input: { age: 45 } },
  {
    key: 'family',
    title: '夫婦＋子1人・35歳',
    note: '配偶者は収入なし',
    input: { age: 35, hasSpouse: true, dependents: 1 },
  },
] as const

// 標準報酬月額の上限（lib/taxCalculations.ts の等級表と同じ値）と、その等級に入る報酬月額の下限
// 健康保険: 第50等級 139万円（133万円と139万円の中間 136万円以上）
// 厚生年金: 第32等級 65万円（62万円と65万円の中間 63.5万円以上）
const HEALTH_STD_CAP = 1_390_000
const HEALTH_CAP_MONTHLY = (1_330_000 + 1_390_000) / 2
const PENSION_STD_CAP = 650_000
const PENSION_CAP_MONTHLY = (620_000 + 650_000) / 2

// 新宿区「保険料の減免について」（令和8年度）: 均等割2割軽減の基準 = 43万円 + 57万円 × 被保険者数（給与・年金所得者がいない場合）
const REDUCTION_20_BASE = 430_000
const REDUCTION_20_PER_PERSON = 570_000

type Family = Partial<InputData>

function burden(income: number, family: Family) {
  const ind = calcIndividual({ ...baseInput, ...family, revenue: income })
  const corp = calcCorporate({ ...baseInput, ...family, revenue: income, directorSalary: income })
  const employee = corp.director.socialInsurance
  const both = employee + corp.socialInsuranceEmployer
  return {
    income,
    nhi: ind.nhi,
    pension: ind.pension,
    individual: ind.nhi + ind.pension,
    employee,
    both,
  }
}

const STEP = 10_000
const SCAN_MAX = 30_000_000

// 国保が上限額に達する最小の所得（1万円単位）
function nhiCap(family: Family) {
  const max = calcIndividual({ ...baseInput, ...family, revenue: 100_000_000 }).nhi
  let at = SCAN_MAX
  for (let x = 0; x <= SCAN_MAX; x += STEP) {
    if (calcIndividual({ ...baseInput, ...family, revenue: x }).nhi >= max) {
      at = x
      break
    }
  }
  return { max, at }
}

// 「それ以上の所得では、ずっと社保（key）が国保＋国民年金を上回る」最小の所得（10万円単位）
function crossover(family: Family, key: 'employee' | 'both'): number | null {
  let lowest: number | null = null
  for (let x = 20_000_000; x >= 500_000; x -= 100_000) {
    const r = burden(x, family)
    if (r[key] <= r.individual) break
    lowest = x
  }
  return lowest
}

const man = (n: number) => `${(Math.round(n / 1_000) / 10).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円`
const manInt = (n: number) => `${Math.round(n / 10_000).toLocaleString('ja-JP')}万円`
const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`
const signedMan = (n: number) => `${n >= 0 ? '+' : '−'}${man(Math.abs(n))}`

const th = 'border border-gray-300 px-2 py-2'
const td = 'border border-gray-300 px-2 py-2'

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function Calc({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs leading-relaxed space-y-1">
      {children}
    </div>
  )
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
      {children}
    </a>
  )
}

function Table({ family }: { family: Family }) {
  const rows = INCOMES.map(x => burden(x, family))
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-3">
        <thead>
          <tr className="bg-gray-100">
            <th className={`${th} text-left`}>
              所得
              <br />
              <span className="font-normal text-gray-500">＝役員報酬</span>
            </th>
            <th className={`${th} text-right`}>
              個人事業主
              <br />
              <span className="font-normal text-gray-500">国保＋国民年金</span>
            </th>
            <th className={`${th} text-right`}>
              法人役員
              <br />
              <span className="font-normal text-gray-500">本人負担</span>
            </th>
            <th className={`${th} text-right`}>
              法人役員
              <br />
              <span className="font-normal text-gray-500">本人＋会社</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.income}>
              <td className={`${td} font-medium`}>{manInt(r.income)}</td>
              <td className={`${td} text-right`}>
                <span className="font-bold">{man(r.individual)}</span>
                <br />
                <span className="text-gray-500">
                  国保{man(r.nhi)}
                  <br />
                  年金{man(r.pension)}
                </span>
              </td>
              <td className={`${td} text-right`}>
                {man(r.employee)}
                <br />
                <span className={r.employee > r.individual ? 'text-red-600' : 'text-green-700'}>
                  {signedMan(r.employee - r.individual)}
                </span>
              </td>
              <td className={`${td} text-right`}>
                {man(r.both)}
                <br />
                <span className={r.both > r.individual ? 'text-red-600' : 'text-green-700'}>
                  {signedMan(r.both - r.individual)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function NhiVsShahoArticle() {
  const caps = FAMILIES.map(f => ({ ...f, cap: nhiCap(f.input) }))
  const crosses = FAMILIES.map(f => ({
    ...f,
    employee: crossover(f.input, 'employee'),
    both: crossover(f.input, 'both'),
  }))

  const ex = burden(6_000_000, { age: 35 })
  const exFamily = burden(6_000_000, { age: 35, hasSpouse: true, dependents: 1 })
  const top = burden(20_000_000, { age: 35 })
  const exHealthCapSalary = HEALTH_CAP_MONTHLY * 12
  const exPensionCapSalary = PENSION_CAP_MONTHLY * 12
  const reduction20Family = REDUCTION_20_BASE + REDUCTION_20_PER_PERSON * 3
  const reduction20Single = REDUCTION_20_BASE + REDUCTION_20_PER_PERSON

  const crossText = (v: number | null) => (v === null ? '2,000万円まで逆転しない' : v === 500_000 ? '50万円以下から' : `${manInt(v)}〜`)

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle(SLUG)!.title, href: `/articles/${SLUG}` }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">{TITLE}</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              計算根拠と前提条件
            </Link>
          </p>

          <p>
            法人化を考えるとき、多くの人が気にするのが「国民健康保険（国保）と国民年金」から「健康保険と厚生年金（いわゆる社会保険・社保）」に切り替わると、
            保険料がいくら変わるのかという点です。このページでは、所得200万円〜2,000万円について、
            <strong>個人事業主の国保＋国民年金</strong>と、<strong>法人役員の健康保険＋厚生年金（本人負担／本人＋会社負担）</strong>を
            3つの家族構成で並べました。表の金額はすべて、当サイトのシミュレーターと同じ計算モデルでページ表示時に計算しています。
          </p>

          <section>
            <H2>先に結論</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>会社負担まで含めると、ほとんどの所得帯で社保のほうが重くなります。</strong>単身35歳では所得
                {crossText(crosses[0].both)}、ずっと社保（本人＋会社）が国保＋国民年金を上回ります。
              </li>
              <li>
                <strong>本人負担だけで比べると、所得が低〜中程度なら社保のほうが軽いか同程度</strong>です。本人負担が上回り続けるのは単身35歳で
                {crossText(crosses[0].employee)}、夫婦＋子1人で{crossText(crosses[2].employee)}です。
              </li>
              <li>
                国保は年{manInt(caps[0].cap.max)}（40〜64歳は{manInt(caps[1].cap.max)}）で頭打ちになり、
                単身ではおおむね所得{manInt(caps[0].cap.at)}で上限に達します。社保は標準報酬月額の上限（健康保険{manInt(HEALTH_STD_CAP)}・厚生年金
                {manInt(PENSION_STD_CAP)}）まで上がり続けるため、高所得ほど差が開きます。
              </li>
              <li>
                配偶者に収入がない世帯では、個人事業主のままだと配偶者の国民年金（年{yen(ex.pension)}）と国保の均等割がかかりますが、
                法人の社保では配偶者が被扶養者・第3号被保険者になり、この分の保険料はかかりません。
              </li>
              <li>
                社保の保険料が高いぶん、厚生年金の上乗せや傷病手当金などの給付があります。保険料の差だけで損得を決めないことが大切です（
                <Link href="/articles/social-insurance" className="text-blue-600 hover:underline">
                  社会保険の違いと給付の解説
                </Link>
                ）。
              </li>
            </ul>
          </section>

          <section>
            <H2>この表の前提</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>個人事業主：</strong>表の「所得」は国保の計算に使う所得（事業所得。青色申告特別控除などを引いた後）です。
                国保は新宿区の令和8年度料率、国民年金は月17,920円（年215,040円）。
              </li>
              <li>
                <strong>法人役員：</strong>表の「所得」と<strong>同じ金額を役員報酬（額面・年額）</strong>として毎月均等に受け取り、賞与はなしとします。
                健康保険は協会けんぽ東京の令和8年度料率（健康保険9.85%、子ども・子育て支援金0.23%、40〜64歳は介護保険1.62%を加算）、厚生年金18.3%。
                「本人＋会社」には会社だけが負担する子ども・子育て拠出金（0.36%）も含みます。
              </li>
              <li>
                <strong>夫婦＋子1人：</strong>配偶者は収入なし。個人事業主側では配偶者も国民年金（第1号）を納め、国保の均等割が3人分かかります。
                法人側では配偶者と子は代表者の健康保険の被扶養者、配偶者は国民年金の第3号被保険者になり、追加の保険料はかかりません。
              </li>
              <li>
                国保の低所得世帯向けの均等割軽減、未就学児の均等割軽減は計算に含めていません（後述）。
              </li>
            </ul>
            <p className="mt-2">
              「所得＝役員報酬」という置き方は、<strong>同じ金額を基準に保険料の仕組みだけを比べる</strong>ためのものです。
              実際に法人化すると、役員報酬は利益の一部に抑えることが多く、また同じ金額でも個人事業の「所得」と役員報酬の「額面」は意味が異なります
              （役員報酬からは給与所得控除が引かれます）。法人化全体の損得は
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">事業所得別・法人化の損益分岐表</Link>
              、役員報酬の決め方は
              <Link href="/articles/director-salary" className="text-blue-600 hover:underline">役員報酬の決め方</Link>
              を参照してください。
            </p>
          </section>

          {FAMILIES.map(f => (
            <section key={f.key}>
              <H2>
                早見表：{f.title}（{f.note}）
              </H2>
              <Table family={f.input} />
              <p className="mt-2 text-xs text-gray-500">
                法人役員の列の下段は「個人事業主の国保＋国民年金」との差です。赤字（＋）は社保のほうが重く、緑字（−）は社保のほうが軽いことを示します。
              </p>
            </section>
          ))}

          <section>
            <H2>表の読み方：所得600万円の例</H2>
            <p>単身35歳で所得600万円の場合、表の数字は次のように計算されています。</p>
            <Calc>
              <p>
                <strong>個人事業主：</strong>国保 {yen(ex.nhi)} ＋ 国民年金 {yen(ex.pension)} ＝ {yen(ex.individual)}
              </p>
              <p className="pl-3 text-gray-600">
                国保の所得割は「所得 − 43万円」に料率（医療7.51%・支援金2.80%・子ども・子育て支援金0.27%）を掛け、これに1人あたりの均等割を足します。
              </p>
              <p>
                <strong>法人役員（役員報酬600万円・月50万円）：</strong>本人負担 {yen(ex.employee)}、本人＋会社 {yen(ex.both)}
              </p>
              <p className="pl-3 text-gray-600">
                月50万円は標準報酬月額50万円の等級に当たり、健康保険（9.85%＋0.23%）と厚生年金（18.3%）を労使折半します。
              </p>
              <p>
                差：本人負担だけなら {signedMan(ex.employee - ex.individual)}、本人＋会社なら {signedMan(ex.both - ex.individual)}
              </p>
            </Calc>
            <p className="mt-2">
              同じ所得600万円でも夫婦＋子1人の世帯では、個人事業主の負担が{yen(exFamily.individual)}に増えます（配偶者の国民年金と、配偶者・子の均等割が加わるため）。
              一方、社保の本人負担は{yen(exFamily.employee)}で単身と変わりません。社保は「本人の報酬」だけで決まり、扶養家族が何人いても保険料が増えないためです。
              家族がいる世帯ほど、法人化で社会保険料の差が縮まりやすいのはこのためです。
            </p>
            <p className="mt-2">
              「本人負担」と「本人＋会社」のどちらで比べるべきかは、見る立場で変わります。一人社長の会社では、会社負担分も結局は自分の会社のお金から出ていくため、
              <strong>手元に残るお金で比べるなら「本人＋会社」</strong>で見るのが実態に近くなります。
              ただし会社負担分は法人の経費（損金）になるので、そのぶん法人税等は下がります。税金まで含めた比較はシミュレーターで確認できます。
            </p>
          </section>

          <section>
            <H2>国保の上限113万円に達する所得</H2>
            <p>
              国保は、医療分・後期高齢者支援金分・介護分・子ども・子育て支援金分のそれぞれに上限（賦課限度額）があります。新宿区の令和8年度は
              医療分67万円、支援金分26万円、介護分17万円、子ども・子育て支援金分3万円で、合計は40〜64歳で113万円、それ以外は96万円です。
              上限に達する所得を計算モデルで求めると次のとおりです。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={`${th} text-left`}>家族構成</th>
                    <th className={`${th} text-right`}>国保の上限額</th>
                    <th className={`${th} text-right`}>上限に達する所得</th>
                  </tr>
                </thead>
                <tbody>
                  {caps.map(c => (
                    <tr key={c.key}>
                      <td className={`${td} font-medium`}>{c.title}</td>
                      <td className={`${td} text-right`}>{man(c.cap.max)}</td>
                      <td className={`${td} text-right`}>約{manInt(c.cap.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              区分ごとに上限に届く所得は異なります。単身の場合、医療分は所得約870万円で上限に達し、最後に上限に届くのは料率の低い子ども・子育て支援金分です。
              この所得を超えると国保はそれ以上増えません。国民年金も定額なので、
              <strong>個人事業主の社会保険料は年{manInt(caps[0].cap.max + ex.pension)}前後（40〜64歳は{manInt(caps[1].cap.max + ex.pension)}前後）で頭打ち</strong>
              になります。介護分は上限が別枠なので、45歳の上限到達所得は35歳とほぼ同じになります。
            </p>
          </section>

          <section>
            <H2>社保の上限：健康保険{manInt(HEALTH_STD_CAP)}・厚生年金{manInt(PENSION_STD_CAP)}</H2>
            <p>
              健康保険・厚生年金の保険料は、毎月の報酬を区切りのよい「標準報酬月額」に当てはめて計算します。標準報酬月額には上限があり、
              当サイトの計算モデルでは健康保険が{manInt(HEALTH_STD_CAP)}（第50等級）、厚生年金が{manInt(PENSION_STD_CAP)}（第32等級）です。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                厚生年金が上限に達するのは報酬月額{manInt(PENSION_CAP_MONTHLY)}以上、年額でおよそ{manInt(exPensionCapSalary)}以上。これを超えると厚生年金保険料は増えません。
              </li>
              <li>
                健康保険が上限に達するのは報酬月額{manInt(HEALTH_CAP_MONTHLY)}以上、年額でおよそ{manInt(exHealthCapSalary)}以上です。
              </li>
            </ul>
            <p className="mt-2">
              つまり、国保が所得1,000万円台前半で頭打ちになるのに対し、健康保険は役員報酬1,600万円台まで上がり続けます。
              表の所得2,000万円（単身35歳）では、個人事業主が{man(top.individual)}、社保の本人負担が{man(top.employee)}、本人＋会社が{man(top.both)}と、
              差が最も大きくなります。
            </p>
            <p className="mt-2">
              なお、厚生年金の標準報酬月額の上限は、2025年の年金制度改正により2027年9月に68万円、2028年9月に71万円、2029年9月に75万円へ段階的に引き上げられる予定です。
              高めの役員報酬を設定する場合、2027年以降は厚生年金保険料が表より増える点に注意してください（そのぶん将来の厚生年金も増えます）。
            </p>
          </section>

          <section>
            <H2>社保が重くなる所得の目安</H2>
            <p>「その所得以上では、表の前提でずっと社保のほうが国保＋国民年金より重い」最小の所得（10万円単位）を家族構成別に求めました。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={`${th} text-left`}>家族構成</th>
                    <th className={`${th} text-right`}>本人負担で比べた場合</th>
                    <th className={`${th} text-right`}>本人＋会社で比べた場合</th>
                  </tr>
                </thead>
                <tbody>
                  {crosses.map(c => (
                    <tr key={c.key}>
                      <td className={`${td} font-medium`}>{c.title}</td>
                      <td className={`${td} text-right`}>{crossText(c.employee)}</td>
                      <td className={`${td} text-right`}>{crossText(c.both)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              標準報酬月額は段階的に決まるため、目安の付近では社保と国保の大小が入れ替わることがあります。
              会社負担を含めると、社保の保険料率は合計で約29%（健康保険9.85%＋子ども・子育て支援金0.23%＋厚生年金18.3%＋拠出金0.36%。40〜64歳は介護1.62%が加わり約30%）になります。
              国保の所得割は合計約10.6%（40〜64歳は約13%）なので、定額の国民年金を足しても、社保（本人＋会社）のほうが重くなりやすい構造です。
            </p>
          </section>

          <section>
            <H2>社保の保険料が高いぶん、何が受けられるか</H2>
            <p>社保は保険料が高い代わりに、国保・国民年金にはない給付があります。主なものは次のとおりです。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>厚生年金：</strong>老後に国民年金（老齢基礎年金）に加えて、報酬と加入期間に応じた老齢厚生年金を受け取れます。障害・遺族の保障も厚くなります。
              </li>
              <li>
                <strong>傷病手当金：</strong>協会けんぽでは、業務外の病気やけがで働けず給与が出ないとき、連続3日の待期の後、4日目から、
                標準報酬月額（直近12か月の平均）の30分の1の3分の2を1日分として、通算1年6か月まで受け取れます。
                ただし役員報酬が支払われ続けている間は支給されない（報酬が少ない場合は差額のみ）ため、一人社長は休業時に報酬をどうするかで受け取れるかが変わります。
              </li>
              <li>
                <strong>扶養：</strong>収入が一定以下の家族を、追加の保険料なしで被扶養者・第3号被保険者にできます。
              </li>
            </ul>
            <p className="mt-2">
              給付の比較は
              <Link href="/articles/social-insurance" className="text-blue-600 hover:underline">国民健康保険と社会保険の違い</Link>
              で詳しく解説しています。「保険料が高い＝損」と決めつけず、将来の年金や保障をどう評価するかも含めて判断してください。
            </p>
          </section>

          <section>
            <H2>国保の地域差について</H2>
            <p>
              国保の料率・均等割・上限額は<strong>市区町村ごとに異なります</strong>。この表は新宿区の令和8年度の料率で計算しており、
              東京23区の他の区や、他の市町村にお住まいの場合は国保の金額が表と変わります。一方、協会けんぽの健康保険料率は都道府県単位、
              厚生年金の料率は全国共通です。
            </p>
            <p className="mt-2">
              特に所得が低〜中程度の層では、均等割（1人あたりの定額部分）の大きさが自治体で違うため、家族の人数が多いほど地域差が出やすくなります。
              高所得層では多くの人が上限額に達するため、上限額の違いがそのまま差になります。
              お住まいの自治体の料率は、市区町村のホームページや保険料の通知で確認してください。東京23区については、東京都保健医療局が区ごとの保険料の一覧表を公表しています（出典参照）。
            </p>
          </section>

          <section>
            <H2>表と実際の金額がずれる主な理由</H2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>国保は前年の所得で決まる：</strong>令和8年度の国保料は、令和7年中の所得をもとに計算されます。
                開業したばかりの年や、所得が大きく増減した年は、表の「その年の所得」と実際の保険料の基準がずれます。
                一方、社保はその時点の役員報酬（標準報酬月額）をもとに決まるため、国保のような「前年所得とのずれ」は基本的に生じません。
              </li>
              <li>
                <strong>低所得世帯の均等割の軽減：</strong>前年の世帯の所得が一定以下だと、国保の均等割が7割・5割・2割軽減されます。
                新宿区の令和8年度の2割軽減の基準は、給与・年金所得者がいない世帯で「43万円＋57万円×加入者数」、単身なら{manInt(reduction20Single)}、
                3人世帯なら{manInt(reduction20Family)}以下です。<strong>表の夫婦＋子1人・所得200万円の行は、実際には2割軽減の対象になり得る</strong>ため、
                国保は表より少なくなる可能性があります。軽減を受けるには、所得がない家族も含めて申告が済んでいる必要があります。
              </li>
              <li>
                <strong>未就学児の均等割の軽減：</strong>未就学児の均等割は5割減額されます（申請不要）。表の子どもは未就学児かどうかを区別せず、軽減前で計算しています。
                また、子ども・子育て支援金分の均等割は18歳以上の加入者にかかる仕組みのため、表では本人と配偶者の2人分、子どもは18歳未満として計算しています。
              </li>
              <li>
                <strong>扶養の条件：</strong>健康保険の被扶養者になるには、年間収入130万円未満（60歳以上などは180万円未満）で、同居なら被保険者の収入の半分未満などの条件があります。
                配偶者にパート収入などがある場合は、表の「配偶者は収入なし」の前提が当てはまらないことがあります。
              </li>
              <li>
                <strong>年齢：</strong>表は35歳と45歳だけです。介護保険料がかかるのは40〜64歳で、それ以外の年齢や、年金を受け取る年齢に近い人は表の前提から外れます。
              </li>
            </ul>
          </section>

          <section>
            <H2>よくある誤解</H2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>「法人化すれば社会保険料は安くなる」：</strong>表のとおり、同じ金額で比べると社保（本人＋会社）は国保＋国民年金より重いのが普通です。
                法人化で社会保険料が下がるのは、役員報酬を事業の利益より低く設定して、保険料の基準になる金額そのものを小さくした場合です。
                その場合は法人に残った利益に法人税等がかかり、将来の厚生年金も報酬に応じて小さくなります。
              </li>
              <li>
                <strong>「本人負担だけ見れば社保のほうが得」：</strong>一人社長の会社では会社負担分も自分の会社のお金です。単身35歳・所得600万円の例では、
                本人負担だけなら差は{signedMan(ex.employee - ex.individual)}ですが、会社負担を含めると{signedMan(ex.both - ex.individual)}になります。
                従業員として会社に雇われている場合の感覚で「半分は会社持ち」と考えると、負担を小さく見積もってしまいます。
              </li>
              <li>
                <strong>「高所得なら国保のほうが必ず有利」：</strong>保険料だけを見れば、国保は上限があるため高所得ほど有利に見えます。
                ただし国民年金だけでは厚生年金の上乗せがなく、また国保の傷病手当金は、法律上「市町村が条例で定めた場合に支給できる」任意の給付にとどまります
                （協会けんぽでは全加入者向けの制度として設けられています）。保険料の差額で民間の保険や老後資金を自分で用意する必要がある点まで含めて比べるのが公平です。
              </li>
            </ul>
          </section>

          <section>
            <H2>判断のためのチェックリスト</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>比べているのは「本人負担」か「本人＋会社」か（一人社長なら後者が実態に近い）</li>
              <li>配偶者・子どもを社保の扶養に入れられるか（配偶者の収入は130万円未満か）</li>
              <li>自分の自治体の国保料率・上限額はいくらか（前年の所得で計算されているか）</li>
              <li>役員報酬を下げた場合、社保は下がるが、法人に残る利益に法人税がかかる点を考えたか</li>
              <li>厚生年金の上乗せ・傷病手当金を、保険料の増加に見合う価値と考えるか</li>
              <li>2027年9月以降の厚生年金の上限引上げが、自分の報酬水準に影響するか</li>
            </ul>
            <p className="mt-2">
              税金を含めた全体の損得は、
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              で自分の売上・経費・家族構成を入れて確認できます。2026年の制度変更については
              <Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の税制・社会保険の変更点</Link>
              、具体的な計算例は
              <Link href="/examples" className="text-blue-600 hover:underline">計算例ページ</Link>
              にまとめています。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-2 text-xs">
              <li>
                新宿区「保険料の計算方法について」（令和8年度の料率、算定基礎額、未就学児の均等割軽減）
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html">https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html</Ext>
              </li>
              <li>
                新宿区「保険料の減免について」（均等割の7割・5割・2割軽減と基準）
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_002030.html">https://www.city.shinjuku.lg.jp/hoken/hoken01_002030.html</Ext>
              </li>
              <li>
                新宿区「令和8年度国民健康保険料納入通知書についてのご案内」（令和7年中の所得に基づき算定）
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_002061.html">https://www.city.shinjuku.lg.jp/hoken/hoken01_002061.html</Ext>
              </li>
              <li>
                東京都保健医療局「令和8年度特別区国民健康保険料一覧表」
                <br />
                <Ext href="https://www.hokeniryo.metro.tokyo.lg.jp/documents/d/hokeniryo/tokubetuku202605-pdf">
                  https://www.hokeniryo.metro.tokyo.lg.jp/documents/d/hokeniryo/tokubetuku202605-pdf
                </Ext>
              </li>
              <li>
                全国健康保険協会（協会けんぽ） 令和8年度 都道府県単位保険料率
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08">
                  https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08
                </Ext>
              </li>
              <li>
                協会けんぽ「傷病手当金」
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/benefit/injury_and_sickness_allowance/index.html">
                  https://www.kyoukaikenpo.or.jp/benefit/injury_and_sickness_allowance/index.html
                </Ext>
              </li>
              <li>
                国民健康保険法 第58条（e-Gov法令検索）
                <br />
                <Ext href="https://laws.e-gov.go.jp/law/333AC0000000192">https://laws.e-gov.go.jp/law/333AC0000000192</Ext>
              </li>
              <li>
                日本年金機構「従業員が家族を被扶養者にするとき、被扶養者に異動があったときの手続き」（被扶養者の収入要件）
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20141202.html">
                  https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20141202.html
                </Ext>
              </li>
              <li>
                日本年金機構「国民年金第3号被保険者の保険料について」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kokunen/hokenryo/sango.html">https://www.nenkin.go.jp/service/kokunen/hokenryo/sango.html</Ext>
              </li>
              <li>
                日本年金機構 お知らせ（令和8年度の国民年金保険料）
                <br />
                <Ext href="https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html">
                  https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html
                </Ext>
              </li>
              <li>
                厚生労働省「厚生年金等の標準報酬月額の上限の段階的引上げについて」
                <br />
                <Ext href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000147284_00024.html">
                  https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000147284_00024.html
                </Ext>
              </li>
            </ul>
          </section>

          <p className="text-xs text-gray-500">
            本ページは一般的な情報提供を目的とした概算であり、個別の税務・社会保険の助言ではありません。実際の保険料はお住まいの自治体、加入する健康保険、
            前年の所得や家族の状況によって異なります。法人設立や役員報酬の判断は、税理士・社会保険労務士等の専門家にご相談ください。
          </p>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug={SLUG} />
      </main>

      <SiteFooter />
    </div>
  )
}
