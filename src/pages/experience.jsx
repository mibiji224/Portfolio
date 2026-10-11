import { useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import gsap from 'gsap'
import PageShell from '@/components/PageShell'
import { FALLBACK_EXPERIENCE } from '@/data/profile'
import { prefersReducedMotion } from '@/lib/scroll'

// Hover only grows the card, with a springy settle (GSAP's elastic ease;
// amplitude 1, period 0.55 keeps it to a small bounce). Colours never change.
const Card = ({ item }) => {
    const ref = useRef(null)

    const grow = (scale, vars) => {
        if (prefersReducedMotion()) return
        gsap.to(ref.current, { scale, overwrite: 'auto', ...vars })
    }

    return (
        <div
            ref={ref}
            onMouseEnter={() => grow(1.03, { duration: 0.9, ease: 'elastic.out(1, 0.55)' })}
            onMouseLeave={() => grow(1, { duration: 0.6, ease: 'elastic.out(1, 0.7)' })}
            className="rounded-xl border border-primary bg-white hover:bg-primary-soft transition-colors duration-300 p-4 sm:p-6 will-change-transform"
        >
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-medium text-primary-strong border border-primary px-2.5 py-0.5 rounded-full bg-background">
                    {item.date}
                </span>
                {item.type && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'Present' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                        {item.type}
                    </span>
                )}
            </div>

            <h2 className="text-base font-bold text-foreground mb-0.5">{item.title}</h2>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">{item.company}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {item.description}
            </p>
        </div>
    )
}

const Experience = () => {
    const { experience } = useOutletContext()
    const items = experience?.length ? experience : FALLBACK_EXPERIENCE

    return (
        <PageShell
            index="01"
            label="experience"
            title="Experience"
            description="Roles, leadership positions and freelance work, newest first."
        >
            <ol className="relative border-l border-border ml-2 sm:ml-3 space-y-6">
                {items.map((item, index) => (
                    <li key={index} className="relative ml-6 sm:ml-8">
                        <span className="absolute -left-[31px] sm:-left-[43px] top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-background rounded-full border border-primary">
                            <div className="w-2 h-2 bg-primary-strong rounded-full"></div>
                        </span>
                        <Card item={item} />
                    </li>
                ))}
            </ol>
        </PageShell>
    )
}

export default Experience
