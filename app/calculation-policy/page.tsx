import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '計算根拠と前提条件 | 法人化シミュレーター',
  description: '法人化シミュレーターで使用している所得税、住民税、個人事業税、法人税、社会保険料の計算前提と注意点を公開しています。',
}

const individualRows = [
  ['事業所得', '売上高 − 経費 − 青色申告特別控除 − 専従者給与'],
  ['課税所得', '事業所得 − 基礎控除 − 配偶者控除 − 扶養控除 − iDeCo等 − その他の所得控除'],
  ['所得税', '課税所得に5%〜45%の超過累進税率を適用し、復興特別所得税2.1%を加算'],
  ['住民税', '課税所得 × 10% + 均等割5,000円'],
  ['個人事業税', '(事業所得 − 事業主控除290万円) × 業種別税率'],
  ['国民健康保険', '所得割・均等割を全国平均に近い簡易モデルで試算'],
  ['国民年金', '月額16,980円 × 12か月'],
]

const corporateRows = [
  ['役員の給与所得', '役員報酬 − 給与所得控除'],
  ['役員の課税所得', '給与所得 − 基礎控除 − 扶養控除 − 社会保険料控除 − その他の所得控除'],
  ['役員の所得税・住民税', '個人側と同じ税率で計算。住宅ローン控除は所得税額から控除'],
  ['社会保険料', '協会けんぽ東京の料率をもとに、本人負担分と会社負担分を分けて試算'],
  ['法人課税所得', '売上高 − 経費 − 役員報酬 − 会社負担社会保険料 − 配偶者役員報酬等'],
  ['法人税等', '中小法人を前提に、法人税・地方法人税・法人住民税・法人事業税を概算'],
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">計算根拠と前提条件</h1>
          <Link href="/" className="shrink-0 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
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
              最終更新日: 2026年4月20日
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
    </div>
  )
}
