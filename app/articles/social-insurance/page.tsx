import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'
import { calcIndividual, calcCorporate } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'

// 比較例：事業所得600万円・40歳・単身、法人化後は役員報酬600万円（月50万円）
const sampleInput: InputData = {
  revenue: 6_650_000, expenses: 0, blueFormDeduction: 650_000, familyWorkerSalary: 0,
  hasSpouse: false, dependents: 0, ideco: 0, age: 40, directorSalary: 6_000_000,
  industryTaxRate: 0.05, mortgageDeduction: 0, medicalExpenses: 0, lifeInsuranceDeduction: 0,
  earthquakeInsurance: 0, donationDeduction: 0, spouseDirectorSalary: 0,
}
const ind = calcIndividual(sampleInput)
const corp = calcCorporate(sampleInput)
const pensionEmployee = Math.floor(500_000 * 12 * 0.183 / 2)
const healthEmployee = corp.director.socialInsurance - pensionEmployee
const man = (n: number) => `約${Math.round(n / 10_000)}万円`

export const metadata: Metadata = {
  title: '個人事業主と法人の社会保険を比較｜国保vs社保の違い | 法人化シミュレーター',
  description: '国民健康保険と健康保険（社会保険）の違い、国民年金と厚生年金の比較を解説。法人化で社会保険料はどう変わるのか、メリット・デメリットをまとめました。',
}

export default function SocialInsuranceArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('social-insurance')!.title, href: '/articles/social-insurance' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">個人事業主と法人の社会保険を比較｜国保vs社保の違い</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年10月29日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            法人化を検討する際、税金と並んで重要なのが<strong>社会保険料</strong>の違いです。個人事業主は国民健康保険＋国民年金、法人役員は健康保険＋厚生年金に加入します。それぞれの仕組みと負担額の違いを解説します。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">個人事業主の社会保険</h2>
            <div className="space-y-3 mt-2">
              <div>
                <h3 className="font-bold text-gray-700">国民健康保険（国保）</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                  <li>前年の所得に基づいて保険料が決まる</li>
                  <li>自治体によって保険料率が異なる</li>
                  <li>上限額は年間113万円（令和8年度。子ども・子育て支援金分3万円が新設）</li>
                  <li>扶養の概念がなく、家族の人数分の保険料がかかる</li>
                  <li>傷病手当金・出産手当金がない</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">国民年金</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                  <li>月額17,920円（令和8年度）で定額</li>
                  <li>老齢基礎年金のみ（満額で月約6.8万円）</li>
                  <li>付加年金やiDeCoで上乗せ可能</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人役員の社会保険</h2>
            <div className="space-y-3 mt-2">
              <div>
                <h3 className="font-bold text-gray-700">健康保険（社保）</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                  <li>役員報酬（標準報酬月額）に基づいて保険料が決まる</li>
                  <li>会社と本人で折半（東京都は健康保険9.85%＋40〜64歳は介護1.62%＋子ども・子育て支援金0.23%、令和8年度）</li>
                  <li>扶養家族は追加保険料なしで加入可能</li>
                  <li>傷病手当金・出産手当金がある</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">厚生年金</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                  <li>役員報酬に対して18.3%（会社と本人で折半）</li>
                  <li>国民年金（基礎年金）＋厚生年金の2階建て</li>
                  <li>将来の年金受給額が大幅に増える</li>
                  <li>障害年金・遺族年金も手厚い</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">負担額の比較例</h2>
            <p>事業所得600万円・40歳・単身の個人事業主と、同じ利益で役員報酬を年600万円（月50万円）に設定した場合の比較です（国保は東京23区、社保は協会けんぽ東京の令和8年度料率で当サイトの計算モデルにより算出）。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">個人事業主</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">法人役員</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">健康保険料</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(ind.nhi)}<br /><span className="text-gray-500">（国保・全額自己負担）</span></td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(healthEmployee)}<br /><span className="text-gray-500">（健保・介護・支援金の本人負担分）</span></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">年金保険料</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(ind.pension)}<br /><span className="text-gray-500">（国民年金・定額）</span></td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(pensionEmployee)}<br /><span className="text-gray-500">（厚生年金・本人負担分）</span></td>
                  </tr>
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">本人負担合計</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(ind.socialInsurance)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(corp.director.socialInsurance)}</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-gray-300 px-3 py-2">会社負担分</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">—</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{man(corp.socialInsuranceEmployer)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ※金額は概算値です。実際の保険料は自治体や協会けんぽの料率により異なります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">社会保険料を最適化するポイント</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>役員報酬の設定:</strong> 社会保険料は役員報酬に連動するため、報酬額を調整することで保険料をコントロールできます。</li>
              <li><strong>報酬と配当のバランス:</strong> 役員報酬を抑えて配当で受け取ると、社会保険料の対象外にできます（ただし配当には所得税がかかる）。</li>
              <li><strong>家族の扶養:</strong> 法人の社会保険なら、配偶者や子どもを扶養に入れれば追加保険料なしで加入できます。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">まとめ</h2>
            <p>
              社会保険料は法人化で「会社負担分」が新たに発生するため、単純に比較すると総額は増えることが多いです。しかし、将来の年金受給額の増加、扶養制度の活用、傷病手当金などの保障面を考慮すると、法人化のメリットは大きいと言えます。
            </p>
            <p className="mt-2">
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              では、社会保険料を含めた総合的な負担額の比較ができます。
              社会保険料の試算前提は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠ページ</Link>
              にまとめています。
            </p>
          </section>
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
