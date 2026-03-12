import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `この確定申告書の画像から以下の数値を読み取り、必ずJSON形式のみで返してください。
読み取れない項目は null にしてください。

{
  "revenue": 売上高（収入金額）の数値（円）,
  "expenses": 経費合計の数値（円）,
  "blueFormDeduction": 青色申告特別控除額（0/100000/550000/650000のいずれか）,
  "familyWorkerSalary": 専従者給与の数値（円）
}

注意：
- 確定申告書Bの場合、売上高は①欄（事業・営業等）の金額
- 収支内訳書・青色申告決算書の場合、売上（収入）金額と経費合計を読み取る
- 数値以外（テキスト・説明等）は一切出力しないこと
- JSONのみ返すこと`,
            },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: '読み取り結果の解析に失敗しました' }, { status: 422 })
    }

    const extracted = JSON.parse(jsonMatch[0])
    return NextResponse.json({ data: extracted })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '読み取りに失敗しました' }, { status: 500 })
  }
}
