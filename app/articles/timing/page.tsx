import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '法人化のベストタイミングとは？判断基準を徹底解説 | 法人化シミュレーター',
  description: '個人事業主が法人化すべきタイミングを、売上・所得・消費税の観点から解説。課税所得500万円〜800万円が目安とされる理由や、消費税の免税メリットも紹介します。',
}

export default function TimingArticle() {
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
          <h1 className="text-xl font-bold text-gray-900">法人化のベストタイミングとは？判断基準を徹底解説</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年4月20日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            個人事業主として事業が順調に成長すると、「そろそろ法人化すべき？」という疑問が生まれます。法人化には大きなメリットがある一方で、コストやリスクも伴います。この記事では、法人化に踏み切るべきタイミングの判断基準を詳しく解説します。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">課税所得が500万円〜800万円を超えたとき</h2>
            <p>
              法人化の最も一般的な判断基準は<strong>課税所得の金額</strong>です。個人事業主の所得税は累進課税で、所得が増えるほど税率が上がります（最大45%＋住民税10%＝55%）。一方、法人税の実効税率は中小企業の場合、所得800万円以下の部分で約22〜25%程度です。
            </p>
            <p className="mt-2">
              このため、課税所得が<strong>500万円〜800万円</strong>を超えたあたりから、法人化したほうが税負担が軽くなるケースが多くなります。ただし、社会保険料の負担も考慮する必要があるため、一概に「所得がいくら以上なら必ず得」とは言えません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">消費税の免税メリットを活用したいとき</h2>
            <p>
              個人事業主として課税売上高が<strong>1,000万円</strong>を超えると、その2年後から消費税の納税義務が発生します。このタイミングで法人化すれば、法人設立から最大2年間は消費税の免税事業者になれる可能性があります（資本金1,000万円未満の場合）。
            </p>
            <p className="mt-2">
              ただし、2023年10月に開始されたインボイス制度により、免税事業者のままでいると取引先から仕入税額控除ができなくなるため、実務上のメリットは以前より小さくなっている点に注意が必要です。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">事業拡大・人材採用を考えているとき</h2>
            <p>
              法人化は税金面だけでなく、<strong>信用力</strong>の面でも大きなメリットがあります。法人格を持つことで、以下のような場面で有利になります。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>金融機関からの融資審査</li>
              <li>大手企業との取引（法人でないと取引できない企業も多い）</li>
              <li>人材採用（社会保険完備をアピールできる）</li>
              <li>補助金・助成金の申請（法人限定のものがある）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">赤字の繰越控除を長く使いたいとき</h2>
            <p>
              個人事業主の場合、青色申告でも赤字の繰越控除は<strong>3年間</strong>です。一方、法人は<strong>最長10年間</strong>繰り越すことができます。設備投資などで大きな赤字が出る見込みがある場合、法人化しておくことで将来の利益と相殺でき、長期的な節税につながります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化を急がなくてもよいケース</h2>
            <p>
              以下のような場合は、すぐに法人化する必要はありません。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>課税所得が500万円未満で安定していない</li>
              <li>事業規模を大きくする予定がない</li>
              <li>設立費用（合同会社で約10万円、株式会社で約25万円）が負担になる</li>
              <li>税理士への顧問料（年間20万〜50万円）を支払う余裕がない</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">まとめ</h2>
            <p>
              法人化のタイミングは、税負担だけでなく、事業の成長段階や将来のビジョンを総合的に考慮して判断することが大切です。まずは当サイトの
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              で、現在の売上・経費に基づく税負担の比較を確認してみましょう。
              計算に含めている税金や社会保険料の範囲は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠ページ</Link>
              で確認できます。
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
