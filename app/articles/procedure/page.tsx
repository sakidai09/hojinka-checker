import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { calcCorporate } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'

export const metadata: Metadata = {
  title: '法人化の手続きガイド｜設立までの流れと必要書類 | 法人化シミュレーター',
  description:
    '個人事業主が法人化するときの手続きを、株式会社と合同会社の設立費用の比較（定款認証手数料・登録免許税・印紙税）、定款作成から登記完了までの流れ、設立後の届出の提出先と期限、個人事業の廃業手続き、法人化した年の確定申告の注意点まで、公的機関の情報をもとに整理したチェックリストです。',
}

const thHead = 'border border-gray-300 px-2 py-2 text-left'
const th = 'border border-gray-300 bg-gray-50 px-2 py-2 text-left font-bold'
const td = 'border border-gray-300 px-2 py-2'
const tdR = 'border border-gray-300 px-2 py-2 text-right'

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="font-bold text-gray-900 mt-4 mb-1">{children}</h3>
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

function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden="true" className="inline-block w-3.5 h-3.5 mt-0.5 shrink-0 border border-gray-500 rounded-sm" />
      <span>{children}</span>
    </li>
  )
}

const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`
const man = (n: number) => `${(Math.round(n / 1_000) / 10).toLocaleString('ja-JP')}万円`

// ── 計算例の前提（シミュレーターと同じモデルで計算）──
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

const MONTHLY_SALARIES = [200_000, 300_000, 400_000, 500_000]

function socialInsuranceRow(monthly: number, age: number) {
  const salary = monthly * 12
  // 社会保険料は売上に左右されないため、売上＝役員報酬として計算する
  const r = calcCorporate({ ...baseInput, age, revenue: salary, directorSalary: salary })
  const employee = r.director.socialInsurance
  const employer = r.socialInsuranceEmployer
  return { monthly, employee, employer, total: employee + employer }
}

// 法人化に必要な実費（法定のもののみ。印鑑代・専門家報酬・証明書代は含まない）
const REG_TAX_KK = 150_000
const REG_TAX_GK = 60_000
const STAMP_PAPER = 40_000
const TEIKAN_FEE_MIN = 15_000
const TEIKAN_FEE_LOW = 30_000
const TEIKAN_FEE_MID = 40_000
const TEIKAN_FEE_HIGH = 50_000

export default function ProcedureArticle() {
  const rows35 = MONTHLY_SALARIES.map(m => socialInsuranceRow(m, 35))
  const rows45 = MONTHLY_SALARIES.map(m => socialInsuranceRow(m, 45))
  // 売上も役員報酬もゼロの法人にかかる税（法人住民税均等割）
  const zeroCorp = calcCorporate({ ...baseInput })
  const fixedResidentTax = zeroCorp.corporate.total

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('procedure')!.title, href: '/articles/procedure' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">法人化の手続きガイド｜設立までの流れと必要書類</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            個人事業主が法人化（いわゆる「法人成り」）するときは、会社を作る手続き（定款・登記）だけでは終わりません。税務署・都道府県・年金事務所への届出、個人事業の廃業手続き、契約や口座の切り替え、法人化した年の個人の確定申告まで、期限付きの作業が続きます。
          </p>
          <p>
            この記事では、法務省・国税庁・日本年金機構・日本公証人連合会などの公表情報をもとに、手続きを時系列のチェックリストにまとめました。金額と期限には出典を付けています。法人化するかどうかの判断がまだの方は、先に
            <Link href="/" className="text-blue-600 hover:underline">シミュレーター</Link>や
            <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">損益分岐表</Link>
            で税と社会保険の負担を比べてください。
          </p>

          <section>
            <H2>先に結論</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                法定の実費だけで比べると、最も安く作れた場合で<strong>合同会社は6万円、株式会社は約16.5万円</strong>（どちらも電子定款を使う場合）。差の大半は登録免許税（株式会社15万円・合同会社6万円が最低額）です。
              </li>
              <li>
                株式会社の定款認証手数料は資本金で変わり、2022年1月から3万〜5万円の3段階、2024年12月からは一定の小規模な会社で1.5万円になりました。<strong>定款に資本金を「○○万円以上」と書くと5万円</strong>になる点に注意。
              </li>
              <li>
                期限が短いのは、<strong>社会保険の新規適用届（5日以内）</strong>と<strong>都道府県への法人設立届（東京都は15日以内）</strong>。税務署の法人設立届出書は2か月以内、青色申告の承認申請は最長でも設立から3か月以内です。
              </li>
              <li>
                個人で受けていたインボイスの登録は法人では使えません。法人の登録番号は「T＋法人番号」で、<strong>法人として改めて登録申請</strong>が必要です。
              </li>
            </ul>
          </section>

          <section>
            <H2>1. 株式会社と合同会社の比較</H2>
            <p>
              個人事業からの法人成りで選ばれるのは、ほとんどが株式会社か合同会社です。税金（法人税など）の計算は同じで、違いは設立費用と運営のルールです。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>項目</th>
                    <th className={thHead}>株式会社</th>
                    <th className={thHead}>合同会社</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={th}>定款の認証（公証役場）</td>
                    <td className={td}>必要（会社法30条）</td>
                    <td className={td}>不要</td>
                  </tr>
                  <tr>
                    <td className={th}>定款認証手数料</td>
                    <td className={td}>1.5万〜5万円（下表）</td>
                    <td className={td}>なし</td>
                  </tr>
                  <tr>
                    <td className={th}>定款の印紙税</td>
                    <td className={td}>紙の定款は4万円／電子定款は不要</td>
                    <td className={td}>紙の定款は4万円／電子定款は不要</td>
                  </tr>
                  <tr>
                    <td className={th}>設立登記の登録免許税</td>
                    <td className={td}>資本金×0.7%。最低15万円</td>
                    <td className={td}>資本金×0.7%。最低6万円</td>
                  </tr>
                  <tr>
                    <td className={th}>役員の任期</td>
                    <td className={td}>
                      取締役は原則2年。株式の譲渡に会社の承認が必要な会社（非公開会社）は定款で最長10年まで延長可（会社法332条）
                    </td>
                    <td className={td}>法律上の任期なし</td>
                  </tr>
                  <tr>
                    <td className={th}>任期満了時の登記</td>
                    <td className={td}>同じ人が再任しても役員変更登記が必要。登録免許税1万円（資本金1億円以下）</td>
                    <td className={td}>任期がないため不要</td>
                  </tr>
                  <tr>
                    <td className={th}>決算公告</td>
                    <td className={td}>毎年、定時株主総会後に貸借対照表の公告が必要。官報・新聞で公告する会社は要旨で可（会社法440条）</td>
                    <td className={td}>会社法に公告義務の規定なし</td>
                  </tr>
                  <tr>
                    <td className={th}>出資者と経営者</td>
                    <td className={td}>株主（出資者）と取締役（経営者）は別の立場。取締役1人の会社も可（会社法326条）で、1人で兼ねられる</td>
                    <td className={td}>出資者（社員）が原則として業務を執行する（会社法590条）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              1人で事業をしていて、取引先や業界の慣習で「株式会社」である必要がないなら、合同会社の方が設立時も運営中も手間と費用が少なく済みます。株式会社を選ぶなら、任期を10年に延ばしておくと役員変更登記の頻度を減らせます。ただし任期を長くすると、役員を途中で交代させたいときに揉めやすい面もあります。
            </p>

            <H3>株式会社の定款認証手数料（公証人手数料令35条）</H3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-1">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>資本金の額等</th>
                    <th className={`${thHead} text-right`}>手数料</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>
                      100万円未満で、次の3つをすべて満たす
                      <br />
                      ①発起人が全員個人（自然人）で3人以下 ②発起人が設立時の株式を全部引き受ける ③取締役会を置かない
                    </td>
                    <td className={tdR}>{yen(TEIKAN_FEE_MIN)}</td>
                  </tr>
                  <tr>
                    <td className={td}>100万円未満（上の条件を満たさない）</td>
                    <td className={tdR}>{yen(TEIKAN_FEE_LOW)}</td>
                  </tr>
                  <tr>
                    <td className={td}>100万円以上300万円未満</td>
                    <td className={tdR}>{yen(TEIKAN_FEE_MID)}</td>
                  </tr>
                  <tr>
                    <td className={td}>上記以外（300万円以上など）</td>
                    <td className={tdR}>{yen(TEIKAN_FEE_HIGH)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              2021年までは資本金にかかわらず一律5万円でした。2022年1月1日に3段階になり、1.5万円の区分は2024年12月1日から加わっています。このほか、登記に使う定款の謄本代が1枚250円かかります。日本公証人連合会によると、定款に「設立に際して出資される財産の最低額」（「○○万円以上」の書き方）を記載すると「上記以外」の扱いになり、5万円になります。
            </p>

            <H3>法定の実費の合計（最も安い場合）</H3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-1">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>費用</th>
                    <th className={`${thHead} text-right`}>株式会社</th>
                    <th className={`${thHead} text-right`}>合同会社</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>登録免許税（最低額）</td>
                    <td className={tdR}>{yen(REG_TAX_KK)}</td>
                    <td className={tdR}>{yen(REG_TAX_GK)}</td>
                  </tr>
                  <tr>
                    <td className={td}>定款認証手数料</td>
                    <td className={tdR}>{yen(TEIKAN_FEE_MIN)}〜{yen(TEIKAN_FEE_HIGH)}</td>
                    <td className={tdR}>0円</td>
                  </tr>
                  <tr>
                    <td className={td}>印紙税（電子定款なら0円）</td>
                    <td className={tdR}>0円 / {yen(STAMP_PAPER)}</td>
                    <td className={tdR}>0円 / {yen(STAMP_PAPER)}</td>
                  </tr>
                  <tr className="font-bold bg-gray-50">
                    <td className={td}>最少の合計（電子定款・1.5万円区分）</td>
                    <td className={tdR}>{man(REG_TAX_KK + TEIKAN_FEE_MIN)}＋謄本代</td>
                    <td className={tdR}>{man(REG_TAX_GK)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              登録免許税は資本金×0.7%が最低額を超えると増えます。計算上、株式会社は資本金約2,143万円超、合同会社は約857万円超から最低額を上回ります。代表者印などの印鑑代、登記事項証明書・印鑑証明書の手数料、司法書士などに頼む場合の報酬はこの表に含めていません。電子定款は電子署名が必要なので、自分で作るならマイナンバーカードなどで電子署名できる環境を用意します。
            </p>
          </section>

          <section>
            <H2>2. 設立までの流れ</H2>
            <ol className="list-decimal list-inside space-y-3 mt-2">
              <li>
                <strong>基本事項を決める</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  商号（会社名）、事業目的、本店所在地、資本金、事業年度（決算月）、役員。事業目的は、許認可が必要な業種や将来やりたい事業も含めて書いておくと、後から定款変更と変更登記をする手間と費用を省けます。決算月は個人事業の繁忙期と重ならない月にすると、1期目の決算作業が楽になります。
                </p>
              </li>
              <li>
                <strong>定款を作る</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  合同会社は社員になる人が作成して署名（電子定款なら電子署名）すれば完成です（会社法575条）。株式会社は次の認証が必要です。資本金の書き方は前の章の注意点を確認してください。
                </p>
              </li>
              <li>
                <strong>定款の認証（株式会社のみ）</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  公証役場で公証人の認証を受けます。認証を受けないと定款は効力を持ちません（会社法30条）。オンラインで定款認証と設立登記を同時に申請する方法もあります。
                </p>
              </li>
              <li>
                <strong>資本金を払い込む</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  まだ会社の口座はないので、発起人が定めた銀行等の口座に払い込みます（会社法34条）。実務では発起人（代表者）個人の口座を使い、入金が分かる通帳の写しなどを払込みの証明として登記に添付するのが一般的です。
                </p>
              </li>
              <li>
                <strong>設立登記を申請する</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  本店所在地を管轄する法務局へ申請します。<strong>法務局が申請を受け付けた日が会社の設立日</strong>になります。2026年2月2日からは、休日の直前の開庁日に申請し、申請書に求める旨を書けば、土日祝日を設立日にできるようになりました（「1日設立」などにしたい場合に使えます）。株式会社は、設立時取締役による調査の終了日などから2週間以内に登記する決まりがあります（会社法911条）。
                </p>
              </li>
              <li>
                <strong>登記の完了</strong>
                <p className="ml-5 mt-1 text-gray-600">
                  完全オンライン申請（添付書面をすべて電子化・登録免許税を電子納付・役員等5人以内・補正なし）なら、繁忙期を除き原則24時間以内に完了します。それ以外は、各法務局がホームページで公表している「登記完了予定日」が目安です。完了するまで登記事項証明書や印鑑証明書は取れないので、法人口座の開設などはその後になります。オンライン申請なら法務局への印鑑の提出は任意ですが、法務局は、代表者の印鑑証明書が必要な場合は印鑑を提出するよう案内しています。
                </p>
              </li>
              <li>
                <strong>設立後の届出・切り替え</strong>
                <p className="ml-5 mt-1 text-gray-600">次の章の表のとおりです。登記完了の日から期限が短いものを先に片付けます。</p>
              </li>
            </ol>
          </section>

          <section>
            <H2>3. 設立後の届出一覧（法人側）</H2>
            <p>期限は「設立日（登記を申請した日）」や「事実が発生した日」から数えます。期限が土日祝日に当たる場合の扱いは届出ごとに異なるので、余裕を持って出してください。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>届出</th>
                    <th className={thHead}>提出先</th>
                    <th className={thHead}>期限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>健康保険・厚生年金保険 新規適用届</td>
                    <td className={td}>年金事務所（事務センター）</td>
                    <td className={td}>事実発生から5日以内</td>
                  </tr>
                  <tr>
                    <td className={td}>健康保険・厚生年金保険 被保険者資格取得届（社長本人も）</td>
                    <td className={td}>年金事務所（新規適用届と同時）</td>
                    <td className={td}>事実発生から5日以内</td>
                  </tr>
                  <tr>
                    <td className={td}>法人設立・設置届出書（地方税）</td>
                    <td className={td}>都道府県税事務所・市町村</td>
                    <td className={td}>東京都は事業開始の日から15日以内。他の自治体は各条例で確認</td>
                  </tr>
                  <tr>
                    <td className={td}>法人設立届出書（国税）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>設立の日以後2か月以内</td>
                  </tr>
                  <tr>
                    <td className={td}>青色申告の承認申請書</td>
                    <td className={td}>税務署</td>
                    <td className={td}>設立の日以後3か月を経過した日と1期目の事業年度終了日のうち、早い方の前日まで</td>
                  </tr>
                  <tr>
                    <td className={td}>給与支払事務所等の開設届出書</td>
                    <td className={td}>税務署</td>
                    <td className={td}>開設から1か月以内</td>
                  </tr>
                  <tr>
                    <td className={td}>源泉所得税の納期の特例の承認に関する申請書</td>
                    <td className={td}>税務署</td>
                    <td className={td}>随時（提出した月の翌月に源泉徴収する分から）</td>
                  </tr>
                  <tr>
                    <td className={td}>適格請求書発行事業者の登録申請書（インボイス）</td>
                    <td className={td}>税務署（インボイス登録センター）</td>
                    <td className={td}>1期目の末日までに出せば設立日から登録可</td>
                  </tr>
                  <tr>
                    <td className={td}>事前確定届出給与に関する届出書（使う場合のみ）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>設立の日以後2か月を経過する日まで</td>
                  </tr>
                  <tr>
                    <td className={td}>棚卸資産の評価方法・減価償却資産の償却方法の届出書（任意）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>1期目の確定申告書の提出期限まで</td>
                  </tr>
                  <tr>
                    <td className={td}>労働保険 保険関係成立届／雇用保険適用事業所設置届（従業員を雇う場合）</td>
                    <td className={td}>労働基準監督署／ハローワーク</td>
                    <td className={td}>それぞれ翌日から10日以内</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-gray-600">
              <li>
                法人は社長1人だけでも健康保険・厚生年金保険の強制適用事業所です（日本年金機構）。役員報酬を払い始めるなら、設立直後に手続きが必要です。
              </li>
              <li>
                東京23区内だけに事務所がある法人は、市町村民税に当たる分も都民税として都税事務所に申告します。区役所への別の届出は通常ありません。23区外や他の道府県では、都道府県と市町村の両方に出します。
              </li>
              <li>
                納期の特例は給与の支給人員が常時10人未満の場合に使えます。承認されると源泉所得税の納付が年2回（1〜6月分は7月10日、7〜12月分は翌年1月20日）になります。
              </li>
              <li>
                消費税は、資本金1,000万円未満なら1期目は原則として免税です。ただしインボイス登録をすると1期目から課税事業者になります。資本金1,000万円以上の会社は1期目から課税です。
              </li>
            </ul>
          </section>

          <section>
            <H2>4. 個人事業側でやること</H2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>手続き</th>
                    <th className={thHead}>提出先</th>
                    <th className={thHead}>期限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>個人事業の開業・廃業等届出書（廃業）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>廃業した年分の確定申告期限まで</td>
                  </tr>
                  <tr>
                    <td className={td}>所得税の青色申告の取りやめ届出書</td>
                    <td className={td}>税務署</td>
                    <td className={td}>取りやめる年分の確定申告期限まで</td>
                  </tr>
                  <tr>
                    <td className={td}>給与支払事務所等の廃止届出書（従業員・専従者に給与を払っていた場合）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>廃止から1か月以内</td>
                  </tr>
                  <tr>
                    <td className={td}>消費税の事業廃止届出書（課税事業者だった場合）</td>
                    <td className={td}>税務署</td>
                    <td className={td}>速やかに</td>
                  </tr>
                  <tr>
                    <td className={td}>個人事業税の事業廃止の申告</td>
                    <td className={td}>都道府県税事務所</td>
                    <td className={td}>東京都は廃止の日から10日以内</td>
                  </tr>
                  <tr>
                    <td className={td}>国民健康保険の脱退</td>
                    <td className={td}>市区町村</td>
                    <td className={td}>新宿区の場合、社会保険に加入してから14日以内</td>
                  </tr>
                  <tr>
                    <td className={td}>国民年金から厚生年金への切り替え</td>
                    <td className={td}>—</td>
                    <td className={td}>会社が資格取得届を出せば本人の届出は不要</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <H3>インボイス登録は引き継がれない</H3>
            <p>
              個人事業者と新しく作った法人は、税金の上では別の事業者です。インボイスの登録番号は、法人番号を持つ事業者なら「T＋法人番号（13桁）」と決まっているので、個人の番号を法人がそのまま使うことはできません。取引先がインボイスを求めるなら、法人として登録申請をします。国税庁の新設法人の特例では、事業を始めた課税期間の末日までに申請すれば、設立日にさかのぼって登録を受けられます。
            </p>
            <p>
              個人側の登録は、消費税の事業廃止届出書を出すと廃止日の翌日に効力がなくなります。国税庁は、事業用の資産を法人に買い取ってもらうなどの整理が終わった後に事業廃止届出書を出せばよい、と案内しています。請求書のテンプレートの登録番号を、切り替え日に合わせて差し替えるのを忘れないでください。
            </p>
            <p className="text-xs text-gray-600">
              なお、インボイス登録をきっかけに課税事業者になった人向けの「2割特例」は、2026年9月30日を含む課税期間までの措置です。2027年・2028年の「3割特例」は個人事業者が対象です。2026年10月以降に設立する法人は、どちらも使えないと考えてください（国税庁タックスアンサーNo.6498）。
            </p>
          </section>

          <section>
            <H2>5. 個人から法人への引継ぎ</H2>
            <p>法人は個人とは別の「人」です。個人名義のものは、手続きをしない限り自動では法人に移りません。</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>取引先との契約</strong>：契約の相手方が変わるので、新しく契約を結ぶか、相手の同意を得て契約上の地位を法人に移します。請求書の宛先・振込先・インボイス番号の変更も、あわせて取引先に知らせます。
              </li>
              <li>
                <strong>銀行口座</strong>：法人口座は登記完了後に、登記事項証明書などを持って申し込みます。審査に時間がかかることもあるので、個人口座はしばらく残しておき、法人化前の売上の入金と経費の支払いは個人口座で処理します。
              </li>
              <li>
                <strong>許認可</strong>：個人で受けた許可や登録が法人に自動で移るとは限りません。業種によっては法人として取り直す必要があり、許可が下りるまで法人で営業できないこともあります。設立前に所管の窓口へ確認してください。
              </li>
              <li>
                <strong>事業用の資産</strong>：方法は、法人に売る・法人に貸す・個人で持ち続ける、などから選びます。法人に売る場合、時価の2分の1未満の価額で売ると、時価で売ったものとして個人に譲渡所得の税金がかかります（所得税法59条）。不動産を現物出資した場合も同じ判定があります。
              </li>
              <li>
                <strong>一括償却資産</strong>：3年に分けて経費にしていた一括償却資産のまだ経費にしていない残りは、廃業した年の事業所得の必要経費に全額入れます（国税庁 質疑応答事例）。
              </li>
              <li>
                <strong>売掛金・買掛金</strong>：法人化前の取引分は個人の売上・経費です。法人の口座に入金された場合は、個人と法人の間で精算し、帳簿を分けておきます。
              </li>
            </ul>
          </section>

          <section>
            <H2>6. 法人化した年の個人の確定申告</H2>
            <p>
              年の途中で法人化した年は、翌年3月の確定申告で「1月1日から廃業日までの事業所得」と「法人から受け取った役員報酬（給与所得）」をまとめて申告します。会社の年末調整だけでは終わりません。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>個人事業税の見込控除</strong>：事業税は通常、課税された年の経費になりますが、廃業した年は翌年に課される事業税を見込みで計算し、その年の必要経費に入れられます（所得税基本通達37-7）。使わない場合は、事業税が確定した後に更正の請求で取り戻す方法があります（所得税法63条・152条）。
              </li>
              <li>
                <strong>廃業後に出た費用</strong>：廃業後に発生した、事業に関する費用や損失の扱いにも所得税法63条の特例があります。
              </li>
              <li>
                <strong>翌年の住民税・国保</strong>：住民税は前年の所得で計算されるため、法人化した翌年の住民税は、法人化した年の事業所得と役員報酬を合わせた所得にかかります。法人化しても、翌年の住民税はすぐには下がりません。
              </li>
            </ul>
          </section>

          <section>
            <H2>7. 設立直後から毎月かかるお金（計算例）</H2>
            <p>
              設立後は、役員報酬を払い始めた月から社会保険料の支払いが始まります。法人化前の資金計画に入れておくべき金額を、このサイトのシミュレーターと同じモデルで計算しました。
            </p>
            <Calc>
              <p className="font-bold">前提</p>
              <p>
                協会けんぽ東京支部・令和8年度の料率（健康保険9.85%、40〜64歳は介護保険1.62%を加算、子ども・子育て支援金0.23%）、厚生年金18.3%、子ども・子育て拠出金0.36%（会社のみ負担）。標準報酬月額の等級に当てはめた年額。賞与なし。
              </p>
            </Calc>
            {[
              { title: '35歳（介護保険なし）', rows: rows35 },
              { title: '45歳（介護保険あり）', rows: rows45 },
            ].map(group => (
              <div key={group.title} className="overflow-x-auto">
                <p className="mt-3 font-bold text-xs">{group.title}</p>
                <table className="w-full text-xs border-collapse mt-1">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className={thHead}>役員報酬（月額）</th>
                      <th className={`${thHead} text-right`}>本人負担（年）</th>
                      <th className={`${thHead} text-right`}>会社負担（年）</th>
                      <th className={`${thHead} text-right`}>合計（年）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map(r => (
                      <tr key={r.monthly}>
                        <td className={td}>{man(r.monthly)}</td>
                        <td className={tdR}>{yen(r.employee)}</td>
                        <td className={tdR}>{yen(r.employer)}</td>
                        <td className={`${tdR} font-bold`}>{yen(r.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <p className="mt-2">
              このほか、利益が出なくても法人住民税の均等割がかかります。モデルでは赤字でもかかる固定費として年{yen(fixedResidentTax)}を計上しています（売上・役員報酬ゼロで計算した法人の税額）。実際の額は自治体・資本金・従業員数で変わります。役員報酬の決め方は
              <Link href="/articles/director-salary" className="text-blue-600 hover:underline">役員報酬の決め方</Link>、
              国保と社会保険の比較は
              <Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline">国保と社保の比較</Link>
              の記事で詳しく扱っています。
            </p>
          </section>

          <section>
            <H2>8. よくある失敗</H2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>定款に「資本金○○万円以上」と書いてしまう</strong>：資本金が100万円未満でも、認証手数料は5万円の区分になります。資本金は確定額で書きます。
              </li>
              <li>
                <strong>1.5万円になると思ったら3万円だった</strong>：発起人に法人が入っている、発起人が4人以上、取締役会を置く、のどれかに当たると対象外です。
              </li>
              <li>
                <strong>青色申告の承認申請が間に合わない</strong>：設立日から3か月以内（1期目が3か月より短ければその末日の前日まで）です。決算月を設立直後にすると、さらに短くなります。
              </li>
              <li>
                <strong>役員報酬を決めるのが遅れる</strong>：毎月同額の役員報酬（定期同額給与）は、事業年度の開始から3か月を経過する日までに金額を決めるのが原則です。1期目は設立日が事業年度の開始日です（国税庁No.5211）。途中で自由に変えた分は法人の経費にならないことがあります。
              </li>
              <li>
                <strong>個人のインボイス番号のまま法人の請求書を出す</strong>：法人の番号は別です。法人の登録が済むまでの請求書の扱いも、取引先と相談しておきます。
              </li>
              <li>
                <strong>国保の脱退を忘れる</strong>：会社の健康保険に入っても、国保は自動では抜けません。届出をしないまま国保の資格確認書などで受診すると、後で医療費を返すことになります（新宿区）。
              </li>
              <li>
                <strong>社会保険の手続きを後回しにする</strong>：法人は社長1人でも加入義務があります。届出が遅れても、さかのぼって保険料を納めることになります。
              </li>
              <li>
                <strong>資本金を大きくしすぎる</strong>：資本金1,000万円以上だと1期目から消費税の課税事業者になり、登録免許税も資本金の0.7%が最低額を超えると増えます。
              </li>
            </ol>
          </section>

          <section>
            <H2>9. 印刷用チェックリスト</H2>
            <div className="border-2 border-gray-300 rounded-lg p-4 space-y-3 text-xs">
              <div>
                <p className="font-bold mb-1">設立前</p>
                <ul className="space-y-1">
                  <Check>シミュレーターで法人化後の負担を確認した</Check>
                  <Check>株式会社か合同会社かを決めた</Check>
                  <Check>商号・事業目的・本店・資本金（確定額）・決算月・役員を決めた</Check>
                  <Check>許認可が必要な業種か、法人で取り直しが必要かを所管窓口に確認した</Check>
                  <Check>電子定款の作成方法（自分で電子署名／専門家に依頼）を決めた</Check>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">設立手続き</p>
                <ul className="space-y-1">
                  <Check>定款を作成した（株式会社は公証役場で認証）</Check>
                  <Check>資本金を払い込み、払込みの証明を用意した</Check>
                  <Check>設立登記を申請した（申請日＝設立日）</Check>
                  <Check>登記完了後、登記事項証明書・印鑑証明書を取得した</Check>
                  <Check>法人口座を申し込んだ</Check>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">設立後（期限の短い順）</p>
                <ul className="space-y-1">
                  <Check>5日以内：社会保険の新規適用届・資格取得届</Check>
                  <Check>15日以内（東京都）：法人設立・設置届出書（都税事務所）</Check>
                  <Check>1か月以内：給与支払事務所等の開設届出書</Check>
                  <Check>2か月以内：法人設立届出書（税務署）</Check>
                  <Check>3か月以内：青色申告の承認申請書／役員報酬の決定</Check>
                  <Check>随時：源泉所得税の納期の特例の申請</Check>
                  <Check>1期目の末日まで：インボイスの登録申請（必要な場合）</Check>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">個人事業の整理</p>
                <ul className="space-y-1">
                  <Check>国民健康保険の脱退（社保加入から14日以内が目安）</Check>
                  <Check>個人事業税の廃止申告（東京都は10日以内）</Check>
                  <Check>給与支払事務所等の廃止届出書（給与を払っていた場合・1か月以内）</Check>
                  <Check>消費税の事業廃止届出書（課税事業者・インボイス登録者）</Check>
                  <Check>個人事業の廃業届・青色申告の取りやめ届出書</Check>
                  <Check>取引先への通知、契約・振込先・請求書の切り替え</Check>
                  <Check>事業用資産の扱い（売却・賃貸・個人保有）を決めた</Check>
                  <Check>翌年3月：個人の確定申告（事業所得＋役員報酬）</Check>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <H2>まとめ</H2>
            <p>
              法人化の手続きで費用が最も大きいのは登録免許税で、合同会社なら6万円、株式会社なら15万円が最低額です。期限が短いのは社会保険と地方税の届出で、設立直後の1〜2週間に集中します。インボイス、口座、契約、許認可はどれも「個人のものは法人に移らない」と考えて準備しておくと、取引の空白を防げます。
            </p>
            <p>
              手続きに進む前に、
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              で法人化後の税と社会保険の負担を確認してください。いつ法人化するかは
              <Link href="/articles/timing" className="text-blue-600 hover:underline">法人化のタイミング</Link>、
              2026年の制度変更は
              <Link href="/articles/2026-changes" className="text-blue-600 hover:underline">2026年の変更点</Link>
              の記事、計算の前提は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠ページ</Link>
              にまとめています。
            </p>
            <p className="text-xs text-gray-500">
              本記事は2026年11月時点の公表情報にもとづく一般的な情報で、税務・法律の助言ではありません。手数料・期限・様式は改正されることがあり、自治体や業種によって扱いが異なります。実際の手続きは、法務局・税務署・年金事務所・自治体などの窓口や、税理士・司法書士などの専門家に確認してください。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                e-Gov法令検索 会社法（30条・34条・332条・440条・575条・911条）
                <br />
                <Ext href="https://laws.e-gov.go.jp/law/417AC0000000086">https://laws.e-gov.go.jp/law/417AC0000000086</Ext>
              </li>
              <li>
                e-Gov法令検索 公証人手数料令（35条）
                <br />
                <Ext href="https://laws.e-gov.go.jp/law/405CO0000000224">https://laws.e-gov.go.jp/law/405CO0000000224</Ext>
              </li>
              <li>
                日本公証人連合会「会社の定款手数料の改定」
                <br />
                <Ext href="https://www.koshonin.gr.jp/chg_teikanfee">https://www.koshonin.gr.jp/chg_teikanfee</Ext>
              </li>
              <li>
                日本公証人連合会「定款の認証に要する費用、株式会社設立の費用等はいくらですか」
                <br />
                <Ext href="https://www.koshonin.gr.jp/notary/ow09_4/9_4_q03">https://www.koshonin.gr.jp/notary/ow09_4/9_4_q03</Ext>
              </li>
              <li>
                国税庁 No.7191 登録免許税の税額表
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/inshi/7191.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/inshi/7191.htm</Ext>
              </li>
              <li>
                国税庁 No.7141 印紙税額の一覧表（第6号文書 定款）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/inshi/7141.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/inshi/7141.htm</Ext>
              </li>
              <li>
                法務局「商業・法人登記の申請書様式」（設立年月日・登記完了予定日）
                <br />
                <Ext href="https://houmukyoku.moj.go.jp/homu/COMMERCE_11-1.html">https://houmukyoku.moj.go.jp/homu/COMMERCE_11-1.html</Ext>
              </li>
              <li>
                法務省「休日を会社等の設立の日とすることが可能になりました」
                <br />
                <Ext href="https://www.moj.go.jp/MINJI/minji06_00234.html">https://www.moj.go.jp/MINJI/minji06_00234.html</Ext>
              </li>
              <li>
                法務省「完全オンライン申請による法人設立登記の『24時間以内処理』について」
                <br />
                <Ext href="https://www.moj.go.jp/MINJI/minji06_00006.html">https://www.moj.go.jp/MINJI/minji06_00006.html</Ext>
              </li>
              <li>
                法務局「よくあるご質問（商業・法人登記関係）」（印鑑の提出）
                <br />
                <Ext href="https://houmukyoku.moj.go.jp/homu/static/shougyou.html">https://houmukyoku.moj.go.jp/homu/static/shougyou.html</Ext>
              </li>
              <li>
                国税庁 No.5100 新設法人の届出書類
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5100.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5100.htm</Ext>
              </li>
              <li>
                国税庁 A2-7 給与支払事務所等の開設・移転・廃止の届出
                <br />
                <Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/annai/1648_11.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/annai/1648_11.htm</Ext>
              </li>
              <li>
                国税庁 No.2505 源泉所得税及び復興特別所得税の納付期限と納期の特例
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2505.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2505.htm</Ext>
              </li>
              <li>
                国税庁 インボイスQ&amp;A 問11（新たに設立された法人等の登録時期の特例）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/pdf/qa/11.pdf">https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/pdf/qa/11.pdf</Ext>
              </li>
              <li>
                国税庁 No.6498 適格請求書等保存方式（インボイス制度）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6498.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6498.htm</Ext>
              </li>
              <li>
                国税庁 インボイス制度 新規開業者向けページ（法人成りと事業廃止届出書）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice_sinkijigyousha.htm">https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice_sinkijigyousha.htm</Ext>
              </li>
              <li>
                国税庁 No.6503 納税義務の免除の特例（新設法人）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6503.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6503.htm</Ext>
              </li>
              <li>
                国税庁 No.6603 個人事業者が事業を廃止した場合
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6603.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6603.htm</Ext>
              </li>
              <li>
                国税庁 A1-5 個人事業の開業届出・廃業届出等手続
                <br />
                <Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shinkoku/annai/04.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shinkoku/annai/04.htm</Ext>
              </li>
              <li>
                国税庁 A1-9 所得税の青色申告の取りやめ手続
                <br />
                <Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shinkoku/annai/23200008.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shinkoku/annai/23200008.htm</Ext>
              </li>
              <li>
                国税庁 D1-14 事業廃止届出手続（消費税）
                <br />
                <Ext href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shohi/annai/1461_06.htm">https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shohi/annai/1461_06.htm</Ext>
              </li>
              <li>
                国税庁 No.5211 役員に対する給与
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/hojin/5211.htm</Ext>
              </li>
              <li>
                国税庁 No.3217 時価より低い価額で売ったとき／No.3117 不動産を法人に現物出資したとき
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3217.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3217.htm</Ext>
                <br />
                <Ext href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3117.htm">https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3117.htm</Ext>
              </li>
              <li>
                国税庁 質疑応答事例「法人成りした場合の一括償却資産の必要経費算入」
                <br />
                <Ext href="https://www.nta.go.jp/law/shitsugi/shotoku/04/04.htm">https://www.nta.go.jp/law/shitsugi/shotoku/04/04.htm</Ext>
              </li>
              <li>
                国税庁 所得税基本通達37-7（事業を廃止した場合の事業税の見込控除）
                <br />
                <Ext href="https://www.nta.go.jp/law/tsutatsu/kihon/shotoku/05/06.htm">https://www.nta.go.jp/law/tsutatsu/kihon/shotoku/05/06.htm</Ext>
              </li>
              <li>
                日本年金機構「新規適用の手続き」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150311.html">https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150311.html</Ext>
              </li>
              <li>
                日本年金機構「就職したとき（健康保険・厚生年金保険の資格取得）の手続き」
                <br />
                <Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20150422.html">https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20150422.html</Ext>
              </li>
              <li>
                日本年金機構「国民年金制度の基本的事項 ～適用・保険料編～」（厚生年金加入時の届出）
                <br />
                <Ext href="https://www.nenkin.go.jp/service/riyoushabetsu/cooperator/kenshu.files/01.pdf">https://www.nenkin.go.jp/service/riyoushabetsu/cooperator/kenshu.files/01.pdf</Ext>
              </li>
              <li>
                東京都主税局「事業を始めたとき・廃止したとき」
                <br />
                <Ext href="https://www.tax.metro.tokyo.lg.jp/scene/business">https://www.tax.metro.tokyo.lg.jp/scene/business</Ext>
              </li>
              <li>
                東京都主税局「法人事業税・法人都民税（仕事と税金）」（23区の都民税）
                <br />
                <Ext href="https://www.tax.metro.tokyo.lg.jp/shitsumon/work/a1">https://www.tax.metro.tokyo.lg.jp/shitsumon/work/a1</Ext>
              </li>
              <li>
                新宿区「国民健康保険の届出について」
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html">https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html</Ext>
              </li>
              <li>
                厚生労働省「労働保険の成立手続」
                <br />
                <Ext href="https://www.mhlw.go.jp/www2/topics/seido/daijin/hoken/980916_2.htm">https://www.mhlw.go.jp/www2/topics/seido/daijin/hoken/980916_2.htm</Ext>
              </li>
              <li>
                全国健康保険協会 令和8年度 都道府県単位保険料率
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08">https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08</Ext>
              </li>
            </ul>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="procedure" />
      </main>

      <SiteFooter />
    </div>
  )
}
