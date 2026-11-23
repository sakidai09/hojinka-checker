import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'
import { calcIndividual, calcCorporate, NATIONAL_PENSION_MONTHLY } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'

export const metadata: Metadata = {
  title: '国保・国民年金と社会保険の違い｜給付・扶養・年金を比較（2026年版） | 法人化シミュレーター',
  description:
    '個人事業主の国民健康保険・国民年金と、法人役員の健康保険・厚生年金の違いを、加入の仕組み・保険料の決まり方・扶養・傷病手当金・出産手当金・老齢/障害/遺族年金・40歳以降の介護保険まで公的資料に基づいて整理。本人＋会社の負担と受けられる給付を計算例で示します。',
}

// ===== 計算例の前提 =====
// 東京都（国保は新宿区 令和8年度、社保は協会けんぽ東京 令和8年度）・40歳。
// 個人：事業所得600万円（売上665万円・経費0・青色申告特別控除65万円）
// 法人：役員報酬 年600万円（月50万円、賞与なし）。月50万円は健康保険・厚生年金とも標準報酬月額50万円の等級にちょうど一致
const SALARY_MONTHLY = 500_000
const PENSION_RATE = 0.183 // 厚生年金保険料率（労使合計）

const sampleInput: InputData = {
  revenue: 6_650_000, expenses: 0, blueFormDeduction: 650_000, familyWorkerSalary: 0,
  hasSpouse: false, dependents: 0, ideco: 0, age: 40, directorSalary: SALARY_MONTHLY * 12,
  industryTaxRate: 0.05, mortgageDeduction: 0, medicalExpenses: 0, lifeInsuranceDeduction: 0,
  earthquakeInsurance: 0, donationDeduction: 0, spouseDirectorSalary: 0,
}
// 家族あり：配偶者（収入なし）＋子1人（小学生以上）
const familyInput: InputData = { ...sampleInput, hasSpouse: true, dependents: 1 }

const ind = calcIndividual(sampleInput)
const corp = calcCorporate(sampleInput)
const indFam = calcIndividual(familyInput)
const corpFam = calcCorporate(familyInput)

// 厚生年金の本人負担（標準報酬月額50万円 × 18.3% ÷ 2 × 12か月）。残りが健保・介護・子ども子育て支援金
const pensionEmployee = Math.floor(SALARY_MONTHLY * 12 * PENSION_RATE / 2)
const healthEmployee = corp.director.socialInsurance - pensionEmployee
const corpTotal = corp.director.socialInsurance + corp.socialInsuranceEmployer
const indTotal = ind.socialInsurance
const extraCost = corpTotal - indTotal
const corpFamTotal = corpFam.director.socialInsurance + corpFam.socialInsuranceEmployer

// 見返りの試算
// 老齢厚生年金（報酬比例部分・平成15年4月以降の式）: 平均標準報酬額 × 5.481/1000 × 加入月数
const pensionPerYearEnrolled = Math.round(SALARY_MONTHLY * 5.481 / 1000 * 12)
// 傷病手当金・出産手当金の日額: 標準報酬月額の平均 ÷ 30（10円未満四捨五入）× 2/3
const dailyBase = Math.round(SALARY_MONTHLY / 30 / 10) * 10
const sickDaily = Math.round(dailyBase * 2 / 3)
const recoveryYears = extraCost / pensionPerYearEnrolled

// 厚生年金保険料の上限（標準報酬月額の上限65万円 × 18.3%、労使合計・月額）
const pensionCapMonthly = Math.round(650_000 * PENSION_RATE)

