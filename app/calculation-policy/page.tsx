import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: '計算根拠と前提条件 | 法人化シミュレーター',
  description: '法人化シミュレーターで使用している所得税、住民税、個人事業税、法人税、社会保険料の計算前提と注意点を公開しています。',
}

const individualRows = [
  ['事業所得', '売上高 − 経費 − 青色申告特別控除 − 専従者給与'],
  ['国民健康保険', '(事業所得 − 43万円) × 所得割率 ＋ 均等割（世帯人数分）。東京23区（新宿区）の令和8年度料率：医療分7.51%・47,600円（上限67万円）、支援金分2.80%・17,600円（上限26万円）、介護分2.43%・17,800円（40〜64歳、上限17万円）、子ども・子育て支援金分0.27%・1,873円（上限3万円）'],
  ['国民年金', '月額17,920円（令和8年度）× 12か月。配偶者ありの場合は配偶者分も加算'],
  ['所得税の課税所得', '事業所得 − 基礎控除（合計所得489万円以下104万円／655万円以下67万円／2,350万円以下62万円）− 配偶者控除38万円 − 扶養控除38万円 − 社会保険料控除（国保・国民年金）− iDeCo等 − その他の所得控除'],
  ['所得税', '課税所得に5%〜45%の超過累進税率を適用し、復興特別所得税2.1%を加算。住宅ローン控除は税額から控除'],
  ['住民税', '基礎控除43万円・配偶者控除33万円・扶養控除33万円で住民税用の課税所得を別に計算し、所得割10% ＋ 均等割等5,000円'],
  ['個人事業税', '(事業所得 − 事業主控除290万円) × 業種別税率'],
]

const corporateRows = [
  ['役員の給与所得', '役員報酬 − 給与所得控除（令和8年分：最低保障額74万円、収入360万円以下は30%＋8万円）'],
  ['標準報酬月額', '報酬月額を健康保険50等級（5.8万〜139万円）・厚生年金32等級（8.8万〜65万円）の等級表に当てはめて決定'],
  ['社会保険料', '協会けんぽ東京 令和8年度：健康保険9.85%、介護保険1.62%（40〜64歳）、子ども・子育て支援金0.23%、厚生年金18.3%を労使折半。子ども・子育て拠出金0.36%は会社のみ負担'],
  ['役員の所得税・住民税', '個人事業主側と同じ控除・税率で計算（社会保険料控除は本人負担分）'],
  ['配偶者', '配偶者役員報酬を設定しない場合、配偶者は代表者の健康保険の扶養・国民年金第3号被保険者とする'],
  ['法人課税所得', '売上高 − 経費 − 役員報酬 − 会社負担社会保険料 − 配偶者役員報酬等'],
  ['法人税等', '中小法人を前提に、法人税（800万円以下15%・超過分23.2%）・地方法人税10.3%・法人住民税法人税割7%・法人事業税（3.5%／5.3%／7.0%）・特別法人事業税37%で概算'],
  ['法人住民税均等割', '赤字でも発生する固定費として年70,000円を計上'],
]

const limitationRows = [
  ['地域差', '国民健康保険料、住民税均等割、協会けんぽ料率は地域や年度で変わります。'],
  ['事業内容', '個人事業税の対象業種、消費税の課税区分、インボイス登録状況は個別判断が必要です。'],
  ['家族構成', '配偶者控除、扶養控除、社会保険の扶養可否は所得や年齢などで変わります。'],
  ['法人維持費', '税理士報酬、会計ソフト、登記変更費用などは試算結果の本体には含めていません。'],
  ['役員報酬', '法人では役員報酬を原則として期中に自由変更できません。実務では事業計画と合わせて決める必要があります。'],
]

function DataTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-3">
        <tbody>
          {rows.map(([label, detail]) => (
            <tr key={label}>
              <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left align-top w-32 text-gray-800">
                {label}
              </th>
              <td className="border border-gray-300 px-3 py-2 text-gray-700">
                {detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CalculationPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '計算根拠と前提条件', href: '/calculation-policy' }]} />
        <h1 className="text-xl font-bold text-gray-900 mb-4">計算根拠と前提条件</h1>
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-7 text-gray-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <p>
              法人化シミュレーターは、個人事業主として事業を続けた場合と、法人化して役員報酬を受け取る場合の
              <strong>税金・社会保険料の年間負担額</strong>を比較するための概算ツールです。
            </p>
            <p>
              税制や社会保険料は地域、年度、家族構成、業種、届出状況によって変わります。そのため、本サイトでは計算モデルを公開し、どこまでを試算に含めているかを明示しています。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">計算モデルの対象年度と制約</h2>
            <p>現行モデルは<strong>2026年（令和8年）分の所得税・住民税</strong>と<strong>令和8年度の社会保険料</strong>を使用しています。令和8年度税制改正による基礎控除の引上げ（最大104万円）と給与所得控除の最低保障額74万円、令和8年4月分から始まった子ども・子育て支援金を反映しています。</p>
            <p className="mt-3">一方で、以下は簡易化しています。国民健康保険は東京23区の料率で、自治体による差は反映していません。扶養親族は一般の扶養親族（38万円）として扱い、特定扶養親族・老人扶養親族の区分、住民税の調整控除、未就学児の国保均等割軽減は計算していません。配偶者役員の介護保険料は代表者と同じ年齢区分と仮定しています。個人事業税は青色申告控除後の事業所得を使う簡易モデルです。実際の税額・保険料とは差が生じます。</p>
            <p className="mt-3">数値は次の公式資料で確認しています（2026年10月29日確認）。</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><a href="https://www.nta.go.jp/publication/pamph/gensen/2026kaisei.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">国税庁：源泉所得税の改正のあらまし（令和8年4月）</a></li>
              <li><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">国税庁：所得税の税率</a></li>
              <li><a href="https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">日本年金機構：令和8年度の国民年金保険料</a></li>
              <li><a href="https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">協会けんぽ：令和8年度 都道府県単位保険料率</a></li>
              <li><a href="https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">新宿区：国民健康保険料の計算方法（令和8年度）</a></li>
              <li><a href="https://www2.city.kyoto.lg.jp/shikai/img/iinkai/soumushoubou/R08/data/080525gyouzai.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">京都市：個人市民税の基礎控除・給与所得控除の改正概要</a></li>
            </ul>
            <h3 className="font-bold text-gray-900 mt-4">2026年10月の計算モデル更新内容</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>2024年度の数値から、2026年分の控除・令和8年度の保険料率に更新</li>
              <li>個人事業主側で国保・国民年金の社会保険料控除を差し引くよう修正</li>
              <li>住民税の課税所得を住民税の控除額（基礎控除43万円等）で別に計算</li>
              <li>標準報酬月額を正式な等級表で決定し、役員の介護保険料（40〜64歳）を反映</li>
              <li>配偶者がいる場合の国民年金・国保均等割（個人側）と扶養（法人側）の違いを反映</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">個人事業主側の計算</h2>
            <DataTable rows={individualRows} />
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化後の計算</h2>
            <DataTable rows={corporateRows} />
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">判定ロジック</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>個人事業主の総負担額から、法人化後の総負担額を差し引いた金額を「節税効果」としています。</li>
              <li>年間50万円以上有利な場合は「法人化を強くおすすめ」、0円以上50万円未満の場合は「検討する価値あり」と判定します。</li>
              <li>法人化が不利な場合は、売上を増やしたときに法人化が有利になる事業所得の目安を二分探索で計算します。</li>
              <li>法人設立費用の回収年数は、設立費用25万円を年間節税効果で割って概算しています。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">試算に含めていない主な項目</h2>
            <DataTable rows={limitationRows} />
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">更新方針</h2>
            <p>
              税率、社会保険料率、控除額に関する前提は、公開情報や制度改正に合わせて見直します。大きな制度変更があった場合は、計算ロジックと記事内容を順次更新します。
            </p>
            <p className="mt-2 text-xs text-gray-500">
              最終更新日: 2026年10月29日
            </p>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-900 space-y-2">
            <h2 className="text-sm font-bold">注意事項</h2>
            <p>
              本サイトは税理士・社会保険労務士による個別相談の代替ではありません。正確な税額、社会保険料、法人化の可否判断は、税務署、年金事務所、税理士、社会保険労務士などの専門家にご確認ください。
            </p>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
