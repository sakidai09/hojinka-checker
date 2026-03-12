'use client'

import { InputData } from '@/lib/types'

interface Props {
  data: InputData
  onChange: (data: InputData) => void
  onSubmit: () => void
}

function MoneyInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
        <input
          type="number"
          min={0}
          step={10000}
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  )
}

export default function InputForm({ data, onChange, onSubmit }: Props) {
  const set = <K extends keyof InputData>(key: K, value: InputData[K]) =>
    onChange({ ...data, [key]: value })

  return (
    <div className="space-y-4">
      {/* 売上・経費 */}
      <Section title="📊 売上・経費">
        <MoneyInput
          label="年間売上高"
          value={data.revenue}
          onChange={(v) => set('revenue', v)}
        />
        <MoneyInput
          label="年間経費合計"
          value={data.expenses}
          onChange={(v) => set('expenses', v)}
          hint="専従者給与は除く"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">青色申告特別控除</label>
          <select
            value={data.blueFormDeduction}
            onChange={(e) => set('blueFormDeduction', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={650000}>65万円（電子申告・複式簿記）</option>
            <option value={550000}>55万円（複式簿記）</option>
            <option value={100000}>10万円（簡易帳簿）</option>
            <option value={0}>なし（白色申告）</option>
          </select>
        </div>
        <MoneyInput
          label="専従者給与（配偶者・家族への給与）"
          value={data.familyWorkerSalary}
          onChange={(v) => set('familyWorkerSalary', v)}
          hint="いない場合は 0"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">業種（個人事業税率）</label>
          <select
            value={data.industryTaxRate}
            onChange={(e) => set('industryTaxRate', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0.05}>5%（一般的な事業）</option>
            <option value={0.04}>4%（畜産業・水産業など）</option>
            <option value={0.03}>3%（林業など）</option>
            <option value={0}>非課税（個人事業税なし）</option>
          </select>
        </div>
      </Section>

      {/* 家族・控除 */}
      <Section title="👨‍👩‍👧 家族構成・所得控除">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700">配偶者あり</p>
            <p className="text-xs text-gray-400">配偶者の所得が48万円以下</p>
          </div>
          <button
            type="button"
            onClick={() => set('hasSpouse', !data.hasSpouse)}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
              data.hasSpouse ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                data.hasSpouse ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            扶養家族の数（配偶者除く）
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={data.dependents}
            onChange={(e) => set('dependents', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <MoneyInput
          label="iDeCo・小規模企業共済等掛金"
          value={data.ideco}
          onChange={(v) => set('ideco', v)}
          hint="年間の掛金合計"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
          <p className="text-xs text-gray-400 mb-1">40歳以上は国保の介護分が加算されます</p>
          <input
            type="number"
            min={20}
            max={80}
            value={data.age}
            onChange={(e) => set('age', Number(e.target.value) || 40)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Section>

      {/* 法人化後の設定 */}
      <Section title="🏢 法人化後のシミュレーション">
        <MoneyInput
          label="希望する役員報酬（年額）"
          value={data.directorSalary}
          onChange={(v) => set('directorSalary', v)}
          hint="自分への給与として設定する金額"
        />
        <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-2">
          <p>💡 役員報酬は会社の経費になります。給与所得控除も使えるため個人事業主より節税効果があります。残りの利益は法人に留保されます。</p>
          <hr className="border-blue-200" />
          <p className="font-semibold">📌 社会保険料の目安</p>
          <ul className="space-y-1 pl-1">
            <li>・<span className="font-medium">月額45万円</span>が「最適ライン」とよく言われます。社保が最低等級になり給与所得控除も活用できるバランスの良い金額です</li>
            <li>・最低等級（標準報酬月額 健保58,000円 / 厚年88,000円）での社保合計は<span className="font-medium">約17,000円/月</span>（会社＋本人）</li>
            <li>・役員報酬を<span className="font-medium">0円</span>にすると社会保険加入自体が不要になりますが、公的年金・健保の保障もなくなります</li>
          </ul>
        </div>
      </Section>

      <button
        onClick={onSubmit}
        disabled={data.revenue === 0}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        法人化シミュレーションを実行
      </button>
    </div>
  )
}
