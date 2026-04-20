import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'このサイトについて・運営者情報 | 法人化シミュレーター',
  description: '法人化シミュレーターの目的、対象ユーザー、運営者情報、問い合わせ先、更新方針を掲載しています。',
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">このサイトについて</h1>
          <Link href="/" className="shrink-0 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 text-gray-800 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">サイトの目的</h2>
            <p>
              法人化シミュレーターは、個人事業主やフリーランスが「法人化すると税金や社会保険料はどう変わるのか」を事前に確認するための無料ツールです。
            </p>
            <p className="mt-2">
              法人化は、所得税や法人税だけでなく、国民健康保険、厚生年金、会社負担の社会保険料、法人住民税均等割などをまとめて考える必要があります。本サイトでは、それらを同じ画面で比較できるようにしています。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">対象となる方</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>売上が伸びてきて法人化のタイミングを検討している個人事業主</li>
              <li>役員報酬をいくらにすべきか大まかな感覚をつかみたい方</li>
              <li>国民健康保険と社会保険の負担差を確認したいフリーランス</li>
              <li>マイクロ法人や配偶者役員報酬の影響を試算したい方</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">提供している情報</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>個人事業主と法人化後の税金・社会保険料の概算比較</li>
              <li>確定申告書や青色申告決算書からのAI自動入力補助</li>
              <li>法人化のタイミング、手続き、社会保険、マイクロ法人に関する解説</li>
              <li>
                <Link href="/calculation-policy" className="text-blue-600 hover:underline">
                  計算根拠と前提条件
                </Link>
                の公開
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">運営者情報</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top w-28">サイト名</th>
                    <td className="py-3 text-gray-800">法人化シミュレーター</td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">URL</th>
                    <td className="py-3 text-gray-800">
                      <a href="https://hojinka-checker.com" className="text-blue-600 hover:underline">
                        https://hojinka-checker.com
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">運営者</th>
                    <td className="py-3 text-gray-800">合同会社GILOS</td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">連絡先</th>
                    <td className="py-3 text-gray-800">
                      <a href="mailto:support@hojinka-checker.com" className="text-blue-600 hover:underline">
                        support@hojinka-checker.com
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">編集・更新方針</h2>
            <p>
              税制や社会保険料の改定があった場合、公開情報を確認したうえで計算前提と記事内容を見直します。専門家による個別監修済みの税務助言ではないため、申告や法人設立の最終判断は専門家へご相談ください。
            </p>
            <p className="mt-2 text-xs text-gray-500">
              最終更新日: 2026年4月20日
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
