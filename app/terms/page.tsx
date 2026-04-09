import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | 法人化シミュレーター',
  description: '法人化シミュレーターの利用規約について。本サービスのご利用にあたっての注意事項・免責事項をご確認ください。',
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">利用規約</h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 text-gray-800 text-sm leading-relaxed">
          <p>
            この利用規約（以下「本規約」）は、法人化シミュレーター（以下「本サービス」）の利用条件を定めるものです。ご利用にあたっては、本規約に同意いただいたものとみなします。
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第1条（適用範囲）</h2>
            <p>
              本規約は、本サービスを利用するすべてのユーザー（以下「利用者」）に適用されます。利用者は、本サービスを利用することにより、本規約のすべての条項に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第2条（サービスの内容）</h2>
            <p>
              本サービスは、個人事業主が法人化（法人成り）した場合の税負担の変化をシミュレーションするWebツールです。利用者が入力した売上・経費等のデータに基づき、概算の税額比較を表示します。
            </p>
            <p className="mt-2">
              本サービスの計算結果はあくまで概算・参考値であり、実際の税額・社会保険料等とは異なる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第3条（免責事項）</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>本サービスが提供するシミュレーション結果は、税制の簡略化した計算モデルに基づく概算値であり、正確な税額を保証するものではありません。</li>
              <li>税制改正や個別の控除・経費の状況等により、実際の税額と大きく異なる場合があります。</li>
              <li>本サービスの利用により生じた直接的・間接的・付随的・派生的な損害について、運営者は一切の責任を負いません。</li>
              <li>正確な税額の計算・申告にあたっては、必ず税務署・税理士・社会保険労務士等の専門家にご相談ください。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第4条（禁止事項）</h2>
            <p>利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>本サービスの運営を妨害する行為</li>
              <li>本サービスのシステムに不正にアクセスする行為</li>
              <li>本サービスのコンテンツを無断で複製・転載・改変する行為</li>
              <li>他の利用者または第三者の権利を侵害する行為</li>
              <li>法令または公序良俗に反する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第5条（知的財産権）</h2>
            <p>
              本サービスに関する著作権、商標権その他の知的財産権は、運営者に帰属します。利用者は、運営者の事前の書面による承諾なく、本サービスのコンテンツを複製、転載、改変、販売等してはなりません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第6条（サービスの変更・中断・終了）</h2>
            <p>
              運営者は、利用者への事前の通知なく、本サービスの内容を変更、または本サービスの提供を中断・終了することができるものとします。これにより利用者に生じた損害について、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第7条（個人情報の取り扱い）</h2>
            <p>
              本サービスにおける個人情報の取り扱いについては、
              <Link href="/privacy" className="text-blue-600 hover:underline">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第8条（準拠法・管轄裁判所）</h2>
            <p>
              本規約の解釈は日本法に準拠するものとし、本サービスに関連する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">第9条（規約の変更）</h2>
            <p>
              運営者は、必要と判断した場合には、利用者に通知することなく本規約を変更することがあります。変更後の利用規約は、本ページに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <p className="text-xs text-gray-500 pt-4 border-t">
            制定日: 2025年4月1日
          </p>
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
