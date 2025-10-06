"use client"

import type React from "react"

import { useMemo, useState, Fragment, useRef } from "react"
import { useDataset } from "@/components/dataset-context"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { toPng } from "html-to-image"

type HistogramBin = { x0: number; x1: number; count: number }

function computeHistogram(values: number[], bins = 20): HistogramBin[] {
  if (!values.length) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const width = max === min ? 1 : (max - min) / bins
  const arr = new Array(bins).fill(0) as number[]
  for (const v of values) {
    const idx = Math.max(0, Math.min(bins - 1, Math.floor((v - min) / width)))
    arr[idx] += 1
  }
  return arr.map((count, i) => {
    const x0 = min + i * width
    const x1 = x0 + width
    return { x0, x1, count }
  })
}

function PhaseTwoActions({ contentRef }: { contentRef: React.RefObject<HTMLDivElement> }) {
  const { clear } = useDataset()
  return (
    <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        className="rounded-lg px-5 py-2 text-sm font-semibold border border-[var(--color-border)] hover:glow-cyan transition"
        onClick={() => clear()}
      >
        Start New Analysis
      </button>
      <div className="neon-square rounded-lg p-[2px]">
        <button
          className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold"
          onClick={async () => {
            const node = contentRef.current
            if (!node) return
            try {
              const dataUrl = await toPng(node, {
                pixelRatio: 2,
                cacheBust: true,
                backgroundColor: getComputedStyle(document.body).getPropertyValue("--color-card") || "#ffffff",
                // @ts-expect-error runtime option from html-to-image
                skipFonts: true,
                style: {
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                },
              } as any)
              const a = document.createElement("a")
              a.href = dataUrl
              a.download = "dataset-detective-phase-2.png"
              a.click()
            } catch (err) {
              console.error("Export failed:", err)
            }
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export function PhaseTwo() {
  const { data } = useDataset()
  const [focus, setFocus] = useState<{ cols?: string[]; pair?: [string, string] } | null>(null)
  const contentRef = useRef<HTMLDivElement>(null) // capture section for export

  const numericCols = useMemo(() => data?.summary.filter((s) => s.type === "numeric").map((s) => s.col) || [], [data])

  const columnToValues = useMemo(() => {
    const map: Record<string, number[]> = {}
    if (data) {
      for (const col of numericCols) {
        const arr: number[] = []
        for (const r of data.rows) {
          const v = r[col]
          if (typeof v === "number" && Number.isFinite(v)) arr.push(v)
        }
        map[col] = arr
      }
    }
    return map
  }, [data, numericCols])

  const histograms = useMemo(() => {
    const out: Record<string, HistogramBin[]> = {}
    for (const col of numericCols) out[col] = computeHistogram(columnToValues[col] || [], 20)
    return out
  }, [columnToValues, numericCols])

  const topCorr = useMemo(
    () => [...(data?.correlations || [])].sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 10),
    [data],
  )

  if (!data) {
    return (
      <div className="px-4">
        <div className="mx-auto max-w-6xl grid gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading font-extrabold uppercase tracking-widest text-2xl mb-2">
              Phase 2: Interactive Report
            </h2>
            <p className="opacity-80">
              Upload a CSV above to unlock the fully interactive EDA: narrative insights, column statistics, missingness
              overview, correlations, and distributions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4" ref={contentRef}>
      <div className="mx-auto max-w-6xl grid gap-6">
        {/* Narrative */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-heading font-extrabold uppercase tracking-widest text-2xl mb-2">
            Phase 2: Interactive Report
          </h2>
          <ul className="grid gap-2 text-sm opacity-90">
            <li
              className="hover:glow-cyan cursor-pointer"
              onClick={() => setFocus({ cols: data.summary.map((s) => s.col) })}
            >
              • Columns analyzed: {data.summary.length}
            </li>
            <li
              className="hover:glow-cyan cursor-pointer"
              onClick={() =>
                setFocus({
                  cols: data.missingness.filter((m) => m.missingPct > 0.2).map((m) => m.col),
                })
              }
            >
              • High missingness:{" "}
              {data.missingness
                .filter((m) => m.missingPct > 0.2)
                .map((m) => m.col)
                .join(", ") || "None"}
            </li>
            {topCorr.length ? (
              <li
                className="hover:glow-cyan cursor-pointer"
                onClick={() => setFocus({ pair: [topCorr[0].a, topCorr[0].b] })}
              >
                • Top correlation: {topCorr[0].a} vs {topCorr[0].b} (r = {topCorr[0].r.toFixed(2)})
              </li>
            ) : (
              <li>• No strong correlations detected</li>
            )}
          </ul>
        </div>

        {/* Column statistics */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-extrabold uppercase tracking-wider mb-3">Column Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left opacity-70">
                <tr>
                  <th className="py-2 pr-4">Column</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Uniques</th>
                  <th className="py-2 pr-4">Missing</th>
                  <th className="py-2 pr-4">Mean</th>
                  <th className="py-2 pr-4">Median</th>
                </tr>
              </thead>
              <tbody>
                {data.summary.map((s) => {
                  const active =
                    focus?.cols?.includes(s.col) ||
                    (focus?.pair && (focus.pair[0] === s.col || focus.pair[1] === s.col))
                  return (
                    <tr
                      key={s.col}
                      className={`border-t border-border/50 hover:bg-white/2 transition ${
                        active ? "outline outline-1 outline-[var(--color-primary)]" : ""
                      }`}
                      onMouseEnter={() => setFocus({ cols: [s.col] })}
                      onMouseLeave={() => setFocus(null)}
                    >
                      <td className="py-2 pr-4 font-medium">{s.col}</td>
                      <td className="py-2 pr-4">{s.type}</td>
                      <td className="py-2 pr-4">{s.uniques}</td>
                      <td className="py-2 pr-4">{(s.missingPct * 100).toFixed(1)}%</td>
                      <td className="py-2 pr-4">{s.type === "numeric" && s.mean != null ? s.mean.toFixed(2) : "—"}</td>
                      <td className="py-2 pr-4">
                        {s.type === "numeric" && s.median != null ? s.median.toFixed(2) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Quality Overview */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-extrabold uppercase tracking-wider mb-3">Data Quality Overview</h3>
          <div className="grid gap-3">
            {data.missingness.map((m) => {
              const active = focus?.cols?.includes(m.col)
              return (
                <div key={m.col} className="grid gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${active ? "text-[var(--color-primary)]" : ""}`}>{m.col}</span>
                    <span className="opacity-70">{(m.missingPct * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-md bg-black/10 overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] transition-all"
                      style={{ width: `${Math.min(100, m.missingPct * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Correlation Analysis */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-extrabold uppercase tracking-wider mb-3">Correlation Analysis</h3>
          {numericCols.length >= 2 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Heatmap-like matrix using CSS grid */}
              <div>
                <div className="text-sm opacity-70 mb-2">Correlation matrix (|r| colored)</div>
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `auto repeat(${numericCols.length}, minmax(0, 1fr))`,
                    gap: "2px",
                  }}
                >
                  <div />
                  {numericCols.map((c) => (
                    <div key={`h-${c}`} className="text-[10px] text-center opacity-70 truncate">
                      {c}
                    </div>
                  ))}
                  {numericCols.map((rowC) => (
                    <Fragment key={`row-${rowC}`}>
                      <div key={`rlabel-${rowC}`} className="text-[10px] opacity-70 truncate">
                        {rowC}
                      </div>
                      {numericCols.map((colC) => {
                        const pair =
                          data.correlations.find(
                            (p) => (p.a === rowC && p.b === colC) || (p.a === colC && p.b === rowC),
                          ) || null
                        const r = rowC === colC ? 1 : pair ? Math.abs(pair.r) : 0
                        const hue = 180 // cyan-ish
                        const alpha = Math.min(0.95, r)
                        const isFocus =
                          (focus?.pair &&
                            ((focus.pair[0] === rowC && focus.pair[1] === colC) ||
                              (focus.pair[0] === colC && focus.pair[1] === rowC))) ||
                          (focus?.cols && (focus.cols.includes(rowC) || focus.cols.includes(colC)))
                        return (
                          <button
                            key={`${rowC}-${colC}`}
                            className={`h-6 rounded-sm transition ${
                              isFocus ? "outline outline-1 outline-[var(--color-primary)]" : ""
                            }`}
                            style={{ backgroundColor: `hsl(${hue} 100% 50% / ${alpha})` }}
                            onMouseEnter={() => setFocus({ pair: [rowC, colC] })}
                            onMouseLeave={() => setFocus(null)}
                            title={`${rowC} vs ${colC}: r=${(rowC === colC ? 1 : (pair?.r ?? 0)).toFixed(2)}`}
                          />
                        )
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Top correlations list */}
              <div>
                <div className="text-sm opacity-70 mb-2">Top correlations</div>
                <ul className="grid gap-1 text-sm">
                  {topCorr.map((c) => (
                    <li
                      key={`${c.a}-${c.b}`}
                      className="flex items-center justify-between rounded-md bg-black/5 px-3 py-2 hover:glow-cyan cursor-pointer"
                      onMouseEnter={() => setFocus({ pair: [c.a, c.b] })}
                      onMouseLeave={() => setFocus(null)}
                    >
                      <span className="opacity-90">
                        {c.a} ↔ {c.b}
                      </span>
                      <span className="font-mono tabular-nums">{c.r.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="opacity-70 text-sm">Not enough numeric columns for correlations.</div>
          )}
        </div>

        {/* Distributions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-extrabold uppercase tracking-wider mb-3">Distributions</h3>
          {numericCols.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {numericCols.map((c) => {
                const active = focus?.cols?.includes(c) || (focus?.pair && (focus.pair[0] === c || focus.pair[1] === c))
                const bins = histograms[c] || []
                const dataSrc = bins.map((b) => ({
                  label: `${b.x0.toFixed(2)}-${b.x1.toFixed(2)}`,
                  count: b.count,
                }))
                return (
                  <div
                    key={c}
                    className={`rounded-xl border border-border/50 p-3 transition ${
                      active ? "outline outline-1 outline-[var(--color-primary)]" : ""
                    }`}
                    onMouseEnter={() => setFocus({ cols: [c] })}
                    onMouseLeave={() => setFocus(null)}
                    aria-label={`Distribution for ${c}`}
                  >
                    <div className="text-sm font-medium mb-2">{c}</div>
                    <ChartContainer
                      id={`hist-${c}`}
                      className="h-40"
                      config={{ count: { label: "Count", color: "var(--color-primary)" } }}
                    >
                      <ResponsiveContainer>
                        <BarChart data={dataSrc} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="hsl(var(--muted)/.4)" />
                          <XAxis dataKey="label" hide />
                          <YAxis hide />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-primary)" radius={3} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="opacity-70 text-sm">No numeric columns to visualize.</div>
          )}
        </div>

        <PhaseTwoActions contentRef={contentRef} />
      </div>
    </div>
  )
}
