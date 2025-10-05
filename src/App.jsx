import React, { useState } from 'react'

// --- API base configuration ---
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001'
const API_BASE = USE_PROXY ? `${PROXY_URL}/api/` : 'https://labs.bible.org/api/'

async function fetchVerseFromApi(passage) {
  const url = `${API_BASE}?passage=${encodeURIComponent(passage)}&type=json`
  const resp = await fetch(url)
  const data = await resp.json()
  return data
}

function VerseCard({ verse }) {
  if (!verse) return null
  return (
    <blockquote className="verse-card">
      <p className="verse-text">{verse.text}</p>
      <footer className="verse-meta">
        — {verse.bookname} {verse.chapter}:{verse.verse}
      </footer>
    </blockquote>
  )
}

function RandomVerse() {
  const [verse, setVerse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getRandom = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVerseFromApi('random')
      setVerse(Array.isArray(data) ? data[0] : data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h2>Random Verse</h2>
      <p className="muted">Click the button to fetch a new random verse.</p>

      <div className="controls">
        <button onClick={getRandom} disabled={loading} className="btn">
          {loading ? 'Loading…' : 'Get Random Verse'}
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      <VerseCard verse={verse} />
    </section>
  )
}

function SpecificVerse() {
  const [input, setInput] = useState('John 3:16')
  const [verse, setVerse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lookup = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVerseFromApi(input)
      setVerse(Array.isArray(data) ? data[0] : data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') lookup()
  }

  return (
    <section className="card">
      <h2>Lookup a Specific Verse</h2>
      <p className="muted">
        Enter a passage (e.g. <code>John 3:16</code>) then press Enter or click Go.
      </p>

      <div className="controls">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Book Chapter:Verse — e.g. John 3:16"
          className="input"
        />
        <button onClick={lookup} disabled={loading} className="btn small">
          {loading ? 'Loading…' : 'Go'}
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      <VerseCard verse={verse} />
    </section>
  )
}

export default function App() {
  return (
    <main className="app">
      <header className="header">
        <h1>Bible Verse Explorer</h1>
        <p className="tagline">Random verses & quick lookups — built with React + Vite</p>
      </header>

      <div className="grid">
        <RandomVerse />
        <SpecificVerse />
      </div>

      <footer className="footer">
        Made for learning — uses labs.bible.org API
      </footer>
    </main>
  )
}
