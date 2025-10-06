export function Features() {
  const items = [
    {
      title: "Predictive Insights",
      desc: "Surface patterns and relationships fast to inform your next model or analysis.",
    },
    {
      title: "Impeccable Quality",
      desc: "Spot missingness, leakage risk, and data issues before they derail your project.",
    },
    {
      title: "Unlock Distributions",
      desc: "Understand feature spread and shape at a glance with quick visuals.",
    },
  ]
  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="glass rounded-2xl p-6 transition hover:-translate-y-0.5 hover:glow-cyan">
            <h3 className="font-heading font-extrabold uppercase tracking-wider">{it.title}</h3>
            <p className="opacity-80 mt-2">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
