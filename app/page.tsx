'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import InputForm from '@/components/InputForm'
import ResultDisplay from '@/components/ResultDisplay'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { InputData } from '@/lib/types'
import { compare } from '@/lib/taxCalculations'
import type { ComparisonResult } from '@/lib/types'

const SUBTITLES = [
  '個人事業主 vs 法人化の税負担を比較',
  'そろそろ法人化？売上から最適タイミングを診断',
  '法人化でいくら得する？1分でシミュレーション',
  '個人事業主のまま vs 法人化、税負担を比べてみよう',
  '売上○○万円、法人化するとどれだけ節税できる？',
  '個人事業主の節税限界、もう法人化すべき？',
  '税金・社保を丸ごとシミュレーション',
  'マイクロ法人検討中の方へ｜税負担を今すぐ比較',
  '法人化で手取りは増える？売上・経費を入力して確認',
  'あと何万円売上が上がれば法人化がお得になる？',
]

const STORAGE_KEY = 'hojinka-input'

const DEFAULT_INPUT: InputData = {
  revenue: 0,
  expenses: 0,
  blueFormDeduction: 650_000,
  familyWorkerSalary: 0,
  hasSpouse: false,
  dependents: 0,
  ideco: 0,
  age: 40,
  directorSalary: 540_000,
  industryTaxRate: 0.05,
  mortgageDeduction: 0,
  medicalExpenses: 0,
  lifeInsuranceDeduction: 0,
  earthquakeInsurance: 0,
  donationDeduction: 0,
  spouseDirectorSalary: 0,
}

function loadInput(): InputData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_INPUT
    // DEFAULT_INPUT とマージして新フィールド追加にも対応
    return { ...DEFAULT_INPUT, ...JSON.parse(saved) }
  } catch {
    return DEFAULT_INPUT
  }
}

export default function Home() {
  const [input, setInput] = useState<InputData>(DEFAULT_INPUT)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [subtitle, setSubtitle] = useState(SUBTITLES[0])

  // マウント時: localStorage から復元 & ランダムサブタイトル
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInput(loadInput())
    setSubtitle(SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)])
  }, [])

  // 入力変更時: localStorage に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
  }, [input])

  const handleSubmit = () => {
    setResult(compare(input))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">法人化シミュレーター</h1>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>

        {result ? (
          <ResultDisplay result={result} input={input} onReset={handleReset} />
        ) : (
          <InputForm data={input} onChange={setInput} onSubmit={handleSubmit} />
        )}

        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">このシミュレーターで比較できること</h2>
            <p>
              法人化シミュレーターは、個人事業主のまま事業を続けた場合と、法人化して役員報酬を受け取る場合の年間負担額を比較する無料ツールです。
              所得税だけでなく、住民税、個人事業税、国民健康保険、国民年金、法人税、法人住民税、法人事業税、社会保険の本人負担分と会社負担分まで含めて試算します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">計算に含めている主な項目</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left w-28">個人側</th>
                    <td className="border border-gray-300 px-3 py-2">
                      事業所得、所得税、住民税、個人事業税、国民健康保険、国民年金、青色申告控除、iDeCo等の所得控除
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left">法人側</th>
                    <td className="border border-gray-300 px-3 py-2">
                      役員報酬、給与所得控除、法人課税所得、法人税等、法人住民税均等割、法人事業税、社会保険の本人負担・会社負担
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left">追加設定</th>
                    <td className="border border-gray-300 px-3 py-2">
                      配偶者役員報酬、扶養人数、住宅ローン控除、医療費控除、生命保険料控除、地震保険料控除、寄附金控除
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              詳しい計算式や前提条件は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline mx-1">
                計算根拠と前提条件
              </Link>
              にまとめています。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">ケース別に見る確認ポイント</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">ケース</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">入力例</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">見るべき点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">IT・デザイン系</td>
                    <td className="border border-gray-300 px-3 py-2">売上700万円、経費80万円</td>
                    <td className="border border-gray-300 px-3 py-2">所得税率と国保負担が上がり始めるため、役員報酬の設定で差が出ます。</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">コンサル・士業</td>
                    <td className="border border-gray-300 px-3 py-2">売上1,000万円、経費150万円</td>
                    <td className="border border-gray-300 px-3 py-2">法人税と給与所得控除の効果、社会保険の会社負担を合わせて確認します。</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">店舗・飲食</td>
                    <td className="border border-gray-300 px-3 py-2">売上1,200万円、経費700万円</td>
                    <td className="border border-gray-300 px-3 py-2">売上だけでなく利益率が重要です。法人住民税や維持費も含めて判断します。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">結果を見るときの注意点</h2>
            <p>
              法人化の損得は、売上だけでは判断できません。経費率、役員報酬、家族構成、国民健康保険料の地域差、消費税やインボイス登録の状況、税理士報酬などによって結果が変わります。
              本ツールは判断の入り口として使い、実際に法人を設立する前には専門家へ相談してください。
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
