import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { compare } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'

export const metadata: Metadata = {
  title: '法人化のベストタイミングとは？判断基準を徹底解説 | 法人化シミュレーター',
  description:
    '法人化のタイミングを、事業所得別の負担差（2026年の税制・社会保険料で計算）、消費税（新設法人の免税、インボイス登録、2割特例の終了と個人限定の3割特例）、赤字の繰越期間、決算期の選び方、年の途中で法人化する年の注意点から整理した判断ガイドです。',
}

// ===== 計算例の前提（break-even-table と同じ前提） =====
const EXPENSES = 1_000_000
const BLUE = 650_000
const SALARY_RATIO = 0.5

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

const PROFILES = [
  { key: 'single', label: '単身・35歳', input: {} as Partial<InputData> },
  { key: 'single45', label: '単身・45歳', input: { age: 45 } as Partial<InputData> },
  { key: 'family', label: '配偶者＋子1人・35歳', input: { hasSpouse: true, dependents: 1 } as Partial<InputData> },
]

const INCOMES = [3, 4, 5, 6, 7, 8, 10, 12].map(v => v * 1_000_000)

const revenueFor = (businessIncome: number) => businessIncome + EXPENSES + BLUE
// 法人では青色申告特別控除がないため、控除前の利益の50%を役員報酬（月1万円単位）にする
const salaryFor = (businessIncome: number) =>
  Math.round(((businessIncome + BLUE) * SALARY_RATIO) / 120_000) * 120_000

function calc(businessIncome: number, profile: Partial<InputData>) {
  return compare({
    ...baseInput,
    ...profile,
    revenue: revenueFor(businessIncome),
    directorSalary: salaryFor(businessIncome),
  })
}

// それ以上の事業所得では負担差がずっとプラスになる最小の事業所得（10万円単位）
const BREAK_EVEN_MIN = 1_000_000
function breakEven(profile: Partial<InputData>): number | null {
  let lowest: number | null = null
  for (let bi = 30_000_000; bi >= BREAK_EVEN_MIN; bi -= 100_000) {
    if (calc(bi, profile).savings < 0) break
    lowest = bi
  }
  return lowest
}

const man = (n: number) => `${Math.round(n / 10_000).toLocaleString('ja-JP')}万円`
const signedMan = (n: number) =>
  `${n >= 0 ? '+' : '−'}${Math.round(Math.abs(n) / 10_000).toLocaleString('ja-JP')}万円`

// ===== 消費税の計算例（制度の計算式をそのまま適用） =====
const SALES_EX_TAX = 8_000_000 // 税抜売上（標準税率10%のみと仮定）
const SALES_TAX = SALES_EX_TAX * 0.1
const CONSUMPTION_CASES = [
  { label: '2割特例（〜2026年9月30日を含む課税期間）', amount: SALES_TAX * 0.2 },
  { label: '3割特例（個人事業者の2027年分・2028年分）', amount: SALES_TAX * 0.3 },
  { label: '簡易課税・第5種（サービス業等、みなし仕入率50%）', amount: SALES_TAX * (1 - 0.5) },
]

const thHead = 'border border-gray-300 px-2 py-2'
const td = 'border border-gray-300 px-2 py-2'

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

function Box({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs leading-relaxed space-y-1">
      {children}
    </div>
  )
}

