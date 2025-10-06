import { Github, Linkedin, Twitter, Globe } from "lucide-react"

export function About() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-3xl glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-6">
        <img
          src="/images/mee.png"
          alt="Sai Sarthak Sadangi"
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover mx-auto"
          style={{ boxShadow: "0 0 0 2px var(--color-primary)" }}
        />
        <div className="w-full">
          <h2 className="font-heading font-extrabold uppercase tracking-widest text-2xl">About the Creator</h2>
          <p className="mt-1 text-sm opacity-75">{"me sai,i'm a AI/ML EXPLORER #saiAIstacker"}</p>
          <p className="opacity-80 mt-3 max-w-2xl mx-auto">
            Hi I build tools that reveal signal in messy data. Dataset Detective turns CSVs into clear, actionable EDA
            so you can move faster with confidence.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="https://github.com/sai-AIstacker"
              aria-label="GitHub"
              className="p-2 rounded-lg transition hover:glow-cyan glass"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sai-sarthak-sadangi/"
              aria-label="LinkedIn"
              className="p-2 rounded-lg transition hover:glow-cyan glass"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/Sai_AIstacker"
              aria-label="X (Twitter)"
              className="p-2 rounded-lg transition hover:glow-cyan glass"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://wanderwithsai.vercel.app/"
              aria-label="Portfolio Website"
              className="p-2 rounded-lg transition hover:glow-cyan glass"
              target="_blank"
              rel="noreferrer"
              title="wanderwithsai.vercel.app"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
