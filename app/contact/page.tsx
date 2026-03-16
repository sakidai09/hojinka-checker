import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | 法人化シミュレーター',
  description: '当サイト（法人化シミュレーター）へのお問い合わせについて',
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">お問い合わせ</h1>
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
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">お問い合わせフォームについて</h2>
            <p>
              当サイトについてのご質問、ご意見、バグ報告などがございましたら、以下のGoogleフォームよりお問い合わせください。
            </p>
            <div className="mt-6 text-center">
              <a
                href="https://forms.gle/XXXXXXX" // FIXME: 実際のフォームURLに差し替えてください
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                お問い合わせフォームを開く
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              ※お問い合わせ内容によっては、返信にお時間をいただく場合や回答できかねる場合がございます。あらかじめご了承ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">運営者情報</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>運営者: 法人化シミュレーター運営チーム</li>
            </ul>
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
