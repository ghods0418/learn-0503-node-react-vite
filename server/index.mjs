import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const PORT = Number(process.env.API_PORT || 3001)
const ALLOWED = new Set(['ko', 'en', 'es', 'ja', 'zh'])

const LANG = {
  ko: 'Korean',
  en: 'English',
  es: 'Spanish',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
}

const app = express()
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return cb(null, true)
      }
      cb(null, false)
    },
  }),
)
app.use(express.json({ limit: '32kb' }))

app.post('/api/generate-quote', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY가 .env에 없습니다. 키를 저장한 뒤 API 서버를 다시 시작하세요.',
    })
  }

  let { language = 'ko', keyword = '' } = req.body ?? {}
  if (typeof keyword !== 'string') keyword = ''
  if (!ALLOWED.has(language)) language = 'ko'

  const langName = LANG[language]
  const kw = keyword.trim()
  const userHint = kw
    ? `Theme or mood (weave in naturally, do not repeat verbatim): "${kw}".`
    : 'No keyword; write a concise general motivational quote.'

  const client = new OpenAI({ apiKey })
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'

  try {
    const completion = await client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You create brief original inspirational quotes (not copying well-known copyrighted lines). Reply with ONE JSON object only, keys: "text" (quote in ${langName}), "author" (plausible name or a natural "unknown author" phrase in ${langName}), "tag" (short theme label in ${langName}, max ~15 chars). At most 2 sentences for text.`,
        },
        { role: 'user', content: `${userHint}\nAll string values must be in ${langName}.` },
      ],
      temperature: 0.85,
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) throw new Error('모델 응답이 비어 있습니다.')

    const parsed = JSON.parse(raw)
    const text = typeof parsed.text === 'string' ? parsed.text.trim() : ''
    const author =
      typeof parsed.author === 'string' && parsed.author.trim()
        ? parsed.author.trim()
        : 'Unknown'
    const tag =
      typeof parsed.tag === 'string' && parsed.tag.trim() ? parsed.tag.trim() : 'GPT'

    if (!text) throw new Error('JSON에 유효한 text가 없습니다.')

    res.json({ text, author, tag })
  } catch (err) {
    console.error(err)
    const msg = err instanceof Error ? err.message : '명언 생성에 실패했습니다.'
    res.status(500).json({ error: msg })
  }
})

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}`)
})
