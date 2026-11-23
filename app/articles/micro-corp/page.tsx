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

export const metadata: Metadata = {
  title: 'マイクロ法人とは？個人事業主との二刀流で社会保険料を最適化 | 法人化シミュレーター',
  description:
    '個人事業と小さな法人を併用する「マイクロ法人」で社会保険料がどれだけ変わるかを、令和8年度の料率と標準報酬月額の等級を使って事業所得400万・800万・1,200万円で試算。事業の切り分け、年金・健康保険の給付差、割に合わないケースも解説します。',
}

// ===== 試算の前提 =====
// 役員報酬 月4.5万円（年54万円）。lib/taxCalculations.ts の等級表では
// 健康保険 標準報酬月額58,000円（63,000円未満）、厚生年金 88,000円（93,000円未満）に該当する
const MONTHLY_SALARY = 45_000
const SALARY = MONTHLY_SALARY * 12
const HEALTH_STD = 58_000
const PENSION_STD = 88_000

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

type Family = { key: string; title: string; input: Partial<InputData> }

const FAMILIES: Family[] = [
  { key: 'single35', title: '単身・35歳', input: { age: 35 } },
  { key: 'single45', title: '単身・45歳（介護保険料あり）', input: { age: 45 } },
  { key: 'couple35', title: '夫婦・35歳（配偶者は収入なし）', input: { age: 35, hasSpouse: true } },
]

const MAIN_INCOMES = [4, 8, 12].map(v => v * 1_000_000)
const SCAN_INCOMES = [1, 2, 3, 4, 6, 8, 10, 12, 15, 20].map(v => v * 1_000_000)