export default function TimingArticle() {
  const rows = INCOMES.map(bi => ({
    bi,
    salary: salaryFor(bi),
    results: PROFILES.map(p => calc(bi, p.input)),
  }))
  const breakEvens = PROFILES.map(p => ({ label: p.label, value: breakEven(p.input) }))
  const nhiExample = calc(8_000_000, {}).individual
  const formatBreakEven = (v: number | null) =>
    v === null ? '3,000万円超' : v === BREAK_EVEN_MIN ? '100万円以下から' : `${man(v)}〜`

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('timing')!.title, href: '/articles/timing' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">法人化のベストタイミングとは？判断基準を徹底解説</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            法人化のタイミングは「所得がいくらを超えたら」だけでは決まりません。税金と社会保険料の負担差に加えて、
            <strong>消費税の扱いがいつ変わるか</strong>、<strong>どの月に会社を作り、決算期をいつにするか</strong>、
            <strong>法人化した年とその翌年に個人の税・保険料がどう残るか</strong>で、同じ所得でも有利・不利が入れ替わります。
            この記事では、まず当サイトの計算モデルで負担差を示し、そのうえで所得以外の判断材料を順に整理します。
          </p>

          <section>
            <H2>結論：判断は3段階で考える</H2>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>負担差：</strong>税・社会保険料の合計が、法人の維持費（税理士報酬など）を差し引いても安定してプラスか</li>
              <li><strong>消費税：</strong>インボイス登録が必要な取引か、個人のまま使える特例（3割特例）と比べて損をしないか</li>
              <li><strong>時期：</strong>決算期・設立月・個人の確定申告や国保の切り替えを考えて、手間と二重負担が小さい時期か</li>
            </ol>
            <p className="mt-2">
              1だけで「得」に見えても、2と3で逆転することがあります。順番に見ていきます。
            </p>
          </section>

          <section>
            <H2>1. 事業所得別の負担差（2026年の制度で計算）</H2>
            <p>
              次の表は、当サイトのシミュレーターと同じ計算モデルで、ページ表示時に計算した値です。
              「負担差」は<strong>個人事業主の年間負担 − 法人化後の年間負担</strong>（プラスなら法人化したほうが税・社会保険料の合計が少ない）です。
            </p>
            <Box>
              <p className="font-bold">計算の前提</p>
              <p>・税制は2026年分の所得税・住民税、社会保険は協会けんぽ東京の令和8年度料率と厚生年金18.3%、国保は新宿区の令和8年度料率、国民年金は月17,920円</p>
              <p>・経費100万円、青色申告特別控除65万円、個人事業税率5%</p>
              <p>・法人化後の役員報酬は、青色申告特別控除前の利益（事業所得＋65万円）の50%（月1万円単位に丸め）</p>
              <p>・配偶者は収入なし。個人事業主のままなら配偶者も国保・国民年金に加入、法人化後は代表者の社会保険の扶養に入る</p>
              <p>・45歳は介護保険料（国保の介護分、協会けんぽの介護保険料）を含む</p>
              <p>・税理士報酬、設立費用、消費税、会社に残した利益を後で受け取るときの税金は含まない</p>
            </Box>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={`${thHead} text-left`}>事業所得<br /><span className="font-normal text-gray-500">（役員報酬）</span></th>
                    {PROFILES.map(p => (
                      <th key={p.key} className={`${thHead} text-right`}>{p.label}<br /><span className="font-normal text-gray-500">負担差 / 月あたり</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.bi}>
                      <td className={`${td} font-medium`}>
                        {man(r.bi)}
                        <br />
                        <span className="text-gray-500">（{man(r.salary)}）</span>
                      </td>
                      {r.results.map((res, i) => (
                        <td key={PROFILES[i].key} className={`${td} text-right`}>
                          <span className={res.savings >= 0 ? 'text-green-700 font-bold' : 'text-red-600'}>
                            {signedMan(res.savings)}
                          </span>
                          <br />
                          <span className="text-gray-500">{signedMan(res.savings / 12)}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={`${thHead} text-left`}>家族構成</th>
                    <th className={`${thHead} text-right`}>負担差がずっとプラスになる事業所得</th>
                  </tr>
                </thead>
                <tbody>
                  {breakEvens.map(b => (
                    <tr key={b.label}>
                      <td className={`${td} font-medium`}>{b.label}</td>
                      <td className={`${td} text-right`}>{formatBreakEven(b.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              ここで大事なのは、表の負担差が<strong>維持費を引く前</strong>の数字だという点です。
              「月あたり」の欄を、税理士の顧問料や会計ソフト代など、法人にすると増える月々の費用と比べてください。
              負担差がプラスでも、維持費を引いて数万円しか残らないなら、急ぐ理由は弱くなります。
            </p>
            <p className="mt-2">
              配偶者がいる世帯で分岐点が低いのは、個人事業主のままだと配偶者の国民年金と国保の均等割がかかるのに対し、
              法人化後は代表者の社会保険の扶養に入れるためです（配偶者に収入がない前提）。
              役員報酬を80%にした場合や事業所得2,000万円までの一覧は
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">事業所得別・法人化の損益分岐表</Link>
              に、報酬の決め方は
              <Link href="/articles/director-salary" className="text-blue-600 hover:underline">役員報酬の決め方</Link>
              にまとめています。
            </p>
            <p className="mt-2">
              また、1年分の所得だけで判断しないことも重要です。法人化は元に戻すのに手間がかかるため、
              <strong>直近2〜3年の所得がいずれも分岐点を超えているか</strong>、来年以降も同程度が見込めるかで判断するほうが安全です。
            </p>
          </section>

          <section>
            <H2>2. 消費税：2026年10月以降は判断の前提が変わった</H2>
            <p>
              消費税は、税・社会保険料の負担差とは別に、法人化のタイミングを大きく左右します。まず基本ルールです。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>課税事業者になる基準：</strong>原則として<strong>基準期間</strong>（個人は前々年、法人は原則として前々事業年度）の課税売上高が1,000万円を超えると、消費税を納める義務があります。
                基準期間が1,000万円以下でも、<strong>特定期間</strong>（個人は前年1〜6月、法人は原則として前事業年度の最初の6か月）の課税売上高が1,000万円を超えると課税事業者になります（特定期間は売上の代わりに給与等の支払額で判定することもできます）。
              </li>
              <li>
                <strong>新設法人：</strong>設立したばかりの法人には基準期間がありません。事業年度開始日の資本金が<strong>1,000万円未満</strong>なら、原則として1期目・2期目は免税事業者になれます。
                ただし、2期目は1期目の特定期間の課税売上高と給与等の支払額がいずれも1,000万円を超えると課税事業者になります。大きな会社グループが作った法人（特定新規設立法人）などにも例外があります。
              </li>
              <li>
                <strong>インボイス登録との関係：</strong>インボイス（適格請求書）を発行するには登録が必要で、登録した事業者は売上の金額にかかわらず課税事業者になります。
                つまり、<strong>取引先にインボイスを求められる事業では、新設法人の免税は事実上使えません</strong>。
                新設法人には、事業を開始した課税期間の末日までに登録申請書を提出すると、その期間の初日から登録を受けたものとみなす特例があり、設立時からインボイスを発行できます（あわせて必要な届出は法人の状況で異なるため、所轄の税務署で確認してください）。
              </li>
            </ul>
            <p className="mt-3">
              次に、2026年に変わった点です。免税事業者がインボイス登録をした場合に納める消費税を売上の消費税の2割にできる
              <strong>2割特例</strong>は、<strong>2026年9月30日を含む課税期間</strong>で終わりました。
              令和8年度税制改正で後継の<strong>3割特例</strong>ができましたが、対象は<strong>個人事業者の2027年分・2028年分</strong>の申告だけで、<strong>法人は対象外</strong>です。
              また、2026年10月1日以後に設立した法人の課税期間は、2割特例の対象期間に入りません。
            </p>
            <Box>
              <p className="font-bold">計算例：税抜売上{man(SALES_EX_TAX)}（すべて標準税率10%）、インボイス登録あり、基準期間の課税売上高1,000万円以下</p>
              <p>売上にかかる消費税：{man(SALES_TAX)}</p>
              {CONSUMPTION_CASES.map(c => (
                <p key={c.label}>・{c.label}：納付額 {man(c.amount)}</p>
              ))}
              <p className="text-gray-500">※ 簡易課税のみなし仕入率は業種で異なります（第1種90%〜第6種40%）。一般課税では実際の仕入・経費の消費税を差し引くため、結果は事業によって異なります。</p>
            </Box>
            <p className="mt-2">
              この例では、インボイス登録が必要なサービス業の個人事業主が2027年に法人化すると、個人のまま3割特例を使う場合に比べて、
              簡易課税で計算した消費税が年{man(CONSUMPTION_CASES[2].amount - CONSUMPTION_CASES[1].amount)}増える計算になります。
              表の負担差がこの金額を下回るなら、<strong>3割特例が使える2028年分までは個人のままにしておく</strong>のも合理的な選択肢です。
              逆に、基準期間の課税売上高がすでに1,000万円を超えている人は3割特例の対象外なので、この比較は当てはまりません。
            </p>
            <p className="mt-2">
              一方、取引先の多くが一般消費者などでインボイスを求められない事業なら、資本金1,000万円未満の新設法人の免税は今も有効です。
              個人で課税事業者になる時期（売上が1,000万円を超えた年の2年後）の前に法人化すると、免税期間を続けられる可能性があります。
              なお、取引先が免税事業者から仕入れた場合に一部を差し引ける経過措置は、令和8年度改正で2026年10月から2年間は70%とされ、その後段階的に縮小します。
              取引先にとっての負担が年々増えることは、免税のまま取引を続けられるかの判断材料になります。
            </p>
            <p className="mt-2">
              簡易課税は、原則として適用したい課税期間が始まる前日までに届出が必要ですが、事業を開始した課税期間はその期間中に届け出れば適用できます。
              一度選ぶと原則2年間は続ける必要があるため、大きな設備投資を予定している場合は一般課税と比べてから選びます。
            </p>
          </section>

          <section>
            <H2>3. 赤字の繰越期間：個人3年、法人10年</H2>
            <p>
              青色申告をしている個人事業主の赤字（純損失）は、翌年以後<strong>3年間</strong>繰り越して所得から差し引けます。
              青色申告の法人の赤字（欠損金）は、<strong>10年間</strong>繰り越せます（2018年4月1日以後に開始した事業年度に生じたもの）。
              資本金1億円以下などの中小法人は、繰り越した赤字を所得の全額まで差し引けます。
            </p>
            <p className="mt-2">
              大きな先行投資で数年赤字が続く見込みなら、法人で事業を始めたほうが赤字を活かしやすいといえます。
              ただし、<strong>個人時代の赤字を法人に引き継ぐことはできません</strong>（個人と法人は別の納税者です）。
              個人で赤字の繰越が残っている場合は、それを使い切ってから法人化するほうが無駄がありません。
            </p>
          </section>

          <section>
            <H2>4. 決算期と設立月の選び方</H2>
            <p>法人の事業年度（決算期）は自由に決められます。タイミングの観点では、次の点を考えます。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>1期目の長さと消費税：</strong>設立1期目が7か月以下なら、2期目の判定に使う特定期間がありません。
                1期目が8か月以上で最初の6か月の課税売上高と給与等がともに1,000万円を超えると、2期目から課税事業者になります。
                売上規模が大きい場合は1期目の長さを意識します（月の途中で設立した場合などは判定が変わることがあるため、個別の日付で確認が必要です）。
              </li>
              <li>
                <strong>役員報酬の変更時期：</strong>毎月同額の役員報酬（定期同額給与）を変えられるのは、原則として事業年度開始から3か月以内です。
                繁忙期と決算期が重なると利益の見通しが立たないまま報酬を決めることになるため、売上が読みやすい時期に事業年度が始まるようにします。
              </li>
              <li>
                <strong>決算・申告の作業時期：</strong>12月決算にすると、法人の決算と個人の確定申告の準備が年末年始から3月に集中します。
                繁忙期を避けた月を決算期にすると作業を分散できます。
              </li>
              <li>
                <strong>青色申告の承認申請：</strong>新設法人は、設立日から3か月を経過した日と1期目の終了日のいずれか早い日の前日までに申請します。
                1期目を短くすると期限も早まる点に注意してください。
              </li>
            </ul>
          </section>

          <section>
            <H2>5. 年の途中で法人化する年の注意点</H2>
            <p>
              年の途中で法人化すると、その年は<strong>1月から法人化までの事業所得</strong>と<strong>法人から受け取る役員報酬（給与所得）</strong>が混在します。
              翌年の確定申告では両方を合算して申告します。個人事業の廃業届や、消費税の届出も必要になります。
            </p>
            <p className="mt-2">
              さらに見落としやすいのが、<strong>個人の負担は前年の所得で決まる</strong>という点です。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>国民健康保険：</strong>国保の保険料は前年の所得をもとに計算されます。法人化した年度は、社会保険に切り替わるまでの期間分を、高かった前年の事業所得で払うことになります。
                計算モデルでは、事業所得800万円の単身者（新宿区・35歳）の国保は年約{man(nhiExample.nhi)}です。
                国保は自動で切り替わらないため、社会保険に加入したら脱退の届出が必要です（新宿区では14日以内）。
                国保と社会保険の違いは<Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline">国民健康保険と社会保険の比較</Link>をご覧ください。
              </li>
              <li>
                <strong>住民税：</strong>前年1年間の所得に対して翌年度に課税されます。法人化した翌年度は、法人化した年の事業所得と役員報酬の合計に住民税がかかります。
                役員報酬を低めに設定しても、法人化の翌年度は住民税が下がらないことがあります。
              </li>
            </ul>
            <p className="mt-2">
              このため、法人化の効果が数字に表れ切るのは、<strong>個人事業の所得がなくなった年の翌年度</strong>からです。
              初年度に「思ったほど手取りが増えない」と感じるのはこの時間差によるもので、資金繰りは前年の所得を基準に組んでおく必要があります。
              手続きの流れは<Link href="/articles/procedure" className="text-blue-600 hover:underline">法人化の手続きガイド</Link>で解説しています。
            </p>
          </section>

          <section>
            <H2>6. 税金以外のきっかけ：取引先・融資・採用</H2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>取引先：</strong>法人とだけ取引する方針の企業や、法人であることを条件とする案件があります。具体的な案件が見えているなら、負担差が小さくても法人化する理由になります。</li>
              <li><strong>融資：</strong>法人の決算書は事業と家計が分かれているため、資金の使い道を説明しやすくなります。ただし、設立直後は決算の実績がない点は個人と変わりません。</li>
              <li>
                <strong>採用：</strong>法人の事業所は、従業員がいなくても社会保険（健康保険・厚生年金）の適用事業所になります。
                個人事業所が強制適用になるのは、原則として常時5人以上の従業員がいる場合です。人を雇う予定があるなら、社会保険に入れる職場として募集できる点は法人の強みです。
                反対に、会社負担分の保険料が人件費に上乗せされる点も見込んでおく必要があります。
              </li>
            </ul>
          </section>

          <section>
            <H2>法人化を検討すべきサイン（チェックリスト）</H2>
            <ul className="space-y-1">
              <li>☐ 直近2〜3年、事業所得が上の表の分岐点を安定して超えている</li>
              <li>☐ 負担差の「月あたり」が、税理士報酬など法人で増える月々の費用を十分に上回る</li>
              <li>☐ 生活費を引いても手元にお金が残り、それを会社に残しておける</li>
              <li>☐ インボイス登録が不要な事業で、課税売上高が1,000万円を超えそう（または超えた）</li>
              <li>☐ インボイス登録が必要な事業でも、3割特例を手放しても負担差が十分に残る</li>
              <li>☐ 配偶者を扶養に入れられるなど、社会保険への切り替えで家族の保険料が下がる</li>
              <li>☐ 法人であることが条件の取引や、人を雇う予定がある</li>
              <li>☐ 数年続く赤字を伴う先行投資を予定している</li>
            </ul>
            <p className="mt-2">当てはまる項目が多いほど、法人化を前向きに検討する段階です。</p>
          </section>

          <section>
            <H2>まだ急がなくてよいケース</H2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>所得が分岐点前後で年によって上下する：</strong>標準報酬の等級や控除の段差で、分岐点付近の負担差はプラスとマイナスを行き来します。所得が安定するまで待っても失うものは小さいです。</li>
              <li><strong>インボイス登録が必要で、基準期間の売上が1,000万円以下：</strong>個人なら2028年分まで3割特例を使えます。法人化で消費税が増える分を負担差が上回るか確認してからで遅くありません。</li>
              <li><strong>稼いだお金をほぼ全額生活費に使う：</strong>役員報酬を高くするしかなく、会社に利益を残す余地がないと、法人化の効果は小さくなります。</li>
              <li><strong>個人の赤字の繰越がまだ残っている：</strong>法人に引き継げないため、使い切ってからのほうが有利です。</li>
              <li><strong>事業をやめる・縮小する予定がある：</strong>法人は利益がなくても法人住民税の均等割がかかり、解散にも手続きと費用が必要です。</li>
            </ul>
          </section>

          <section>
            <H2>自分の数字で確認する</H2>
            <p>
              上の表は典型的な前提での目安です。経費、iDeCo、家族構成、配偶者への役員報酬などで結果は変わります。
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              にご自身の数字を入れて負担差を確認し、その結果に消費税と維持費を加えて判断してください。
              具体的な入力例は<Link href="/examples" className="text-blue-600 hover:underline">計算例ページ</Link>、
              2026年の制度変更の影響は<Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の税制・社会保険の変更点</Link>で解説しています。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>国税庁 No.6501 納税義務の免除<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6501.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6501.htm</Ext></li>
              <li>国税庁 No.6503 基準期間がない法人の納税義務の免除の特例<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6503.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6503.htm</Ext></li>
              <li>国税庁 質疑応答事例「特定期間の判定」<br /><Ext href="https://www.nta.go.jp/law/shitsugi/shohi/22/10.htm">https://www.nta.go.jp/law/shitsugi/shohi/22/10.htm</Ext></li>
              <li>国税庁「2割特例（インボイス発行事業者となる小規模事業者に対する負担軽減措置）」<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice_2tokurei.htm">https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice_2tokurei.htm</Ext></li>
              <li>国税庁「令和8年度税制改正によるインボイス制度の見直しについて」<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice-review/index.htm">https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice-review/index.htm</Ext></li>
              <li>国税庁「新たに設立された法人等の登録時期の特例」（インボイスQ&A）<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/pdf/sinkijigyousha/faq_k02.pdf">https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/pdf/sinkijigyousha/faq_k02.pdf</Ext></li>
              <li>国税庁 No.6505 簡易課税制度<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6505.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6505.htm</Ext></li>
              <li>国税庁 D1-22 消費税簡易課税制度選択届出手続<br /><Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shohi/annai/1461_13.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shohi/annai/1461_13.htm</Ext></li>
              <li>国税庁 No.2070 青色申告者の純損失の繰越しと繰戻し<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2070.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2070.htm</Ext></li>
              <li>国税庁 No.5762 青色申告書を提出した事業年度の欠損金の繰越控除<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5762.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5762.htm</Ext></li>
              <li>国税庁 No.5211 役員に対する給与（平成29年4月1日以後支給決議分）<br /><Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm</Ext></li>
              <li>国税庁 青色申告の承認申請手続（法人）<br /><Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hojin/annai/1554_14.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hojin/annai/1554_14.htm</Ext></li>
              <li>日本年金機構「適用事業所と被保険者」<br /><Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html">https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html</Ext></li>
              <li>新宿区「保険料の計算方法について」<br /><Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html">https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html</Ext></li>
              <li>新宿区「国民健康保険の届出について」<br /><Ext href="https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html">https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html</Ext></li>
              <li>新宿区「住民税について」<br /><Ext href="https://www.city.shinjuku.lg.jp/hoken/file04_03_00001.html">https://www.city.shinjuku.lg.jp/hoken/file04_03_00001.html</Ext></li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              本ページは2026年11月23日時点の制度にもとづく一般的な情報提供であり、個別の税務助言ではありません。
              計算結果は概算です。法人設立や消費税の届出などの判断は、税理士等の専門家や所轄の税務署にご確認ください。
            </p>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="timing" />
      </main>

      <SiteFooter />
    </div>
  )
}
