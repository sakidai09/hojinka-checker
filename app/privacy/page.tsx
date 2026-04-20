import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 法人化シミュレーター',
  description: '当サイトのプライバシーポリシー（個人情報保護方針）について',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">プライバシーポリシー</h1>
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
          {/* Section: 基本方針 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">個人情報の利用目的</h2>
            <p>
              当サイトでは、お問い合わせやサービスのご利用に際して、お名前やメールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は、質問に対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
            </p>
          </section>

          {/* Section: Google AdSense / 広告 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">広告の配信について</h2>
            <p>
              当サイトは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
            </p>
            <p className="mt-2">
              Googleなどの第三者配信事業者は、Cookieを使用して、各ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。Googleが広告Cookieを使用することにより、各ユーザーが当サイトや他のウェブサイトにアクセスした際の情報に基づいて、Googleやそのパートナーが適切な広告を表示できるようになります。
            </p>
            <p className="mt-2">
              広告配信のため、第三者配信事業者や広告ネットワークがユーザーのブラウザにCookieを保存したり、既存のCookieを読み取ったりする場合があります。また、広告配信や不正利用防止、効果測定のために、IPアドレス、ブラウザ情報、端末情報、閲覧ページ、広告の表示・クリックに関する情報などが利用される場合があります。
            </p>
            <p className="mt-2">
              ユーザーは、
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center mx-1 gap-1"
              >
                Googleのマイアドセンター
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
              にアクセスして、パーソナライズ広告の配信に使用されるCookieを無効にすることができます。（もしくは、
              <a
                href="https://optout.aboutads.info/?c=2&lang=EN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center mx-1 gap-1"
              >
                www.aboutads.info
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
              にアクセスして、第三者配信事業者がパーソナライズド広告の掲載に使用するCookieを無効にすることもできます。）
            </p>
            <p className="mt-2">
              Googleによる広告でのデータ利用については、
              <a
                href="https://policies.google.com/technologies/partner-sites?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center mx-1 gap-1"
              >
                Googleのポリシーと規約
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
              をご確認ください。
            </p>
          </section>

          {/* Section: アクセス解析 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">アクセス解析ツールについて</h2>
            <p>
              当サイトでは、サービス改善や不具合調査のため、アクセス状況や利用状況を確認する場合があります。アクセス解析ツールを導入する場合、Cookieや匿名のトラフィックデータを利用し、個人を直接特定しない形で分析します。
            </p>
            <p className="mt-2">
              Cookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。
            </p>
          </section>

          {/* Section: 免責事項 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">免責事項</h2>
            <p>
              当サイト（法人化シミュレーター）が提供する計算結果やシミュレーションは目安であり、各種法改正や個別の控除・経費の状況により実際の税額や社会保険料等が異なる場合があります。正確な情報の計算・申告にあたっては、必ず最寄りの税務署、税理士または社会保険労務士などの専門家にご相談ください。
            </p>
            <p className="mt-2">
              当サイトの利用により生じた直接的、間接的、付随的、派生的ないかなる損害についても、当サイトの運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">プライバシーポリシーの変更</h2>
            <p>
              本ポリシーの内容は、法令や利用サービスの変更に応じて、利用者への事前通知なく変更される場合があります。変更後の内容は本ページに掲載した時点で有効となります。
            </p>
            <p className="mt-3 text-xs text-gray-500">
              最終更新日: 2026年4月20日
            </p>
          </section>
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
