'use client'

import { useState } from 'react'
import InputForm from '@/components/InputForm'
import ResultDisplay from '@/components/ResultDisplay'
import { InputData } from '@/lib/types'
import { compare } from '@/lib/taxCalculations'
import type { ComparisonResult } from '@/lib/types'

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
}

export default function Home() {
  const [input, setInput] = useState<InputData>(DEFAULT_INPUT)
  const [result, setResult] = useState<ComparisonResult | null>(null)

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
          <p className="text-xs text-gray-500 mt-0.5">個人事業主 vs 法人化の税負担を比較</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {result ? (
          <ResultDisplay result={result} onReset={handleReset} />
        ) : (
          <InputForm data={input} onChange={setInput} onSubmit={handleSubmit} />
        )}
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 text-center text-xs text-gray-400">
        本ツールの計算結果はあくまで参考値です。正確な税額・社会保険料は税理士・社労士にご相談ください。
      </footer>
    </div>
  )
}
