'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="法人化シミュレーター ロゴ" width={32} height={32} className="object-contain" priority />
            <div>
              <h1 className="text-xl font-bold text-gray-900">法人化シミュレーター</h1>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {result ? (
          <ResultDisplay result={result} input={input} onReset={handleReset} />
        ) : (
          <InputForm data={input} onChange={setInput} onSubmit={handleSubmit} />
        )}

        {/* AdSense・SEO対策としてのテキストコンテンツ（有用性の低いコンテンツと判定されるのを防ぐため） */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化シミュレーターとは？</h2>
            <p>
              個人事業主やフリーランスの方が「法人化（法人成り）」をした場合と、そのまま個人事業主を続けた場合で、所得税・住民税・国民健康保険料（社会保険料）などの税負担がどれくらい変わるかを簡単に比較できるシミュレーションツールです。
              売上や経費を入力するだけで、手元に残る金額の違いを可視化します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化のメリット・デメリット</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-blue-700 mb-1">■ メリット</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>給与所得控除が使えるため、役員報酬を出すことで節税効果が期待できる</li>
                  <li>欠損金（赤字）の繰越期間が最長10年になる（個人は3年）</li>
                  <li>社会的な信用度が上がり、取引先拡大や資金調達で有利になることがある</li>
                  <li>家族を役員にして所得を分散しやすい</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-1">■ デメリット</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>赤字でも法人住民税の均等割（年間約7万円〜）がかかる</li>
                  <li>社会保険への加入が義務化され、会社負担分の保険料が発生する</li>
                  <li>設立費用（株式会社で約25万円、合同会社で約10万円）がかかる</li>
                  <li>決算や税務申告が複雑になり、税理士報酬などの維持コストが増える</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">法人化の目安はいつ？</h2>
            <p>
              一般的に、個人事業主の課税所得（売上から経費や各種控除を引いた金額）が<strong>500万円〜800万円</strong>を超えたあたりが法人化を検討するタイミングと言われています。
              日本の所得税は累進課税のため、所得が増えるほど税率が高くなりますが、法人税は一定の税率（中小企業の場合は軽減税率あり）となるため、ある水準を超えると法人化のほうが税負担が軽くなります。
              ただし、社会保険料の負担額を含めると状況は大きく変わるため、本シミュレーターで具体的な数字を比較してみることをおすすめします。
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 space-y-4 text-center text-xs text-gray-400">
        <p>本ツールの計算結果はあくまで参考値です。<br />正確な税額・社会保険料は税理士・社労士にご相談ください。</p>
        <div className="flex justify-center items-center gap-4 text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">
            プライバシーポリシー
          </Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            お問い合わせ
          </Link>
          <span>v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
        </div>
      </footer>
    </div>
  )
}
