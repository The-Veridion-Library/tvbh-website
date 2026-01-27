"use client"
import React, { useState } from "react"

const BASE_URL = "/api/label"

export default function LabelApiTestPage() {
  const [bookId, setBookId] = useState("book_styles_001")
  const [labelId, setLabelId] = useState("")
  const [output, setOutput] = useState("")

  const handleMint = async () => {
    setOutput('Minting...')
    try {
      const res = await fetch(`${BASE_URL}/mint?bookId=${encodeURIComponent(bookId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setOutput(`Error: ${message}`)
    }
  }

  const handlePrint = async () => {
    if (!labelId) {
      setOutput('⚠️ Please enter a labelId first')
      return
    }
    setOutput('Printing...')

    try {
      const res = await fetch(`${BASE_URL}/print?labelId=${encodeURIComponent(labelId)}`, {
        method: 'POST',
      })

      if (!res.ok) {
        // If API returns JSON error
        const errData = await res.json()
        setOutput(JSON.stringify(errData, null, 2))
        return
      }

      // PDF response
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // Trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `label-${labelId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setOutput(`✅ PDF downloaded for label ${labelId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setOutput(`Error: ${message}`)
    }
  }

  const handleVerify = async () => {
    if (!labelId) {
      setOutput('⚠️ Please enter a labelId first')
      return
    }
    setOutput('Verifying...')
    try {
      const res = await fetch(`${BASE_URL}/verify?labelId=${encodeURIComponent(labelId)}`)
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setOutput(`Error: ${message}`)
    }
  }

  return (
    <div className="container">
      <h1>TVBH Label API Tester</h1>
      <p className="subtitle">Execute command commands for minting, printing, and verifying labels</p>

      <div className="card">
        <h2>Mint Label</h2>
        <p>Creates a new label. Status will be <code>CREATED</code>.</p>
        <label>
          Book ID:
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="book_styles_001"
          />
        </label>
        <button onClick={handleMint}>Execute command</button>
      </div>

      <div className="card">
        <h2>Print Label</h2>
        <p>Moves a label from <code>CREATED</code> → <code>PRINTED</code> and downloads the PDF.</p>
        <label>
          Label ID:
          <input
            type="text"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
            placeholder="paste labelId here"
          />
        </label>
        <button onClick={handlePrint}>Execute command</button>
      </div>

      <div className="card">
        <h2>Verify Label</h2>
        <p>Check if a label is valid, revoked, or printed.</p>
        <label>
          Label ID:
          <input
            type="text"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
            placeholder="paste labelId here"
          />
        </label>
        <button onClick={handleVerify}>Execute command</button>
      </div>

      <div className="card">
        <h2>Output</h2>
        <pre>{output}</pre>
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 2rem auto;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          color: #0f172a;
          background: #f8fafc;
          padding: 2rem 1rem;
          border-radius: 8px;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .subtitle {
          color: #475569;
          margin-bottom: 2rem;
        }
        .card {
          background: #ffffff;
          border: 1px solid #e6eef6;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.04);
        }
        h2 {
          margin-top: 0;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          margin-top: 0.25rem;
          background: #ffffff;
          color: #0f172a;
        }
        button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: #2563eb;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: #1d4ed8;
        }
        pre {
          background: #f1f5f9;
          border: 1px solid #e6eef6;
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          color: #0f172a;
        }
      `}</style>
    </div>
  )
}