const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`
const man = (n: number) => `約${(Math.round(n / 1_000) / 10).toLocaleString('ja-JP')}万円`

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="font-bold text-gray-800 mt-4 mb-1">{children}</h3>
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
      {children}
    </a>
  )
}

const th = 'border border-gray-300 px-2 py-2 text-left bg-gray-100'
const td = 'border border-gray-300 px-2 py-2 align-top'
const tdr = 'border border-gray-300 px-2 py-2 text-right align-top whitespace-nowrap'

export default function SocialInsuranceArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('social-insurance')!.title, href: '/articles/social-insurance' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">国保・国民年金と社会保険（健康保険・厚生年金）の違い｜給付・扶養・年金を比較</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年11月23日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            法人化すると、社長1人の会社でも健康保険・厚生年金（いわゆる社会保険）に加入することになります。保険料の額だけを見ると「高くなる」と感じやすいのですが、社会保険は<strong>払う額の決まり方も、受けられる給付も国保・国民年金とは別の制度</strong>です。この記事では、負担額よりも「制度と給付の違い」に絞って、公的機関の資料で確認できる内容を整理します。
          </p>
          <p>
            事業所得ごとの保険料の比較表は
            <Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline mx-1">国保と社保の負担額比較</Link>
            に分けています。ここでは計算例を1つ（家族ありの変形を含めて2パターン）だけ示し、「払った分で何が得られるのか」まで見ていきます。
          </p>

          <section>
            <H2>まず全体像：何が変わるのか</H2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr>
                    <th className={th}>項目</th>
                    <th className={th}>個人事業主（国保・国民年金）</th>
                    <th className={th}>法人役員（健康保険・厚生年金）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>保険料の基準</td>
                    <td className={td}>前年の所得・世帯の人数。料率は市区町村ごと</td>
                    <td className={td}>役員報酬（標準報酬月額）。料率は都道府県ごと（協会けんぽ）</td>
                  </tr>
                  <tr>
                    <td className={td}>負担する人</td>
                    <td className={td}>全額自分</td>
                    <td className={td}>本人と会社で折半（どちらも結局は自分の会社のお金）</td>
                  </tr>
                  <tr>
                    <td className={td}>扶養</td>
                    <td className={td}>なし（家族も1人ずつ加入者として計算）</td>
                    <td className={td}>要件を満たす家族は保険料なしで加入</td>
                  </tr>
                  <tr>
                    <td className={td}>病気で働けないとき</td>
                    <td className={td}>傷病手当金は法律上「任意給付」で、通常はない</td>
                    <td className={td}>傷病手当金（標準報酬日額の2/3）</td>
                  </tr>
                  <tr>
                    <td className={td}>出産で休むとき</td>
                    <td className={td}>産前産後の国保料・国民年金保険料の免除あり。所得補償はなし</td>
                    <td className={td}>出産手当金＋産休中の保険料免除（本人分・会社分とも）</td>
                  </tr>
                  <tr>
                    <td className={td}>老後の年金</td>
                    <td className={td}>老齢基礎年金のみ</td>
                    <td className={td}>老齢基礎年金＋老齢厚生年金（報酬比例）</td>
                  </tr>
                  <tr>
                    <td className={td}>障害・死亡</td>
                    <td className={td}>障害基礎年金（1・2級）、遺族基礎年金（子のある配偶者・子）</td>
                    <td className={td}>上記に加えて障害厚生年金（1〜3級）・障害手当金、遺族厚生年金</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <H2>1. 加入の仕組み：法人は「社長1人」でも加入が義務</H2>
            <p>
              日本年金機構は、厚生年金保険の適用事業所を「株式会社などの法人の事業所（事業主のみの場合を含む）」と説明しています。つまり<strong>従業員がいない1人会社でも、法人である以上は加入が義務（強制適用）</strong>です。報酬を受け取る代表者・役員は、その事業所の被保険者になります。健康保険もセットで加入します。
            </p>
            <p className="mt-2">
              一方、個人の事業所が強制適用になるのは、常時5人以上の従業員がいて、農林漁業・サービス業などに当たらない場合に限られます。個人事業主本人はそもそも厚生年金に入れないため、国保と国民年金（第1号被保険者）に加入します。
            </p>
            <p className="mt-2">
              法人で社会保険に入ったら、国保は自動では抜けられません。たとえば新宿区では、職場の健康保険に加入した日から14日以内に国保をやめる届出が必要とされています。届け出が遅れると、国保料の請求が続き、二重払いの手間が生じます。
            </p>
          </section>

          <section>
            <H2>2. 保険料の決まり方</H2>
            <H3>国保：前年の所得 × 市区町村の料率 ＋ 人数割</H3>
            <p>
              国民健康保険料は、前年の所得から43万円を引いた額に料率をかける「所得割」と、加入者1人あたりの「均等割」を、世帯単位で合計して決まります。新宿区の令和8年度は、医療分・後期高齢者支援金分・介護分（40〜64歳）・子ども子育て支援金分の4つに分かれ、合計の上限は年113万円です。<strong>料率も上限も市区町村ごとに違う</strong>ので、引っ越すと保険料が変わります。
            </p>
            <p className="mt-2">
              注意したいのは「前年の所得」で決まる点です。売上が落ちた年でも、前年が好調なら高い保険料を払うことになります。
            </p>

            <H3>社保：標準報酬月額 × 料率（会社と折半）</H3>
            <p>
              健康保険・厚生年金は、毎月の報酬をきりのよい金額の段階（<strong>標準報酬月額</strong>）に当てはめ、その額に料率をかけて計算します。段階（等級）は健康保険が5.8万円〜139万円の50段階、厚生年金が8.8万円〜65万円の32段階です。厚生年金は65万円が上限なので、役員報酬が月100万円でも200万円でも、厚生年金保険料は月{yen(pensionCapMonthly)}（労使合計）で頭打ちになります。
            </p>
            <p className="mt-2">標準報酬月額は、主に次の2つのタイミングで決まり直します。</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><strong>定時決定（算定基礎届）</strong>：毎年4〜6月に支払った報酬の平均で、その年の9月から翌年8月までの標準報酬月額を決めます。届出は毎年7月です。</li>
              <li><strong>随時改定（月額変更届）</strong>：固定的な報酬が変わり、変動月から3か月の平均が従来と<strong>2等級以上</strong>違うと、変動月から4か月目に改定されます。</li>
            </ul>
            <p className="mt-2">
              役員報酬は毎月同額で支払うのが一般的なため、標準報酬月額も1年間ほぼ固定されます。「保険料は役員報酬の決め方で決まる」と言ってよく、報酬額の考え方は
              <Link href="/articles/director-salary" className="text-blue-600 hover:underline mx-1">役員報酬の決め方</Link>
              で詳しく扱っています。
            </p>
          </section>

          <section>
            <H2>3. 扶養：国保にはない、社保の大きな違い</H2>
            <p>
              国保には「扶養」という考え方がありません。配偶者や子どもも加入者として1人ずつ均等割がかかり、20歳以上60歳未満の配偶者は自分で国民年金保険料（令和8年度 月{NATIONAL_PENSION_MONTHLY.toLocaleString('ja-JP')}円）を納めます。
            </p>
            <p className="mt-2">
              健康保険では、収入などの要件を満たす家族は<strong>被扶養者</strong>として保険料なしで加入できます。協会けんぽが示す収入の基準は次のとおりです。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr>
                    <th className={th}>対象となる家族</th>
                    <th className={th}>年収の基準</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>基本</td>
                    <td className={td}>130万円未満。同居なら被保険者の年収の半分未満、別居なら被保険者からの仕送り額より少ないこと</td>
                  </tr>
                  <tr>
                    <td className={td}>60歳以上、または障害厚生年金を受けられる程度の障害がある人</td>
                    <td className={td}>180万円未満</td>
                  </tr>
                  <tr>
                    <td className={td}>19歳以上23歳未満（その年の12月31日時点。配偶者を除く）</td>
                    <td className={td}>150万円未満（2025年10月1日以降の認定から）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              さらに2026年4月1日以降は、パートなど給与収入のみの家族について、労働条件通知書などの<strong>労働契約の内容から見込まれる年収</strong>で判定する取扱いが始まっています。
            </p>
            <p className="mt-2">
              扶養される配偶者（20歳以上60歳未満）は国民年金の<strong>第3号被保険者</strong>となり、本人が保険料を納めなくても基礎年金の加入期間になります。夫婦で国民年金を納めていた世帯ほど、法人化による変化が大きくなります。
            </p>
          </section>

          <section>
            <H2>4. 傷病手当金・出産手当金：役員も対象</H2>
            <p>
              病気やけがで働けないときの所得補償は、社保と国保の差がもっとも大きい部分です。国民健康保険法では傷病手当金は条例で定めれば支給できる「任意給付」とされ、自営業者向けに支給している国保は通常ありません。
            </p>
            <H3>傷病手当金（協会けんぽ）</H3>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>条件：業務外の病気・けがで、医師が働けないと認め、連続3日間（待期）を含めて4日以上休み、その間に給与（役員報酬）が支払われていないこと</li>
              <li>1日あたりの額：支給開始日以前の継続した12か月の標準報酬月額の平均 ÷ 30 × 2/3</li>
              <li>期間：支給開始日から通算1年6か月</li>
              <li>報酬が一部支払われた場合は、手当金の日額との差額だけが支給されます</li>
            </ul>
            <p className="mt-2">
              被保険者であれば代表取締役も対象です。ただし、休んでいる間も役員報酬を満額払い続けると支給されません。また健康保険法では、<strong>役員としての業務が原因の病気・けがは原則として健康保険の給付対象外</strong>とされ、被保険者5人未満の事業所の役員の一定の業務だけが例外です。業務中のけがへの備えは、健康保険とは別に確認しておく必要があります。
            </p>
            <H3>出産手当金と産休中の保険料免除</H3>
            <p>
              出産のために休んだ期間（出産日以前42日、多胎は98日から、出産の翌日以後56日まで）について、傷病手当金と同じ計算方法の日額が支給されます。あわせて、産前産後休業中の健康保険・厚生年金保険料は、事業主が届け出ると<strong>本人分も会社分も免除</strong>され、免除期間も年金額の計算では納付済みとして扱われます。日本年金機構は「事業主等であっても、被保険者であれば」免除を受けられると説明しています。
            </p>
            <p className="mt-2">
              個人事業主にも、産前産後の国民年金保険料の免除（原則4か月）と、2024年1月から始まった国保料の産前産後期間の減免（原則4か月分の所得割・均等割）があります。ただし、休業中の収入を補う手当はありません。
            </p>
          </section>

          <section>
            <H2>5. 年金：1階建てと2階建て</H2>
            <H3>老齢基礎年金（共通の1階部分）</H3>
            <p>
              令和8年度の老齢基礎年金の満額は<strong>月70,608円（年約84.7万円）</strong>です（昭和31年4月2日以後生まれ。それ以前の生まれは月70,408円）。満額は20〜60歳の40年間すべて保険料を納めた場合の額で、法人役員として厚生年金に加入している期間も、この1階部分の加入期間に数えられます。
            </p>
            <H3>老齢厚生年金（社保だけの2階部分）</H3>
            <p>
              厚生年金に加入した期間があると、65歳から老齢基礎年金に上乗せして老齢厚生年金を受け取れます。中心となる報酬比例部分は、平成15年4月以降の加入期間について、原則として次の式で計算されます。
            </p>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs leading-relaxed">
              平均標準報酬額 × 5.481／1000 × 加入月数
              <br />
              <span className="text-gray-500">※平均標準報酬額は、過去の標準報酬月額・標準賞与額を現在の価値に直して（再評価して）平均した額。平成15年3月以前の期間は乗率7.125／1000で別に計算します。</span>
            </div>
            <p className="mt-2">
              たとえば標準報酬月額50万円で1年加入すると、50万円 × 5.481／1000 × 12か月 ＝ <strong>年{yen(pensionPerYearEnrolled)}</strong>が、生涯受け取る年金額に上乗せされる計算です（再評価や毎年の改定で実際の額は変わります）。10年加入なら年約{Math.round(pensionPerYearEnrolled * 10 / 10_000)}万円です。式の通り、<strong>役員報酬を下げれば保険料は減りますが、将来の年金も同じ割合で減ります</strong>。
            </p>
          </section>

          <section>
            <H2>6. 障害年金・遺族年金の違い</H2>
            <ul className="list-disc list-inside space-y-2 mt-1">
              <li>
                <strong>障害</strong>：国民年金の障害基礎年金は1級・2級のみです。初診日に厚生年金に加入していれば障害厚生年金があり、1・2級は障害基礎年金に上乗せ、3級（労働に著しい制限がある程度）は障害厚生年金だけが支給されます。3級より軽くても一定の障害が残れば、一時金の障害手当金があります。
              </li>
              <li>
                <strong>遺族</strong>：遺族基礎年金を受け取れるのは「子のある配偶者」または「子」（18歳になった年度末まで等）に限られます。厚生年金の加入者が亡くなると遺族厚生年金があり、子のいない配偶者や父母なども対象順位に入ります。額は亡くなった人の報酬比例部分の4分の3で、在職中の死亡などでは加入期間が300月（25年）未満でも300月とみなして計算します。
              </li>
            </ul>
            <p className="mt-2">
              加入して間もない時期の障害・死亡でも「300月みなし」で一定額が保障される点は、民間保険を検討するときの前提になります。法人化後は、遺族厚生年金の見込み額を差し引いて保障額を考えると、保険の掛けすぎを防げます。
            </p>
          </section>

          <section>
            <H2>7. 40歳からの介護保険、65歳以降</H2>
            <ul className="list-disc list-inside space-y-2 mt-1">
              <li><strong>40〜64歳（第2号被保険者）</strong>：加入している医療保険と一緒に介護保険料を納めます。国保なら介護分（新宿区R8は所得割2.43%＋均等割17,800円、上限17万円）、協会けんぽ東京なら1.62%（会社と折半）です。介護サービスを受けられるのは、末期がんなど加齢に伴う特定の病気が原因の場合に限られます。</li>
              <li><strong>65歳以上（第1号被保険者）</strong>：介護保険料は健康保険料から切り離され、市区町村が所得段階に応じた額で徴収します。年金が年18万円以上なら年金から天引きです。国保・社保どちらでも同じです。</li>
              <li><strong>70歳</strong>：厚生年金の被保険者資格を失い、保険料はかからなくなります（健康保険は続く）。</li>
              <li><strong>75歳</strong>：国保・健康保険とも抜けて、後期高齢者医療制度に移ります。</li>
              <li><strong>在職老齢年金</strong>：65歳以降も役員報酬を受け取りながら老齢厚生年金をもらう場合、報酬（総報酬月額相当額）と年金（基本月額）の合計が令和8年度は<strong>月65万円</strong>を超えると、超えた分の半分が老齢厚生年金から止められます（令和7年度の51万円から引き上げ）。老齢基礎年金は止められません。</li>
            </ul>
          </section>

          <section>
            <H2>8. 計算例：本人＋会社でいくら払い、何が得られるか</H2>
            <p>
              <strong>前提</strong>：東京都在住・40歳・単身。個人は事業所得600万円（青色申告特別控除65万円控除後）、法人は同じ事業で役員報酬を年600万円（月50万円・賞与なし）にした場合。国保は新宿区、社保は協会けんぽ東京の令和8年度料率で、当サイトの計算モデル（
              <Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠</Link>
              ）により算出しています。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr>
                    <th className={th}>年額</th>
                    <th className={th + ' text-right'}>個人事業主</th>
                    <th className={th + ' text-right'}>法人役員</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>医療（＋介護・支援金）</td>
                    <td className={tdr}>{man(ind.nhi)}<br /><span className="text-gray-500">国保</span></td>
                    <td className={tdr}>{man(healthEmployee)}<br /><span className="text-gray-500">本人負担分</span></td>
                  </tr>
                  <tr>
                    <td className={td}>年金</td>
                    <td className={tdr}>{man(ind.pension)}<br /><span className="text-gray-500">国民年金</span></td>
                    <td className={tdr}>{man(pensionEmployee)}<br /><span className="text-gray-500">本人負担分</span></td>
                  </tr>
                  <tr>
                    <td className={td}>本人負担 計</td>
                    <td className={tdr}>{man(indTotal)}</td>
                    <td className={tdr}>{man(corp.director.socialInsurance)}</td>
                  </tr>
                  <tr>
                    <td className={td}>会社負担（子ども・子育て拠出金含む）</td>
                    <td className={tdr}>—</td>
                    <td className={tdr}>{man(corp.socialInsuranceEmployer)}</td>
                  </tr>
                  <tr className="font-bold bg-yellow-50">
                    <td className={td}>本人＋会社 合計</td>
                    <td className={tdr}>{man(indTotal)}</td>
                    <td className={tdr}>{man(corpTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              合計で見ると、法人のほうが年{man(extraCost)}多く払います。当サイトのモデルでは会社負担分を法人の経費として差し引いてから法人税等を計算するため、税金まで含めた損得は
              <Link href="/" className="text-blue-600 hover:underline mx-1">シミュレーター</Link>
              で確認してください。この差額で手に入るものは次のとおりです。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>老齢厚生年金</strong>：1年加入するごとに、65歳から年約{yen(pensionPerYearEnrolled)}が上乗せ。単純計算では、上の差額（1年分）を取り戻すには約{recoveryYears.toFixed(1)}年分の受給が必要な計算です（税・改定・物価は考慮せず）。年金だけで元を取るのは長生きが前提で、保障（下の2つ）込みで評価するのが現実的です。</li>
              <li><strong>傷病手当金</strong>：働けなくなったとき、日額{yen(dailyBase)}×2/3＝約{yen(sickDaily)}（30日で{man(sickDaily * 30)}）を通算1年6か月まで。</li>
              <li><strong>障害厚生年金・遺族厚生年金</strong>：加入期間が短くても300月みなしで計算される保障（遺族厚生年金、在職中の死亡など）。</li>
            </ul>

            <H3>家族がいると差は縮まる</H3>
            <p>
              同じ条件で、収入のない配偶者と子1人（小学生以上）がいる場合です。国保は3人分の均等割、国民年金は夫婦2人分がかかりますが、社保では配偶者と子は被扶養者、配偶者は第3号被保険者になるため、保険料は単身のときと変わりません。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr>
                    <th className={th}>年額</th>
                    <th className={th + ' text-right'}>単身</th>
                    <th className={th + ' text-right'}>配偶者＋子1人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>個人事業主（国保＋国民年金）</td>
                    <td className={tdr}>{man(indTotal)}</td>
                    <td className={tdr}>{man(indFam.socialInsurance)}</td>
                  </tr>
                  <tr>
                    <td className={td}>法人（本人＋会社）</td>
                    <td className={tdr}>{man(corpTotal)}</td>
                    <td className={tdr}>{man(corpFamTotal)}</td>
                  </tr>
                  <tr className="font-bold bg-yellow-50">
                    <td className={td}>法人 − 個人</td>
                    <td className={tdr}>{man(corpTotal - indTotal)}</td>
                    <td className={tdr}>{corpFamTotal - indFam.socialInsurance >= 0 ? '' : '−'}{man(Math.abs(corpFamTotal - indFam.socialInsurance))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ※いずれも概算。国保の軽減制度、賞与、標準報酬の端数処理などは反映していません。所得水準ごとの比較は
              <Link href="/articles/nhi-vs-shaho" className="text-blue-600 hover:underline mx-1">国保と社保の負担額比較</Link>
              と
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline mx-1">損益分岐表</Link>
              をご覧ください。
            </p>
          </section>

          <section>
            <H2>9. よくある誤解</H2>
            <ul className="space-y-3 mt-2">
              <li>
                <p className="font-bold">×「会社が半分払ってくれるから得」</p>
                <p>1人会社の会社負担分は、自分の事業の利益から出ています。比べるときは必ず<strong>本人＋会社の合計</strong>で見ます。</p>
              </li>
              <li>
                <p className="font-bold">×「社保は高いだけで損」</p>
                <p>増えた分は老齢厚生年金・傷病手当金・障害/遺族厚生年金という形で返ってきます。また、扶養に入れられる家族が多いほど、国保との差は縮まります。</p>
              </li>
              <li>
                <p className="font-bold">×「役員は傷病手当金をもらえない」</p>
                <p>被保険者なら役員も対象です。ただし報酬を払い続けると支給されず、役員業務が原因のけがは原則対象外という2点に注意が必要です。</p>
              </li>
              <li>
                <p className="font-bold">×「国保でも家族を扶養に入れられる」</p>
                <p>国保に扶養の仕組みはありません。家族の人数が増えるほど均等割が増えます。</p>
              </li>
              <li>
                <p className="font-bold">×「法人化したら国保は自動で切り替わる」</p>
                <p>市区町村への脱退の届出が必要です（新宿区は14日以内）。</p>
              </li>
              <li>
                <p className="font-bold">×「役員報酬を最低限にすれば一番得」</p>
                <p>保険料は下がりますが、老齢厚生年金・傷病手当金・出産手当金も標準報酬月額に比例して小さくなります。保障をどこまで社保に頼り、どこから民間保険や小規模企業共済などで備えるかの選択です。</p>
              </li>
              <li>
                <p className="font-bold">×「65歳を過ぎて報酬をもらうと年金が全部止まる」</p>
                <p>止まる可能性があるのは老齢厚生年金の一部で、令和8年度は報酬と年金の合計が月65万円を超えた部分の半分です。老齢基礎年金は止まりません。</p>
              </li>
            </ul>
          </section>

          <section>
            <H2>まとめ：判断のチェックリスト</H2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>本人＋会社の合計で、国保・国民年金との差額はいくらか</li>
              <li>扶養に入れられる家族（配偶者・子・親）はいるか。年収基準を満たすか</li>
              <li>働けなくなったときの収入の備えは十分か（傷病手当金の価値）</li>
              <li>老後の年金をどれだけ厚くしたいか（報酬比例部分は報酬×期間に比例）</li>
              <li>65歳以降も役員報酬を受け取る予定か（在職老齢年金）</li>
            </ul>
            <p className="mt-2">
              税金も含めた総額は
              <Link href="/" className="text-blue-600 hover:underline mx-1">法人化シミュレーター</Link>
              で試算できます。制度改正の全体像は
              <Link href="/articles/2026-changes" className="text-blue-600 hover:underline mx-1">2026年の改正まとめ</Link>
              、具体的な世帯例は
              <Link href="/examples" className="text-blue-600 hover:underline mx-1">試算例</Link>
              も参考にしてください。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>日本年金機構「適用事業所と被保険者」<br /><Ext href="https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html">https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html</Ext></li>
              <li>日本年金機構「随時改定（月額変更届）」<br /><Ext href="https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-02.html">https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-02.html</Ext></li>
              <li>日本年金機構「定時決定（算定基礎届）」<br /><Ext href="https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20121017.html">https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20121017.html</Ext></li>
              <li>協会けんぽ「被扶養者とは？」<br /><Ext href="https://www.kyoukaikenpo.or.jp/about/business/dependent_status/001/">https://www.kyoukaikenpo.or.jp/about/business/dependent_status/001/</Ext></li>
              <li>厚生労働省 通知（19歳以上23歳未満の被扶養者の収入要件、令和7年10月1日適用）<br /><Ext href="https://www.mhlw.go.jp/hourei/doc/tsuchi/T250724S0010.pdf">https://www.mhlw.go.jp/hourei/doc/tsuchi/T250724S0010.pdf</Ext></li>
              <li>日本年金機構「労働契約内容による年間収入が基準額未満である場合の被扶養者の認定」<br /><Ext href="https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202605/0501.html">https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202605/0501.html</Ext></li>
              <li>厚生労働省「公的年金制度の仕組み（第3号被保険者）」<br /><Ext href="https://www.mhlw.go.jp/stf/nenkin_shikumi_03.html">https://www.mhlw.go.jp/stf/nenkin_shikumi_03.html</Ext></li>
              <li>協会けんぽ 広報資料「傷病手当金」<br /><Ext href="https://www.kyoukaikenpo.or.jp/~/media/Files/honbu/event/kohoshizai/47_sogo_syoute.pdf">https://www.kyoukaikenpo.or.jp/~/media/Files/honbu/event/kohoshizai/47_sogo_syoute.pdf</Ext></li>
              <li>協会けんぽ「出産手当金について」<br /><Ext href="https://www.kyoukaikenpo.or.jp/benefit/childbirth/001/">https://www.kyoukaikenpo.or.jp/benefit/childbirth/001/</Ext></li>
              <li>健康保険法 第53条の2（法人の役員である被保険者等に関する保険給付の特例）<br /><Ext href="https://www.japaneselawtranslation.go.jp/ja/laws/view/3266/ja">https://www.japaneselawtranslation.go.jp/ja/laws/view/3266/ja</Ext></li>
              <li>国民健康保険法 第58条（任意給付）関連 厚生労働省 事務連絡<br /><Ext href="https://www.mhlw.go.jp/content/000607518.pdf">https://www.mhlw.go.jp/content/000607518.pdf</Ext></li>
              <li>日本年金機構「産前産後休業保険料免除制度」<br /><Ext href="https://www.nenkin.go.jp/service/kounen/hokenryo/menjo/sankyu-menjo/20140509-02.html">https://www.nenkin.go.jp/service/kounen/hokenryo/menjo/sankyu-menjo/20140509-02.html</Ext></li>
              <li>日本年金機構「国民年金保険料の産前産後期間の免除制度」<br /><Ext href="https://www.nenkin.go.jp/service/kokunen/menjo/20180810.html">https://www.nenkin.go.jp/service/kokunen/menjo/20180810.html</Ext></li>
              <li>大田区「国民健康保険料の産前産後期間の減額」<br /><Ext href="https://www.city.ota.tokyo.jp/seikatsu/kokunen/kokuho/topics/kokuho_sanzensango_genmen.html">https://www.city.ota.tokyo.jp/seikatsu/kokunen/kokuho/topics/kokuho_sanzensango_genmen.html</Ext></li>
              <li>日本年金機構 お知らせ（令和8年度の年金額・国民年金保険料）<br /><Ext href="https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html">https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html</Ext></li>
              <li>厚生労働省「令和8年度の年金額改定について」<br /><Ext href="https://www.mhlw.go.jp/stf/houdou/0000191631_00020.html">https://www.mhlw.go.jp/stf/houdou/0000191631_00020.html</Ext></li>
              <li>日本年金機構 用語集「報酬比例部分」<br /><Ext href="https://www.nenkin.go.jp/service/yougo/hagyo/hoshuhirei.html">https://www.nenkin.go.jp/service/yougo/hagyo/hoshuhirei.html</Ext></li>
              <li>日本年金機構 制度説明資料「障害年金」<br /><Ext href="https://www.nenkin.go.jp/service/learn/seidosetsumei.files/shogainenkin.pdf">https://www.nenkin.go.jp/service/learn/seidosetsumei.files/shogainenkin.pdf</Ext></li>
              <li>日本年金機構「遺族厚生年金（受給要件・対象者・年金額）」<br /><Ext href="https://www.nenkin.go.jp/service/jukyu/seido/izokunenkin/jukyu-yoken/20150424.html">https://www.nenkin.go.jp/service/jukyu/seido/izokunenkin/jukyu-yoken/20150424.html</Ext></li>
              <li>日本年金機構「遺族基礎年金（受給要件・対象者・年金額）」<br /><Ext href="https://www.nenkin.go.jp/service/jukyu/seido/izokunenkin/jukyu-yoken/20150401-04.html">https://www.nenkin.go.jp/service/jukyu/seido/izokunenkin/jukyu-yoken/20150401-04.html</Ext></li>
              <li>厚生労働省「介護保険制度の概要」（厚生労働白書 資料編）<br /><Ext href="https://www.mhlw.go.jp/wp/hakusyo/kousei/26-2/dl/10.pdf">https://www.mhlw.go.jp/wp/hakusyo/kousei/26-2/dl/10.pdf</Ext></li>
              <li>日本年金機構 よくある質問（70歳以上の被用者・75歳の健康保険）<br /><Ext href="https://www.nenkin.go.jp/section/faq/kounen/jigyonushi/70hiyosha.html">https://www.nenkin.go.jp/section/faq/kounen/jigyonushi/70hiyosha.html</Ext></li>
              <li>日本年金機構「在職中の老齢厚生年金（在職老齢年金）」<br /><Ext href="https://www.nenkin.go.jp/service/jukyu/seido/roureinenkin/zaishoku/20150401-01.html">https://www.nenkin.go.jp/service/jukyu/seido/roureinenkin/zaishoku/20150401-01.html</Ext></li>
              <li>新宿区「国民健康保険をやめるとき」<br /><Ext href="https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html">https://www.city.shinjuku.lg.jp/hoken/file02_02_00001.html</Ext></li>
              <li>協会けんぽ 令和8年度 都道府県単位保険料率／新宿区 令和8年度国民健康保険料率（計算モデルの前提。詳細は<Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠</Link>）</li>
            </ul>
          </section>

          <p className="text-xs text-gray-500">
            ※本記事は2026年11月時点で公的機関が公表している情報をもとにした一般的な解説であり、個別の税務・社会保険の助言ではありません。保険料率・給付の要件は改定されることがあります。実際の手続きや判断は、年金事務所・協会けんぽ・市区町村、または税理士・社会保険労務士にご確認ください。
          </p>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>

        <RelatedArticles currentSlug="social-insurance" />
      </main>

      <SiteFooter />
    </div>
  )
}
