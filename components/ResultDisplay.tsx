'use client'

import { useMemo, useState } from 'react'
import { ComparisonResult, InputData } from '@/lib/types'
import { compare } from '@/lib/taxCalculations'

function yen(n: number) {
  if (!isFinite(n)) return '−'
  return `¥${Math.abs(n).toLocaleString()}`
}

function Row({
  label, individual, corporation, highlight, note,
}: {
  label: string; individual: number; corporation: number; highlight?: boolean; note?: string
}) {
  return (
    <tr className={highlight ? 'font-semibold bg-gray-50' : ''}>
      <td className="py-2 pr-3 text-sm text-gray-600">
        <span className="whitespace-nowrap">{label}</span>
        {note && <span className="block text-xs text-gray-400 font-normal leading-tight mt-0.5">{note}</span>}
      </td>
      <td className={`py-2 px-2 text-sm text-right whitespace-nowrap ${highlight ? 'text-gray-900' : 'text-gray-800'}`}>{yen(individual)}</td>
      <td className={`py-2 px-2 text-sm text-right whitespace-nowrap ${highlight ? 'text-gray-900' : 'text-gray-800'}`}>{yen(corporation)}</td>
    </tr>
  )
}

export default function ResultDisplay({
  result, input, onReset,
}: {
  result: ComparisonResult; input: InputData; onReset: () => void
}) {
  const { individual, corporation, savings, verdict, breakEvenYears } = result

  // ── スライダー状態 ────────────────────────────────────
  const SLIDER_MAX = 15_000_000
  const SLIDER_STEP = 100_000
  const [sliderSalary, setSliderSalary] = useState(input.directorSalary)

  const sliderResult = useMemo(
    () => compare({ ...input, directorSalary: sliderSalary }),
    [input, sliderSalary],
  )
  const sliderSavings = sliderResult.individual.total - sliderResult.corporation.totalBurden
  const sliderMonthly = sliderSalary > 0 ? Math.round(sliderSalary / 12) : 0

  // ── 判定バナー ────────────────────────────────────────
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

  // ── バーチャート（元の結果で固定） ───────────────────
  const indTotal = individual.total
  const corpTotal = corporation.totalBurden
  const maxVal = Math.max(indTotal, corpTotal)
  const indWidth = Math.round((indTotal / maxVal) * 100)
  const corpWidth = Math.round((corpTotal / maxVal) * 100)

  // ── スライダーのバー ──────────────────────────────────
  const sliderIndTotal = sliderResult.individual.total
  const sliderCorpTotal = sliderResult.corporation.totalBurden
  const sliderMaxVal = Math.max(sliderIndTotal, sliderCorpTotal)
  const sliderIndWidth = Math.round((sliderIndTotal / sliderMaxVal) * 100)
  const sliderCorpWidth = Math.round((sliderCorpTotal / sliderMaxVal) * 100)

  // ── 消費税免税メリット ────────────────────────────────
  // 課税売上1,000万超の場合、個人では消費税を納付しているがらの新法人は2年間免税
  const vatPerYear = input.revenue > 10_000_000
    ? Math.round(Math.max(0, input.revenue - input.expenses) / 11)
    : 0

  // ── 比較表の税率注 ────────────────────────────────────
  const bizTaxNote = `個人：税率${(input.industryTaxRate * 100).toFixed(0)}%・事業主控除290万円 ／ 法人：15%（〜800万）/ 23.2%（超過）＋地方税`

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

      {/* 今できる節税対策（not_yet のみ） */}
      {verdict === 'not_yet' && (() => {
        const tips: { icon: string; title: string; desc: string }[] = []
        if (input.blueFormDeduction < 650_000) {
          tips.push({ icon: '📒', title: '青色申告65万円控除を活用する', desc: '電子申告（e-Tax）＋複式簿記で最大65万円の特別控除が受けられます。現在の設定より節税額が増える可能性があります。' })
        }
        if (input.ideco === 0) {
          tips.push({ icon: '💰', title: 'iDeCo・小規模企業共済を活用する', desc: '個人事業主はiDeCo（最大年816,000円）＋小規模企業共済（最大年840,000円）を全額所得控除できます。合わせると最大年間約165万円の控除に。' })
        } else {
          tips.push({ icon: '🏦', title: '小規模企業共済を活用する', desc: '掛金最大月7万円（年840,000円）が全額所得控除。廃業・退職時には退職金としても受け取れます。' })
        }
        if (input.familyWorkerSalary === 0 && input.hasSpouse) {
          tips.push({ icon: '👥', title: '配偶者への専従者給与を活用する', desc: '青色申告の専従者給与を設定すると、給与全額が経費になります（配偶者控除との併用は不可）。配偶者が実際に事業に従事している場合は検討を。' })
        }
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-sm text-blue-900">💡 今すぐできる節税対策</p>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-lg leading-tight">{tip.icon}</span>
                  <div>
                    <p className="font-medium text-blue-900">{tip.title}</p>
                    <p className="text-xs text-blue-700 mt-0.5">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-blue-200 pt-3 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">法人化が有利になる目安</p>
              {result.tippingPointBusinessIncome != null ? (() => {
                const currentBI = result.individual.businessIncome
                const targetBI  = result.tippingPointBusinessIncome!
                const gap       = Math.max(0, targetBI - currentBI)
                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>現在の事業所得：<span className="font-semibold">{(currentBI / 10_000).toLocaleString()}万円</span></span>
                    <span className="text-blue-400">→</span>
                    <span>
                      目標：<span className="font-semibold">約{(targetBI / 10_000).toLocaleString()}万円</span>
                      {gap > 0 && <span className="ml-1 text-blue-500">（あと約{(gap / 10_000).toLocaleString()}万円）</span>}
                    </span>
                  </div>
                )
              })() : (
                <p>現在の役員報酬設定では、売上が大幅に増えても法人化のメリットが出にくい可能性があります。役員報酬額を見直してから再シミュレーションしてみましょう。</p>
              )}
            </div>
          </div>
        )
      })()}

      {/* 追加コスト（incorporate / consider のみ） */}
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

      {/* 消費税免税メリット（incorporate / consider のみ） */}
      {(verdict === 'incorporate' || verdict === 'consider') && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-800 space-y-2">
          <p className="font-semibold text-sm">🏦 消費税免税の特例メリット（設立後2年間）</p>
          <p className="text-teal-700">新設法人は資本金1,000万円未満であれば、原則として設立後2年間は消費税が免税になります。</p>
          {vatPerYear > 0 ? (
            <div className="bg-white rounded-lg p-3 space-y-1">
              <p>現在の売上規模（{(input.revenue / 10_000).toLocaleString()}万円）では、個人事業主として消費税を納付している可能性があります。</p>
              <div className="flex justify-between items-center pt-1 border-t border-teal-100">
                <span className="font-medium text-teal-900">2年間の消費税節税効果の目安</span>
                <span className="font-bold text-teal-900 text-sm">約 {(vatPerYear * 2 / 10_000).toLocaleString()}万円</span>
              </div>
              <p className="text-teal-500 text-[11px]">※売上・仕入の消費税率10%（税込）を前提とした概算。インボイス登録済みの場合や、主な取引先が消費者でない場合は効果が異なります。</p>
            </div>
          ) : (
            <p className="text-teal-700">現在の売上（{(input.revenue / 10_000).toLocaleString()}万円）では個人事業主としても消費税免税の可能性があります。法人化後も同様に2年間の免税特例が適用されます。</p>
          )}
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
              <div className="h-full bg-orange-400 rounded-lg transition-all duration-700" style={{ width: `${indWidth}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">法人化した場合</span>
              <span className="font-semibold text-gray-800">{yen(corpTotal)}</span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-full bg-blue-500 rounded-lg transition-all duration-700" style={{ width: `${corpWidth}%` }} />
            </div>
          </div>
        </div>
        <div className={`mt-4 text-center text-sm font-semibold ${savings >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {savings >= 0 ? `年間 ${yen(savings)} の節税効果` : `法人化でコスト ${yen(Math.abs(savings))} 増加`}
        </div>
      </div>

      {/* 役員報酬スライダー */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">🔧 役員報酬を変えてシミュレーション</h3>
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-base font-bold text-gray-900">¥{sliderSalary.toLocaleString()}<span className="text-sm font-normal text-gray-500">/年</span></span>
            <span className="text-sm text-gray-500">月額 ¥{sliderMonthly.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0} max={SLIDER_MAX} step={SLIDER_STEP}
            value={sliderSalary}
            onChange={(e) => setSliderSalary(Number(e.target.value))}
            className="w-full h-2 accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>¥0</span><span>¥{(SLIDER_MAX / 10_000).toLocaleString()}万</span>
          </div>
        </div>

        {/* スライダーのバー比較 */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">個人事業主のまま</span>
              <span className="font-medium text-gray-700">{yen(sliderIndTotal)}</span>
            </div>
            <div className="h-5 bg-gray-100 rounded overflow-hidden">
              <div className="h-full bg-orange-300 rounded transition-all duration-300" style={{ width: `${sliderIndWidth}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">法人化（この役員報酬）</span>
              <span className="font-medium text-gray-700">{yen(sliderCorpTotal)}</span>
            </div>
            <div className="h-5 bg-gray-100 rounded overflow-hidden">
              <div className="h-full bg-blue-400 rounded transition-all duration-300" style={{ width: `${sliderCorpWidth}%` }} />
            </div>
          </div>
        </div>

        <div className={`text-center text-sm font-semibold py-2 rounded-lg ${sliderSavings >= 500_000 ? 'bg-green-50 text-green-700' : sliderSavings >= 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
          {sliderSavings >= 0
            ? `年間 ${yen(sliderSavings)} の節税効果`
            : `法人化でコスト ${yen(Math.abs(sliderSavings))} 増加`}
          {sliderSalary !== input.directorSalary && (
            <span className="ml-2 text-xs font-normal opacity-70">
              （元の設定より {sliderSavings - savings >= 0 ? '+' : ''}{yen(sliderSavings - savings)}）
            </span>
          )}
        </div>

        {sliderSalary !== input.directorSalary && (
          <button type="button" onClick={() => setSliderSalary(input.directorSalary)}
            className="text-xs text-blue-500 hover:underline">
            ← 元の設定（¥{input.directorSalary.toLocaleString()}/年）に戻す
          </button>
        )}
      </div>

      {/* 詳細内訳テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">詳細内訳</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs text-gray-500 font-normal">項目</th>
                <th className="pb-2 text-right text-xs text-gray-500 font-normal px-2">個人事業主</th>
                <th className="pb-2 text-right text-xs text-gray-500 font-normal px-2">法人化後</th>
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
                note="累進課税5〜45%（復興特別所得税2.1%込み）"
              />
              <Row
                label="住民税"
                individual={individual.residentTax}
                corporation={corporation.director.residentTax}
                note="所得割10% ＋ 均等割5,000円"
              />
              <Row
                label="個人事業税 / 法人税等"
                individual={individual.businessTax}
                corporation={corporation.corporate.total}
                note={bizTaxNote}
              />
              <Row
                label="国保・年金 / 社会保険（本人）"
                individual={individual.socialInsurance}
                corporation={corporation.director.socialInsurance}
                note="個人：国保（全国平均）＋国民年金16,980円/月 ／ 法人：健保4.99%＋厚年9.15%（折半）"
              />
              <Row
                label="社会保険（会社負担）"
                individual={0}
                corporation={corporation.socialInsuranceEmployer}
                note="健保4.99%＋厚年9.15%＋児童拠出金0.36%（協会けんぽ東京2024年度）"
              />
              {corporation.spouseDirector && (
                <Row
                  label="配偶者役員 税・社保合計"
                  individual={0}
                  corporation={corporation.spouseDirector.total + corporation.socialInsuranceSpouseEmployer}
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

      {/* 計算の前提・注意点 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-2">計算の前提・注意点</h3>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>社会保険料は協会けんぽ東京（2024年度）の料率で試算（地域により異なります）</li>
          <li>国民健康保険料は全国平均ベースの簡易計算です（自治体により大きく異なります）</li>
          <li>法人化後の残余利益は法人内留保として計算（役員報酬以外の分配なし）</li>
          <li>消費税の節税効果は概算です。インボイス登録状況や業種により大きく異なります</li>
          <li>本ツールの計算は参考値です。正確な税額は税理士にご相談ください</li>
        </ul>
      </div>

      <button onClick={onReset}
        className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
        入力をやり直す
      </button>
    </div>
  )
}
