import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `この書類は日本の確定申告書や収支内訳書・青色申告決算書のいずれかです。
以下の手順でJSONを返してください。説明文は不要でJSONのみ返してください。

【確定申告書B 第一表の場合の読み取り方】
- revenue: 「収入金額等」→「事業」→「営業等」の欄（①またはア）の金額
- businessIncome: 「所得金額等」→「事業」→「営業等」の欄（①）の金額
- blueFormDeduction: 「青色申告特別控除額」欄（⑲または59番付近）の金額
- familyWorkerSalary: 「専従者給与（控除）額の合計額」欄（⑱または58番付近）の金額
※ expenses（経費合計）は第一表に載っていないため null で返すこと

【収支内訳書・青色申告決算書の場合の読み取り方】
- revenue: 「売上（収入）金額」の合計
- expenses: 「経費合計」の金額
- blueFormDeduction: 「青色申告特別控除額」の金額
- familyWorkerSalary: 「専従者給与」の金額
※ businessIncome は null で返すこと

返すJSONの形式（数値はカンマなしの整数、読み取れない場合は null）:
{
  "revenue": 数値またはnull,
  "expenses": 数値またはnull,
  "businessIncome": 数値またはnull,
  "blueFormDeduction": 数値またはnull,
  "familyWorkerSalary": 数値またはnull
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

    return NextResponse.json({ data: extracted })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[OCR] Error:', msg)
    return NextResponse.json({ error: `読み取りに失敗しました: ${msg}` }, { status: 500 })
  }
}
