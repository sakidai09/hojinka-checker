import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { compare, calcCorporate } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'

export const metadata: Metadata = {
  title: '個人事業主と法人の税金を徹底比較｜どちらが得？（2026年版） | 法人化シミュレーター',
  description:
    '事業所得400万・800万・1,500万円の3ケースで、個人事業主の所得税・住民税・個人事業税と、法人化後の役員の所得税・住民税、法人税・地方法人税・法人住民税・法人事業税を1行ずつ比較。差が生まれる理由と2026年の税率・制度を解説します。',
}

// ===== 計算の前提 =====
const EXPENSES = 1_000_000
const BLUE = 650_000
const INDUSTRY_RATE = 0.05

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
  industryTaxRate: INDUSTRY_RATE,
  mortgageDeduction: 0,
  medicalExpenses: 0,
  lifeInsuranceDeduction: 0,
  earthquakeInsurance: 0,
  donationDeduction: 0,
  spouseDirectorSalary: 0,
}

const INCOMES = [4_000_000, 8_000_000, 15_000_000]

const man = (n: number) => `${(Math.round(n / 1_000) / 10).toLocaleString('ja-JP')}万円`
const manShort = (n: number) => `${Math.round(n / 10_000).toLocaleString('ja-JP')}万円`
const signedMan = (n: number) => `${n >= 0 ? '+' : '−'}${(Math.round(Math.abs(n) / 1_000) / 10).toLocaleString('ja-JP')}万円`
const pct = (n: number) => `${(Math.round(n * 1000) / 10).toFixed(1)}%`

function buildCase(businessIncome: number) {
  // 法人では青色申告特別控除がないため、控除前の利益（事業所得＋65万円）の50%を役員報酬にする（月1万円単位）
  const profit = businessIncome + BLUE
  const salary = Math.round((profit * 0.5) / 120_000) * 120_000
  const r = compare({ ...baseInput, revenue: businessIncome + EXPENSES + BLUE, directorSalary: salary })
  const ind = r.individual
  const corp = r.corporation

  const businessTax = ind.businessTax
  const indTaxes = ind.incomeTax + ind.residentTax + businessTax
  const indTotal = indTaxes + ind.socialInsurance

  const corpTaxes = corp.director.incomeTax + corp.director.residentTax + corp.corporate.total
  const corpSocial = corp.director.socialInsurance + corp.socialInsuranceEmployer
  const corpTotal = corp.totalBurden

  return {
    businessIncome,
    profit,
    salary,
    ind: { ...ind, businessTax, taxes: indTaxes, total: indTotal },
    corp,
    corpTaxes,
    corpSocial,
    corpTotal,
    salaryDeduction: salary - corp.director.employmentIncome,
    retained: corp.corporate.income - corp.corporate.total,
    taxDiff: indTaxes - corpTaxes,
    socialDiff: ind.socialInsurance - corpSocial,
    diff: indTotal - corpTotal,
  }
}

// 法人の所得（役員報酬を払った後の利益）に対する税負担率（均等割を除く）
const CORP_INCOMES = [2_000_000, 4_000_000, 8_000_000, 15_000_000]
function corpRate(income: number) {
  const c = calcCorporate({ ...baseInput, revenue: income + EXPENSES, directorSalary: 0 }).corporate
  return { income, tax: c.total - 70_000, rate: (c.total - 70_000) / income }
}

// 防衛特別法人税がかかり始める所得の目安（法人税額が500万円を超える所得）
const DEFENSE_THRESHOLD_INCOME = 8_000_000 + (5_000_000 - 8_000_000 * 0.15) / 0.232

const thHead = 'border border-gray-300 px-2 py-2 text-left'
const thR = 'border border-gray-300 px-2 py-2 text-right'
const th = 'border border-gray-300 bg-gray-50 px-2 py-2 text-left font-normal'
const td = 'border border-gray-300 px-2 py-2'
const tdR = 'border border-gray-300 px-2 py-2 text-right'

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="font-bold text-gray-900 mt-4 mb-1">{children}</h3>
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
      {children}
    </a>
  )
}

