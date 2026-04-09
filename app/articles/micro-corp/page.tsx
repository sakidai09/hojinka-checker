import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'マイクロ法人とは？個人事業主との二刀流で社会保険料を最適化 | 法人化シミュレーター',
  description: 'マイクロ法人（ひとり法人）の仕組みと、個人事業主との併用による社会保険料の最適化戦略を解説。メリット・デメリット・注意点をまとめました。',
}

export default function MicroCorpArticle() {
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
          <h1 className="text-xl font-bold text-gray-900">マイクロ法人とは？個人事業主との二刀流で社会保険料を最適化</h1>

          <p>
            近年、フリーランスや個人事業主の間で注目されている<strong>「マイクロ法人」</strong>。従業員を雇わず、自分ひとりだけの法人を設立する手法です。特に「個人事業主＋マイクロ法人」の二刀流スキームは、社会保険料の最適化に効果的とされています。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">マイクロ法人とは</h2>
            <p>
              マイクロ法人とは、代表者1人だけで構成される小規模な法人のことです。法的な定義はなく、一般的に以下のような特徴を持つ法人を指します。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>従業員を雇用しない（役員＝自分のみ）</li>
              <li>事業規模を意図的に小さく保つ</li>
              <li>主な目的は節税・社会保険料の最適化</li>
              <li>合同会社で設立するケースが多い（設立費用が安い）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">個人事業主＋マイクロ法人の「二刀流」とは</h2>
            <p>
              最もポピュラーなスキームは、<strong>個人事業とマイクロ法人で異なる事業を行い、役員報酬を最低限に設定する</strong>方法です。
            </p>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg space-y-2">
              <p className="font-bold text-blue-800">典型的な二刀流の仕組み</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-900">
                <li>メインの事業収入は<strong>個人事業主</strong>として受け取る</li>
                <li>別の事業（不動産賃貸、コンサル等）を<strong>マイクロ法人</strong>で行う</li>
                <li>法人からの役員報酬を<strong>月額4.5万円〜6.5万円</strong>程度に設定</li>
                <li>法人の社会保険（健康保険＋厚生年金）に最低限の保険料で加入</li>
                <li>個人事業の所得に対する<strong>国民健康保険料が不要</strong>になる</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">メリット</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>社会保険料の大幅削減:</strong>
                国保料が年間数十万円かかる場合でも、法人の社会保険に最低額で加入することで大きく削減できる。
              </li>
              <li>
                <strong>厚生年金に加入できる:</strong>
                国民年金だけでは老後の年金が不安な場合、厚生年金の2階建て部分を上乗せできる。
              </li>
              <li>
                <strong>扶養制度の活用:</strong>
                配偶者や家族を社会保険の扶養に入れれば、家族分の保険料が追加不要。
              </li>
              <li>
                <strong>法人の経費活用:</strong>
                法人名義で必要経費（通信費、家賃按分等）を計上できる。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">デメリット・注意点</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>法人の維持コスト:</strong>
                赤字でも法人住民税の均等割（年間約7万円）がかかる。税理士費用も年間15〜30万円程度。
              </li>
              <li>
                <strong>個人と法人で同じ事業はNG:</strong>
                個人事業と法人で同一の事業を行うと、所得の付替えと見なされるリスクがある。必ず異なる事業を行うこと。
              </li>
              <li>
                <strong>法人に実態が必要:</strong>
                社会保険のためだけのペーパーカンパニーと見なされると、税務調査で否認される可能性がある。
              </li>
              <li>
                <strong>事務負担の増加:</strong>
                個人の確定申告に加え、法人の決算・申告も必要になり、管理コストが増える。
              </li>
              <li>
                <strong>役員報酬の変更制限:</strong>
                法人の役員報酬は原則、事業年度開始から3ヶ月以内にしか変更できない。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">マイクロ法人に向いている人</h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>フリーランスで国保料が高額になっている人</li>
              <li>個人事業の売上が安定している人</li>
              <li>不動産収入など法人で行える副業がある人</li>
              <li>将来の年金を増やしたい人</li>
              <li>配偶者を扶養に入れたい人</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">まとめ</h2>
            <p>
              マイクロ法人は、正しく運用すれば社会保険料を大幅に節約できる強力な手法です。ただし、法人の維持コストや税務リスクもあるため、必ず数字でシミュレーションした上で判断しましょう。
            </p>
            <p className="mt-2">
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              で、法人化した場合の社会保険料を含めた総合的な負担額を確認できます。
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
