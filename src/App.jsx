import { useEffect, useState } from 'react'

const STORAGE_KEY = 'favorite-quotes'

const GPT_LANGUAGES = [
  { value: 'ko', flag: '🇰🇷', name: '한국' },
  { value: 'en', flag: '🇺🇸', name: '미국' },
  { value: 'es', flag: '🇪🇸', name: '스페인' },
  { value: 'ja', flag: '🇯🇵', name: '일본' },
  { value: 'zh', flag: '🇨🇳', name: '중국' },
]

/** Vite base (로컬 `/`, GitHub Pages `/repo/`) + API 경로 */
function quoteApiPath() {
  const base = import.meta.env.BASE_URL ?? '/'
  return `${base}${base.endsWith('/') ? '' : '/'}api/generate-quote`.replace(/\/{2,}/g, '/')
}

function loadSavedFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [keyword, setKeyword] = useState('')
  const [gptLang, setGptLang] = useState('ko')
  const [quote, setQuote] = useState(null)
  const [saved, setSaved] = useState(() => loadSavedFromStorage())
  const [gptLoading, setGptLoading] = useState(false)
  const [gptError, setGptError] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }, [saved])

  async function handleGenerateQuote() {
    setGptError(null)
    setGptLoading(true)
    try {
      const res = await fetch(quoteApiPath(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: gptLang,
          keyword: keyword,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 405) {
          throw new Error(
            '405: 이 주소에서는 POST가 허용되지 않습니다. GitHub Pages 등 정적 사이트이거나, API 서버 없이 미리보기만 켠 경우에 자주 발생합니다. http://localhost:5173 에서 npm run dev(Vite+API 동시)로 실행했는지 확인하세요.',
          )
        }
        if (res.status === 404) {
          throw new Error(
            '404: API를 찾지 못했습니다. npm run dev 로 Vite와 API(3001)를 함께 켰는지 확인하고, 터미널의 BASE_PATH를 지운 뒤 다시 실행해 보세요.',
          )
        }
        throw new Error(data.error || `요청 실패 (${res.status})`)
      }
      setQuote({
        text: data.text,
        author: data.author,
        tag: data.tag || 'GPT',
      })
    } catch (e) {
      setGptError(e instanceof Error ? e.message : '알 수 없는 오류')
    } finally {
      setGptLoading(false)
    }
  }

  const isCurrentSaved =
    quote &&
    saved.some((s) => s.text === quote.text && s.author === quote.author)

  function handleSaveCurrent() {
    if (!quote || isCurrentSaved) return
    setSaved((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: quote.text,
        author: quote.author,
        tag: quote.tag,
      },
    ])
  }

  function handleRemoveSaved(id) {
    setSaved((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">오늘의 명언 생성기</h1>
      </header>

      <section className="controls">
        <fieldset className="lang-fieldset">
          <legend className="label">생성 언어</legend>
          <div className="lang-chips" role="group" aria-label="생성 언어 선택">
            {GPT_LANGUAGES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`lang-chip ${gptLang === opt.value ? 'is-active' : ''}`}
                onClick={() => setGptLang(opt.value)}
                disabled={gptLoading}
                aria-pressed={gptLang === opt.value}
              >
                <span className="lang-chip-flag" aria-hidden="true">
                  {opt.flag}
                </span>
                <span className="lang-chip-name">{opt.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="label" htmlFor="keyword">
          주제나 감정 키워드
        </label>
        <input
          id="keyword"
          className="input"
          type="text"
          placeholder="예: 성공, 도전, 휴식 (비워도 됨)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !gptLoading && handleGenerateQuote()}
        />

        <div className="btn-row">
          <button
            type="button"
            className="btn btn-generate"
            onClick={handleGenerateQuote}
            disabled={gptLoading}
          >
            {gptLoading ? '생성 중…' : '명언 생성'}
          </button>
        </div>

        {gptError ? <p className="api-error">{gptError}</p> : null}
      </section>

      <section className="card-wrap">
        {quote ? (
          <article className="card">
            <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
            <p className="quote-author">— {quote.author}</p>
            <span className="quote-tag">{quote.tag}</span>
            <div className="card-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSaveCurrent}
                disabled={isCurrentSaved}
              >
                {isCurrentSaved ? '저장됨' : '이 명언 저장하기'}
              </button>
            </div>
          </article>
        ) : (
          <p className="hint">언어와 키워드를 고른 뒤 명언 생성을 눌러 보세요.</p>
        )}
      </section>

      <section className="saved-section" aria-labelledby="saved-heading">
        <h2 id="saved-heading" className="saved-title">
          저장한 명언 <span className="saved-count">({saved.length})</span>
        </h2>
        {saved.length === 0 ? (
          <p className="saved-empty">아직 저장한 명언이 없습니다.</p>
        ) : (
          <ul className="saved-list">
            {saved.map((item) => (
              <li key={item.id} className="saved-item">
                <div className="saved-item-body">
                  <p className="saved-item-text">&ldquo;{item.text}&rdquo;</p>
                  <p className="saved-item-meta">
                    <span>— {item.author}</span>
                    <span className="saved-item-tag">{item.tag}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => handleRemoveSaved(item.id)}
                  aria-label="목록에서 이 명언 삭제"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="app-version" aria-label="배포 버전">
        배포 버전 {__APP_VERSION__}
      </footer>
    </div>
  )
}
