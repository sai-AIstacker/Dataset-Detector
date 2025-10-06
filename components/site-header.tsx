"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn("fixed top-3 inset-x-0 z-50 flex justify-center px-4")}>
      <div
        className={cn(
          "glass w-full max-w-6xl rounded-xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all",
          scrolled ? "shadow-lg" : "",
        )}
      >
        <Link href="#home" className="flex items-center gap-3 group">
          <LogoMark />
          <span className="font-heading font-extrabold tracking-widest text-sm sm:text-base">DATASET DETECTIVE</span>
        </Link>

        <nav className="hidden sm:flex gap-6 text-sm">
          {[
            { href: "#home", label: "Home" },
            { href: "#features", label: "Features" },
            { href: "#phase1", label: "Phase 1 Report" },
            { href: "#phase2", label: "Phase 2 Report" },
            { href: "#faq", label: "FAQ" },
            { href: "#about", label: "About" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="opacity-80 hover:opacity-100 transition">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function LogoMark() {
  // Overlapping magnifying glasses forming infinity with cyan glow
  return (
    <div className="relative">
      <svg width="36" height="20" viewBox="0 0 36 20" aria-hidden>
        <defs>
          <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(0,255,255,0.7)" />
          </filter>
        </defs>
        <g filter="url(#g)" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M10 10a6 6 0 1 1 0-0.01Z" />
          <path d="M26 10a6 6 0 1 1 0-0.01Z" />
          <line x1="6" y1="14" x2="3" y2="17" />
          <line x1="30" y1="14" x2="33" y2="17" />
        </g>
      </svg>
      <span className="sr-only">Dataset Detective</span>
    </div>
  )
}
