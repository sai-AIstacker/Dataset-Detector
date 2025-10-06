"use client"

import { useEffect, useState } from "react"

type SplashProps = {
  onDone?: () => void
  durationMs?: number
}

export default function Splash({ onDone, durationMs = 2300 }: SplashProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
      onDone?.()
    }, durationMs)
    return () => clearTimeout(t)
  }, [durationMs, onDone])

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label="Loading Dataset Detective"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[440px] px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md animate-[ddFadeIn_600ms_ease-out]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5">
            {/* Logo: magnifying glasses + infinity (inline SVG) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 120"
              className="h-16 w-16"
              style={{ filter: "drop-shadow(0 0 18px rgba(34,211,238,0.6))" }}
            >
              <defs>
                <linearGradient id="dd-cyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(34 211 238)" />
                  <stop offset="100%" stopColor="rgb(14 165 233)" />
                </linearGradient>
              </defs>
              <path
                d="M20,60 C20,45 35,40 45,50 L60,65 L75,50 C85,40 100,45 100,60 C100,75 85,80 75,70 L60,55 L45,70 C35,80 20,75 20,60 Z"
                fill="none"
                stroke="url(#dd-cyan)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="48" cy="52" r="14" fill="none" stroke="url(#dd-cyan)" strokeWidth="5" />
              <line x1="57" y1="61" x2="67" y2="71" stroke="url(#dd-cyan)" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-foreground">DATASET DETECTIVE</h1>
          <p className="mt-2 text-center text-sm text-foreground/70">Auditing datasets with elegance and precision</p>
          {/* Cyan pulse aura */}
          <div
            className="pointer-events-none absolute -inset-3 rounded-3xl"
            style={{ boxShadow: "0 0 70px 10px rgba(34,211,238,0.35)" }}
          />
        </div>
      </div>
    </div>
  )
}