const SOURCES = [
  { label: '国税庁 タックスアンサーNo.2260 所得税の税率', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm' },
  { label: '国税庁 タックスアンサーNo.1410 給与所得控除', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm' },
  { label: '国税庁 タックスアンサーNo.5759 法人税の税率', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5759.htm' },
  { label: '財務省 令和7年度税制改正（中小法人の軽減税率の特例の見直し・延長）', href: 'https://www.mof.go.jp/tax_policy/publication/brochure/zeisei2025/02.html' },
  { label: '国税庁 地方法人税の税率の改正のお知らせ', href: 'https://www.nta.go.jp/publication/pamph/hojin/chihou_hojin/01.htm' },
  { label: '国税庁 防衛特別法人税の納付について', href: 'https://www.nta.go.jp/taxes/nozei/bouei_noufu/index.htm' },
  { label: '国税庁 令和7年度 法人税関係法令の改正の概要（防衛特別法人税）', href: 'https://www.nta.go.jp/publication/pamph/hojin/kaisei_gaiyo2025/pdf/E.pdf' },
  { label: '東京都主税局 個人事業税', href: 'https://www.tax.metro.tokyo.lg.jp/kazei/kojin_ji.html' },
  { label: '東京都主税局 法人事業税・法人都民税（仕事と税金）', href: 'https://www.tax.metro.tokyo.lg.jp/shitsumon/work/a1' },
  { label: '東京都主税局 法人事業税の税率表', href: 'https://www.tax.metro.tokyo.lg.jp/documents/d/tax/img_houjinji_rate_table-1-' },
  { label: '東京都主税局 都民税均等割の税率表（第6号様式別表4の3 記載の手引）', href: 'https://www.tax.metro.tokyo.lg.jp/documents/d/tax/11_4_3b' },
  { label: '東京都主税局 特別法人事業税', href: 'https://www.tax.metro.tokyo.lg.jp/kazei/work/tokubetsu_houjin' },
  { label: '目黒区 令和6年度から森林環境税（国税）が導入されます', href: 'https://www.city.meguro.tokyo.jp/zeimu/kurashi/juuminzei/kaiseiten.html' },
  { label: '国税庁 タックスアンサーNo.1420 退職金を受け取ったとき（退職所得）', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm' },
  { label: '国税庁 タックスアンサーNo.1330 配当金を受け取ったとき（配当所得）', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1330.htm' },
  { label: '国税庁 タックスアンサーNo.2600 役員に社宅などを貸したとき', href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2600.htm' },
]

export default function TaxComparisonArticle() {
  const cases = INCOMES.map(buildCase)
  const mid = cases[1]
  const corpRates = CORP_INCOMES.map(corpRate)

  const rows: { label: string; ind: (c: (typeof cases)[number]) => number | null; corp: (c: (typeof cases)[number]) => number | null }[] = [
    { label: '所得税（復興特別所得税込み）', ind: c => c.ind.incomeTax, corp: c => c.corp.director.incomeTax },
    { label: '住民税（所得割＋均等割）', ind: c => c.ind.residentTax, corp: c => c.corp.director.residentTax },
    { label: '個人事業税', ind: c => c.ind.businessTax, corp: () => null },
    { label: '法人税＋地方法人税', ind: () => null, corp: c => c.corp.corporate.corporateTax },
    { label: '法人住民税（法人税割＋均等割）', ind: () => null, corp: c => c.corp.corporate.residentTax },
    { label: '法人事業税＋特別法人事業税', ind: () => null, corp: c => c.corp.corporate.businessTax },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('tax-comparison')!.title, href: '/articles/tax-comparison' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">個人事業主と法人の税金を徹底比較｜どちらが得？（2026年版）</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            「法人化すると税金が安くなる」と言われますが、何がどれだけ安くなるのかを税目ごとに見ないと、自分に当てはまるかは判断できません。
            この記事では、事業所得400万円・800万円・1,500万円の3ケースについて、個人事業主の税金と法人化後の税金を
            <strong>1行ずつ並べて</strong>比較し、差がどこから生まれるのかを分解します。数値はページ表示時に当サイトの計算モデル（2026年の制度）から直接計算しています。
          </p>

          <section>
            <H2>比較の前提</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>単身・35歳（介護保険料なし）・扶養なし、東京23区在住・本店も23区内</li>
              <li>経費100万円、青色申告特別控除65万円、個人事業税の税率5%（多くの業種がこの税率）</li>
              <li>法人化後は、青色申告特別控除前の利益（事業所得＋65万円）の50%を役員報酬にする（月1万円単位に丸め）</li>
              <li>法人は資本金1,000万円以下・従業者50人以下（法人住民税の均等割は年7万円）</li>
              <li>所得税・住民税は2026年分のルール（所得税の基礎控除104万〜62万円、給与所得控除の最低74万円）。社会保険料は令和8年度の料率（協会けんぽ東京・新宿区の国保）</li>
              <li>税理士報酬・設立費用・消費税・配当や退職金での受取りは含まない</li>
            </ul>
          </section>

          <section>
            <H2>税目ごとの比較表（年額）</H2>
            {cases.map(c => (
              <div key={c.businessIncome} className="mt-4">
                <H3>
                  事業所得{manShort(c.businessIncome)}（役員報酬{manShort(c.salary)}）
                </H3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className={thHead}>税目</th>
                        <th className={thR}>個人事業主</th>
                        <th className={thR}>法人化後</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => {
                        const a = row.ind(c)
                        const b = row.corp(c)
                        return (
                          <tr key={row.label}>
                            <th className={th}>{row.label}</th>
                            <td className={tdR}>{a === null ? '—' : man(a)}</td>
                            <td className={tdR}>{b === null ? '—' : man(b)}</td>
                          </tr>
                        )
                      })}
                      <tr className="font-bold">
                        <th className={th}>税金の合計</th>
                        <td className={tdR}>{man(c.ind.taxes)}</td>
                        <td className={tdR}>{man(c.corpTaxes)}</td>
                      </tr>
                      <tr>
                        <th className={th}>社会保険料（法人は本人＋会社負担）</th>
                        <td className={tdR}>{man(c.ind.socialInsurance)}</td>
                        <td className={tdR}>{man(c.corpSocial)}</td>
                      </tr>
                      <tr className="font-bold">
                        <th className={th}>税・社会保険料の総額</th>
                        <td className={tdR}>{man(c.ind.total)}</td>
                        <td className={tdR}>{man(c.corpTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  税金だけの差：
                  <span className={c.taxDiff >= 0 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{signedMan(c.taxDiff)}</span>
                  ／社会保険料の差：
                  <span className={c.socialDiff >= 0 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{signedMan(c.socialDiff)}</span>
                  ／総額の差：
                  <span className={c.diff >= 0 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{signedMan(c.diff)}</span>
                  （プラスは法人化後のほうが少ない）。法人に税引後で残る利益は約{manShort(Math.max(0, c.retained))}。
                </p>
              </div>
            ))}
            <p className="mt-3">
              事業所得{manShort(cases[0].businessIncome)}では、<strong>税金だけ</strong>で見ても法人化後のほうが
              {cases[0].taxDiff >= 0 ? '少なくなりますが、その差はわずかです' : `${man(-cases[0].taxDiff)}多くなります`}。
              個人のままでも所得税は低い税率の区分に収まっていて所得を分ける効果が小さい一方、法人側では法人の所得に2割強の法人税等と均等割7万円がかかるためです。
              事業所得{manShort(mid.businessIncome)}では税金が{signedMan(mid.taxDiff)}、{manShort(cases[2].businessIncome)}では{signedMan(cases[2].taxDiff)}と、
              所得が増えるほど法人化後の税金の少なさが際立ちます。一方で社会保険料は、事業所得{manShort(cases[0].businessIncome)}ではほぼ同じ（差{signedMan(cases[0].socialDiff)}）ですが、
              {manShort(mid.businessIncome)}では{man(-mid.socialDiff)}、{manShort(cases[2].businessIncome)}では{man(-cases[2].socialDiff)}法人化後のほうが多く、
              総額で見ると差は縮みます。「法人化で税金が下がる」かどうかは所得水準しだいで、「負担の総額が下がる」かどうかは社会保険料まで含めて見る必要があります（社会保険料の比較は
              <Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline">国民健康保険と社会保険の比較</Link>
              を参照）。
            </p>
            <p className="mt-2 text-xs text-gray-500">
              ※ 個人事業税は、青色申告特別控除を差し引く前の所得から事業主控除290万円を引いて計算しています（東京都主税局の説明による）。
              また、個人事業税は翌年に経費になりますが、この表では考慮していません。
            </p>
          </section>

          <section>
            <H2>差はどこから生まれるのか（事業所得{manShort(mid.businessIncome)}の例）</H2>
            <H3>① 給与所得控除：経費のように差し引ける枠が増える</H3>
            <p>
              役員報酬は給与なので、実際にかかった経費とは関係なく「給与所得控除」を差し引けます。役員報酬{manShort(mid.salary)}の場合の給与所得控除は
              <strong>{man(mid.salaryDeduction)}</strong>。法人側では役員報酬が全額経費になるため、同じお金に対して控除が二重に効くような形になります。
              役員本人の所得税・住民税が個人事業主のときより大きく下がる主な理由がこれです。
            </p>
            <H3>② 所得の分散：累進税率の高い部分を避けられる</H3>
            <p>
              個人事業主のままだと、所得税の課税所得は約{manShort(mid.ind.taxableIncome)}で、上積み部分には所得税20%（復興特別所得税込みで20.42%）＋住民税10%＋事業税5%がかかります。
              法人化後は、利益が「役員報酬{manShort(mid.salary)}」と「法人の所得{manShort(mid.corp.corporate.income)}」に分かれ、役員の課税所得は約
              {manShort(mid.corp.director.taxableIncome)}（所得税率5%の区分）、法人の所得には後述の中小法人向けの低い税率がかかります。
              1か所に集めると高い税率がかかる所得を、2か所に分けて低い税率の区分に収めるのが「所得分散」です。
            </p>
            <H3>③ 法人税率の低さ：所得800万円以下は軽減税率</H3>
            <p>
              中小法人の法人税は所得年800万円以下の部分が15%です。地方法人税・法人住民税・法人事業税を合わせても、法人の所得に対する負担率は次のとおりです（計算モデルで算出、均等割を除く）。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>法人の所得</th>
                    <th className={thR}>法人税等の合計</th>
                    <th className={thR}>負担率</th>
                  </tr>
                </thead>
                <tbody>
                  {corpRates.map(r => (
                    <tr key={r.income}>
                      <td className={td}>{manShort(r.income)}</td>
                      <td className={tdR}>{man(r.tax)}</td>
                      <td className={tdR}>{pct(r.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              個人事業主の上積み税率（所得税＋住民税＋事業税）は、課税所得330万円超で35%を超えます。法人の所得800万円までの負担率は{pct(corpRates[0].rate)}〜{pct(corpRates[2].rate)}程度なので、
              「個人の高い区分にかかるはずの利益を法人に残す」と税金が下がります。
            </p>
            <H3>④ 均等割：赤字でもかかる固定費</H3>
            <p>
              法人住民税の均等割（この前提で年7万円）は、利益がゼロや赤字でもかかります。所得が小さいほど負担率が上がる原因で、
              事業所得{manShort(cases[0].businessIncome)}のケースでは法人住民税{man(cases[0].corp.corporate.residentTax)}のうち7万円が均等割です。
              さらに法人化すると税理士報酬などの維持費もかかるため、損益分岐点は「税金だけの差」より高くなります（
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">損益分岐表</Link>
              ）。
            </p>
          </section>

          <section>
            <H2>個人事業主にかかる税金（2026年のルール）</H2>
            <H3>所得税：5%〜45%の累進税率</H3>
            <p>課税所得（所得から各種控除を引いた額）に応じて、次の速算表で計算します。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>課税所得</th>
                    <th className={thR}>税率</th>
                    <th className={thR}>控除額</th>
                    <th className={thR}>＋住民税10%</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['195万円未満', '5%', '0円', '15%'],
                    ['195万円以上330万円未満', '10%', '97,500円', '20%'],
                    ['330万円以上695万円未満', '20%', '427,500円', '30%'],
                    ['695万円以上900万円未満', '23%', '636,000円', '33%'],
                    ['900万円以上1,800万円未満', '33%', '1,536,000円', '43%'],
                    ['1,800万円以上4,000万円未満', '40%', '2,796,000円', '50%'],
                    ['4,000万円以上', '45%', '4,796,000円', '55%'],
                  ].map(r => (
                    <tr key={r[0]}>
                      <td className={td}>{r[0]}</td>
                      <td className={tdR}>{r[1]}</td>
                      <td className={tdR}>{r[2]}</td>
                      <td className={tdR}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              所得税額は「課税所得×税率−控除額」。これに<strong>復興特別所得税（所得税額の2.1%）</strong>が加わります。
              令和8年度税制改正で、2027年（令和9年）分以後は復興特別所得税の税率が下がる代わりに防衛特別所得税が創設されますが、国税庁によれば合計の税率は変わりません。
              なお、所得税の基礎控除は2026年分から合計所得489万円以下で104万円、655万円以下で67万円、2,350万円以下で62万円です（
              <Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の変更点</Link>
              ）。
            </p>
            <H3>住民税：所得割10%＋均等割</H3>
            <p>
              住民税の所得割は、課税所得（住民税の基礎控除は43万円）の10%（都道府県民税4%＋市区町村民税6%）です。これに均等割がかかり、東京23区では
              特別区民税3,000円＋都民税1,000円に、国税の森林環境税1,000円を合わせて年5,000円です。住民税は前年の所得に対して翌年に課税されるため、
              法人化した年の翌年は「前年の事業所得にかかる住民税」の支払いが残る点に注意してください。
            </p>
            <H3>個人事業税：事業主控除290万円、税率3〜5%</H3>
            <p>
              都道府県の税金です。東京都の場合、（事業所得＋青色申告特別控除−事業主控除290万円）×税率で計算し、
              青色申告特別控除は差し引けません。税率は物品販売業・飲食店業・製造業などの第1種事業と、医業・税理士業・理容業・美容業などの第3種事業の多くが5%、
              畜産業・水産業などの第2種事業が4%、あんま・マッサージ・はり・きゅう等の一部が3%です。法定の業種に当たらない仕事には課税されません。
              所得税の確定申告をすれば別途の申告は不要で、原則8月と11月に納めます。
            </p>
          </section>

          <section>
            <H2>法人にかかる税金（2026年のルール）</H2>
            <H3>法人税：中小法人は年800万円以下の部分が15%</H3>
            <p>
              資本金1億円以下の普通法人は、所得のうち年800万円以下の部分が15%、800万円を超える部分が23.2%です。
              この15%は租税特別措置法による特例で、令和7年度税制改正により見直しのうえ<strong>令和8年度末（2027年3月31日までに開始する事業年度）まで</strong>延長されました。
              見直しにより、所得が年10億円を超える事業年度は17%になります。期限後に延長されるかは今後の税制改正次第で、特例がなくなると法人税法本来の税率19%（現在も特例の適用除外事業者に使われる税率）に戻ります。
            </p>
            <H3>地方法人税：法人税額の10.3%</H3>
            <p>国税ですが、地方の財源に回される税金です。法人税額に10.3%をかけて計算し、法人税と一緒に申告します。</p>
            <H3>法人住民税：法人税割＋均等割</H3>
            <p>
              東京23区内の法人の場合、法人税割は法人税額の7.0%（資本金1億円以下かつ法人税額が年1,000万円以下の法人。それ以外は10.4%）。
              均等割は資本金等の額と従業者数で決まり、資本金1,000万円以下・従業者50人以下なら年7万円、従業者50人超なら年14万円です。
            </p>
            <H3>法人事業税・特別法人事業税</H3>
            <p>
              外形標準課税の対象外の普通法人（資本金1億円以下など）は、所得のうち年400万円以下の部分3.5%、400万円超800万円以下の部分5.3%、800万円超の部分7.0%（東京都の標準税率。規模の大きい法人には超過税率がかかります）。
              さらに国税の特別法人事業税として、標準税率で計算した法人事業税額の37%がかかります。
            </p>
            <H3>防衛特別法人税：2026年4月1日以後に開始する事業年度から</H3>
            <p>
              法人税額から年500万円の基礎控除を差し引いた額に4%をかける新しい税金です。この前提では、法人の所得がおよそ
              {manShort(Math.round(DEFENSE_THRESHOLD_INCOME / 10_000) * 10_000)}
              を超えるまで法人税額が500万円に届かないため、多くの小規模法人では税額は生じません（税額がゼロでも申告は必要です）。
              上の比較表のケースでは発生しないため、計算モデルにも含めていません。
            </p>
          </section>

          <section>
            <H2>給与所得控除の表（2026年分）</H2>
            <p>役員報酬を受け取ると、所得税・住民税の計算で次の給与所得控除を差し引けます。2026年分から最低額が65万円から74万円に引き上げられました。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>給与の収入金額</th>
                    <th className={thR}>給与所得控除額</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['220万円以下', '74万円'],
                    ['220万円超 360万円以下', '収入×30%＋8万円'],
                    ['360万円超 660万円以下', '収入×20%＋44万円'],
                    ['660万円超 850万円以下', '収入×10%＋110万円'],
                    ['850万円超', '195万円（上限）'],
                  ].map(r => (
                    <tr key={r[0]}>
                      <td className={td}>{r[0]}</td>
                      <td className={tdR}>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              比較表の3ケースでは、役員報酬{cases.map(c => `${manShort(c.salary)}→控除${man(c.salaryDeduction)}`).join('、')}です。
              控除は850万円で頭打ちになるため、役員報酬を高くするほど「控除で守られる割合」は下がります。報酬額の決め方は
              <Link href="/articles/director-salary" className="text-blue-600 hover:underline">役員報酬はいくらにすべき？</Link>
              で比較しています。
            </p>
          </section>

          <section>
            <H2>経費にできる範囲の違い</H2>
            <p>税率以外に、法人だと経費（損金）にしやすい支出もあります。ただし、どれも要件があり「何でも経費になる」わけではありません。</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>役員社宅：</strong>会社が借りた住宅を役員に貸し、国税庁の基準で計算した「賃貸料相当額」以上の家賃を役員から受け取っていれば、給与として課税されません。
                会社が借り上げる場合、小規模な住宅は固定資産税の課税標準額などから計算した額、それ以外は会社が払う家賃の50%などとの比較で賃貸料相当額を決めます。
                現金の住宅手当や、役員本人が契約して家賃を払う場合は社宅として扱われず、給与になります。
              </li>
              <li>
                <strong>役員退職金：</strong>個人事業主は自分に退職金を払えませんが、法人は役員に退職金を払えます（金額が不相当に高い部分は損金にならないことがあります）。
                受け取る側は「（収入−退職所得控除）×1/2」が課税対象で、退職所得控除は勤続20年以下なら1年40万円（最低80万円）、20年超は800万円＋70万円×（年数−20年）。
                ただし役員としての勤続が5年以下の場合は1/2にならないので、法人化してすぐの退職金は有利になりにくい点に注意が必要です。
              </li>
              <li>
                <strong>生命保険：</strong>法人が契約者となる保険の保険料は、保険の種類や解約返戻金の水準によって損金にできる割合が異なります。
                全額が経費になるとは限らず、解約時の返戻金は法人の収益になるため、加入前に取扱いを確認してください。
              </li>
              <li>
                <strong>家族への給与：</strong>個人事業主が生計を一にする家族に払う給与は、青色事業専従者給与などの届出と要件を満たす場合に限り経費になります。
                法人では家族を役員や従業員にして報酬を払えますが、勤務実態に見合わない金額は認められません。
              </li>
            </ul>
          </section>

          <section>
            <H2>見落としやすい点：会社のお金を個人で使うときの二重課税</H2>
            <p>
              比較表の「法人化後」は、会社に利益が残っている状態の負担です（事業所得{manShort(mid.businessIncome)}なら約{manShort(Math.max(0, mid.retained))}）。
              このお金は会社のものなので、個人が生活費に使うには役員報酬、配当、退職金などで受け取る必要があります。
            </p>
            <p className="mt-2">
              配当で受け取る場合、配当は法人税等を払った後の利益から出すため経費になりません。そのうえで受け取った個人にも課税されます。
              非上場の会社の配当は原則として総合課税で、支払時に20.42%が源泉徴収され、確定申告で他の所得と合算します（配当控除を受けられます）。
              これがいわゆる「二重課税」で、会社に残した利益を配当で引き出すと、比較表の差の一部が消えます。
              「会社に残す利益は、事業への再投資や将来の退職金の原資にする」という使い方を前提に役員報酬を決めるのが一般的です。
            </p>
          </section>

          <section>
            <H2>よくある誤解</H2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>「所得税率が33%になったら法人化」：</strong>判断は税率だけでなく社会保険料と維持費を含めた総額で行います。上の表のように、所得が低いと法人化で税金がかえって増えたり、税金の差より社会保険料の増加が大きくなったりします。</li>
              <li><strong>「法人税は一律15%」：</strong>15%は所得800万円以下の部分の法人税だけで、地方法人税・法人住民税・法人事業税を合わせると負担率は上の表のとおり2割を超えます。15%自体も期限付きの特例です。</li>
              <li><strong>「赤字なら法人は税金ゼロ」：</strong>法人住民税の均等割（23区で最低年7万円）は赤字でもかかります。</li>
              <li><strong>「役員報酬を低くすれば得」：</strong>税・社会保険料の合計は下がりやすい一方、個人の手取りが減り、会社に残ったお金を引き出すときに再び課税されます。</li>
            </ul>
          </section>

          <section>
            <H2>自分の数字で確認する</H2>
            <p>
              この記事の数値は前提を固定した例です。経費、家族構成、iDeCo、配偶者の役員報酬などで結果は変わります。
              ご自身の売上・経費で比較するには<Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>を、
              計算例は<Link href="/examples" className="text-blue-600 hover:underline">計算例ページ</Link>をご覧ください。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {SOURCES.map(s => (
                <li key={s.href}>
                  {s.label}
                  <br />
                  <Ext href={s.href}>{s.href}</Ext>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              本ページは一般的な情報提供を目的とした概算であり、個別の税務助言ではありません。税率は2026年11月時点で確認したもので、自治体や事業年度により異なる場合があります。
              法人設立や申告の判断は税理士等の専門家にご相談ください。
            </p>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="tax-comparison" />
      </main>

      <SiteFooter />
    </div>
  )
}
