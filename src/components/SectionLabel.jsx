// The small mono "01 — about" eyebrow that opens each dashboard section: an
// index, a name, and a hairline running out to the edge of the column.
const SectionLabel = ({ index, children, className = '' }) => (
  <p className={`flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground ${className}`}>
    <span className="shrink-0">{index} — {children}</span>
    <span className="h-px flex-1 bg-border" aria-hidden="true" />
  </p>
)

export default SectionLabel
