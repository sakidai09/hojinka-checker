import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '個人事業主と法人の税金を徹底比較｜どちらが得？ | 法人化シミュレーター',
  description: '所得税vs法人税、住民税、事業税、消費税の違いを個人事業主と法人で比較。累進課税と法人税率の仕組みを分かりやすく解説します。',
}

export default function TaxComparisonArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">個人事業主と法人の税金を徹底比較｜どちらが得？</h1>

          <p>
            「法人化すると税金が安くなる」と聞いたことがある方も多いでしょう。しかし実際には、所得水準や経費構造によって有利・不利が変わります。この記事では、個人事業主と法人で課せられる税金の種類と計算方法を比較し、どの段階で法人化が有利になるかを解説します。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">個人事業主にかかる主な税金</h2>
            <ul className="space-y-3 mt-2">
              <li>
                <strong>所得税（累進課税）</strong>
                <p className="mt-1 text-gray-600">課税所得に応じて5%〜45%の7段階。所得が上がるほど税率も上がります。</p>
              </li>
              <li>
                <strong>住民税</strong>
                <p className="mt-1 text-gray-600">一律10%（都道府県民税4%＋市区町村民税6%）＋均等割。</p>
              </li>
              <li>
                <strong>個人事業税</strong>
                <p className="mt-1 text-gray-600">事業所得が290万円を超える部分に3〜5%が課税されます（業種により税率が異なる）。</p>
              </li>
              <li>
                <strong>消費税</strong>
                <p className="mt-1 text-gray-600">課税売上高1,000万円超で2年後から納税義務が発生。</p>
              </li>
              <li>
                <strong>国民健康保険料</strong>
                <p className="mt-1 text-gray-600">所得に応じて計算。上限額は年間約106万円（2024年度）。</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人にかかる主な税金</h2>
            <ul className="space-y-3 mt-2">
              <li>
                <strong>法人税</strong>
                <p className="mt-1 text-gray-600">中小法人は所得800万円以下の部分が15%、800万円超は23.2%。個人の所得税と違い、税率が大きく跳ね上がりません。</p>
              </li>
              <li>
                <strong>法人住民税</strong>
                <p className="mt-1 text-gray-600">法人税額に対する税率＋均等割（赤字でも年間約7万円〜）。</p>
              </li>
              <li>
                <strong>法人事業税</strong>
                <p className="mt-1 text-gray-600">所得に応じた税率で課税。外形標準課税は資本金1億円超の法人が対象。</p>
              </li>
              <li>
                <strong>社会保険料</strong>
                <p className="mt-1 text-gray-600">役員報酬に対して健康保険料＋厚生年金保険料が発生。会社負担分（約15%）と個人負担分（約15%）の合計約30%。</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">所得税と法人税の税率比較</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">課税所得</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">所得税率</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">所得税+住民税</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">195万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">5%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">15%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">330万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">10%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">20%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">695万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">20%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">30%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">900万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">23%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">33%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">1,800万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">33%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">43%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">4,000万円以下</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">40%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">50%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">4,000万円超</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">45%</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">55%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              一方、中小法人の法人税実効税率は約22〜34%程度（所得金額により変動）。課税所得が695万円を超えるあたりから、法人のほうが税率面で有利になり始めます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化で使える節税テクニック</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>役員報酬による所得分散:</strong> 法人の利益を役員報酬として支給することで、給与所得控除を活用できます。</li>
              <li><strong>家族への給与:</strong> 配偶者や家族を役員・従業員にして給与を支払い、世帯全体の税負担を軽減。</li>
              <li><strong>退職金の活用:</strong> 法人は退職金を損金算入でき、受け取る側も退職所得控除で税負担が軽い。</li>
              <li><strong>生命保険の活用:</strong> 一定の要件を満たす法人契約の保険料を損金に算入可能。</li>
              <li><strong>出張手当（日当）:</strong> 法人から役員への出張日当は、法人の経費になり受け取る側は非課税。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">まとめ</h2>
            <p>
              個人と法人では課される税金の種類も計算方法も大きく異なります。特に所得が高くなるほど、法人化による節税効果は大きくなります。ただし、社会保険料の負担増や法人維持コストも考慮が必要です。
            </p>
            <p className="mt-2">
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              を使えば、あなたの売上・経費に基づいた具体的な比較ができます。
            </p>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 pt-4 text-center">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          トップページへ戻る
        </Link>
        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} 法人化シミュレーター
        </p>
      </footer>
    </div>
  )
}
