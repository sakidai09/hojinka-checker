'use client'

import { useRef, useState } from 'react'
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
  const [focused, setFocused] = useState(false)

  // フォーカス中は生の数字、離脱時は3桁カンマ付き
  const displayValue = focused
    ? (value === 0 ? '' : String(value))
    : (value === 0 ? '' : value.toLocaleString())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    onChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0"
          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

function DirectorSalaryInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [focused, setFocused] = useState(false)

  const displayValue = focused
    ? (value === 0 ? '' : String(value))
    : (value === 0 ? '' : value.toLocaleString())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    onChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  const monthly = value > 0 ? Math.round(value / 12) : null

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        希望する役員報酬（<span className="font-bold text-gray-900">年額</span>）
      </label>
      <p className="text-xs text-gray-400 mb-1">自分への給与として設定する金額</p>
      <div className="flex items-center gap-3">
        <div className="relative w-1/2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="0"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-gray-500">
          {monthly !== null ? (
            <>月額 <span className="font-semibold text-gray-800">¥{monthly.toLocaleString()}</span></>
          ) : (
            <span className="text-gray-300">月額 —</span>
          )}
        </div>
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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [ocrError, setOcrError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    if (!isImage && !isPdf) {
      setOcrError('JPG / PNG / PDF ファイルをアップロードしてください')
      setOcrStatus('error')
      return
    }
    setOcrStatus('loading')
    setOcrError('')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/ocr', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '読み取り失敗')
      const d = json.data
      onChange({
        ...data,
        ...(d.revenue != null && { revenue: d.revenue }),
        ...(d.expenses != null && { expenses: d.expenses }),
        ...(d.blueFormDeduction != null && { blueFormDeduction: d.blueFormDeduction }),
        ...(d.familyWorkerSalary != null && { familyWorkerSalary: d.familyWorkerSalary }),
      })
      setOcrStatus('done')
    } catch (e: unknown) {
      setOcrError(e instanceof Error ? e.message : '読み取りに失敗しました')
      setOcrStatus('error')
    }
  }

  return (
    <div className="space-y-4">

      {/* STEP 1: 自動入力 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">STEP 1</span>
          <span className="text-sm font-semibold text-gray-800">確定申告書で自動入力</span>
          <span className="text-xs text-gray-400 ml-auto">任意</span>
        </div>
        <p className="text-xs text-gray-500">
          以下いずれかの書類を撮影・スキャンした画像をアップロードすると、AIが数値を自動で読み取ります。
        </p>
        <p className="text-xs text-gray-500">
          対応書類：確定申告書B 第一表 ／ 収支内訳書 ／ 青色申告決算書
        </p>

        {/* アップロードエリア */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed py-4 text-center transition-colors ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          {ocrStatus === 'loading' ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm font-medium">AIが数値を読み取り中…</p>
            </div>
          ) : ocrStatus === 'done' ? (
            <div className="flex flex-col items-center gap-1 text-green-600">
              <span className="text-xl">✅</span>
              <p className="text-sm font-medium">読み取り完了！STEP 2 の内容を確認してください</p>
              <p className="text-xs text-gray-400">別の画像を読み込む場合はここをタップ</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <span className="text-2xl">📄</span>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">タップして画像を選択</p>
                <p className="text-xs">またはドラッグ＆ドロップ　JPG / PNG / PDF 対応</p>
              </div>
            </div>
          )}
          {ocrStatus === 'error' && (
            <p className="mt-2 text-xs text-red-500">{ocrError}</p>
          )}
        </div>
      </div>

      {/* STEP 2: 手動入力 */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-bold bg-gray-700 text-white px-2 py-0.5 rounded-full">STEP 2</span>
        <span className="text-sm font-semibold text-gray-800">内容を確認・入力</span>
        {ocrStatus === 'done' && (
          <span className="text-xs text-green-600 font-medium ml-auto">自動入力済み ✓</span>
        )}
      </div>
      {/* 売上・経費 */}
      <Section title="📊 売上・経費">
        <MoneyInput
          label="年間売上高"
          value={data.revenue}
          onChange={(v) => set('revenue', v)}
          hint="確定申告書B 第一表①欄（事業・営業等）／収支内訳書・青色申告決算書の「売上（収入）金額」"
        />
        <MoneyInput
          label="年間経費合計"
          value={data.expenses}
          onChange={(v) => set('expenses', v)}
          hint="収支内訳書・青色申告決算書の「経費合計」欄（専従者給与は除く）"
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
        <DirectorSalaryInput
          value={data.directorSalary}
          onChange={(v) => set('directorSalary', v)}
        />
        <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-2">
          <p>💡 役員報酬は会社の経費になります。給与所得控除も使えるため個人事業主より節税効果があります。残りの利益は法人に留保されます。</p>
          <hr className="border-blue-200" />
          <p className="font-semibold">📌 社会保険料の目安</p>
          <ul className="space-y-1 pl-1">
            <li>・<span className="font-medium">月額45,000円</span>が「最適ライン」とよく言われます。社保が最低等級になり給与所得控除も活用できるバランスの良い金額です</li>
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
