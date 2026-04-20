import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '法人化の手続きガイド｜設立までの流れと必要書類 | 法人化シミュレーター',
  description: '個人事業主が法人化する際の手続きを、株式会社・合同会社それぞれのステップで解説。定款作成から登記申請、届出までの流れと費用をまとめました。',
}

export default function ProcedureArticle() {
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
          <h1 className="text-xl font-bold text-gray-900">法人化の手続きガイド｜設立までの流れと必要書類</h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年4月20日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            法人化を決意したら、次は実際の手続きです。「何から始めればいい？」「どれくらい費用がかかる？」という疑問に答えるために、法人設立の流れを株式会社・合同会社それぞれのケースで解説します。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">株式会社と合同会社の違い</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">株式会社</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">合同会社</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">設立費用</td>
                    <td className="border border-gray-300 px-3 py-2">約25万円</td>
                    <td className="border border-gray-300 px-3 py-2">約10万円</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">定款認証</td>
                    <td className="border border-gray-300 px-3 py-2">必要（公証役場）</td>
                    <td className="border border-gray-300 px-3 py-2">不要</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">社会的信用</td>
                    <td className="border border-gray-300 px-3 py-2">高い</td>
                    <td className="border border-gray-300 px-3 py-2">やや低い</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">意思決定</td>
                    <td className="border border-gray-300 px-3 py-2">株主総会・取締役会</td>
                    <td className="border border-gray-300 px-3 py-2">社員の合意（柔軟）</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">役員任期</td>
                    <td className="border border-gray-300 px-3 py-2">最長10年</td>
                    <td className="border border-gray-300 px-3 py-2">任期なし</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              一人で事業を行う場合やコストを抑えたい場合は<strong>合同会社</strong>、取引先からの信用を重視する場合や将来的に株式上場を視野に入れる場合は<strong>株式会社</strong>が適しています。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人設立の流れ（7ステップ）</h2>
            <ol className="list-decimal list-inside space-y-3 mt-2">
              <li>
                <strong>基本事項の決定</strong>
                <p className="ml-5 mt-1 text-gray-600">商号（会社名）、事業目的、本店所在地、資本金額、事業年度、役員構成などを決めます。</p>
              </li>
              <li>
                <strong>法人印の作成</strong>
                <p className="ml-5 mt-1 text-gray-600">代表者印（実印）、銀行印、角印の3本セットが一般的です。費用は5,000円〜2万円程度。</p>
              </li>
              <li>
                <strong>定款の作成</strong>
                <p className="ml-5 mt-1 text-gray-600">会社の基本ルールを定めた書類です。電子定款にすれば収入印紙代4万円を節約できます。</p>
              </li>
              <li>
                <strong>定款の認証（株式会社のみ）</strong>
                <p className="ml-5 mt-1 text-gray-600">公証役場で公証人の認証を受けます。手数料は資本金額に応じて3万〜5万円。</p>
              </li>
              <li>
                <strong>資本金の払い込み</strong>
                <p className="ml-5 mt-1 text-gray-600">発起人の個人口座に資本金を振り込み、通帳のコピーを用意します。</p>
              </li>
              <li>
                <strong>登記申請</strong>
                <p className="ml-5 mt-1 text-gray-600">法務局に設立登記を申請します。登録免許税は株式会社15万円、合同会社6万円。申請日が会社設立日になります。</p>
              </li>
              <li>
                <strong>各種届出</strong>
                <p className="ml-5 mt-1 text-gray-600">税務署、都道府県税事務所、市区町村役場、年金事務所、労働基準監督署などへの届出を行います。</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">設立後に必要な届出一覧</h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>税務署:</strong> 法人設立届出書、青色申告承認申請書、給与支払事務所等の開設届出書</li>
              <li><strong>都道府県・市区町村:</strong> 法人設立届出書</li>
              <li><strong>年金事務所:</strong> 健康保険・厚生年金保険の新規適用届</li>
              <li><strong>労働基準監督署:</strong> 労働保険関係成立届（従業員を雇用する場合）</li>
              <li><strong>ハローワーク:</strong> 雇用保険適用事業所設置届（従業員を雇用する場合）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">設立費用のまとめ</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">費用項目</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">株式会社</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">合同会社</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">定款認証手数料</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">3〜5万円</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">不要</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">登録免許税</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">15万円</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">6万円</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">収入印紙（紙定款の場合）</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">4万円</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">4万円</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">法人印</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">0.5〜2万円</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">0.5〜2万円</td>
                  </tr>
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">合計目安</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">約22〜26万円</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">約10〜12万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">まとめ</h2>
            <p>
              法人設立の手続きは複雑に見えますが、会社設立freeeやマネーフォワード会社設立などのオンラインサービスを使えば、多くの書類作成を自動化できます。まずは
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              で税負担を比較し、法人化のメリットが見込める場合に手続きに進みましょう。
              試算の前提は
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
