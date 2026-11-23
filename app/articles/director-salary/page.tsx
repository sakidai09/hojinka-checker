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

const SLUG = 'director-salary'
const TITLE = '役員報酬はいくらにすべき？事業所得別の負担と手取りの比較表（2026年版）'

export const metadata: Metadata = {
  title: `${TITLE} | 法人化シミュレーター`,
  description:
    '事業所得500万〜2,000万円の個人事業主が法人化した場合に、役員報酬を月5万〜150万円で変えたときの税・社会保険料の総負担、個人の手取り、会社に残るお金を2026年の制度で計算した比較表。定期同額給与・事前確定届出給与のルールと決め方の手順も解説します。',
}

// ===== 計算の前提 =====
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

const SINGLE: Partial<InputData> = {}
const FAMILY: Partial<InputData> = { hasSpouse: true, dependents: 1 }

// 事業所得（青色申告特別控除後）から売上を逆算する
const revenueFor = (businessIncome: number) => businessIncome + EXPENSES + BLUE

const INCOMES = [5, 8, 12, 20].map(v => v * 1_000_000)
// 役員報酬の月額（万円）
const MONTHLY = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 120, 150]

const man = (n: number) => `${Math.round(n / 10_000).toLocaleString('ja-JP')}万円`
const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`

type Row = {
  monthly: number
  salary: number
  burden: number
  takeHome: number
  retained: number
  sum: number
}

function rowsFor(businessIncome: number, family: Partial<InputData>) {
  const profit = businessIncome + BLUE // 法人化後の役員報酬差引前の利益（売上−経費）
  const indiv = compare({ ...baseInput, ...family, revenue: revenueFor(businessIncome) }).individual
  const rows: Row[] = []
  for (const m of MONTHLY) {
    const salary = m * 120_000
    const c = calcCorporate({ ...baseInput, ...family, revenue: revenueFor(businessIncome), directorSalary: salary })
    // 役員報酬と会社負担の社会保険料が利益を超える（赤字になる）設定は除外
    if (profit - salary - c.socialInsuranceEmployer < 0) continue
    const takeHome = salary - c.director.total
    const retained = c.corporate.income - c.corporate.total
    rows.push({ monthly: m, salary, burden: c.totalBurden, takeHome, retained, sum: takeHome + retained })
  }
  const best = rows.reduce((a, b) => (b.burden < a.burden ? b : a))
  return {
    businessIncome,
    profit,
    indivBurden: indiv.total,
    indivCash: profit - indiv.total,
    rows,
    best,
  }
}

const thHead = 'border border-gray-300 px-2 py-2 text-right font-medium'
const td = 'border border-gray-300 px-2 py-1.5 text-right'

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
      {children}
    </a>
  )
}

function SalaryTable({ data }: { data: ReturnType<typeof rowsFor> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-2 text-left font-medium">役員報酬（月額）</th>
            <th className={thHead}>税・社保の総負担</th>
            <th className={thHead}>個人の手取り</th>
            <th className={thHead}>会社に残る額</th>
            <th className={thHead}>合計</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50 text-gray-600">
            <td className="border border-gray-300 px-2 py-1.5">個人事業主のまま</td>
            <td className={td}>{man(data.indivBurden)}</td>
            <td className={td}>{man(data.indivCash)}</td>
            <td className={td}>—</td>
            <td className={td}>{man(data.indivCash)}</td>
          </tr>
          {data.rows.map(r => {
            const isBest = r.monthly === data.best.monthly
            return (
              <tr key={r.monthly} className={isBest ? 'bg-yellow-50 font-bold' : ''}>
                <td className="border border-gray-300 px-2 py-1.5">
                  {isBest && '★ '}月{r.monthly}万円
                  <span className="font-normal text-gray-500">（年{man(r.salary)}）</span>
                </td>
                <td className={td}>{man(r.burden)}</td>
                <td className={td}>{man(r.takeHome)}</td>
                <td className={td}>{man(r.retained)}</td>
                <td className={td}>{man(r.sum)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// 標準報酬月額の等級による階段（35歳・単身。報酬額だけを変える）
const STEP_MONTHLY = [269_000, 270_000, 289_000, 290_000, 634_000, 635_000, 800_000, 1_000_000]
function insuranceStep(monthly: number, age: number) {
  const c = calcCorporate({ ...baseInput, revenue: 50_000_000, directorSalary: monthly * 12, age })
  return {
    monthly,
    employee: c.director.socialInsurance,
    employer: c.socialInsuranceEmployer,
    total: c.director.socialInsurance + c.socialInsuranceEmployer,
  }
}

export default function DirectorSalaryArticle() {
  const singles = INCOMES.map(bi => rowsFor(bi, SINGLE))
  const families = [8_000_000, 12_000_000].map(bi => rowsFor(bi, FAMILY))
  const ex800 = singles[1]
  const ex800Low = ex800.rows.find(r => r.monthly === 5)!
  const ex800Ten = ex800.rows.find(r => r.monthly === 10)!
  const ex800Forty = ex800.rows.find(r => r.monthly === 40)!
  const steps = STEP_MONTHLY.map(m => insuranceStep(m, 35))
  const care35 = insuranceStep(300_000, 35)
  const care45 = insuranceStep(300_000, 45)

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
            法人化したあと最初に決めなければならないのが、自分に払う役員報酬の額です。役員報酬は会社の経費になる一方で、受け取った本人には所得税・住民税がかかり、
            さらに報酬額に応じて健康保険・厚生年金の保険料が<strong>会社と本人の両方に</strong>かかります。報酬を上げても下げても、どこかで負担が増えるため、
            「いくらが正解か」は利益の額によって変わります。
          </p>
          <p>
            このページでは、当サイトのシミュレーターと同じ計算モデルを使い、事業所得500万・800万・1,200万・2,000万円の場合に役員報酬を月5万〜150万円で変えたとき、
            <strong>税・社会保険料の総負担、個人の手取り、会社に残るお金</strong>がどう動くかを一覧にしました。表の数値はページ表示時に計算モデルから直接計算しています。
            後半では、役員報酬を経費にするための税務上のルール（定期同額給与など）と、実際の決め方の手順を説明します。
          </p>

          <section>
            <H2>先に結論</H2>
            <ul className="list-disc list-inside space-y-1">
              {singles.map(d => (
                <li key={d.businessIncome}>
                  事業所得{man(d.businessIncome)}（単身）：総負担が最も小さいのは<strong>月{d.best.monthly}万円</strong>
                  （総負担{man(d.best.burden)}、個人の手取り{man(d.best.takeHome)}、会社に残る額{man(d.best.retained)}）
                </li>
              ))}
              <li>
                利益が小さいうちは「報酬を低くして会社に残す」ほうが総負担は小さく、利益が大きくなるほど負担最小の報酬額は上がります。
                ただし負担最小の点では個人の手取りが少なく、<strong>生活費が足りない設定になりがち</strong>です。
              </li>
              <li>
                会社に残ったお金は個人の財布とは別物です。後から配当などで個人に移すと、そこでもう一度税金がかかります。
                「総負担が最小の報酬」が「自分にとって最適な報酬」とは限りません。
              </li>
              <li>
                役員報酬は原則として事業年度の途中で変えられません（変えると経費にならない部分が出ます）。年の初めに1年分を見通して決めることが重要です。
              </li>
            </ul>
          </section>

          <section>
            <H2>計算の前提</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                「事業所得」は個人事業主として青色申告特別控除65万円を差し引いた後の金額。経費は100万円、個人事業税率5%。
                法人化後は、青色申告特別控除がないため<strong>役員報酬を払う前の会社の利益＝事業所得＋65万円</strong>として計算
              </li>
              <li>本人35歳（介護保険料なし）、単身・扶養なし。家族ありの表は配偶者（収入なし）＋子1人で、法人化後は配偶者・子とも本人の健康保険の扶養に入る前提</li>
              <li>
                税制は2026年（令和8年）分の所得税（基礎控除104万〜62万円、給与所得控除の最低保障74万円）と住民税（基礎控除43万円、均等割等5,000円）
              </li>
              <li>
                社会保険は協会けんぽ東京の令和8年度料率（健康保険9.85%、子ども・子育て支援金0.23%）、厚生年金18.3%、子ども・子育て拠出金0.36%（会社のみ）。
                標準報酬月額の等級表で計算
              </li>
              <li>個人事業主の比較対象は、国民健康保険（新宿区 令和8年度料率）と国民年金（月17,920円）</li>
              <li>法人税等は中小法人の税率で、法人住民税の均等割7万円を含む。役員報酬は代表者1人のみ、賞与なし</li>
              <li>税理士報酬・設立費用・消費税・配当や退職金にかかる税は含まない</li>
            </ul>
          </section>

          <section>
            <H2>表の見方</H2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>税・社保の総負担：</strong>役員本人の所得税・住民税・社会保険料（本人負担分）＋会社負担の社会保険料＋法人税・法人住民税・法人事業税の合計</li>
              <li><strong>個人の手取り：</strong>役員報酬 −（本人の所得税・住民税・社会保険料の本人負担分）</li>
              <li><strong>会社に残る額：</strong>役員報酬と会社負担の社会保険料を差し引いた会社の利益から、法人の税金を引いた税引後の利益</li>
              <li><strong>合計：</strong>手取り＋会社に残る額。会社の利益（事業所得＋65万円）から総負担を引いた額と一致します。つまり<strong>総負担が最小の行＝合計が最大の行</strong>です</li>
              <li>★は総負担が最も小さい報酬額。灰色の行は個人事業主のままの場合で、「手取り」は事業所得＋65万円から税・社保を引いた額</li>
              <li>報酬と会社負担の社会保険料が利益を超える（会社が赤字になる）報酬額は表から除いています</li>
            </ul>
          </section>

          {singles.map(d => (
            <section key={d.businessIncome}>
              <H2>事業所得{man(d.businessIncome)}（単身・35歳）</H2>
              <p className="text-xs text-gray-600">法人化後の役員報酬を払う前の利益：{man(d.profit)}</p>
              <SalaryTable data={d} />
            </section>
          ))}

          <section>
            <H2>事業所得800万円の表を読み解く</H2>
            <p>
              事業所得800万円の単身者が個人事業主のままだと、税・社保の負担は約{man(ex800.indivBurden)}、手元に残るのは約{man(ex800.indivCash)}です。
              法人化して役員報酬を月{ex800.best.monthly}万円にすると総負担は約{man(ex800.best.burden)}まで下がり、合計（手取り＋会社に残る額）は約{man(ex800.best.sum)}になります。
            </p>
            <p className="mt-2">
              しかし、このとき<strong>個人の手取りは年約{man(ex800.best.takeHome)}</strong>しかありません。残りの約{man(ex800.best.retained)}は会社のお金です。
              生活費を役員報酬でまかなうなら、たとえば月40万円にすると手取りは約{man(ex800Forty.takeHome)}、総負担は約{man(ex800Forty.burden)}で、
              合計は負担最小の設定より約{man(ex800.best.sum - ex800Forty.sum)}少なくなります。
              この差が「生活費を個人で受け取るためのコスト」と考えるとわかりやすいでしょう。
            </p>
            <p className="mt-2">
              また、月5万円は月10万円より総負担が大きくなっています（月5万円：{man(ex800Low.burden)}、月10万円：{man(ex800Ten.burden)}）。
              これは、厚生年金の標準報酬月額に下限（8万8千円）があり、報酬が月5万円でも8万8千円とみなして保険料がかかるためです。
              報酬を下げれば下げるほど得になるわけではありません。
            </p>
          </section>

          <section>
            <H2>「総負担が最小」が最適とは限らない理由</H2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>会社に残ったお金は自由に使えない：</strong>会社の口座のお金を個人の生活費に使うことはできません。会社から個人に移す方法は、役員報酬のほか、
                配当や退職金などに限られます。
              </li>
              <li>
                <strong>配当で受け取ると二重に課税される：</strong>配当は会社の経費になりません。法人税を払った後の利益から支払い、受け取った個人にも所得税・住民税がかかります。
                表の「会社に残る額」は、すでに法人の税金を引いた後の金額ですが、それを個人が受け取るにはさらに税金がかかる、という意味で「合計」は手取りの上限に近い数字です。
              </li>
              <li>
                <strong>社会保険の給付も報酬に連動する：</strong>厚生年金の将来の受取額や、病気で働けないときの傷病手当金（協会けんぽの場合、日額はおおむね標準報酬月額の平均の30分の1の3分の2。支給期間は通算1年6か月）は、標準報酬月額が低いほど少なくなります。保険料を節約すると、保障も小さくなります。
              </li>
              <li>
                <strong>個人の信用：</strong>住宅ローンなどの審査では個人の所得が見られることが一般的です。役員報酬を極端に低くすると、借入れの計画に影響することがあります。
              </li>
              <li>
                <strong>会社に資金を残す意味もある：</strong>設備投資や運転資金、赤字の年への備えとして会社に資金を残すことには実務上の意味があります。
                「会社に残る額」をどう使うつもりかで、適切な報酬額は変わります。
              </li>
            </ol>
          </section>

          <section>
            <H2>家族がいる場合（配偶者＋子1人・35歳）</H2>
            <p>
              配偶者に収入がない場合、個人事業主のままだと配偶者も国民年金（年215,040円）を払い、国民健康保険も世帯人数分の均等割がかかります。
              法人化して本人が健康保険・厚生年金に入ると、配偶者は扶養（健康保険の被扶養者、国民年金の第3号被保険者）に入れるため、その保険料がかからなくなります。
              また、役員報酬から配偶者控除・扶養控除が受けられるため、同じ報酬額でも単身より手取りが増えます。
            </p>
            {families.map(d => (
              <div key={d.businessIncome} className="mt-4">
                <h3 className="font-bold text-gray-900">事業所得{man(d.businessIncome)}（配偶者＋子1人）</h3>
                <SalaryTable data={d} />
                <p className="mt-1 text-xs text-gray-600">
                  負担最小は月{d.best.monthly}万円（総負担{man(d.best.burden)}）。個人事業主のままとの差は約{man(d.indivBurden - d.best.burden)}です。
                </p>
              </div>
            ))}
            <p className="mt-3 text-xs text-gray-600">
              所得税の扶養控除の対象は、その年12月31日現在で16歳以上の扶養親族です。子が15歳以下なら税額は表より少し増えます。本表は計算モデル上、子1人を扶養控除の対象として計算しています。
              配偶者に役員報酬を払う設定は<Link href="/" className="text-blue-600 hover:underline">シミュレーター</Link>の詳細設定で試せます。
            </p>
          </section>

          <section>
            <H2>標準報酬月額の「等級」で負担は階段状に変わる</H2>
            <p>
              会社員や役員の健康保険料・厚生年金保険料は、実際の報酬そのものではなく、報酬を区切りのよい幅で区分した<strong>標準報酬月額</strong>に料率を掛けて計算します。
              厚生年金は1等級（8万8千円）から32等級（65万円）までの32段階です。そのため、報酬を1,000円上げただけで等級が1つ上がり、保険料が数万円単位で増えることがあります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-left font-medium">報酬月額</th>
                    <th className={thHead}>本人負担（年）</th>
                    <th className={thHead}>会社負担（年）</th>
                    <th className={thHead}>合計（年）</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map(s => (
                    <tr key={s.monthly}>
                      <td className="border border-gray-300 px-2 py-1.5">{yen(s.monthly)}</td>
                      <td className={td}>{yen(s.employee)}</td>
                      <td className={td}>{yen(s.employer)}</td>
                      <td className={td}>{yen(s.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              前提：35歳、協会けんぽ東京 令和8年度料率、厚生年金18.3%、子ども・子育て拠出金0.36%。年額＝標準報酬月額×12か月×料率（労使折半）。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>境目の直前と直後：</strong>報酬月額269,000円と270,000円、289,000円と290,000円では、報酬の差は月1,000円（年12,000円）ですが、
                保険料の合計はそれ以上に増えます。報酬を決めるときは、等級の境目を少し下回る額にすると無駄が少なくなります。
              </li>
              <li>
                <strong>厚生年金の上限：</strong>報酬月額がおよそ63.5万円を超えると厚生年金の標準報酬月額は上限の65万円で止まり、それ以上は健康保険料だけが増えます。
                事業所得2,000万円の表で、報酬月額を上げても総負担がしばらく横ばいになる理由の一つです。
              </li>
              <li>
                <strong>40歳以上は介護保険料が加わる：</strong>40〜64歳は健康保険料に介護保険料（協会けんぽ東京 令和8年度1.62%）が上乗せされます。
                報酬月額30万円の場合、社会保険料の合計（本人＋会社）は35歳で{yen(care35.total)}、45歳で{yen(care45.total)}と、
                年{yen(care45.total - care35.total)}増えます。一方、個人事業主の国民健康保険にも40〜64歳は介護分がかかるため、両者の差への影響はその分小さくなります。
              </li>
            </ul>
            <p className="mt-2">
              標準報酬月額は、原則として毎年4〜6月の報酬の平均で決め直し（定時決定）、その年の9月から翌年8月まで使われます。固定的な報酬が変わり、
              3か月の平均が2等級以上変わったときは途中で改定されます（随時改定）。役員報酬は通常毎月同額なので、実際には「年度初めに決めた報酬額で1年間の保険料がほぼ決まる」と考えてよいでしょう。
            </p>
          </section>

          <section>
            <H2>役員報酬を経費にするためのルール</H2>
            <p>
              会社が役員に払う給与は、法人税法上、次のどれかに当たる場合だけ損金（税務上の経費）になります（国税庁 タックスアンサーNo.5211）。
              当たらない部分は会社の経費にならないのに、受け取った本人には給与として課税されるため、二重に負担することになります。
            </p>

            <h3 className="font-bold text-gray-900 mt-3">1. 定期同額給与（毎月同じ額の報酬）</h3>
            <p>
              1か月以下の一定の期間ごとに支給し、事業年度中の各支給額が同じである給与です。小規模な法人の役員報酬は、ほとんどがこの形です。
              事業年度の途中で額を変えてよいのは、次の場合に限られます。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>
                <strong>事業年度開始から3か月以内の改定：</strong>事業年度の開始日から3か月を経過する日（申告期限の延長を受けている場合は別の日）までに行う通常の改定。
                設立1期目は、設立日が事業年度の開始日にあたります
              </li>
              <li><strong>臨時改定事由：</strong>役員の職制上の地位の変更や職務内容の重大な変更など、やむを得ない事情による改定</li>
              <li>
                <strong>業績悪化改定事由：</strong>経営の状況が著しく悪化したことなどによる<strong>減額</strong>。
                国税庁の通達では、一時的な資金繰りの都合や、単に業績目標に届かなかったことは含まれないとされています
              </li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-3">2. 事前確定届出給与（決めた時期に決めた額を払う報酬）</h3>
            <p>
              所定の時期に確定した額を支給する旨を事前に決め、税務署に届け出ておく給与です。役員に「賞与」を払いたい場合は通常これを使います。
              届出書の提出期限は、原則として次のうち早い日です。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>株主総会等で決議した日（その日より職務の執行を始める日が後ならその日）から1か月を経過する日</li>
              <li>その会計期間の開始日から4か月を経過する日（申告期限の延長を受けている法人などは別の期限）</li>
              <li>新設法人がその役員の設立時の職務について定める場合は、設立日以後2か月を経過する日</li>
            </ul>
            <p className="mt-1">
              届け出た内容どおりに支給することが前提です。なお、役員賞与にも社会保険料がかかります（標準賞与額。上限は健康保険が年度累計573万円、厚生年金が1か月150万円）。
              「賞与にすれば社会保険料がかからない」わけではありません。
            </p>

            <h3 className="font-bold text-gray-900 mt-3">3. 業績連動給与</h3>
            <p>
              利益や株価などの指標に連動する給与で、算定方法を報酬委員会などの手続きで決め、有価証券報告書などで開示するといった要件があります。個人事業から法人化した小規模な会社（マイクロ法人など）では、
              通常は使えないと考えておくのが無難です。
            </p>

            <h3 className="font-bold text-gray-900 mt-3">損金にならない主なケース</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>期中に理由なく増額した：</strong>増額した部分が損金になりません。国税庁の質疑応答事例では、月50万円を期中に月70万円へ増額し2か月支給した例で、
                増額分20万円×2か月＝40万円が損金不算入とされています
              </li>
              <li><strong>期中に理由なく減額した：</strong>業績悪化改定事由などに当たらない減額も、定期同額給与の要件から外れるおそれがあります</li>
              <li><strong>届出をしていない（または届出と違う）賞与：</strong>事前確定届出給与に当たらない役員賞与は損金になりません</li>
              <li><strong>不相当に高額な部分：</strong>職務内容や会社の収益などに照らして高すぎる部分は、上の3種類に当たっても損金になりません</li>
              <li><strong>事実を隠したり仮装したりして支払った給与：</strong>全額が損金になりません</li>
            </ul>
            <p className="mt-2">
              「今期は儲かったので後半だけ報酬を上げる」「決算前に役員賞与を出して利益を減らす」は、どちらも典型的な失敗例です。利益が想定より増えた場合は、
              翌期の報酬を見直すのが基本になります。
            </p>
          </section>

          <section>
            <H2>役員報酬の決め方：5つの手順</H2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>今期の利益を見積もる：</strong>直近の確定申告の事業所得に青色申告特別控除（65万円など）を足し戻した額が、役員報酬を払う前の利益の目安です。
                売上の増減や、法人化で増える費用（税理士報酬など）も反映します。迷うなら少し控えめに見積もります。
              </li>
              <li>
                <strong>生活に必要な手取りから下限を決める：</strong>家賃・生活費・貯蓄など、個人として1年間に必要な手取り額を出し、それを確保できる報酬月額を表やシミュレーターで探します。
                これが報酬の下限です。
              </li>
              <li>
                <strong>総負担の小さい範囲と照らし合わせる：</strong>下限が★の報酬額より低ければ、★の近くを候補にします。下限が★より高ければ、下限そのものが候補です。
                利益が大きい場合は、表のように総負担がほぼ横ばいの範囲があるので、その中で手取りを多めに取る選択肢もあります。
              </li>
              <li>
                <strong>等級の境目を確認する：</strong>候補の報酬月額が標準報酬月額の等級の境目のすぐ上なら、少し下げて一つ下の等級に収めます。
              </li>
              <li>
                <strong>事業年度開始から3か月以内に決議し、毎月同額で払う：</strong>株主総会などで決議して記録（議事録）を残し、事業年度中は毎月同じ額を支給します。
                賞与を払うなら事前確定届出給与の届出を期限内に出します。期末に実績と比べ、翌期の報酬を見直します。
              </li>
            </ol>
          </section>

          <section>
            <H2>よくある疑問</H2>
            <div className="space-y-3">
              <div>
                <p className="font-bold">Q. 役員報酬を0円にすれば社会保険料はかからない？</p>
                <p>
                  会社の健康保険・厚生年金の保険料はかかりませんが、その場合は本人が国民健康保険・国民年金に加入することになり、その保険料がかかります（表には0円の行を載せていません）。
                  なお、法人の事業所は事業主1人だけでも厚生年金の適用事業所になります。報酬を払うなら原則として社会保険に加入します。
                </p>
              </div>
              <div>
                <p className="font-bold">Q. 表の「合計」が個人事業主より多ければ法人化すべき？</p>
                <p>
                  表には税理士報酬などの法人の維持費や、会社に残したお金を個人が受け取るときの税金が入っていません。合計の差からそれらを差し引いて判断します。
                  分岐点の目安は<Link href="/articles/break-even-table" className="text-blue-600 hover:underline">事業所得別・法人化の損益分岐表</Link>を参照してください。
                </p>
              </div>
              <div>
                <p className="font-bold">Q. 住んでいる地域が東京以外だと？</p>
                <p>
                  協会けんぽの健康保険料率は都道府県ごとに、国民健康保険の料率は市区町村ごとに異なります。総負担の水準は数万円程度変わることがありますが、
                  「報酬を上げると社会保険料と所得税が、下げると法人税が増える」という構造は同じです。
                </p>
              </div>
            </div>
          </section>

          <section>
            <H2>自分の数字で確認する</H2>
            <p>
              経費、iDeCo、住宅ローン控除、配偶者への役員報酬などを入れると最適な報酬額は変わります。
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>で役員報酬の額を変えながら、総負担と手取りのバランスを確認してください。
              社会保険の仕組みは<Link href="/articles/social-insurance" className="text-blue-600 hover:underline">社会保険の解説</Link>、
              2026年の制度変更は<Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の税制・社会保険の変更点</Link>、
              具体的な計算の流れは<Link href="/examples" className="text-blue-600 hover:underline">計算例</Link>で解説しています。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                国税庁 タックスアンサー No.5211 役員に対する給与（平成29年4月1日以後支給決議分）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm</Ext>
              </li>
              <li>
                国税庁 法人税基本通達 9-2-13（経営の状況の著しい悪化に類する理由）
                <br />
                <Ext href="https://www.nta.go.jp/law/tsutatsu/kihon/hojin/09/09_02_03.htm">https://www.nta.go.jp/law/tsutatsu/kihon/hojin/09/09_02_03.htm</Ext>
              </li>
              <li>
                国税庁 質疑応答事例「定期給与の額を改定した場合の損金不算入額（定期同額給与）」
                <br />
                <Ext href="https://www.nta.go.jp/law/shitsugi/hojin/11/03.htm">https://www.nta.go.jp/law/shitsugi/hojin/11/03.htm</Ext>
              </li>
              <li>
                日本年金機構「標準報酬月額・標準賞与額とは？」（定時決定・随時改定・厚生年金の等級）
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html">https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html</Ext>
              </li>
              <li>
                日本年金機構「標準賞与額」（健康保険 年度累計573万円、厚生年金 1か月150万円）
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20141203.html">https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20141203.html</Ext>
              </li>
              <li>
                日本年金機構「適用事業所と被保険者」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html">https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html</Ext>
              </li>
              <li>
                国税庁 タックスアンサー No.1180 扶養控除
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm</Ext>
              </li>
              <li>
                全国健康保険協会「病気やケガで会社を休んだとき（傷病手当金）」
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/g3/sb3040/r139/">https://www.kyoukaikenpo.or.jp/g3/sb3040/r139/</Ext>
              </li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">
              税率・保険料率の前提は<Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠と前提条件</Link>にまとめています。
            </p>
          </section>

          <p className="text-xs text-gray-500">
            本ページは一般的な情報提供を目的とした概算であり、個別の税務助言ではありません。役員報酬の決定や届出は、税理士等の専門家にご相談ください。
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
