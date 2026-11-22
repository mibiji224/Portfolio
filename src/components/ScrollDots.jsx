// "Where you are" strip shared by the scroll-driven carousels: the current number, a row
// of dots with the active one stretched into a pill, and the total. A long list shares 14
// dots between its items, so the strip stays the same length however many there are.
const ScrollDots = ({ count, position, className = '' }) => {
  const dots = Math.min(count, 14)
  const active = Math.max(0, Math.min(count - 1, Math.round(position)))
  const activeDot = count > 1 ? Math.round((position / (count - 1)) * (dots - 1)) : 0
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="font-mono text-[10px] tabular-nums tracking-wider text-muted-foreground">{pad(active + 1)}</span>
      <div className="flex gap-1.5">
        {Array.from({ length: dots }, (_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === activeDot ? 20 : 6,
              background: i === activeDot ? 'hsl(var(--primary-deep))' : 'hsl(var(--primary))',
              opacity: i === activeDot ? 0.9 : 0.5,
            }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tabular-nums tracking-wider text-muted-foreground">{pad(count)}</span>
    </div>
  )
}

export default ScrollDots
