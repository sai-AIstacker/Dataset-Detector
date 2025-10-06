"use client"

import { SiteHeader } from "@/components/site-header"
import { HeroUpload } from "@/components/hero-upload"
import { PhaseOne } from "@/components/phase-one"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { About } from "@/components/about"
import { SiteFooter } from "@/components/site-footer"
import { PhaseTwo } from "@/components/phase-two"
import { DatasetProvider } from "@/components/dataset-context"
import Splash from "@/components/splash"
import WelcomeGreeting from "@/components/welcome-greeting"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <Splash />
      <DatasetProvider>
        <SiteHeader />
        <div className="pt-6">
          <WelcomeGreeting />
        </div>
        <section id="home" className="pt-24">
          <HeroUpload />
        </section>
        <section id="phase1" className="py-20">
          <PhaseOne />
        </section>
        <section id="phase2" className="py-20">
          <PhaseTwo />
        </section>
        <section id="features" className="py-20">
          <Features />
        </section>
        <section id="faq" className="py-20">
          <FAQ />
        </section>
        <section id="about" className="py-20">
          <About />
        </section>
        <SiteFooter />
      </DatasetProvider>
    </main>
  )
}
