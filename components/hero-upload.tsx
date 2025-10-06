"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import Papa from "papaparse"
import { cn } from "@/lib/utils"
import { useDataset } from "@/components/dataset-context" // added

type Row = Record<string, string | number | null>

export function HeroUpload() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [reportText, setReportText] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setDataset, clear } = useDataset() // added

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if ((f && f.type.includes("csv")) || f?.name?.endsWith(".csv")) {
      setFileName(f.name)
      parseFile(f)
    }
  }, [])

  const parseFile = (f: File) => {
    setProcessing(true)
    Papa.parse<Row>(f, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transform: (val) => {
        try {
          const s = String(val ?? "").trim()
          if (s === "" || /^(na|n\/a|null|nan|undefined|none)$/i.test(s)) return null
          return val
        } catch {
          return val
        }
      },
      complete: async (results) => {
        const raw = (results.data as Row[]) || []
        const rows = sanitizeRows(raw)
        const { summary, missingness, correlations } = computeEDA(rows)
        setDataset({ rows, summary, missingness, correlations })
        const png = await renderReportPNG({
          fileName: f.name,
          rows,
          summary,
          missingness,
          correlations,
        })
        const text = buildTextSummary(summary, missingness, correlations)
        setReportUrl(png)
        setReportText(text)
        setProcessing(false)
      },
      error: () => {
        setProcessing(false)
      },
    })
  }

  const handleClickUpload = () => fileInputRef.current?.click()

  const headline = useMemo(() => "TRANSCEND DATA. DISCOVER INSIGHT.", [])

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl text-center space-y-6">
        <h1 className="font-heading font-extrabold uppercase text-balance text-3xl sm:text-5xl tracking-[0.08em]">
          {headline}
        </h1>
        <p className="text-pretty opacity-80 max-w-2xl mx-auto">
          Instantly audit any CSV and receive a one-page report with actionable insights.
        </p>
      </div>

      <div className="mx-auto max-w-4xl mt-10">
        <div className="neon-square rounded-2xl p-[2px]">
          <div
            className={cn(
              "glass rounded-2xl p-6 sm:p-8 transition-transform",
              "hover:-translate-y-0.5 hover:glow-cyan",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setFileName(f.name)
                    parseFile(f)
                  }
                }}
              />
              {/* Dedicated dropzone with animated square border */}
              <div
                className="w-full max-w-xl neon-square rounded-xl p-[2px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                aria-label="CSV dropzone"
              >
                <div
                  className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-black/3 px-6 py-8"
                  role="button"
                  tabIndex={0}
                  onClick={handleClickUpload}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClickUpload()}
                >
                  <div className="text-sm opacity-80 mb-3">Drag & drop your CSV here</div>
                  <button
                    className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClickUpload()
                    }}
                    aria-label="Upload CSV"
                  >
                    Drag & Drop / Click to Upload CSV
                  </button>
                </div>
              </div>

              {fileName && (
                <div className="opacity-80 text-sm">
                  File Selected: <span className="font-medium">{fileName}</span>
                </div>
              )}

              {/* Animated square around Initiate Audit button (kept) */}
              <div className="neon-square rounded-lg p-[2px]">
                <button
                  className={cn(
                    "rounded-lg px-5 py-2 text-sm font-semibold transition",
                    processing ? "cursor-not-allowed opacity-70" : "btn-primary",
                  )}
                  onClick={() => fileInputRef.current?.files?.[0] && parseFile(fileInputRef.current.files[0]!)}
                  disabled={processing || !fileInputRef.current?.files?.[0]}
                  aria-busy={processing ? "true" : "false"}
                >
                  {processing ? "Initiating Audit..." : "Initiate Audit"}
                </button>
              </div>

              {processing && (
                <div className="mt-2 flex items-center gap-2 text-sm opacity-80" aria-live="polite">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  Generating Phase 1 EDA…
                </div>
              )}
            </div>
          </div>
        </div>

        {reportUrl && (
          <div className="mt-10 grid gap-6">
            <div className="glass rounded-2xl p-4">
              <img
                src={reportUrl || "/placeholder.svg"}
                alt="Dataset Detective audit report preview"
                className="w-full h-auto rounded-md"
              />
            </div>
            {reportText && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-extrabold uppercase text-lg tracking-wider mb-2">Summary</h3>
                <pre className="text-sm whitespace-pre-wrap opacity-90">{reportText}</pre>
              </div>
            )}
            {/* Action row under analysis: Start New Analysis + Download Report */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                className="rounded-lg px-5 py-2 text-sm font-semibold border border-[var(--color-border)] hover:glow-cyan transition"
                onClick={() => {
                  setFileName(null)
                  setProcessing(false)
                  setReportUrl(null)
                  setReportText(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                  clear()
                }}
              >
                Start New Analysis
              </button>
              <div className="neon-square rounded-lg p-[2px]">
                <button
                  className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold"
                  onClick={() => {
                    if (!reportUrl) return
                    const a = document.createElement("a")
                    a.href = reportUrl
                    a.download = "dataset-detective-report.png"
                    a.click()
                  }}
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function computeEDA(rows: Row[]) {
  const allCols = getAllColumns(rows)
  const n = rows.length

  const colStats = allCols.map((col) => {
    const vals = rows.map((r) => (r ? r[col] : undefined))
    const nonMissing = vals.filter((v) => !isMissing(v))
    const numericVals = nonMissing
      .map((v) => toNumber(v))
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))

    const numericCount = numericVals.length
    const type: "numeric" | "categorical" =
      numericCount >= Math.max(3, Math.ceil(0.6 * nonMissing.length)) ? "numeric" : "categorical"

    let mean: number | null = null
    let median: number | null = null
    if (type === "numeric" && numericVals.length) {
      mean = numericVals.reduce((a, b) => a + b, 0) / numericVals.length
      const sorted = [...numericVals].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    }

    const uniqueSet = new Set(nonMissing.map((v) => (typeof v === "string" ? v.trim() : v)))
    const uniques = uniqueSet.size
    const missing = n - nonMissing.length
    const missingPct = n ? missing / n : 0

    return { col, type, missing, missingPct, mean, median, uniques }
  })

  const numericCols = colStats.filter((s) => s.type === "numeric").map((s) => s.col)

  const correlations: { a: string; b: string; r: number }[] = []
  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const a = numericCols[i]
      const b = numericCols[j]
      const xs: number[] = []
      const ys: number[] = []
      // Pair rows only where both columns are valid numbers
      for (const r of rows) {
        const va = toNumber(r?.[a])
        const vb = toNumber(r?.[b])
        if (typeof va === "number" && Number.isFinite(va) && typeof vb === "number" && Number.isFinite(vb)) {
          xs.push(va)
          ys.push(vb)
        }
      }
      if (xs.length >= 3) {
        const r = pearson(xs, ys)
        if (!Number.isNaN(r)) correlations.push({ a, b, r })
      }
    }
  }

  const missingness = colStats.map((s) => ({ col: s.col, missingPct: s.missingPct }))

  return { summary: colStats, missingness, correlations }
}

