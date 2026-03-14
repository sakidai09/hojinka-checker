'use client'

import { useRef, useState } from 'react'
import { InputData } from '@/lib/types'

// ── Tooltip ──────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] leading-none inline-flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
        aria-label="説明を表示"
      >?</button>
      {open && (
        <span className="absolute left-0 top-6 z-50 w-64 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl leading-relaxed whitespace-normal">
          {text}
        </span>
      )}
    </span>
  )
}

// ── Presets ───────────────────────────────────────────────
const PRESET_BASE: InputData = {
  revenue: 0, expenses: 0, blueFormDeduction: 650_000, familyWorkerSalary: 0,
  hasSpouse: false, dependents: 0, ideco: 0, age: 40, directorSalary: 540_000,
  industryTaxRate: 0.05, mortgageDeduction: 0, medicalExpenses: 0,
  lifeInsuranceDeduction: 0, earthquakeInsurance: 0, donationDeduction: 0, spouseDirectorSalary: 0,
}

const PRESETS: { label: string; emoji: string; sub: string; values: InputData }[] = [
  {
    label: 'エンジニア・デザイナー',
    emoji: '🧑‍💻',
    sub: '売上700万',
    values: {
      ...PRESET_BASE,
      revenue: 7_000_000, expenses: 800_000,
      age: 35, directorSalary: 3_600_000,
    },
  },
  {
    label: 'コンサルタント・士業',
    emoji: '💼',
    sub: '売上1,000万',
    values: {
      ...PRESET_BASE,
      revenue: 10_000_000, expenses: 1_500_000,
      hasSpouse: true, dependents: 1, age: 42, directorSalary: 4_800_000,
    },
  },
  {
    label: '個人商店・飲食',
    emoji: '🏪',
    sub: '売上1,200万',
    values: {
      ...PRESET_BASE,
      revenue: 12_000_000, expenses: 7_000_000,
      hasSpouse: true, age: 45, directorSalary: 3_600_000,
    },
  },
]

// ── MoneyInput ────────────────────────────────────────────
function MoneyInput({
  label, value, onChange, hint,
}: {
  label: string; value: number; onChange: (v: number) => void; hint?: string
}) {
  const [focused, setFocused] = useState(false)
  const displayValue = focused
    ? (value === 0 ? '' : String(value))
    : (value === 0 ? '' : value.toLocaleString())
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    onChange(raw === '' ? 0 : parseInt(raw, 10))
  }
  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <Tooltip text={hint} />}
      </label>
      <div className="relative w-1/2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
        <input
          type="text" inputMode="numeric" value={displayValue} onChange={handleChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="0"
          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

// ── DirectorSalaryInput ───────────────────────────────────
function DirectorSalaryInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        希望する役員報酬（<span className="font-bold text-gray-900">年額</span>）
        <Tooltip text="法人化後に代表者として受け取る年間給与。役員報酬は法人の経費になり、受け取る側には給与所得控除も適用されます。なお、一度決定した役員報酬は原則として期中に変更できません（年1回の改定のみ）。" />
      </label>
      <div className="flex items-center gap-3">
        <div className="relative w-1/2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input
            type="text" inputMode="numeric" value={displayValue} onChange={handleChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="0"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-gray-500">
          {monthly !== null
            ? <>月額 <span className="font-semibold text-gray-800">¥{monthly.toLocaleString()}</span></>
            : <span className="text-gray-300">月額 —</span>}
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  )
}

