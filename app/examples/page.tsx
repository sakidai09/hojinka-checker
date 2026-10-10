import Link from 'next/link'
import { compare } from '@/lib/taxCalculations'
import type { InputData } from '@/lib/types'
export const metadata = { title: '法人化の計算例と結果の読み方 | 法人化シミュレーター', description: '売上・経費・役員報酬を変えた3ケースを現行モデルで比較。維持費を含めた判断方法も解説します。' }
const base: InputData = { revenue: 7000000, expenses: 800000, blueFormDeduction: 650000, familyWorkerSalary: 0, hasSpouse: false, dependents: 0, ideco: 0, age: 40, directorSalary: 3600000, industryTaxRate: .05, mortgageDeduction: 0, medicalExpenses: 0, lifeInsuranceDeduction: 0, earthquakeInsurance: 0, donationDeduction: 0, spouseDirectorSalary: 0 }
const cases = [
  { title: '売上700万円・経費80万円', input: base, note: '役員報酬を年360万円とした例です。会社に残る利益は個人の手取りとは異なるため、負担差だけで自由に使えるお金が増えるとは判断できません。' },
  { title: '同じ売上で経費が300万円', input: { ...base, expenses: 3000000 }, note: '売上が同じでも利益が減ると、法人住民税の固定費と社会保険の負担が相対的に重くなります。売上だけで法人化の時期を決めないための比較です。' },
  { title: '売上1,000万円・役員報酬600万円', input: { ...base, revenue: 10000000, expenses: 1500000, directorSalary: 6000000 }, note: '役員報酬を増やすと法人利益は減りますが、個人の税金と会社・本人の社会保険料は増えます。報酬を変えた複数ケースで確認してください。' },
]
const yen = (n: number) => new Intl.NumberFormat('ja-JP').format(n) + '円'
export default function Examples() { return <main className="max-w-3xl mx-auto px-5 py-10 text-gray-800 space-y-8">
  <Link href="/" className="text-blue-600 underline">シミュレーターへ戻る</Link>
  <h1 className="text-2xl font-bold">法人化の計算例と結果の読み方</h1>
  <p>更新日：2026年10月10日。次の数値は現行ツールの計算モデルから生成しています。2024年度の数値を一部使用する概算であり、2026年度の税額や節税額を保証するものではありません。<Link href="/calculation-policy" className="text-blue-600 underline">対象年度・計算上の制約</Link>を先に確認してください。</p>
  <p>全例で青色申告控除65万円、40歳、配偶者・扶養なし、その他控除なし、個人事業税率5%としています。</p>
  {cases.map(c => { const r = compare(c.input); return <section key={c.title} className="rounded-xl border border-gray-200 p-5 space-y-3">
    <h2 className="text-lg font-bold">{c.title}</h2><p>役員報酬：{yen(c.input.directorSalary)}／年</p>
    <dl className="grid grid-cols-2 gap-2"><dt>個人事業主の年間負担</dt><dd>{yen(r.individual.total)}</dd><dt>法人化後の年間負担</dt><dd>{yen(r.corporation.totalBurden)}</dd><dt>負担差（個人 − 法人）</dt><dd>{yen(r.savings)}</dd></dl>
    <p>{c.note}</p></section> })}
  <section className="space-y-3"><h2 className="text-lg font-bold">維持費を足して判断する</h2><p>例えば年間の負担差が30万円でも、法人化に伴う税理士・会計ソフト等の追加費用が年24万円なら、単純な差額は年6万円になります。この24万円は説明用の仮定で、相場や実際の見積もりではありません。</p><p>設立費用、消費税、必要な生活費、会社に残す資金も別に確認します。現行ツールの判定は負担差に基づく目安です。実務では正式な税額・社会保険料と見積もりを使って比較してください。</p></section>
  <nav className="flex flex-wrap gap-4 text-blue-600 underline"><Link href="/calculation-policy">計算根拠</Link><Link href="/about">運営者情報</Link><Link href="/contact">お問い合わせ</Link></nav>
</main> }
