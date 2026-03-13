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
      icon: '✅',
      title: '法人化を強くおすすめします',
      desc: `年間 ${yen(savings)} の節税効果があります。設立費用（約25万円）は${breakEvenYears}年以内に回収できます。`,
    },
    consider: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '🤔',
      title: '法人化を検討する価値あり',
      desc: `年間 ${yen(savings)} の節税効果があります。ただし下記の追加コストも考慮してください。`,
    },
    not_yet: {
      bg: 'bg-red-50 border-red-200',
      icon: '⏳',
      title: 'まだ法人化は早いかもしれません',
      desc: `現状では法人化によりコストが ${yen(Math.abs(savings))} 増加します。売上増加後に再検討をおすすめします。`,
    },
  }[verdict]

  const indTotal  = individual.total
  const corpTotal = corporation.totalBurden

  const maxVal    = Math.max(indTotal, corpTotal)
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

      {/* 法人化後の追加コスト（incorporate / consider のみ） */}
      {(verdict === 'incorporate' || verdict === 'consider') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-2">
          <p className="font-semibold text-sm">⚠️ 試算に含まれていない追加コスト</p>
          <table className="w-full">
            <tbody className="divide-y divide-amber-100">
              <tr>
                <td className="py-1.5 text-amber-700">税理士・顧問費用</td>
                <td className="py-1.5 text-right font-medium text-amber-900">年 200,000〜400,000円</td>
              </tr>
              <tr>
                <td className="py-1.5 text-amber-700">会計ソフト（freee / MFクラウド等）</td>
                <td className="py-1.5 text-right font-medium text-amber-900">年 35,000〜40,000円</td>
              </tr>
              <tr>
                <td className="py-1.5 text-amber-700">合同会社設立費用（一度のみ）</td>
                <td className="py-1.5 text-right font-medium text-amber-900">約 60,000円</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-amber-300">
                <td className="pt-2 font-semibold text-amber-900">年間追加コスト目安</td>
                <td className="pt-2 text-right font-bold text-amber-900">年 235,000〜440,000円</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-amber-600">法人住民税均等割（年7万円・赤字でも発生）は上記試算に含まれています。</p>
        </div>
      )}

      {/* バーチャート */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">税金・社会保険料の比較</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">個人事業主のまま</span>
              <span className="font-semibold text-gray-800">{yen(indTotal)}</span>
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
              <span className="font-semibold text-gray-800">{yen(corpTotal)}</span>
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
                label="事業所得 / 役員報酬（代表者）"
                individual={individual.businessIncome}
                corporation={corporation.director.salary}
              />
              {corporation.spouseDirector && (
                <Row
                  label="役員報酬（配偶者）"
                  individual={0}
                  corporation={corporation.spouseDirector.salary}
                />
              )}
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
              {corporation.spouseDirector && (
                <Row
                  label="配偶者役員 税・社保合計"
                  individual={0}
                  corporation={
                    corporation.spouseDirector.total + corporation.socialInsuranceSpouseEmployer
                  }
                />
              )}
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
