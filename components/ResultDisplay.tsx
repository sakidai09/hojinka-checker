'use client'

import { ComparisonResult } from '@/lib/types'

function yen(n: number) {
  if (!isFinite(n)) return '−'
  return `¥${Math.abs(n).toLocaleString()}`
}

function Row({
  label,
  individual,
  corporation,
  highlight,
}: {
  label: string
  individual: number
  corporation: number
  highlight?: boolean
}) {
  return (
    <tr className={highlight ? 'font-semibold bg-gray-50' : ''}>
      <td className="py-2 pr-4 text-sm text-gray-600 whitespace-nowrap">{label}</td>
      <td className={`py-2 px-3 text-sm text-right ${highlight ? 'text-gray-900' : 'text-gray-800'}`}>{yen(individual)}</td>
      <td className={`py-2 px-3 text-sm text-right ${highlight ? 'text-gray-900' : 'text-gray-800'}`}>{yen(corporation)}</td>
    </tr>
  )
}

export default function ResultDisplay({
  result,
  onReset,
}: {
  result: ComparisonResult
  onReset: () => void
}) {
  const { individual, corporation, savings, verdict, breakEvenYears } = result

  const verdictConfig = {
    incorporate: {
      bg: 'bg-green-50 border-green-200',
      badge: 'bg-green-500',
      icon: '✅',
      title: '法人化を強くおすすめします',
      desc: `年間 ${yen(savings)} の節税効果があります。設立費用（約25万円）は${breakEvenYears}年以内に回収できます。`,
    },
    consider: {
      bg: 'bg-yellow-50 border-yellow-200',
      badge: 'bg-yellow-500',
      icon: '🤔',
      title: '法人化を検討する価値あり',
      desc: `年間 ${yen(savings)} の節税効果があります。ただし事務負担の増加も考慮してください。`,
    },
    not_yet: {
      bg: 'bg-red-50 border-red-200',
      badge: 'bg-red-400',
      icon: '⏳',
      title: 'まだ法人化は早いかもしれません',
      desc: `現状では法人化によりコストが ${yen(Math.abs(savings))} 増加します。売上増加後に再検討をおすすめします。`,
    },
  }[verdict]

  const indTotal   = individual.total
  const corpTotal  = corporation.totalBurden

  // バーチャートの幅計算
  const maxVal = Math.max(indTotal, corpTotal)
  const indWidth  = Math.round((indTotal / maxVal) * 100)
  const corpWidth = Math.round((corpTotal / maxVal) * 100)

  return (
    <div className="space-y-5">
      {/* 判定バナー */}
      <div className={`rounded-xl border p-5 ${verdictConfig.bg}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{verdictConfig.icon}</span>
          <div>
            <h2 className="font-bold text-lg text-gray-800">{verdictConfig.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{verdictConfig.desc}</p>
          </div>
        </div>
      </div>

      {/* バーチャート */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">税金・社会保険料の比較</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">個人事業主のまま</span>
              <span className="font-medium">{yen(indTotal)}</span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-lg transition-all duration-700"
                style={{ width: `${indWidth}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">法人化した場合</span>
              <span className="font-medium">{yen(corpTotal)}</span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-lg transition-all duration-700"
                style={{ width: `${corpWidth}%` }}
              />
            </div>
          </div>
        </div>
        <div className={`mt-4 text-center text-sm font-semibold ${savings >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {savings >= 0
            ? `年間 ${yen(savings)} の節税効果`
            : `法人化でコスト ${yen(Math.abs(savings))} 増加`}
        </div>
      </div>

      {/* 詳細内訳テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">詳細内訳</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs text-gray-500 font-normal">項目</th>
                <th className="pb-2 text-right text-xs text-gray-500 font-normal px-3">個人事業主</th>
                <th className="pb-2 text-right text-xs text-gray-500 font-normal px-3">法人化後</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <Row
                label="事業所得 / 役員報酬"
                individual={individual.businessIncome}
                corporation={corporation.director.salary}
              />
              <Row
                label="所得税（復興税込）"
                individual={individual.incomeTax}
                corporation={corporation.director.incomeTax}
              />
              <Row
                label="住民税"
                individual={individual.residentTax}
                corporation={corporation.director.residentTax}
              />
              <Row
                label="個人事業税 / 法人税等"
                individual={individual.businessTax}
                corporation={corporation.corporate.total}
              />
              <Row
                label="国保・年金 / 社会保険（本人）"
                individual={individual.socialInsurance}
                corporation={corporation.director.socialInsurance}
              />
              <Row
                label="社会保険（会社負担）"
                individual={0}
                corporation={corporation.socialInsuranceEmployer}
              />
              <Row
                label="合計負担額"
                individual={indTotal}
                corporation={corpTotal}
                highlight
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* 内訳メモ */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-2">計算の前提・注意点</h3>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>社会保険料は協会けんぽ東京 2024年度の料率で試算（地域により異なります）</li>
          <li>国民健康保険料は全国平均ベースの簡易計算です（自治体により大きく異なります）</li>
          <li>法人化後の残余利益は法人内留保として計算（役員報酬以外の分配なし）</li>
          <li>消費税の扱いは考慮していません（新設法人は原則2年間免税）</li>
          <li>本ツールの計算は参考値です。正確な税額は税理士にご相談ください</li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
      >
        入力をやり直す
      </button>
    </div>
  )
}
