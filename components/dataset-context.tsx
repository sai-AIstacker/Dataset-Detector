"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"

export type Row = Record<string, string | number | null>
export type ColSummary = {
  col: string
  type: "numeric" | "categorical"
  missing: number
  missingPct: number
  mean: number | null
  median: number | null
  uniques: number
}
export type Missingness = { col: string; missingPct: number }
export type Correlation = { a: string; b: string; r: number }

type DatasetState = {
  rows: Row[]
  summary: ColSummary[]
  missingness: Missingness[]
  correlations: Correlation[]
}

type DatasetContextType = {
  data: DatasetState | null
  setDataset: (next: DatasetState) => void
  clear: () => void
}

const DatasetContext = createContext<DatasetContextType | null>(null)

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DatasetState | null>(null)
  const api = useMemo<DatasetContextType>(
    () => ({
      data,
      setDataset: (next) => setData(next),
      clear: () => setData(null),
    }),
    [data],
  )

  return <DatasetContext.Provider value={api}>{children}</DatasetContext.Provider>
}

export function useDataset() {
  const ctx = useContext(DatasetContext)
  if (!ctx) throw new Error("useDataset must be used within DatasetProvider")
  return ctx
}
