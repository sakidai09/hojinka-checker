import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'このサイトについて・運営者情報 | 法人化シミュレーター',
  description: '法人化シミュレーターの目的、対象ユーザー、運営者情報、問い合わせ先、更新方針を掲載しています。',
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'このサイトについて', href: '/about' }]} />
        <h1 className="text-xl font-bold text-gray-900 mb-4">このサイトについて</h1>
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
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">計算と記事の作り方</h2>
            <p>
              シミュレーターの計算式は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline mx-1">計算根拠と前提条件</Link>
              ですべて公開しています。税率・控除額・保険料率は、国税庁、日本年金機構、全国健康保険協会（協会けんぽ）、市区町村などの公式資料で確認した値だけを使い、確認日と出典を明記しています。
            </p>
            <p className="mt-2">
              記事中の「所得○○万円の場合の負担額」などの金額は、手入力ではなく、シミュレーターと同じ計算プログラムでページ表示時に算出しています。そのため、制度改正に合わせて計算モデルを更新すると、記事の表も同じ前提で更新されます。
            </p>
            <p className="mt-2">
              記事の作成にはAIによる下書き支援を使っていますが、掲載する数値・制度の説明は公式資料と照合したうえで公開しています。照合できなかった情報は掲載しません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">このサイトでできないこと</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>個別の税務相談・申告書の作成（税理士法により税理士の業務です）</li>
              <li>自治体ごとの国民健康保険料の正確な計算（本サイトは東京23区の料率で試算）</li>
              <li>消費税・インボイス、相続・事業承継などを含めた総合的な判断</li>
            </ul>
            <p className="mt-2">
              シミュレーターの結果は判断の入り口としてお使いいただき、実際に法人を設立する前には税理士・社会保険労務士などの専門家にご相談ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">誤りのご指摘・訂正について</h2>
            <p>
              計算や記事の内容に誤りを見つけた場合は、
              <Link href="/contact" className="text-blue-600 hover:underline mx-1">お問い合わせ</Link>
              からお知らせください。公式資料で確認できた誤りは速やかに修正し、計算モデルに関わる修正は計算根拠ページの更新内容に記載します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">主な更新履歴</h2>
            <ul className="space-y-2">
              <li><span className="text-gray-500 mr-2">2026年11月23日</span>解説記事5本を全面改訂、役員報酬の比較表・国保と社保の所得別比較を追加</li>
              <li><span className="text-gray-500 mr-2">2026年10月29日</span>計算モデルを2026年（令和8年）分の税制・令和8年度の社会保険料率に更新、損益分岐表と2026年の制度変更の解説を追加</li>
              <li><span className="text-gray-500 mr-2">2026年10月10日</span>計算例ページと計算の前提条件の説明を追加</li>
              <li><span className="text-gray-500 mr-2">2026年4月10日</span>解説記事・利用規約・運営者情報を追加</li>
              <li><span className="text-gray-500 mr-2">2026年3月13日</span>シミュレーターを公開（確定申告書の読み取りによる自動入力に対応）</li>
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
              最終更新日: 2026年11月23日
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
