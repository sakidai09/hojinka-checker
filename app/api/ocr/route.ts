import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `この書類は日本の確定申告書や収支内訳書・青色申告決算書のいずれかです。
以下の手順でJSONを返してください。説明文は不要でJSONのみ返してください。

【確定申告書B 第一表の場合の読み取り方】
- revenue: 「収入金額等」→「事業」→「営業等」の欄（①またはア）の金額
- businessIncome: 「所得金額等」→「事業」→「営業等」の欄（①）の金額
- blueFormDeduction: 「青色申告特別控除額」欄（⑲または59番付近）の金額
- familyWorkerSalary: 「専従者給与（控除）額の合計額」欄（⑱または58番付近）の金額
- medicalExpenses: 「所得から差し引かれる金額」→「医療費控除」欄の金額
- lifeInsuranceDeduction: 「所得から差し引かれる金額」→「生命保険料控除」欄の金額
- earthquakeInsurance: 「所得から差し引かれる金額」→「地震保険料控除」欄の金額
- mortgageDeduction: 右側「税金の計算」欄の「住宅借入金等特別控除」（③④番付近）の金額。※この欄は通常0〜50万円程度。「課税される所得金額」③①や「税額」③②と混同しないこと。住宅ローンがない場合は記載がないため null で返すこと
- donationDeduction: 「所得から差し引かれる金額」→「寄附金控除」欄の金額（ふるさと納税等）
※ expenses（経費合計）は第一表に載っていないため null で返すこと

【収支内訳書・青色申告決算書の場合の読み取り方】
- revenue: 「売上（収入）金額」の合計
- expenses: 「経費合計」の金額
- blueFormDeduction: 「青色申告特別控除額」の金額
- familyWorkerSalary: 「専従者給与」の金額
※ businessIncome・medicalExpenses・lifeInsuranceDeduction・earthquakeInsurance・mortgageDeduction・donationDeduction は null で返すこと

返すJSONの形式（数値はカンマなしの整数、読み取れない場合は null）:
{
  "revenue": 数値またはnull,
  "expenses": 数値またはnull,
  "businessIncome": 数値またはnull,
  "blueFormDeduction": 数値またはnull,
  "familyWorkerSalary": 数値またはnull,
  "medicalExpenses": 数値またはnull,
  "lifeInsuranceDeduction": 数値またはnull,
  "earthquakeInsurance": 数値またはnull,
  "mortgageDeduction": 数値またはnull,
  "donationDeduction": 数値またはnull
}`

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'APIキーが設定されていません。環境変数 GEMINI_API_KEY を設定してください。' },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const isPdf = file.type === 'application/pdf'

    const mimeType = isPdf
      ? 'application/pdf'
      : (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
          ? file.type
          : 'image/jpeg') as string

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      PROMPT,
    ])

    const text = result.response.text().trim()
    console.log('[OCR] Gemini response:', text)

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[OCR] JSON not found in response:', text)
      return NextResponse.json(
        { error: '読み取り結果を解析できませんでした。別のファイルをお試しください。', raw: text },
        { status: 422 }
      )
    }

    const extracted = JSON.parse(jsonMatch[0])

    // 確定申告書B 第一表の場合: 経費合計を逆算（売上高 - 事業所得 - 青色申告控除）
    if (extracted.expenses == null && extracted.revenue != null && extracted.businessIncome != null) {
      const blue = extracted.blueFormDeduction ?? 0
      const calc = extracted.revenue - extracted.businessIncome - blue
      extracted.expenses = calc > 0 ? calc : null
    }

    // 住宅ローン控除の異常値チェック（最大50万円程度。それ超は課税所得等との誤認識）
    if (extracted.mortgageDeduction != null && extracted.mortgageDeduction > 500_000) {
      console.warn('[OCR] mortgageDeduction too large, likely misread:', extracted.mortgageDeduction)
      extracted.mortgageDeduction = null
    }

    return NextResponse.json({ data: extracted })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[OCR] Error:', msg)
    return NextResponse.json({ error: `読み取りに失敗しました: ${msg}` }, { status: 500 })
  }
}