// ── DeductionAccordion ────────────────────────────────────
function DeductionAccordion({ data, onChange }: { data: InputData; onChange: (d: InputData) => void }) {
  const [open, setOpen] = useState(false)
  const set = <K extends keyof InputData>(key: K, value: InputData[K]) => onChange({ ...data, [key]: value })
  return (
    <div className="border-t border-gray-100 pt-3">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
        <span className={`inline-block transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
        その他の控除を追加する（任意）
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          <MoneyInput label="住宅ローン控除（年間）" value={data.mortgageDeduction}
            onChange={(v) => set('mortgageDeduction', v)}
            hint="税額控除額（年末残高×0.7%）。確定申告書の「住宅借入金等特別控除額」欄の金額。所得控除ではなく税額から直接引かれます。"
          />
          <MoneyInput label="医療費控除" value={data.medicalExpenses}
            onChange={(v) => set('medicalExpenses', v)}
            hint="実際の医療費 − 10万円（または所得×5%）の超過分。セルフメディケーション税制は別途計算が必要です。"
          />
          <MoneyInput label="生命保険料控除" value={data.lifeInsuranceDeduction}
            onChange={(v) => set('lifeInsuranceDeduction', Math.min(v, 120_000))}
            hint="新契約：一般・介護・個人年金の3区分の控除額の合計（最大12万円）。保険会社から届く「控除証明書」で確認できます。"
          />
          <MoneyInput label="地震保険料控除" value={data.earthquakeInsurance}
            onChange={(v) => set('earthquakeInsurance', Math.min(v, 50_000))}
            hint="支払保険料の全額（最大5万円）。損害保険の地震特約も含みます。"
          />
          <MoneyInput label="寄附金控除（ふるさと納税等）" value={data.donationDeduction}
            onChange={(v) => set('donationDeduction', v)}
            hint="寄付金額 − 2,000円の金額。確定申告書の「寄附金控除」欄を確認。ふるさと納税でワンストップ特例を使った場合は入力不要です。"
          />
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────
interface Props { data: InputData; onChange: (data: InputData) => void; onSubmit: () => void }

export default function InputForm({ data, onChange, onSubmit }: Props) {
  const set = <K extends keyof InputData>(key: K, value: InputData[K]) => onChange({ ...data, [key]: value })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [ocrError, setOcrError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    if (!isImage && !isPdf) { setOcrError('JPG / PNG / PDF ファイルをアップロードしてください'); setOcrStatus('error'); return }
    setOcrStatus('loading'); setOcrError('')
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
        ...(d.medicalExpenses != null && { medicalExpenses: d.medicalExpenses }),
        ...(d.lifeInsuranceDeduction != null && { lifeInsuranceDeduction: Math.min(d.lifeInsuranceDeduction, 120_000) }),
        ...(d.earthquakeInsurance != null && { earthquakeInsurance: Math.min(d.earthquakeInsurance, 50_000) }),
        ...(d.mortgageDeduction != null && { mortgageDeduction: d.mortgageDeduction }),
        ...(d.donationDeduction != null && { donationDeduction: d.donationDeduction }),
      })
      setOcrStatus('done')
    } catch (e: unknown) {
      setOcrError(e instanceof Error ? e.message : '読み取りに失敗しました')
      setOcrStatus('error')
    }
  }

  return (
    <div className="space-y-4">

      {/* プリセット */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">💡 入力例から試す</p>
        <div className="flex flex-col gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => onChange(p.values)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 text-left hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <span className="text-xl">{p.emoji}</span>
              <div>
                <span className="text-sm font-medium text-gray-800">{p.label}</span>
                <span className="text-xs text-gray-400 ml-2">{p.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: 自動入力 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">STEP 1</span>
          <span className="text-sm font-semibold text-gray-800">確定申告書で自動入力</span>
          <span className="text-xs text-gray-400 ml-auto">任意</span>
        </div>
        <p className="text-xs text-gray-500">以下いずれかの書類を撮影・スキャンした画像をアップロードすると、AIが数値を自動で読み取ります。</p>
        <p className="text-xs text-gray-500">対応書類：確定申告書B 第一表 ／ 収支内訳書 ／ 青色申告決算書</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file) }}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed py-4 text-center transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
        >
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
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
          {ocrStatus === 'error' && <p className="mt-2 text-xs text-red-500">{ocrError}</p>}
        </div>
      </div>

      {/* STEP 2 */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-bold bg-gray-700 text-white px-2 py-0.5 rounded-full">STEP 2</span>
        <span className="text-sm font-semibold text-gray-800">内容を確認・入力</span>
        {ocrStatus === 'done' && <span className="text-xs text-green-600 font-medium ml-auto">自動入力済み ✓</span>}
      </div>

      {/* 売上・経費 */}
      <Section title="📊 売上・経費">
        <MoneyInput label="年間売上高" value={data.revenue} onChange={(v) => set('revenue', v)}
          hint="確定申告書B 第一表①欄（事業・営業等）／ 収支内訳書・青色申告決算書の「売上（収入）金額」欄の金額を入力してください。"
        />
        <MoneyInput label="年間経費合計" value={data.expenses} onChange={(v) => set('expenses', v)}
          hint="収支内訳書・青色申告決算書の「経費合計」欄の金額。専従者給与は別の欄に入力するのでここには含めないでください。"
        />
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            青色申告特別控除
            <Tooltip text="青色申告者が受けられる特別控除。e-Tax+複式簿記で65万円、複式簿記のみで55万円、簡易帳簿で10万円、白色申告は0円。確定申告書の「青色申告特別控除額」欄で確認できます。" />
          </label>
          <select value={data.blueFormDeduction} onChange={(e) => set('blueFormDeduction', Number(e.target.value))}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={650000}>65万円（電子申告・複式簿記）</option>
            <option value={550000}>55万円（複式簿記）</option>
            <option value={100000}>10万円（簡易帳簿）</option>
            <option value={0}>なし（白色申告）</option>
          </select>
        </div>
        <MoneyInput label="専従者給与（配偶者・家族への給与）" value={data.familyWorkerSalary}
          onChange={(v) => set('familyWorkerSalary', v)}
          hint="青色申告の専従者給与として支払った年間総額。事業に従事する家族への給与で、全額が経費になります。いない場合は0のままでOK。"
        />
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            業種（個人事業税率）
            <Tooltip text="都道府県に納める個人事業税の税率。ITエンジニア・コンサルタント等の一般的なサービス業は5%。農林水産業の一部は低税率。課税されない業種もあります（不動産貸付などは要確認）。" />
          </label>
          <select value={data.industryTaxRate} onChange={(e) => set('industryTaxRate', Number(e.target.value))}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <p className="flex items-center text-sm font-medium text-gray-700">
              配偶者あり
              <Tooltip text="配偶者（妻・夫）の年間所得が48万円以下の場合に38万円の配偶者控除が受けられます。配偶者控除と専従者給与は同時に使えないため、どちらが有利か検討が必要です。" />
            </p>
            <p className="text-xs text-gray-400">配偶者の所得が48万円以下の場合に控除対象</p>
          </div>
          <button type="button" onClick={() => set('hasSpouse', !data.hasSpouse)}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${data.hasSpouse ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${data.hasSpouse ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            扶養家族の数（配偶者除く）
            <Tooltip text="配偶者以外の扶養親族（子ども・親など）の人数。1人につき38万円の控除（16歳未満の子どもは扶養控除の対象外ですが、入力しても計算上影響ありません）。" />
          </label>
          <input type="text" inputMode="numeric"
            value={data.dependents === 0 ? '' : String(data.dependents)}
            onChange={(e) => { const raw = e.target.value.replace(/[^\d]/g, ''); set('dependents', raw === '' ? 0 : Math.min(parseInt(raw, 10), 10)) }}
            placeholder="0"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <MoneyInput label="iDeCo・小規模企業共済等掛金" value={data.ideco}
          onChange={(v) => set('ideco', v)}
          hint="iDeCo（最大年816,000円）や小規模企業共済（最大年840,000円）の年間掛金合計。全額が所得控除になります。未加入の場合は0のままでOK。"
        />
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            年齢
            <Tooltip text="40歳以上になると国民健康保険料に介護保険料が加算されます（年間1〜3万円程度）。40歳未満・75歳以上では介護保険料は不要です。" />
          </label>
          <input type="text" inputMode="numeric"
            value={data.age === 0 ? '' : String(data.age)}
            onChange={(e) => { const raw = e.target.value.replace(/[^\d]/g, ''); set('age', raw === '' ? 0 : Math.min(parseInt(raw, 10), 99)) }}
            placeholder="40"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <DeductionAccordion data={data} onChange={onChange} />
      </Section>

      {/* 法人化後の設定 */}
      <Section title="🏢 法人化後のシミュレーション">
        <DirectorSalaryInput value={data.directorSalary} onChange={(v) => set('directorSalary', v)} />
        <MoneyInput label="配偶者役員報酬（年額）" value={data.spouseDirectorSalary}
          onChange={(v) => set('spouseDirectorSalary', v)}
          hint="配偶者を役員にして給与を分散することで、家族全体の税負担を下げられます（所得分散）。0の場合は設定なし。配偶者控除との併用は不可です。"
        />
        {data.spouseDirectorSalary > 0 && data.hasSpouse && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            ⚠️ 配偶者が役員として給与を受け取る場合、代表者の配偶者控除（38万円）は適用されません。法人化後の計算では自動的に除外しています。
          </p>
        )}
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

      <button onClick={onSubmit} disabled={data.revenue === 0}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
        法人化シミュレーションを実行
      </button>
    </div>
  )
}
