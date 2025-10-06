"use client"

import { useEffect, useState } from "react"

export default function WelcomeGreeting() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div
      aria-live="polite"
      className={[
        "mx-auto max-w-3xl text-center",
        ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        "transition-all duration-700 ease-out",
      ].join(" ")}
    >
      <p className="text-balance text-lg md:text-xl text-foreground/80">
        <span className="font-medium">Sai</span>, Welcome to <span className="font-semibold">Dataset Detective</span>
      </p>
    </div>
  )
}