function pearson(x: number[], y: number[]) {
  const n = x.length
  const mean = (a: number[]) => a.reduce((p, c) => p + c, 0) / a.length
  const mx = mean(x),
    my = mean(y)
  let num = 0,
    dx = 0,
    dy = 0
  for (let i = 0; i < n; i++) {
    const ax = x[i] - mx
    const ay = y[i] - my
    num += ax * ay
    dx += ax * ax
    dy += ay * ay
  }
  return num / Math.sqrt(dx * dy || 1)
}

function buildTextSummary(
  summary: ReturnType<typeof computeEDA>["summary"],
  missingness: ReturnType<typeof computeEDA>["missingness"],
  correlations: ReturnType<typeof computeEDA>["correlations"],
) {
  const lines: string[] = []
  lines.push("Phase 1: Dataset Detective — EDA Summary")
  lines.push("")
  lines.push(`Columns analyzed: ${summary.length}`)
  lines.push(
    `Columns with > 20% missing: ${
      missingness
        .filter((m) => m.missingPct > 0.2)
        .map((m) => m.col)
        .join(", ") || "None"
    }`,
  )
  const topCorr = [...correlations].sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 3)
  if (topCorr.length) {
    lines.push("Top correlations:")
    for (const c of topCorr) lines.push(`- ${c.a} vs ${c.b}: r = ${c.r.toFixed(2)}`)
  } else {
    lines.push("Top correlations: None detected with sufficient data.")
  }
  lines.push("")
  lines.push("Column summaries:")
  for (const s of summary) {
    lines.push(
      `- ${s.col} [${s.type}] uniques=${s.uniques}${s.type === "numeric" ? ` mean=${s.mean?.toFixed(2) ?? "N/A"} median=${s.median?.toFixed(2) ?? "N/A"}` : ""} missing=${(s.missingPct * 100).toFixed(1)}%`,
    )
  }
  return lines.join("\n")
}

