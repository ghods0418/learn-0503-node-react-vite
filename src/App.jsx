import { useEffect, useState } from 'react'

const STORAGE_KEY = 'favorite-quotes'

const QUOTES = [
  { text: '성공은 준비된 자에게 기회가 왔을 때 찾아온다.', author: '세네카', tag: '성공' },
  { text: '실패는 성공의 어머니다.', author: '토마스 에디슨', tag: '성공' },
  { text: '도전 없이는 승리도 없다.', author: '에디트 해밀턴', tag: '도전' },
  { text: '가장 큰 위험은 위험 없는 삶이다.', author: '프레드릭 니체', tag: '도전' },
  { text: '쉬어가는 것은 길을 잃지 않기 위한 것이다.', author: '노자', tag: '휴식' },
  { text: '느리게 가도 멈추지 않는다면 된다.', author: '공자', tag: '휴식' },
  { text: '우정은 영혼의 결혼이다.', author: '프란시스 베이컨', tag: '우정' },
  { text: '진정한 친구는 어두울 때 빛을 비춘다.', author: '엘렌 버킹', tag: '우정' },
  { text: '할 수 있다고 믿는 자는 결국 그 길을 간다.', author: '괴테', tag: '일반' },
  { text: '오늘 할 수 있는 일을 내일로 미루지 마라.', author: '벤저민 프랭클린', tag: '일반' },
  { text: '작은 기회의 씨앗이 위대한 업적의 열매를 맺는다.', author: '데모크리토스', tag: '일반' },
  { text: '행복은 습관이다. 그것을 몸에 지니라.', author: '허버드', tag: '일반' },
]

function pickRandom(list) {
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

function findQuotesByKeyword(keyword) {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return []

  return QUOTES.filter((q) => {
    const tag = q.tag.toLowerCase()
    return tag.includes(kw) || kw.includes(tag)
  })
}

function getGeneralQuotes() {
  return QUOTES.filter((q) => q.tag === '일반')
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
  const [quote, setQuote] = useState(null)
  const [saved, setSaved] = useState(() => loadSavedFromStorage())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }, [saved])

  function handleGenerate() {
    const matched = findQuotesByKeyword(keyword)
    const pool = matched.length > 0 ? matched : getGeneralQuotes()
    setQuote(pickRandom(pool))
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
        <label className="label" htmlFor="keyword">
          주제나 감정 키워드
        </label>
        <input
          id="keyword"
          className="input"
          type="text"
          placeholder="예: 성공, 도전, 휴식"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button type="button" className="btn" onClick={handleGenerate}>
          명언 생성하기
        </button>
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
          <p className="hint">키워드를 입력하고 버튼을 눌러 명언을 받아보세요.</p>
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
    </div>
  )
}
