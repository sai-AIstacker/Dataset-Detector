export function PhaseOne() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl grid gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-heading font-extrabold uppercase tracking-widest text-2xl mb-2">
            Phase 1: Dataset Detective
          </h2>
          <p className="opacity-80 max-w-3xl">
            Feed any CSV and get a one-page EDA report with visuals and auto-generated insights: missing values map,
            column summaries, correlation heatmap, and sample distributions.
          </p>
        </div>
      </div>
    </div>
  )
}