const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`
const man = (n: number) => `${(Math.round(n / 1_000) / 10).toLocaleString('ja-JP')}万円`
const signedMan = (n: number) => `${n >= 0 ? '+' : '−'}${man(Math.abs(n))}`

// マイクロ法人側：役員報酬 月4.5万円、法人所得0円（法人側の事業の利益で報酬・会社負担社保・均等割をちょうど賄う）と仮定
function microCorp(family: Partial<InputData>) {
  const c = calcCorporate({ ...baseInput, ...family, directorSalary: SALARY, revenue: SALARY })
  return {
    employee: c.director.socialInsurance,
    employer: c.socialInsuranceEmployer,
    fixed: c.corporate.total, // 法人所得0円なので均等割のみ
  }
}

function hybrid(businessIncome: number, family: Partial<InputData>) {
  const input = { ...baseInput, ...family, revenue: businessIncome }
  const solo = calcIndividual(input)
  const corp = microCorp(family)
  // 併用時：個人側の社会保険料控除は「国保＋国民年金」から「法人で天引きされる本人負担分」に置き換わる。
  // calcIndividual は ideco を控除に足すだけなので、差額を ideco に入れて税額だけを再計算する
  // （国保の計算には影響しない。給与54万円は給与所得控除74万円で給与所得0円のため合計所得は変わらない）
  const withCorp = calcIndividual({ ...input, ideco: corp.employee - solo.socialInsurance })
  const taxIncrease =
    withCorp.incomeTax + withCorp.residentTax - (solo.incomeTax + solo.residentTax)
  const saved = solo.socialInsurance
  const added = corp.employee + corp.employer + corp.fixed
  return {
    businessIncome,
    nhi: solo.nhi,
    pension: solo.pension,
    saved,
    ...corp,
    added,
    taxIncrease,
    net: saved - added - taxIncrease,
  }
}

// 将来の年金（報酬比例部分）の目安：平均標準報酬額 × 5.481/1000 × 加入月数（再評価率は考慮しない）
const PENSION_PER_YEAR = Math.round((PENSION_STD * 5.481) / 1000 * 12)
// 傷病手当金の日額：標準報酬月額の平均 ÷ 30（10円未満四捨五入）× 2/3（1円未満四捨五入）
const SICK_DAILY = Math.round((Math.round(HEALTH_STD / 30 / 10) * 10 * 2) / 3)

const thHead = 'border border-gray-300 px-2 py-2 text-left bg-gray-100'
const th = 'border border-gray-300 bg-gray-50 px-2 py-2 text-left font-medium'
const td = 'border border-gray-300 px-2 py-2 text-right'

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

function MainTable({ family }: { family: Family }) {
  const rows = MAIN_INCOMES.map(bi => hybrid(bi, family.input))
  const line = (label: ReactNode, pick: (r: ReturnType<typeof hybrid>) => ReactNode, bold = false) => (
    <tr>
      <th className={th}>{label}</th>
      {rows.map(r => (
        <td key={r.businessIncome} className={`${td} ${bold ? 'font-bold' : ''}`}>
          {pick(r)}
        </td>
      ))}
    </tr>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-3">
        <thead>
          <tr>
            <th className={thHead}>{family.title}</th>
            {rows.map(r => (
              <th key={r.businessIncome} className={`${thHead} text-right`}>
                事業所得{man(r.businessIncome)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {line('① 国民健康保険（払わなくなる）', r => yen(r.nhi))}
          {line('② 国民年金（払わなくなる）', r => yen(r.pension))}
          {line('③ 健保・厚年 本人負担', r => yen(r.employee))}
          {line('④ 健保・厚年 会社負担', r => yen(r.employer))}
          {line('⑤ 法人住民税 均等割', r => yen(r.fixed))}
          {line('⑥ 所得税・住民税の増加', r => yen(r.taxIncrease))}
          {line(
            '差引 ①＋②−③−④−⑤−⑥',
            r => (
              <span className={r.net >= 0 ? 'text-green-700' : 'text-red-600'}>{signedMan(r.net)}</span>
            ),
            true,
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function MicroCorpArticle() {
  const single = microCorp({ age: 35 })
  const single45 = microCorp({ age: 45 })
  const corpRevenueNeeded = SALARY + single.employer + single.fixed
  const r400 = hybrid(4_000_000, { age: 35 })
  const r800 = hybrid(8_000_000, { age: 35 })
  const r1200 = hybrid(12_000_000, { age: 35 })
  const scan = SCAN_INCOMES.map(bi => hybrid(bi, { age: 35 }))
  const best = scan.reduce((a, b) => (b.net > a.net ? b : a))

  // 本人負担の内訳（料率は協会けんぽ東京 令和8年度・厚生年金18.3%。モデルと同じ計算）
  const health35 = Math.floor((HEALTH_STD * 12 * (0.0985 + 0.0023)) / 2)
  const pensionHalf = Math.floor((PENSION_STD * 12 * 0.183) / 2)
  const childContribution = Math.floor(PENSION_STD * 12 * 0.0036)

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('micro-corp')!.title, href: '/articles/micro-corp' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">マイクロ法人とは？個人事業主との二刀流で社会保険料を最適化</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            「マイクロ法人」は法律用語ではなく、社長ひとりだけの小さな法人を指す通称です。よく話題になるのは、本業は個人事業のまま続け、
            <strong>別の事業を小さな法人で行い、そこから低い役員報酬を受け取る</strong>という併用の形です。
            法人の役員として健康保険・厚生年金に加入すると、国民健康保険と国民年金を払わなくてよくなり、社会保険料の合計が下がる場合があります。
          </p>
          <p>
            この記事では、その効果を令和8年度の料率と標準報酬月額の等級表で実際に計算し、どこまでが確かな数字で、どこからが人によって変わる部分なのかを分けて示します。
            なお、当サイトの<Link href="/" className="text-blue-600 hover:underline">シミュレーター</Link>は「事業をまるごと法人化する」場合の比較で、この併用の形は計算しません。
            以下の試算は、シミュレーターと同じ計算モデル（料率・等級・税額の計算）を使い、併用の形に組み替えたものです。
          </p>

          <section>
            <H2>先に結論</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                役員報酬を月4.5万円にすると、本人負担と会社負担を合わせた社会保険料は年{yen(single.employee + single.employer)}（35歳）です。法人住民税の均等割7万円を足すと、固定的な負担は年{yen(single.employee + single.employer + single.fixed)}になります。
              </li>
              <li>
                単身35歳の試算では、税金の増加分まで差し引いた効果は、事業所得400万円で{signedMan(r400.net)}、800万円で{signedMan(r800.net)}、1,200万円で{signedMan(r1200.net)}。
                <strong>所得が高いほど得になるわけではなく</strong>、国保の上限に達するあたりで効果は頭打ちになり、その先は減っていきます。
              </li>
              <li>この数字には税理士報酬や設立費用が入っていません。年に数十万円かかれば、効果の多くが消える所得帯もあります。</li>
              <li>
                前提として、個人事業と法人の事業が実際に別物であることが必要です。個人の売上を法人に付け替えただけの形は、税務・社会保険の両面でリスクがあります。
              </li>
            </ul>
          </section>

          <section>
            <H2>仕組み：なぜ社会保険料が下がるのか</H2>
            <p>
              国民健康保険（国保）は、前年の所得が増えるほど保険料が上がります（新宿区の令和8年度は、医療分・支援金分・子ども子育て支援金分の合計で単身でも上限が約96万円、40〜64歳は介護分を含め113万円）。
              一方、会社の健康保険と厚生年金は<strong>その会社から受け取る報酬だけ</strong>で保険料が決まります。個人事業の所得はいくら多くても保険料の計算に入りません。
            </p>
            <Calc>
              <p>【個人事業だけ】 事業所得 ─→ 国保（所得に比例・上限あり）＋ 国民年金（定額 月17,920円）</p>
              <p>【併用】 事業所得 ─→ 所得税・住民税のみ（国保・国民年金はなし）</p>
              <p className="pl-12">法人の役員報酬 月4.5万円 ─→ 健康保険・厚生年金（報酬で決まる）</p>
            </Calc>
            <p className="mt-2">
              保険料は実際の報酬ではなく「標準報酬月額」という区切りのよい金額に当てはめて計算します。月4.5万円は、健康保険では最も低い等級の58,000円（報酬月額63,000円未満）、
              厚生年金でも最も低い等級の88,000円（93,000円未満）に当たります。これより報酬を下げても保険料は下がりません。
            </p>
          </section>

          <section>
            <H2>試算の前提</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>役員報酬は月{yen(MONTHLY_SALARY)}（年{yen(SALARY)}）。賞与なし</li>
              <li>健康保険は協会けんぽ東京の令和8年度料率（9.85%＋子ども・子育て支援金0.23%、40〜64歳は介護1.62%）、厚生年金18.3%、子ども・子育て拠出金0.36%（会社のみ）</li>
              <li>国保は新宿区の令和8年度料率、国民年金は月17,920円。いずれも1年分</li>
              <li>事業所得は青色申告特別控除後の金額。所得税・住民税は2026年分の基礎控除などで計算（シミュレーターと同じモデル）</li>
              <li>
                法人側は、別の事業の利益で「役員報酬＋会社負担の社会保険料＋均等割」をちょうど賄い、法人の利益は0円とする（このとき法人に最低限必要な利益は約{man(corpRevenueNeeded)}）
              </li>
              <li>役員報酬54万円は給与所得控除（最低74万円）で給与所得0円になるため、報酬そのものに所得税はかからない</li>
              <li>夫婦の例では、配偶者は個人事業だけのときは国保・国民年金に加入し、併用後は健康保険の被扶養者・国民年金の第3号被保険者になれると仮定</li>
              <li>税理士報酬、設立費用、会計ソフト、消費税は含まない</li>
            </ul>
          </section>

          <section>
            <H2>法人側で毎年かかる社会保険料</H2>
            <Calc>
              <p>健康保険（35歳）：58,000円 × 12か月 × 10.08% ÷ 2 ＝ {yen(health35)}（本人・会社それぞれ）</p>
              <p>厚生年金：88,000円 × 12か月 × 18.3% ÷ 2 ＝ {yen(pensionHalf)}（本人・会社それぞれ）</p>
              <p>子ども・子育て拠出金：88,000円 × 12か月 × 0.36% ＝ {yen(childContribution)}（会社のみ）</p>
              <p>
                → 本人負担 {yen(single.employee)}、会社負担 {yen(single.employer)}、合計 <strong>{yen(single.employee + single.employer)}</strong>
              </p>
              <p>
                40〜64歳は介護保険料が加わり、本人負担 {yen(single45.employee)}、会社負担 {yen(single45.employer)}、合計 {yen(single45.employee + single45.employer)}
              </p>
            </Calc>
            <p className="mt-2">
              会社負担分も、結局は自分の法人のお金から出ていきます。ひとり法人では「本人負担＋会社負担」の合計を自分のコストとして見るのが正確です。
            </p>
          </section>

          <section>
            <H2>事業所得400万・800万・1,200万円での比較</H2>
            <p>
              「個人事業だけ」と「同じ事業所得のまま、マイクロ法人を併用」を比べます。①②が払わなくてよくなる金額、③〜⑥が新たに増える金額です。
              ⑥は見落とされがちな点で、国保・国民年金より社会保険料が少なくなると、所得税・住民税の社会保険料控除も減るため、税金は増えます。
            </p>
            {FAMILIES.map(f => (
              <MainTable key={f.key} family={f} />
            ))}
            <p className="mt-2 text-xs text-gray-500">
              表の数値はページ表示時に計算モデルから算出しています。差引は税理士報酬・設立費用を引く前の金額です。
            </p>
          </section>

          <section>
            <H2>表の読み方：効果が最大になるのは中間の所得帯</H2>
            <p>
              単身35歳で事業所得を細かく変えてみると、差引は次のように動きます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr>
                    <th className={thHead}>事業所得</th>
                    <th className={`${thHead} text-right`}>払わなくなる国保＋国民年金</th>
                    <th className={`${thHead} text-right`}>税金の増加</th>
                    <th className={`${thHead} text-right`}>差引</th>
                  </tr>
                </thead>
                <tbody>
                  {scan.map(r => (
                    <tr key={r.businessIncome}>
                      <th className={th}>{man(r.businessIncome)}</th>
                      <td className={td}>{yen(r.saved)}</td>
                      <td className={td}>{yen(r.taxIncrease)}</td>
                      <td className={`${td} font-bold ${r.net >= 0 ? 'text-green-700' : 'text-red-600'}`}>{signedMan(r.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                所得が低いと、払わなくなる国保がもともと少ないため、固定的な負担（約{man(single.employee + single.employer + single.fixed)}）を上回りません。
              </li>
              <li>
                国保は上限があるため、一定の所得を超えると「払わなくなる金額」は増えなくなります。一方、税率は所得とともに上がるので、控除が減ることによる税金の増加は大きくなります。
                この試算では{man(best.businessIncome)}前後で効果が最も大きく、それより上では小さくなっていきます。
              </li>
              <li>40〜64歳や家族がいる世帯は、個人事業だけのときの国保・国民年金が多いため、効果が大きくなります。</li>
            </ul>
            <p className="mt-2">
              逆に「事業をまるごと法人化する」場合は、所得が高いほど法人税率と所得税率の差が効いてきます。高所得の方は
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">事業所得別の損益分岐表</Link>
              で全体の法人化と比べてください。
            </p>
          </section>

          <section>
            <H2>マイクロ法人が割に合わないケース</H2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>事業所得が低い：</strong>上の表のとおり、事業所得100万円台では差引がほぼゼロかマイナスです。ここに税理士報酬などが加わると、確実に赤字になります。
              </li>
              <li>
                <strong>法人で行う別の事業がない：</strong>法人に「役員報酬＋会社負担社保＋均等割」を払えるだけの利益（この前提で約{man(corpRevenueNeeded)}）が出なければ、個人のお金を法人に入れ続けることになります。
              </li>
              <li>
                <strong>維持費が大きい：</strong>法人は利益が0円でも、法人住民税の均等割（この試算では7万円）がかかります。税理士報酬は依頼範囲や地域で大きく違うため、見積もりを取って差引から引いてください。
              </li>
              <li>
                <strong>傷病・出産時の保障を重視したいのに報酬が低い：</strong>後述のとおり、給付の多くは標準報酬月額に比例するため、月4.5万円の報酬では金額がごく小さくなります。
              </li>
              <li>
                <strong>国保の軽減を受けている：</strong>所得が低い世帯には国保料の軽減制度があり、この試算（軽減なし）より国保がさらに安いことがあります。その場合は効果がさらに小さくなります。
              </li>
            </ul>
          </section>

          <section>
            <H2>最大の注意点：事業を本当に分けられるか</H2>
            <p>
              マイクロ法人の併用が成り立つのは、<strong>個人事業と法人の事業がそれぞれ実態を持って別に存在する</strong>場合です。
              たとえば、デザイン業を個人で行い、法人では不動産賃貸や物品販売など別の事業を行う、といった形です。
            </p>
            <p className="mt-2">よくある危ない形と、分けるときに確認したいことは次のとおりです。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>同じ取引先・同じ内容の仕事を、月によって個人と法人に振り分けている（売上の付け替えと見られやすい）</li>
              <li>法人の売上が、実質的に個人事業の外注費として個人から法人に流れているだけ</li>
              <li>契約書・請求書・入金口座・帳簿が、個人と法人で分かれていない</li>
              <li>法人側の業務に、実際に役員として働いた記録（業務内容、取引のやり取り）がない</li>
            </ul>
            <p className="mt-2">
              税務上、取引の実態がない、または不自然な形で所得を移していると判断されると、法人と個人の所得を計算し直される可能性があります。
              社会保険の面でも、健康保険・厚生年金の被保険者になるのは「労務の対償として報酬を受ける」役員で、無報酬の役員しかいない法人は適用事業所になれません。
              形だけの役員報酬が問題視されるリスクは、事業の実態と表裏一体です。業種の切り分けに迷う場合は、設立前に税理士や社会保険労務士へ相談してください。
            </p>
          </section>

          <section>
            <H2>社会保険の手続きで知っておきたいこと</H2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>法人は社長ひとりでも加入義務：</strong>株式会社・合同会社などの法人の事業所は、事業主のみの場合も含めて健康保険・厚生年金の適用事業所です。「加入するかどうか選べる」ものではありません。
              </li>
              <li>
                <strong>国保は自動ではやめられない：</strong>新宿区の場合、職場の健康保険に加入したら14日以内に国保の脱退の届出が必要です。国保と職場の健康保険は自動では切り替わりません。
              </li>
              <li>
                <strong>個人事業で人を雇う場合：</strong>個人事業所は、常時5人以上の従業員がいると原則として強制適用になります（飲食店・理容店などのサービス業や農林漁業は除く。法律・会計関係の士業は令和4年10月から対象）。
                この場合は個人事業側の従業員の社会保険も別に考える必要があり、この記事の試算は当てはまりません。
              </li>
              <li>
                <strong>他社でも働いて社会保険に入っている場合：</strong>2か所以上で社会保険の対象になると、別のルール（二以上事業所勤務）で保険料が決まります。この記事は、本業が個人事業だけの方を前提にしています。
              </li>
              <li>
                <strong>役員報酬は年の途中で自由に変えられない：</strong>法人税で経費にできる役員報酬（定期同額給与）は、原則として事業年度開始から3か月以内の改定に限られます。「国保より高くなったので途中で下げる」といった調整はできません。
              </li>
            </ul>
          </section>

          <section>
            <H2>将来の年金への影響</H2>
            <p>
              厚生年金に加入すると、国民年金にも同時に加入している扱い（第2号被保険者）になり、国民年金保険料を別に払う必要はありません。そのうえで、厚生年金の「報酬比例部分」が上乗せされます。
              平成15年4月以降の加入期間の報酬比例部分は、原則として次の式で計算されます。
            </p>
            <Calc>
              <p>報酬比例部分 ＝ 平均標準報酬額 × 5.481/1000 × 加入月数</p>
              <p>
                標準報酬月額88,000円で1年加入した場合の目安：88,000円 × 5.481/1000 × 12か月 ≒ <strong>{yen(PENSION_PER_YEAR)}</strong>（年金額・年あたり）
              </p>
              <p>10年加入で約{man(PENSION_PER_YEAR * 10)}、20年加入で約{man(PENSION_PER_YEAR * 20)}が、毎年の年金に上乗せされる計算です。</p>
              <p className="text-gray-500">※過去の報酬を現在の価値に直す「再評価率」や年金額の改定は考慮していない、ごく粗い目安です。</p>
            </Calc>
            <p className="mt-2">
              上乗せはあるものの、報酬が最低等級なので金額は小さめです。また、国民年金の第1号被保険者でなくなるため、
              第1号被保険者向けの付加年金（月400円の付加保険料を納める制度）は利用できなくなります。
              「年金を増やす」ことを主な目的にするなら、報酬を上げた場合の保険料の増え方と比べて判断する必要があります。
            </p>
          </section>

          <section>
            <H2>健康保険の給付の違い</H2>
            <p>
              協会けんぽの健康保険には、国保にはない被保険者本人向けの給付として、病気やけがで働けないときの<strong>傷病手当金</strong>、
              出産で休むときの<strong>出産手当金</strong>があります。どちらも1日あたり「支給開始日以前12か月の標準報酬月額の平均 ÷ 30 × 2/3」で計算します。
            </p>
            <Calc>
              <p>標準報酬月額58,000円の場合：58,000円 ÷ 30 ≒ 1,930円 → × 2/3 ≒ <strong>{yen(SICK_DAILY)}／日</strong></p>
            </Calc>
            <p className="mt-2">
              傷病手当金は連続3日の待期のあと4日目以降、休んだ期間の給与が支払われないことなどが条件で、支給期間は通算1年6か月です。
              給付が「ある」こと自体は国保との違いですが、低い報酬のままでは金額が小さく、本業の個人事業の収入減を埋めるものではありません。
            </p>
            <p className="mt-2">
              家族については、要件を満たせば配偶者などを健康保険の被扶養者にでき、20歳以上60歳未満の配偶者は国民年金の第3号被保険者として保険料がかかりません。
              第3号被保険者は原則として年収130万円未満が要件で、年収が被保険者の半分以上ある場合は生計維持の状況で判断されます。
              役員報酬が低いマイクロ法人では、この判断が個別になりやすいため、配偶者に収入がある場合は事前に年金事務所へ確認してください。
            </p>
          </section>

          <section>
            <H2>始める前のチェックリスト</H2>
            <ol className="list-decimal list-inside space-y-1">
              <li>法人で行う事業は、個人事業と取引先・内容・契約が明確に分かれているか</li>
              <li>法人側の事業で、毎年約{man(corpRevenueNeeded)}以上の利益を安定して出せるか</li>
              <li>上の表の差引から、税理士報酬・設立費用・会計ソフト代を引いてもプラスが残るか</li>
              <li>自分の住む市区町村の国保料で計算し直したか（国保料は地域で大きく違う）</li>
              <li>役員報酬を3か月以内に決め、1年間変えない前提で問題ないか</li>
              <li>家族を扶養に入れる場合、収入の条件を確認したか</li>
            </ol>
            <p className="mt-2">
              事業をまるごと法人化する場合の比較は<Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>で、
              役員報酬の決め方は<Link href="/articles/director-salary" className="text-blue-600 hover:underline">役員報酬の設定</Link>、
              国保と社会保険の違いは<Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline">国民健康保険と社会保険の比較</Link>、
              2026年の料率変更は<Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の変更点</Link>で詳しく解説しています。
              計算例は<Link href="/examples" className="text-blue-600 hover:underline">計算例ページ</Link>もご覧ください。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                日本年金機構「適用事業所と被保険者」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html">https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html</Ext>
              </li>
              <li>
                日本年金機構「疑義照会回答（厚生年金保険 適用）」（報酬を受ける役員の被保険者資格）
                <br />
                <Ext href="https://www.nenkin.go.jp/service/seidozenpan/gigishokai.files/kounen_tekiyou.pdf">https://www.nenkin.go.jp/service/seidozenpan/gigishokai.files/kounen_tekiyou.pdf</Ext>
              </li>
              <li>
                日本年金機構「健康保険・厚生年金保険の適用事業所における適用業種（士業）の追加」
                <br />
                <Ext href="https://www.nenkin.go.jp/oshirase/topics/2021/20211118.html">https://www.nenkin.go.jp/oshirase/topics/2021/20211118.html</Ext>
              </li>
              <li>
                日本年金機構「兼業・副業等により2カ所以上の事業所で勤務する皆さまへ」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20131022.files/2kashoijyokinmu.pdf">https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20131022.files/2kashoijyokinmu.pdf</Ext>
              </li>
              <li>
                日本年金機構 用語集「報酬比例部分」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/yougo/hagyo/hoshuhirei.html">https://www.nenkin.go.jp/service/yougo/hagyo/hoshuhirei.html</Ext>
              </li>
              <li>
                日本年金機構 用語集「第2号被保険者」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/yougo/tagyo/dai2hihokensha.html">https://www.nenkin.go.jp/service/yougo/tagyo/dai2hihokensha.html</Ext>
              </li>
              <li>
                日本年金機構 用語集「第3号被保険者」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/yougo/tagyo/dai3hihokensha.html">https://www.nenkin.go.jp/service/yougo/tagyo/dai3hihokensha.html</Ext>
              </li>
              <li>
                日本年金機構「付加保険料の納付」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kokunen/hokenryo/fukanofu.html">https://www.nenkin.go.jp/service/kokunen/hokenryo/fukanofu.html</Ext>
              </li>
              <li>
                協会けんぽ「病気やケガで会社を休んだとき（傷病手当金）」
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/g3/sb3040/r139/">https://www.kyoukaikenpo.or.jp/g3/sb3040/r139/</Ext>
              </li>
              <li>
                協会けんぽ「出産手当金」
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/benefit/childbirth/001/index.html">https://www.kyoukaikenpo.or.jp/benefit/childbirth/001/index.html</Ext>
              </li>
              <li>
                協会けんぽ 令和8年度 都道府県単位保険料率
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08">https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08</Ext>
              </li>
              <li>
                国税庁 タックスアンサー No.5211「役員に対する給与（平成29年4月1日以後支給決議分）」
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm</Ext>
              </li>
              <li>
                新宿区「国民健康保険の届出について」
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html">https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html</Ext>
              </li>
              <li>
                新宿区 国民健康保険料（令和8年度）
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html">https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html</Ext>
              </li>
              <li>
                日本年金機構 お知らせ（令和8年度の国民年金保険料）
                <br />
                <Ext href="https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html">https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html</Ext>
              </li>
            </ul>
          </section>

          <p className="text-xs text-gray-500">
            本ページは一般的な情報提供を目的とした概算であり、個別の税務・社会保険の助言ではありません。料率や制度は改定されることがあります。
            法人の設立や事業の切り分けは、税理士・社会保険労務士等の専門家にご相談ください。
          </p>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="micro-corp" />
      </main>

      <SiteFooter />
    </div>
  )
}