async function renderReportPNG({
  fileName,
  rows,
  summary,
  missingness,
  correlations,
}: {
  fileName: string
  rows: Row[]
  summary: ReturnType<typeof computeEDA>["summary"]
  missingness: ReturnType<typeof computeEDA>["missingness"]
  correlations: ReturnType<typeof computeEDA>["correlations"]
}) {
  const W = 1200,
    H = 1600
  const pad = 28
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!
  // background
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-card") || "#ffffff"
  ctx.fillRect(0, 0, W, H)

  // header
  const cyan = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#00FFFF"
  ctx.fillStyle = cyan
  ctx.fillRect(0, 0, W, 80)

  ctx.fillStyle = "#081013"
  ctx.font = "bold 28px Plus Jakarta Sans, Inter, system-ui"
  ctx.fillText("Dataset Detective — Phase 1 EDA", pad, 50)

  // meta
  ctx.fillStyle = "#0E0F11"
  ctx.font = "bold 22px Inter, system-ui"
  ctx.fillText("File:", pad, 120)
  ctx.font = "18px Inter, system-ui"
  ctx.fillText(fileName, pad + 60, 120)

  // Column summaries table
  const tableY = 160
  ctx.font = "bold 20px Inter"
  ctx.fillText("Column summaries", pad, tableY)
  ctx.font = "16px Inter"
  let y = tableY + 26
  for (const s of summary.slice(0, 18)) {
    const row =
      `${s.col} [${s.type}]  uniques=${s.uniques}  missing=${(s.missingPct * 100).toFixed(1)}%` +
      (s.type === "numeric" ? `  mean=${s.mean?.toFixed(2) ?? "N/A"}  median=${s.median?.toFixed(2) ?? "N/A"}` : "")
    ctx.fillText(row, pad, y)
    y += 22
  }

  // Missingness bar chart
  const chartY = 680
  ctx.font = "bold 20px Inter"
  ctx.fillText("Missing values (%)", pad, chartY)
  const barsArea = { x: pad, y: chartY + 16, w: W - pad * 2, h: 180 }
  const maxPct = Math.max(0.05, ...missingness.map((m) => m.missingPct))
  const barW = Math.max(4, Math.floor((barsArea.w - (missingness.length - 1) * 6) / Math.max(1, missingness.length)))
  let bx = barsArea.x
  for (const m of missingness) {
    const h = Math.round((m.missingPct / maxPct) * (barsArea.h - 30))
    ctx.fillStyle = cyan
    ctx.fillRect(bx, barsArea.y + (barsArea.h - h), barW, h)
    bx += barW + 6
  }

  // Correlations heat list
  const corrY = 900
  ctx.font = "bold 20px Inter"
  ctx.fillStyle = "#0E0F11"
  ctx.fillText("Top correlations (|r|)", pad, corrY)
  ctx.font = "16px Inter"
  const top = [...correlations].sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 10)
  y = corrY + 26
  for (const c of top) {
    ctx.fillText(`${c.a} vs ${c.b}: ${c.r.toFixed(2)}`, pad, y)
    y += 20
  }

  // Footer
  ctx.font = "14px Inter"
  ctx.fillStyle = "#5B616A"
  ctx.fillText(`Rows: ${rows.length}  ·  Generated by Dataset Detective`, pad, H - 24)

  return canvas.toDataURL("image/png")
}

function getAllColumns(rows: Row[]): string[] {
  const set = new Set<string>()
  for (const r of rows) {
    if (!r) continue
    for (const k of Object.keys(r)) set.add(k)
  }
  return Array.from(set)
}

function isMissing(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === "string") {
    const s = v.trim()
    return s === "" || /^(na|n\/a|null|nan|undefined|none)$/i.test(s)
  }
  return false
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null
  if (typeof v === "string") {
    const cleaned = v.replace(/,/g, "").trim()
    if (cleaned === "") return null
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
  }
  return null
}

function sanitizeRows(rows: Row[]): Row[] {
  return rows.filter((r) => r && Object.values(r).some((v) => !isMissing(v)))
}
