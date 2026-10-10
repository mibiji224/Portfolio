import SectionLabel from '@/components/SectionLabel'
import { cn } from '@/lib/utils'

// Common frame for every dashboard page: the mono eyebrow, the title, an
// optional one-line description, then the page's own content.
const PageShell = ({ index, label, title, description, className, children }) => (
  <section className="px-4 sm:px-6 lg:px-10 py-10 lg:py-14 font-sans">
    <div className={cn('mx-auto w-full max-w-5xl', className)}>
      <SectionLabel index={index} className="mb-6">{label}</SectionLabel>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">{description}</p>
      )}
      <div className="mt-8 lg:mt-10">{children}</div>
    </div>
  </section>
)

export default PageShell
