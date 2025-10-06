import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16">
      <div className="mx-auto max-w-6xl glass rounded-2xl p-6 sm:p-8 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="font-heading font-extrabold tracking-widest uppercase">Dataset Detective</div>
          <div className="opacity-80 mt-2">Discover the Unseen</div>
        </div>
        <div>
          <div className="font-heading tracking-wider uppercase text-sm opacity-70">Quick Links</div>
          <ul className="mt-2 grid gap-1 text-sm opacity-80">
            <li>
              <Link href="#home" className="hover:opacity-100">
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:opacity-100">
                Features
              </Link>
            </li>
            <li>
              <Link href="#phase1" className="hover:opacity-100">
                Phase 1 Report
              </Link>
            </li>
            <li>
              <Link href="#phase2" className="hover:opacity-100">
                Phase 2 Report
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:opacity-100">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:opacity-100">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="sm:text-right">
          <div className="opacity-80">Designed & Engineered by sai sarthak</div>
        </div>
      </div>
    </footer>
  )
}
