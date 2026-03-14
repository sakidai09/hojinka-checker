'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import InputForm from '@/components/InputForm'
import ResultDisplay from '@/components/ResultDisplay'
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">法人化シミュレーター</h1>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {result ? (
          <ResultDisplay result={result} input={input} onReset={handleReset} />
        ) : (
          <InputForm data={input} onChange={setInput} onSubmit={handleSubmit} />
        )}
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 space-y-4 text-center text-xs text-gray-400">
        <p>本ツールの計算結果はあくまで参考値です。<br />正確な税額・社会保険料は税理士・社労士にご相談ください。</p>
        <div className="flex justify-center items-center gap-4 text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">
            プライバシーポリシー
          </Link>
          <span>v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
        </div>
      </footer>
    </div>
  )
}
