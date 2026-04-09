import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ・運営者情報 | 法人化シミュレーター',
  description: '法人化シミュレーターへのお問い合わせ方法と運営者情報について。',
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">お問い合わせ・運営者情報</h1>
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
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">お問い合わせ</h2>
            <p>
              当サイトについてのご質問、ご意見、不具合のご報告などがございましたら、下記メールアドレスまでお気軽にお問い合わせください。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-bold text-gray-900 mb-1">メールアドレス</p>
              {/* TODO: 実際のメールアドレスに差し替えてください */}
              <a
                href="mailto:support@hojinka-checker.com"
                className="text-blue-600 hover:underline"
              >
                support@hojinka-checker.com
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              ※お問い合わせ内容によっては、返信にお時間をいただく場合や回答できかねる場合がございます。あらかじめご了承ください。
            </p>
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
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">サイトURL</th>
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
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">お問い合わせ</th>
                    <td className="py-3 text-gray-800">
                      <a href="mailto:support@hojinka-checker.com" className="text-blue-600 hover:underline">
                        support@hojinka-checker.com
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">サービス内容</th>
                    <td className="py-3 text-gray-800">個人事業主の法人化に関する税負担シミュレーション（無料）</td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 whitespace-nowrap align-top">サービス料金</th>
                    <td className="py-3 text-gray-800">無料</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
